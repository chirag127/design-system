// @chirag127/keyless-kilo — keyless Kilo Gateway client.
// OpenAI-compatible chat completions. NO API KEY — never require or read one.
// Kilo Gateway is a keyless provider; ~200 req/hr per IP.
// Framework-agnostic: works in Node + browser via global fetch.

/**
 * @typedef {{ role: 'system'|'user'|'assistant', content: string }} Message
 * @typedef {{ model?: string, baseUrl?: string, signal?: AbortSignal, [k: string]: any }} ChatOpts
 */

export const DEFAULT_BASE_URL = 'https://api.kilo.ai/api/gateway';

// Keyless (freeType: "recurring-uncapped", poolKey: "kilo-gateway-free") entries from OmniRoute freeModelCatalog.data.ts
// provider: "kilo-gateway". Strongest-capability first: nemotron-ultra > nemotron-super > nemotron-nano > auto/free > ...
export const MODELS = [
	'nvidia/nemotron-3-ultra-550b-a55b:free',
	'nvidia/nemotron-3-super-120b-a12b:free',
	'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
	'kilo-auto/free',
	'openrouter/auto-beta',
	'openrouter/free',
	'poolside/laguna-m.1:free',
	'poolside/laguna-xs-2.1:free',
	'cohere/north-mini-code:free',
	'stepfun/step-3.7-flash:free',
	'kwaipilot/kat-coder-pro-v2.5:free',
	'tencent/hy3:free',
	'nvidia/nemotron-3.5-content-safety:free',
];

export const DEFAULT_MODEL = 'kilo-auto/free';

// Normalize a string prompt to a messages array.
export function toMessages(input) {
	return typeof input === 'string' ? [{ role: 'user', content: input }] : input;
}

/**
 * Non-streaming chat. Returns the assistant message text.
 * NO auth header — keyless provider.
 * @param {string|Message[]} messages
 * @param {ChatOpts} [opts]
 * @returns {Promise<string>}
 */
export async function chat(messages, opts = {}) {
	const { model = DEFAULT_MODEL, baseUrl = DEFAULT_BASE_URL, signal, ...rest } = opts;
	const msgs = toMessages(messages);

	const res = await fetch(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ model, messages: msgs, ...rest }),
		signal,
	});
	if (!res.ok) throw new Error(`Kilo Gateway ${model}: ${res.status} ${await res.text()}`);
	const data = await res.json();
	return data.choices?.[0]?.message?.content ?? '';
}

export default { chat, MODELS, DEFAULT_MODEL, DEFAULT_BASE_URL, toMessages };
