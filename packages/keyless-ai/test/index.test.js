import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@chirag127/keyless-kilo', () => ({
	chat: vi.fn(),
	MODELS: ['kilo-auto/free', 'nvidia/nemotron-3-ultra-550b-a55b:free'],
}))
vi.mock('@chirag127/keyless-ovh', () => ({
	chat: vi.fn(),
	MODELS: ['gpt-oss-120b', 'gpt-oss-20b'],
}))
vi.mock('@chirag127/keyless-pollinations', () => ({
	chat: vi.fn(),
	MODELS: ['openai', 'openai-large', 'mistral'],
}))

import { chat as kilo } from '@chirag127/keyless-kilo'
import { chat as ovh } from '@chirag127/keyless-ovh'
import { chat as pollinations } from '@chirag127/keyless-pollinations'
import {
	chat,
	DEFAULT_ORDER,
	listProviders,
	MODELS,
	PROVIDERS,
} from '../src/index.js'

beforeEach(() => {
	vi.clearAllMocks()
	delete process.env.KEYLESS_ORDER
})

describe('keyless-ai', () => {
	it('lists exactly 3 providers (no opencode-zen)', () => {
		const providers = listProviders()
		expect(providers).toEqual(['kilo', 'ovh', 'pollinations'])
		expect(providers).not.toContain('opencode-zen')
	})

	it('DEFAULT_ORDER is [kilo, ovh, pollinations]', () => {
		expect(DEFAULT_ORDER).toEqual(['kilo', 'ovh', 'pollinations'])
		expect(DEFAULT_ORDER).not.toContain('opencode-zen')
	})

	it('PROVIDERS does not include opencode-zen', () => {
		expect(PROVIDERS).not.toHaveProperty('opencode-zen')
		expect(PROVIDERS).toHaveProperty('kilo')
		expect(PROVIDERS).toHaveProperty('ovh')
		expect(PROVIDERS).toHaveProperty('pollinations')
	})

	it('MODELS covers all 3 providers', () => {
		const providers = [...new Set(MODELS.map((m) => m.provider))]
		expect(providers).toContain('kilo')
		expect(providers).toContain('ovh')
		expect(providers).toContain('pollinations')
		expect(providers).not.toContain('opencode-zen')
	})

	it('MODELS is non-empty and first entry is from kilo (best-first by capability)', () => {
		expect(MODELS.length).toBeGreaterThan(0)
		expect(MODELS[0].provider).toBe('kilo')
	})

	it('pollinations entries appear last', () => {
		const lastProvider = MODELS[MODELS.length - 1].provider
		expect(lastProvider).toBe('pollinations')
	})

	it('returns first success (kilo) without trying others', async () => {
		kilo.mockResolvedValue('from-kilo')
		const out = await chat('hi')
		expect(out).toBe('from-kilo')
		expect(kilo).toHaveBeenCalledOnce()
		expect(ovh).not.toHaveBeenCalled()
		expect(pollinations).not.toHaveBeenCalled()
	})

	it('falls through to the next provider on failure', async () => {
		kilo.mockRejectedValue(new Error('402'))
		ovh.mockResolvedValue('from-ovh')
		const out = await chat('hi')
		expect(out).toBe('from-ovh')
		expect(kilo).toHaveBeenCalledOnce()
		expect(ovh).toHaveBeenCalledOnce()
		expect(pollinations).not.toHaveBeenCalled()
	})

	it('passes messages + opts through to the provider, strips order/onError', async () => {
		kilo.mockResolvedValue('ok')
		const onError = vi.fn()
		await chat([{ role: 'user', content: 'q' }], {
			model: 'x',
			temperature: 0.2,
			order: undefined,
			onError,
		})
		const [msgs, opts] = kilo.mock.calls[0]
		expect(msgs).toEqual([{ role: 'user', content: 'q' }])
		expect(opts).toEqual({ model: 'x', temperature: 0.2 })
		expect(opts).not.toHaveProperty('order')
		expect(opts).not.toHaveProperty('onError')
	})

	it('respects opts.order override', async () => {
		ovh.mockResolvedValue('from-ovh')
		const out = await chat('hi', { order: ['ovh', 'pollinations'] })
		expect(out).toBe('from-ovh')
		expect(ovh).toHaveBeenCalledOnce()
		expect(kilo).not.toHaveBeenCalled()
	})

	it('respects env KEYLESS_ORDER', async () => {
		process.env.KEYLESS_ORDER = 'kilo, pollinations'
		pollinations.mockResolvedValue('from-poll')
		kilo.mockRejectedValue(new Error('boom'))
		const out = await chat('hi')
		expect(out).toBe('from-poll')
		expect(kilo).toHaveBeenCalledOnce()
		expect(pollinations).toHaveBeenCalledOnce()
		expect(ovh).not.toHaveBeenCalled()
	})

	it('invokes onError for each failed provider', async () => {
		kilo.mockRejectedValue(new Error('e1'))
		ovh.mockResolvedValue('ok')
		const onError = vi.fn()
		await chat('hi', { onError })
		expect(onError).toHaveBeenCalledOnce()
		expect(onError).toHaveBeenCalledWith('kilo', expect.any(Error))
	})

	it('throws AggregateError only when ALL providers fail', async () => {
		kilo.mockRejectedValue(new Error('e1'))
		ovh.mockRejectedValue(new Error('e2'))
		pollinations.mockRejectedValue(new Error('e3'))
		await expect(chat('hi')).rejects.toThrow(AggregateError)
		await expect(chat('hi')).rejects.toThrow(/All keyless providers failed/)
	})

	it('records unknown provider names as errors and skips them', async () => {
		kilo.mockResolvedValue('ok')
		const out = await chat('hi', { order: ['nope', 'kilo'] })
		expect(out).toBe('ok')
		expect(kilo).toHaveBeenCalledOnce()
	})
})
