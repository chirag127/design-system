// Keyless Pollinations text client. OpenAI-compatible, NO API KEY.
// POST {baseUrl}/chat/completions with { model, messages } — no auth header.

// Keyless (no poolKey=null, no freeType='discontinued') entries from OmniRoute freeModelCatalog.data.ts
// provider: "pollinations". Best-quality first: openai-large > openai > openai-fast > qwen-coder-large > ...
export const MODELS = [
	'openai-large',
	'openai',
	'openai-fast',
	'qwen-coder-large',
	'qwen-large',
	'mistral-large',
	'mistral',
	'deepseek',
	'grok-large',
	'grok',
	'kimi',
	'gemini-large',
	'gemini-flash-lite-3.1',
	'gemini-search',
	'qwen-coder',
	'qwen-vision',
	'qwen-safety',
	'nova',
	'nova-fast',
	'glm',
	'minimax',
	'perplexity-reasoning',
	'perplexity-fast',
	'polly',
];
export const DEFAULT_MODEL = 'openai-large';
const BASE_URL = 'https://text.pollinations.ai/openai';

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
	const { model = DEFAULT_MODEL, baseUrl = BASE_URL, signal, ...rest } = opts;
	const res = await fetch(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ model, messages: toMessages(messages), ...rest }),
		signal,
	});
	if (!res.ok) {
		const body = await res.text().catch(() => '');
		throw new Error(`Pollinations ${res.status} ${res.statusText}${body ? `: ${body}` : ''}`);
	}
	const data = await res.json();
	return data?.choices?.[0]?.message?.content ?? '';
}

export default { chat, MODELS, DEFAULT_MODEL };
