// Puter.js adapter — CLIENT ONLY. Keyless: users auth via Puter, no key leaks.
// Loads https://js.puter.com/v2/, calls puter.ai.chat(prompt, { model }).
import { MODELS, toMessages } from './index.js';

const SRC = 'https://js.puter.com/v2/';
let loading;

// Inject the Puter script tag once; resolve when window.puter exists.
function ensureLoaded() {
	if (typeof window !== 'undefined' && window.puter) return Promise.resolve();
	if (loading) return loading;
	loading = new Promise((resolve, reject) => {
		if (typeof document === 'undefined') return reject(new Error('Puter client needs a browser (no document).'));
		const s = document.createElement('script');
		s.src = SRC;
		s.async = true;
		s.onload = () => resolve();
		s.onerror = () => reject(new Error('Failed to load js.puter.com/v2'));
		document.head.appendChild(s);
	});
	return loading;
}

// Puter takes a single prompt string; flatten messages to role-tagged text.
function flatten(msgs) {
	if (msgs.length === 1 && msgs[0].role === 'user') return msgs[0].content;
	return msgs.map((m) => `${m.role}: ${m.content}`).join('\n');
}

function text(resp) {
	if (typeof resp === 'string') return resp;
	return resp?.message?.content ?? resp?.text ?? resp?.content ?? String(resp ?? '');
}

/** @type {import('./index.js').AIClient['chat']} */
export async function chat(messages, opts = {}) {
	await ensureLoaded();
	const prompt = flatten(toMessages(messages));
	const models = opts.model ? [opts.model, ...MODELS.client.filter((m) => m !== opts.model)] : MODELS.client;
	const { model: _drop, apiKey: _drop2, signal: _drop3, ...rest } = opts;

	let lastErr;
	for (const model of models) {
		try {
			return text(await window.puter.ai.chat(prompt, { model, ...rest }));
		} catch (err) {
			lastErr = err;
		}
	}
	throw lastErr;
}

// Live :free model IDs from Puter's catalog.
export async function listFreeModels() {
	await ensureLoaded();
	const models = await window.puter.ai.listModels();
	const flat = Array.isArray(models) ? models : Object.values(models ?? {}).flat();
	return flat
		.map((m) => (typeof m === 'string' ? m : m?.id ?? m?.name))
		.filter((id) => typeof id === 'string' && id.endsWith(':free'));
}

/** @type {import('./index.js').AIClient} */
export const client = { chat, listFreeModels };
export default client;
export { MODELS };
