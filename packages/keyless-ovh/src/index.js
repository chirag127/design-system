// Keyless OVHcloud AI Endpoints client. OpenAI-compatible chat completions, NO API KEY.
// POST {baseUrl}/chat/completions with {model, messages}. No Authorization header.
// Framework-agnostic: uses global fetch (Node 18+ / browser).

export const DEFAULT_BASE_URL = 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1';

export const MODELS = [
	'Meta-Llama-3_3-70B-Instruct',
	'Qwen3.5-397B-A17B',
	'gpt-oss-120b',
	'Mistral-Small-3.2-24B-Instruct-2506',
	'Qwen3-32B',
	'Qwen3-Coder-30B-A3B-Instruct',
	'gpt-oss-20b',
];

export const DEFAULT_MODEL = 'Meta-Llama-3_3-70B-Instruct';

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
	if (!res.ok) throw new Error(`OVHcloud ${model}: ${res.status} ${await res.text()}`);
	const data = await res.json();
	return data.choices?.[0]?.message?.content ?? '';
}

export default { chat, MODELS, DEFAULT_MODEL, DEFAULT_BASE_URL, toMessages };
