import {
	buildPayload,
	buildVisionMessages,
	type ChatOptions,
	type Message,
	type RequestPayload,
} from './payload'

export type {
	ChatOptions,
	ContentPart,
	Message,
	RequestPayload,
} from './payload'
export { buildPayload, buildVisionMessages } from './payload'

const ENDPOINT = 'https://text.pollinations.ai/openai'
const MODELS_URL = 'https://text.pollinations.ai/models'
const DEBOUNCE_MS = 3000
const MAX_RETRIES = 3

/** Thrown when the provider fails after retries. Callers can catch + degrade. */
export class OzAiError extends Error {
	constructor(
		message: string,
		readonly status?: number,
	) {
		super(message)
		this.name = 'OzAiError'
	}
}

let lastCall = 0

/** Rate-guard: serialize calls at least DEBOUNCE_MS apart. Honors signal. */
async function debounce(signal?: AbortSignal): Promise<void> {
	const wait = lastCall + DEBOUNCE_MS - Date.now()
	lastCall = Math.max(Date.now(), lastCall + DEBOUNCE_MS)
	if (wait <= 0) return
	await new Promise<void>((resolve, reject) => {
		const t = setTimeout(resolve, wait)
		signal?.addEventListener(
			'abort',
			() => {
				clearTimeout(t)
				reject(new OzAiError('aborted'))
			},
			{ once: true },
		)
	})
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** POST payload, retrying on 429/5xx with exponential backoff. */
async function post(
	payload: RequestPayload,
	signal?: AbortSignal,
): Promise<string> {
	await debounce(signal)
	let lastErr: OzAiError | undefined
	for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
		if (attempt > 0) await sleep(2 ** attempt * 500)
		let res: Response
		try {
			res = await fetch(ENDPOINT, {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(payload),
				signal,
			})
		} catch (e) {
			if (signal?.aborted) throw new OzAiError('aborted')
			lastErr = new OzAiError(`network error: ${(e as Error).message}`)
			continue
		}
		if (res.status === 429 || res.status >= 500) {
			lastErr = new OzAiError(`provider ${res.status}`, res.status)
			continue
		}
		if (!res.ok) {
			throw new OzAiError(`provider ${res.status}`, res.status)
		}
		const json = (await res.json()) as {
			choices?: { message?: { content?: string } }[]
		}
		const content = json.choices?.[0]?.message?.content
		if (typeof content !== 'string') {
			throw new OzAiError('malformed response: no choices[0].message.content')
		}
		return content
	}
	throw lastErr ?? new OzAiError('request failed')
}

/** Chat completion from an array of messages. */
export async function chat(
	messages: Message[],
	options: ChatOptions = {},
): Promise<string> {
	return post(buildPayload(messages, options), options.signal)
}

/** One-shot completion from a prompt, with optional system prompt. */
export async function complete(
	prompt: string,
	options: ChatOptions & { system?: string } = {},
): Promise<string> {
	const messages: Message[] = []
	if (options.system) messages.push({ role: 'system', content: options.system })
	messages.push({ role: 'user', content: prompt })
	return post(buildPayload(messages, options), options.signal)
}

/** Vision: describe/answer over an image (data URL or http url). */
export async function vision(
	prompt: string,
	imageDataUrl: string,
	options: ChatOptions = {},
): Promise<string> {
	return post(
		buildPayload(buildVisionMessages(prompt, imageDataUrl), options),
		options.signal,
	)
}

/** List available model ids. Empty array on failure (never throws). */
export async function listModels(signal?: AbortSignal): Promise<string[]> {
	try {
		const res = await fetch(MODELS_URL, { signal })
		if (!res.ok) return []
		const json = (await res.json()) as unknown
		if (Array.isArray(json)) {
			return json
				.map((m) =>
					typeof m === 'string'
						? m
						: String((m as { name?: string }).name ?? ''),
				)
				.filter(Boolean)
		}
		return []
	} catch {
		return []
	}
}
