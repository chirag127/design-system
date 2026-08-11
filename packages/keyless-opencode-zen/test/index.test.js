import { afterEach, describe, expect, it, vi } from 'vitest';
import { chat, DEFAULT_BASE_URL, DEFAULT_MODEL, MODELS } from '../src/index.js';

afterEach(() => {
	vi.restoreAllMocks();
	delete process.env.ZEN_API_KEY;
});

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

describe('keyless-opencode-zen (DEPRECATED)', () => {
	it('MODELS is non-empty and DEFAULT_MODEL is MODELS[0]', () => {
		expect(MODELS.length).toBeGreaterThan(0);
		expect(DEFAULT_MODEL).toBe(MODELS[0]);
	});

	it('exports expected models including nemotron-ultra, nemotron-super, deepseek-v4-flash', () => {
		expect(MODELS).toContain('opencode/nemotron-3-ultra-free');
		expect(MODELS).toContain('opencode/nemotron-3-super-free');
		expect(MODELS).toContain('opencode/deepseek-v4-flash-free');
		expect(DEFAULT_MODEL).toBe('opencode/nemotron-3-ultra-free');
	});

	it('chat() throws without ZEN_API_KEY (not keyless)', async () => {
		delete process.env.ZEN_API_KEY;
		await expect(chat('hi')).rejects.toThrow(/ZEN_API_KEY/);
		await expect(chat('hi')).rejects.toThrow(/NOT keyless/);
	});

	it('chat() uses ZEN_API_KEY when set and returns content', async () => {
		process.env.ZEN_API_KEY = 'test-key-123';
		const f = mockFetch({ choices: [{ message: { content: 'hi there' } }] });
		const out = await chat('hi');
		expect(out).toBe('hi there');
		const [url, init] = f.mock.calls[0];
		expect(url).toBe(`${DEFAULT_BASE_URL}/chat/completions`);
		expect(init.headers['Authorization']).toBe('Bearer test-key-123');
	});

	it('throws on non-ok responses when key is set', async () => {
		process.env.ZEN_API_KEY = 'test-key-123';
		mockFetch('rate limited', false, 429);
		await expect(chat('hi')).rejects.toThrow(/429/);
	});
});
