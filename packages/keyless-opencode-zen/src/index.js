// @chirag127/keyless-opencode-zen — keyless OpenCode Zen client.
// OpenAI-compatible. POST {baseUrl}/chat/completions, no auth header.

export const DEFAULT_BASE_URL = 'https://opencode.ai/zen/v1';

// Keyless (freeType: "recurring-uncapped", poolKey: "opencode-zen-free") entries from OmniRoute freeModelCatalog.data.ts
// provider: "opencode-zen". Strongest first: nemotron-ultra > nemotron-super > deepseek-v4-flash > mimo > north-mini-code > big-pickle
export const MODELS = [
	'opencode/nemotron-3-ultra-free',
	'opencode/nemotron-3-super-free',
	'opencode/deepseek-v4-flash-free',
	'opencode/mimo-v2.5-free',
	'opencode/north-mini-code-free',
	'opencode/big-pickle',
];

export const DEFAULT_MODEL = 'opencode/nemotron-3-ultra-free';

/** @typedef {{ role: 'system'|'user'|'assistant', content: string }} Message */

// Normalize a string prompt to a messages array.
function toMessages(input) {
	return typeof input === 'string' ? [{ role: 'user', content: input }] : input;
}

/**
 * Non-streaming chat completion. Returns the assistant text.
 * @param {string|Message[]} messages
 * @param {{ model?: string, baseUrl?: string, signal?: AbortSignal, [k: string]: any }} [opts]
 * @returns {Promise<string>}
 */
export async function chat(messages, opts = {}) {
	const { model = DEFAULT_MODEL, baseUrl = DEFAULT_BASE_URL, signal, ...rest } = opts;
	const res = await fetch(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify({ model, messages: toMessages(messages), ...rest }),
		signal,
	});
	if (!res.ok) throw new Error(`OpenCode Zen ${res.status}: ${await res.text().catch(() => res.statusText)}`);
	const data = await res.json();
	return data?.choices?.[0]?.message?.content ?? '';
}

export default { chat, MODELS, DEFAULT_MODEL, DEFAULT_BASE_URL };
