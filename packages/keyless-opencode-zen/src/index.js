// @chirag127/keyless-opencode-zen — DEPRECATED: NOT keyless.
// https://opencode.ai/zen/v1 requires a ZEN_API_KEY — returns 401 without one.
// This package is kept published for reference but must NOT be used in keyless contexts.

export const DEFAULT_BASE_URL = 'https://opencode.ai/zen/v1'

// Source: OmniRoute freeModelCatalog.data.ts — provider: "opencode-zen"
export const MODELS = [
	'opencode/nemotron-3-ultra-free',
	'opencode/nemotron-3-super-free',
	'opencode/deepseek-v4-flash-free',
	'opencode/mimo-v2.5-free',
	'opencode/north-mini-code-free',
	'opencode/big-pickle',
]

export const DEFAULT_MODEL = 'opencode/nemotron-3-ultra-free'

/** @typedef {{ role: 'system'|'user'|'assistant', content: string }} Message */

function toMessages(input) {
	return typeof input === 'string' ? [{ role: 'user', content: input }] : input
}

/**
 * DEPRECATED — throws if ZEN_API_KEY is not set.
 * OpenCode Zen is NOT keyless: every request without an API key returns 401.
 * @param {string|Message[]} messages
 * @param {{ model?: string, baseUrl?: string, signal?: AbortSignal, [k: string]: any }} [opts]
 * @returns {Promise<string>}
 */
export async function chat(messages, opts = {}) {
	const key =
		typeof process !== 'undefined' ? process?.env?.ZEN_API_KEY : undefined
	if (!key) {
		throw new Error(
			'@chirag127/keyless-opencode-zen is NOT keyless: ZEN_API_KEY is required. ' +
				'See README. Use @chirag127/keyless-ai or another keyless provider instead.',
		)
	}
	const {
		model = DEFAULT_MODEL,
		baseUrl = DEFAULT_BASE_URL,
		signal,
		...rest
	} = opts
	const res = await fetch(`${baseUrl}/chat/completions`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: `Bearer ${key}`,
		},
		body: JSON.stringify({ model, messages: toMessages(messages), ...rest }),
		signal,
	})
	if (!res.ok)
		throw new Error(
			`OpenCode Zen ${res.status}: ${await res.text().catch(() => res.statusText)}`,
		)
	const data = await res.json()
	return data?.choices?.[0]?.message?.content ?? ''
}

export default { chat, MODELS, DEFAULT_MODEL, DEFAULT_BASE_URL }
