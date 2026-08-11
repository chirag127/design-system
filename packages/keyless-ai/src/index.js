// @chirag127/keyless-ai — keyless AI failover meta-client.
// Tries 4 keyless OpenAI-compatible providers best-first, returns first success.
// NO API KEY — every provider is keyless; never require or read one.
// Framework-agnostic: works in Node + browser via each provider's global fetch.

import { chat as zen } from '@chirag127/keyless-opencode-zen';
import { chat as kilo } from '@chirag127/keyless-kilo';
import { chat as ovh } from '@chirag127/keyless-ovh';
import { chat as pollinations } from '@chirag127/keyless-pollinations';

/**
 * @typedef {{ role: 'system'|'user'|'assistant', content: string }} Message
 * @typedef {{ order?: string[], onError?: (name: string, err: Error) => void, [k: string]: any }} ChatOpts
 */

// Provider registry keyed by name.
export const PROVIDERS = {
	'opencode-zen': zen,
	kilo,
	ovh,
	pollinations,
};

// Best-first default order: zen/kilo have strong free models; pollinations 402s, last.
export const DEFAULT_ORDER = ['opencode-zen', 'kilo', 'ovh', 'pollinations'];

// Available provider names.
export function listProviders() {
	return Object.keys(PROVIDERS);
}

// Resolve the try-order: opts.order -> env KEYLESS_ORDER (comma-separated) -> default.
function resolveOrder(order) {
	if (Array.isArray(order) && order.length) return order;
	const env = typeof process !== 'undefined' ? process?.env?.KEYLESS_ORDER : undefined;
	if (env) return env.split(',').map((s) => s.trim()).filter(Boolean);
	return DEFAULT_ORDER;
}

/**
 * Non-streaming chat with keyless failover. Tries each provider in order,
 * returns the first success; throws AggregateError only if ALL fail.
 * `order` and `onError` are consumed here; remaining opts pass through to each provider.
 * @param {string|Message[]} messages
 * @param {ChatOpts} [opts]
 * @returns {Promise<string>}
 */
export async function chat(messages, opts = {}) {
	const { order, onError, ...rest } = opts;
	const names = resolveOrder(order);
	const errors = [];
	for (const name of names) {
		const provider = PROVIDERS[name];
		if (!provider) {
			errors.push(new Error(`Unknown provider: ${name}`));
			continue;
		}
		try {
			return await provider(messages, rest);
		} catch (err) {
			onError?.(name, err);
			errors.push(new Error(`${name}: ${err.message}`, { cause: err }));
		}
	}
	throw new AggregateError(errors, `All keyless providers failed (${names.join(', ')})`);
}

export default { chat, listProviders, PROVIDERS, DEFAULT_ORDER };
