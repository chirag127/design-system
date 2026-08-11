import { afterEach, describe, expect, it, vi } from 'vitest'
import {
	chat,
	DEFAULT_BASE_URL,
	DEFAULT_MODEL,
	MODELS,
	toMessages,
} from '../src/index.js'

afterEach(() => vi.restoreAllMocks())

const ok = (content) => ({
	ok: true,
	json: async () => ({
		choices: [{ message: { role: 'assistant', content } }],
	}),
})

describe('keyless-pollinations', () => {
	it('MODELS is non-empty and DEFAULT_MODEL is openai', () => {
		expect(MODELS.length).toBeGreaterThan(0)
		expect(DEFAULT_MODEL).toBe('openai')
	})

	it('exposes known models including openai-large, openai, and mistral', () => {
		expect(MODELS).toContain('openai-large')
		expect(MODELS).toContain('openai')
		expect(MODELS).toContain('mistral')
	})

	it('toMessages wraps a string', () => {
		expect(toMessages('hi')).toEqual([{ role: 'user', content: 'hi' }])
		const arr = [{ role: 'user', content: 'x' }]
		expect(toMessages(arr)).toBe(arr)
	})

	it('POSTs with Referer header, no auth, and returns content', async () => {
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(ok('pong'))
		const out = await chat('ping')
		expect(out).toBe('pong')
		const [url, init] = spy.mock.calls[0]
		expect(url).toBe(`${DEFAULT_BASE_URL}/chat/completions`)
		expect(init.method).toBe('POST')
		expect(init.headers['Referer']).toBe('https://oriz.in')
		expect(init.headers).not.toHaveProperty('Authorization')
		const body = JSON.parse(init.body)
		expect(body.model).toBe('openai')
		expect(body.messages).toEqual([{ role: 'user', content: 'ping' }])
	})

	it('chat() sends DEFAULT_MODEL (openai) when no model given', async () => {
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(ok('x'))
		await chat('hi')
		const body = JSON.parse(spy.mock.calls[0][1].body)
		expect(body.model).toBe('openai')
	})

	it('opts.model overrides DEFAULT_MODEL', async () => {
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(ok('x'))
		await chat([{ role: 'user', content: 'q' }], {
			model: 'mistral',
			baseUrl: 'https://ex/openai',
		})
		const [url, init] = spy.mock.calls[0]
		expect(url).toBe('https://ex/openai/chat/completions')
		expect(JSON.parse(init.body).model).toBe('mistral')
	})

	it('sends Referer header even with custom baseUrl', async () => {
		const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(ok('x'))
		await chat('hi', { baseUrl: 'https://custom.test/openai' })
		const [, init] = spy.mock.calls[0]
		expect(init.headers['Referer']).toBe('https://oriz.in')
	})

	it('throws on non-ok (e.g. 402)', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: false,
			status: 402,
			statusText: 'Payment Required',
			text: async () => 'quota',
		})
		await expect(chat('ping')).rejects.toThrow(/402/)
	})
})
