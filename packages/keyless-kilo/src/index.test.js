import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chat, DEFAULT_BASE_URL, DEFAULT_MODEL, MODELS, toMessages } from './index.js';

const jsonResponse = (content) => ({
	ok: true,
	status: 200,
	json: async () => ({ choices: [{ message: { role: 'assistant', content } }] }),
	text: async () => '',
});

beforeEach(() => {
	vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('keyless-kilo', () => {
	it('exports the known model list + default', () => {
		expect(DEFAULT_MODEL).toBe('kilo-auto/free');
		expect(MODELS[0]).toBe(DEFAULT_MODEL);
		expect(MODELS).toContain('cohere/north-mini-code:free');
	});

	it('POSTs to {baseUrl}/chat/completions with {model, messages}, no auth header', async () => {
		fetch.mockResolvedValueOnce(jsonResponse('hi there'));
		const out = await chat('hello');

		expect(out).toBe('hi there');
		expect(fetch).toHaveBeenCalledTimes(1);
		const [url, init] = fetch.mock.calls[0];
		expect(url).toBe(`${DEFAULT_BASE_URL}/chat/completions`);
		expect(init.method).toBe('POST');
		expect(init.headers.Authorization).toBeUndefined();
		expect(init.headers.authorization).toBeUndefined();
		const body = JSON.parse(init.body);
		expect(body.model).toBe(DEFAULT_MODEL);
		expect(body.messages).toEqual([{ role: 'user', content: 'hello' }]);
	});

	it('honors model + baseUrl overrides and passes extra opts through', async () => {
		fetch.mockResolvedValueOnce(jsonResponse('ok'));
		await chat([{ role: 'user', content: 'x' }], {
			model: 'openrouter/free',
			baseUrl: 'https://example.test/gw',
			temperature: 0.2,
		});
		const [url, init] = fetch.mock.calls[0];
		expect(url).toBe('https://example.test/gw/chat/completions');
		const body = JSON.parse(init.body);
		expect(body.model).toBe('openrouter/free');
		expect(body.temperature).toBe(0.2);
	});

	it('throws on non-ok response', async () => {
		fetch.mockResolvedValueOnce({ ok: false, status: 429, text: async () => 'rate limited' });
		await expect(chat('hi')).rejects.toThrow(/429 rate limited/);
	});

	it('toMessages wraps a string, leaves arrays untouched', () => {
		expect(toMessages('a')).toEqual([{ role: 'user', content: 'a' }]);
		const arr = [{ role: 'system', content: 's' }];
		expect(toMessages(arr)).toBe(arr);
	});
});
