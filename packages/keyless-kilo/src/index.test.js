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
	it('MODELS is non-empty and DEFAULT_MODEL is kilo-auto/free (auto-router)', () => {
		expect(MODELS.length).toBeGreaterThan(0);
		expect(DEFAULT_MODEL).toBe('kilo-auto/free');
	});

	it('exports expected models including nemotron-ultra, nemotron-super, north-mini-code, and kilo-auto/free', () => {
		expect(MODELS).toContain('nvidia/nemotron-3-ultra-550b-a55b:free');
		expect(MODELS).toContain('nvidia/nemotron-3-super-120b-a12b:free');
		expect(MODELS).toContain('cohere/north-mini-code:free');
		expect(MODELS).toContain('kilo-auto/free');
		expect(DEFAULT_MODEL).toBe('kilo-auto/free');
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
		expect(body.model).toBe('kilo-auto/free');
		expect(body.messages).toEqual([{ role: 'user', content: 'hello' }]);
	});

	it('chat() sends DEFAULT_MODEL when no model given', async () => {
		fetch.mockResolvedValueOnce(jsonResponse('ok'));
		await chat('hi');
		const body = JSON.parse(fetch.mock.calls[0][1].body);
		expect(body.model).toBe(DEFAULT_MODEL);
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
