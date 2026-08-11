// NVIDIA NIM adapter — SERVER ONLY. OpenAI-compatible chat completions.
// Key from env NVIDIA_API_KEY (or opts.apiKey). NEVER embed a key. NEVER ship to client.
import { MODELS, toMessages } from './index.js';

const BASE = 'https://integrate.api.nvidia.com/v1';

function resolveKey(opts = {}) {
	const key = opts.apiKey || (typeof process !== 'undefined' && process.env && process.env.NVIDIA_API_KEY);
	if (!key) throw new Error('NVIDIA_API_KEY missing. Set env var (GH Secret, server-side only). Never embed a key.');
	return key;
}

/** @type {import('./index.js').AIClient['chat']} */
export async function chat(messages, opts = {}) {
	const key = resolveKey(opts);
	const msgs = toMessages(messages);
	const models = opts.model ? [opts.model, ...MODELS.server.filter((m) => m !== opts.model)] : MODELS.server;
	const { model: _drop, apiKey: _drop2, signal, ...rest } = opts;

	let lastErr;
	for (const model of models) {
		try {
			const res = await fetch(`${BASE}/chat/completions`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
				body: JSON.stringify({ model, messages: msgs, ...rest }),
				signal,
			});
			if (!res.ok) throw new Error(`NVIDIA NIM ${model}: ${res.status} ${await res.text()}`);
			const data = await res.json();
			return data.choices?.[0]?.message?.content ?? '';
		} catch (err) {
			lastErr = err;
		}
	}
	throw lastErr;
}

/** @type {import('./index.js').AIClient} */
export const server = { chat };
export default server;
export { MODELS };
