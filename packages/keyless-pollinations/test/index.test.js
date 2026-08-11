import { describe, it, expect, vi, afterEach } from 'vitest';
import { chat, MODELS, DEFAULT_MODEL, toMessages } from '../src/index.js';

afterEach(() => vi.restoreAllMocks());

const ok = (content) => ({
	ok: true,
	json: async () => ({ choices: [{ message: { role: 'assistant', content } }] }),
});

describe('keyless-pollinations', () => {
	it('MODELS is non-empty and DEFAULT_MODEL is MODELS[0]', () => {
		expect(MODELS.length).toBeGreaterThan(0);
		expect(DEFAULT_MODEL).toBe(MODELS[0]);
	});

	it('exposes known models including openai-large and mistral', () => {
		expect(MODELS).toContain('openai-large');
		expect(MODELS).toContain('mistral');
		expect(MODELS).toContain('openai');
	});

	it('toMessages wraps a string', () => {
		expect(toMessages('hi')).toEqual([{ role: 'user', content: 'hi' }]);
		const arr = [{ role: 'user', content: 'x' }];
		expect(toMessages(arr)).toBe(arr);
	});

	it('POSTs no-auth chat/completions and returns content', async () => {
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(ok('pong'));
		const out = await chat('ping');
		expect(out).toBe('pong');
		const [url, init] = spy.mock.calls[0];
		expect(url).toBe('https://text.pollinations.ai/openai/chat/completions');
		expect(init.method).toBe('POST');
		expect(init.headers).not.toHaveProperty('Authorization');
		const body = JSON.parse(init.body);
		expect(body.model).toBe(DEFAULT_MODEL);
		expect(body.messages).toEqual([{ role: 'user', content: 'ping' }]);
	});

	it('chat() sends DEFAULT_MODEL when no model given', async () => {
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(ok('x'));
		await chat('hi');
		const body = JSON.parse(spy.mock.calls[0][1].body);
		expect(body.model).toBe(DEFAULT_MODEL);
	});

	it('opts.model overrides DEFAULT_MODEL', async () => {
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(ok('x'));
		await chat([{ role: 'user', content: 'q' }], { model: 'mistral', baseUrl: 'https://ex/openai' });
		const [url, init] = spy.mock.calls[0];
		expect(url).toBe('https://ex/openai/chat/completions');
		expect(JSON.parse(init.body).model).toBe('mistral');
	});

	it('throws on non-ok (e.g. 402)', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: false,
			status: 402,
			statusText: 'Payment Required',
			text: async () => 'quota',
		});
		await expect(chat('ping')).rejects.toThrow(/402/);
	});
});
