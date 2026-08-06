import { describe, expect, it } from 'vitest'
import { buildPayload, buildVisionMessages } from './payload'

describe('buildPayload', () => {
	it('defaults model to openai', () => {
		const p = buildPayload([{ role: 'user', content: 'hi' }])
		expect(p.model).toBe('openai')
		expect(p.messages).toHaveLength(1)
		expect(p.temperature).toBeUndefined()
	})

	it('honors model + temperature', () => {
		const p = buildPayload([{ role: 'user', content: 'hi' }], {
			model: 'mistral',
			temperature: 0.2,
		})
		expect(p.model).toBe('mistral')
		expect(p.temperature).toBe(0.2)
	})

	it('omits temperature when undefined', () => {
		const p = buildPayload([{ role: 'user', content: 'hi' }], { model: 'x' })
		expect('temperature' in p).toBe(false)
	})
})

describe('buildVisionMessages', () => {
	it('builds a single user message with text + image parts', () => {
		const msgs = buildVisionMessages(
			'what is this',
			'data:image/png;base64,AAA',
		)
		expect(msgs).toHaveLength(1)
		expect(msgs[0].role).toBe('user')
		const parts = msgs[0].content as Array<Record<string, unknown>>
		expect(parts[0]).toEqual({ type: 'text', text: 'what is this' })
		expect(parts[1]).toEqual({
			type: 'image_url',
			image_url: { url: 'data:image/png;base64,AAA' },
		})
	})
})
