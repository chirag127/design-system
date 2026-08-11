// Keyless OVHcloud AI Endpoints client. OpenAI-compatible chat completions, NO API KEY.
// POST {baseUrl}/chat/completions with {model, messages}. No Authorization header.
// Framework-agnostic: uses global fetch (Node 18+ / browser).

export const DEFAULT_BASE_URL = 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1';

// Keyless (freeType: "keyless", poolKey: "ovhcloud-anon") entries from OmniRoute freeModelCatalog.data.ts
// provider: "ovhcloud". Strongest first: gpt-oss-120b > Qwen3.6-27B > Qwen2.5-VL-72B > Mistral-Small-3.2 > gpt-oss-20b
export const MODELS = [
	'gpt-oss-120b',
	'Qwen3.6-27B',
	'Qwen2.5-VL-72B-Instruct',
	'Mistral-Small-3.2-24B-Instruct-2506',
	'gpt-oss-20b',
];

export const DEFAULT_MODEL = 'gpt-oss-120b';

/**
 * @typedef {{ role: 'system'|'user'|'assistant', content: string }} Message
 * @typedef {{ model?: string, baseUrl?: string, signal?: AbortSignal, [k: string]: any }} ChatOpts
 */

// Normalize a string prompt to a messages array.
export function toMessages(input) {
	return typeof input === 'string' ? [{ role: 'user', content: input }] : input;
}

/**
 * Non-streaming chat completion.
 * @param {Message[]|string} messages
 * @param {ChatOpts} [opts]
 * @returns {Promise<string>}
 */
export async function chat(messages, opts = {}) {
	const { model = DEFAULT_MODEL, baseUrl = DEFAULT_BASE_URL, signal, ...rest } = opts;
	const res = await fetch(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ model, messages: toMessages(messages), ...rest }),
		signal,
	});
	if (!res.ok) {
		const body = await res.text().catch(() => '');
		const msg = `OVHcloud ${model}: ${res.status}${body ? ` ${body}` : ''}`;
		const err = new Error(msg);
		if (res.status === 429) err.retryable = true;
		throw err;
	}
	const data = await res.json();
	return data.choices?.[0]?.message?.content ?? '';
}

export default { chat, MODELS, DEFAULT_MODEL, DEFAULT_BASE_URL, toMessages };
