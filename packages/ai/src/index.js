// Shared interface + contract for @chirag127/ai.
// Both backends implement AIClient.chat(messages, opts) -> Promise<string>.

/**
 * @typedef {{ role: 'system'|'user'|'assistant', content: string }} Message
 * @typedef {{ model?: string, apiKey?: string, signal?: AbortSignal, [k: string]: any }} ChatOpts
 * @typedef {{ chat(messages: Message[], opts?: ChatOpts): Promise<string> }} AIClient
 */

// Model lists — server tried in order; client best-first then fallbacks.
export const MODELS = {
	server: [
		'nvidia/llama-3.3-nemotron-super-49b-v1',
		'meta/llama-3.3-70b-instruct',
		'deepseek-ai/deepseek-r1',
	],
	client: [
		'nvidia/nemotron-3-super-120b-a12b:free',
		'openai/gpt-oss-20b:free',
		'google/gemma-4-31b-it:free',
	],
};

// Normalize a string prompt to a messages array.
export function toMessages(input) {
	return typeof input === 'string' ? [{ role: 'user', content: input }] : input;
}
