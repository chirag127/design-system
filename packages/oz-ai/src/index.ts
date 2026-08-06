import {
	buildPayload,
	buildVisionMessages,
	type ChatOptions,
	extractContent,
	extractDelta,
	extractImageUrl,
	type Message,
	modelId,
	type RequestPayload,
} from './payload'

export type {
	ChatOptions,
	ContentPart,
	Message,
	RequestPayload,
} from './payload'
export {
	buildPayload,
	buildVisionMessages,
	extractContent,
	extractDelta,
	extractImageUrl,
	modelId,
} from './payload'

/** Thrown only after EVERY provider fails. Callers can catch + degrade. */
export class OzAiError extends Error {
	constructor(
		message: string,
		readonly cause?: unknown,
	) {
		super(message)
		this.name = 'OzAiError'
	}
}

/** Minimal structural type over a g4f.dev client (OpenAI-shape). */
interface G4FClient {
	chat: {
		completions: {
			create(
				params: RequestPayload,
			):
				| Promise<unknown>
				| AsyncGenerator<unknown, void, unknown>
				| Promise<AsyncGenerator<unknown, void, unknown>>
		}
	}
	models?: { list(): Promise<unknown[]> }
	images?: { generate(params: Record<string, unknown>): Promise<unknown> }
}

/** A named provider entry in the failover chain. */
export interface Provider {
	name: string
	client: G4FClient
}

const MAX_RETRIES = 2

let chain: Provider[] | null = null

/**
 * Ordered provider failover chain. Built lazily from @gpt4free/g4f.dev.
 * default Client() (auto-router incl. PollinationsAI) → DeepInfra → Puter.
 * THIS is the one place the fleet's provider strategy lives — reorder here.
 */
async function providers(): Promise<Provider[]> {
	if (chain) return chain
	// g4f.dev ships a `declare module 'client'` .d.ts that TS can't resolve as a
	// module; import through a variable specifier so tsc skips type resolution.
	const spec = '@gpt4free/g4f.dev'
	const g4f = (await import(/* @vite-ignore */ spec)) as {
		default?: new () => G4FClient
		Client?: new () => G4FClient
		DeepInfra?: new () => G4FClient
		Puter?: new () => G4FClient
	}
	const Client = g4f.Client ?? g4f.default
	const built: Provider[] = []
	if (Client) built.push({ name: 'default', client: new Client() })
	if (g4f.DeepInfra)
		built.push({ name: 'DeepInfra', client: new g4f.DeepInfra() })
	if (g4f.Puter) built.push({ name: 'Puter', client: new g4f.Puter() })
	if (built.length === 0)
		throw new OzAiError('@gpt4free/g4f.dev exported no usable client')
	chain = built
	return built
}

/** Override the provider chain (tests / custom order). Pass null to reset. */
export function setProviders(next: Provider[] | null): void {
	chain = next
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const isAsyncIterable = (x: unknown): x is AsyncIterable<unknown> =>
	x != null &&
	typeof (x as AsyncIterable<unknown>)[Symbol.asyncIterator] === 'function'

/** Run fn against each provider, up to MAX_RETRIES per provider. */
async function withFailover<T>(
	fn: (p: Provider) => Promise<T>,
	signal?: AbortSignal,
): Promise<T> {
	const list = await providers()
	let last: unknown
	for (const p of list) {
		for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
			if (signal?.aborted) throw new OzAiError('aborted')
			if (attempt > 0) await sleep(2 ** attempt * 300)
			try {
				return await fn(p)
			} catch (e) {
				if (signal?.aborted) throw new OzAiError('aborted')
				last = e
			}
		}
	}
	throw new OzAiError('all providers failed', last)
}

async function completion(
	payload: RequestPayload,
	signal?: AbortSignal,
): Promise<string> {
	return withFailover(
		async (p) =>
			extractContent(await p.client.chat.completions.create(payload)),
		signal,
	)
}

/**
 * Chat completion from messages.
 * `stream:true` → returns an async-iterable of text chunks with failover.
 */
export function chat(
	messages: Message[],
	options: ChatOptions & { stream: true },
): Promise<AsyncIterable<string>>
export function chat(
	messages: Message[],
	options?: ChatOptions,
): Promise<string>
export function chat(
	messages: Message[],
	options: ChatOptions = {},
): Promise<string | AsyncIterable<string>> {
	if (options.stream)
		return streamChat(buildPayload(messages, options), options.signal)
	return completion(buildPayload(messages, options), options.signal)
}

/** One-shot completion from a prompt, with optional system prompt. */
export async function complete(
	prompt: string,
	options: ChatOptions & { system?: string } = {},
): Promise<string> {
	const messages: Message[] = []
	if (options.system) messages.push({ role: 'system', content: options.system })
	messages.push({ role: 'user', content: prompt })
	return completion(buildPayload(messages, options), options.signal)
}

/** Vision: answer over an image (data URL or http url). */
export async function vision(
	prompt: string,
	imageDataUrl: string,
	options: ChatOptions = {},
): Promise<string> {
	return completion(
		buildPayload(buildVisionMessages(prompt, imageDataUrl), options),
		options.signal,
	)
}

/** Streaming chat: async-iterable of text chunks, with provider failover. */
async function streamChat(
	payload: RequestPayload,
	signal?: AbortSignal,
): Promise<AsyncIterable<string>> {
	return withFailover(async (p) => {
		const res = await p.client.chat.completions.create({
			...payload,
			stream: true,
		})
		if (!isAsyncIterable(res))
			throw new OzAiError(`provider ${p.name} did not stream`)
		return (async function* () {
			for await (const chunk of res) {
				if (signal?.aborted) throw new OzAiError('aborted')
				const delta = extractDelta(chunk)
				if (delta) yield delta
			}
		})()
	}, signal)
}

/** Generate an image; returns its URL. Failover across providers. */
export async function image(
	prompt: string,
	options: { model?: string; signal?: AbortSignal } = {},
): Promise<string> {
	return withFailover(async (p) => {
		if (!p.client.images)
			throw new OzAiError(`provider ${p.name} has no images`)
		return extractImageUrl(
			await p.client.images.generate({
				model: options.model ?? 'flux',
				prompt,
			}),
		)
	}, options.signal)
}

/**
 * All model ids across the provider chain (deduped). Empty on total failure.
 * Never throws.
 */
export async function listModels(signal?: AbortSignal): Promise<string[]> {
	let list: Provider[]
	try {
		list = await providers()
	} catch {
		return []
	}
	const ids = new Set<string>()
	for (const p of list) {
		if (signal?.aborted) break
		try {
			const models = (await p.client.models?.list()) ?? []
			for (const m of models) {
				const id = modelId(m)
				if (id) ids.add(id)
			}
		} catch {
			// skip a provider that can't list; others may still work
		}
	}
	return [...ids]
}
