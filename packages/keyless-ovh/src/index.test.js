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

	it('MODELS is non-empty and DEFAULT_MODEL is MODELS[0]', () => {
		expect(MODELS.length).toBeGreaterThan(0);
		expect(DEFAULT_MODEL).toBe(MODELS[0]);
	});

	it('exports expected models including gpt-oss-120b and gpt-oss-20b', () => {
		expect(MODELS).toContain('gpt-oss-120b');
		expect(MODELS).toContain('gpt-oss-20b');
		expect(DEFAULT_MODEL).toBe('gpt-oss-120b');
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

	it('chat() sends DEFAULT_MODEL when no model given', async () => {
		await chat('hi');
		const body = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
		expect(body.model).toBe(DEFAULT_MODEL);
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

	it('429 throws a retryable error with retryable=true', async () => {
		globalThis.fetch = vi.fn(async () => ({ ok: false, status: 429, text: async () => 'rate limited' }));
		const err = await chat('x').catch((e) => e);
		expect(err).toBeInstanceOf(Error);
		expect(err.message).toMatch(/429/);
		expect(err.retryable).toBe(true);
	});
});
