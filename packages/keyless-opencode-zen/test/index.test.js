import { afterEach, describe, expect, it, vi } from 'vitest';
import { chat, DEFAULT_BASE_URL, DEFAULT_MODEL, MODELS } from '../src/index.js';

afterEach(() => vi.restoreAllMocks());

function mockFetch(body, ok = true, status = 200) {
	const f = vi.fn(async () => ({
		ok,
		status,
		statusText: 'x',
		json: async () => body,
		text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
	}));
	vi.stubGlobal('fetch', f);
	return f;
}

describe('keyless-opencode-zen', () => {
	it('exports the known models and default', () => {
		expect(DEFAULT_MODEL).toBe('deepseek-v4-flash-free');
		expect(MODELS).toContain('deepseek-v4-flash-free');
		expect(MODELS).toHaveLength(4);
	});

	it('posts to {baseUrl}/chat/completions with no auth header and returns text', async () => {
		const f = mockFetch({ choices: [{ message: { content: 'hi there' } }] });
		const out = await chat('hi');

		expect(out).toBe('hi there');
		const [url, init] = f.mock.calls[0];
		expect(url).toBe(`${DEFAULT_BASE_URL}/chat/completions`);
		expect(init.method).toBe('POST');
		const headers = init.headers;
		expect(headers.authorization ?? headers.Authorization).toBeUndefined();
		const sent = JSON.parse(init.body);
		expect(sent.model).toBe(DEFAULT_MODEL);
		expect(sent.messages).toEqual([{ role: 'user', content: 'hi' }]);
	});

	it('honors model + baseUrl overrides and passes a messages array through', async () => {
		const f = mockFetch({ choices: [{ message: { content: 'ok' } }] });
		const msgs = [{ role: 'user', content: 'q' }];
		await chat(msgs, { model: 'mimo-v2.5-free', baseUrl: 'https://x.test/v1' });

		const [url, init] = f.mock.calls[0];
		expect(url).toBe('https://x.test/v1/chat/completions');
		const sent = JSON.parse(init.body);
		expect(sent.model).toBe('mimo-v2.5-free');
		expect(sent.messages).toEqual(msgs);
	});

	it('throws on non-ok responses', async () => {
		mockFetch('rate limited', false, 429);
		await expect(chat('hi')).rejects.toThrow(/429/);
	});
});
