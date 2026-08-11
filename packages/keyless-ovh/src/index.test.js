import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { chat, MODELS, DEFAULT_MODEL, DEFAULT_BASE_URL, toMessages } from './index.js';

describe('@chirag127/keyless-ovh', () => {
	beforeEach(() => {
		globalThis.fetch = vi.fn(async () => ({
			ok: true,
			json: async () => ({ choices: [{ message: { content: 'pong' } }] }),
		}));
	});
	afterEach(() => vi.restoreAllMocks());

	it('exports the known model list + default', () => {
		expect(MODELS).toContain('Meta-Llama-3_3-70B-Instruct');
		expect(MODELS).toHaveLength(7);
		expect(DEFAULT_MODEL).toBe('Meta-Llama-3_3-70B-Instruct');
	});

	it('normalizes a string prompt', () => {
		expect(toMessages('hi')).toEqual([{ role: 'user', content: 'hi' }]);
		const msgs = [{ role: 'user', content: 'x' }];
		expect(toMessages(msgs)).toBe(msgs);
	});

	it('POSTs to {baseUrl}/chat/completions with default model, no auth header', async () => {
		const out = await chat('ping');
		expect(out).toBe('pong');
		const [url, init] = globalThis.fetch.mock.calls[0];
		expect(url).toBe(`${DEFAULT_BASE_URL}/chat/completions`);
		expect(init.method).toBe('POST');
		expect(init.headers).not.toHaveProperty('Authorization');
		expect(init.headers).not.toHaveProperty('authorization');
		expect(JSON.parse(init.body)).toEqual({
			model: DEFAULT_MODEL,
			messages: [{ role: 'user', content: 'ping' }],
		});
	});

	it('honors model, baseUrl override + passes extra params', async () => {
		await chat([{ role: 'user', content: 'x' }], {
			model: 'gpt-oss-20b',
			baseUrl: 'https://example.test/v1',
			temperature: 0.2,
		});
		const [url, init] = globalThis.fetch.mock.calls[0];
		expect(url).toBe('https://example.test/v1/chat/completions');
		const body = JSON.parse(init.body);
		expect(body.model).toBe('gpt-oss-20b');
		expect(body.temperature).toBe(0.2);
	});

	it('throws on non-ok response', async () => {
		globalThis.fetch = vi.fn(async () => ({ ok: false, status: 500, text: async () => 'boom' }));
		await expect(chat('x')).rejects.toThrow('OVHcloud');
	});
});
