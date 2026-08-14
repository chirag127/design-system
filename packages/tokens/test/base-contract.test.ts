import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { declaredProps, readCss, ruleBody } from './parse'

const SRC = join(__dirname, '..', '..', 'oz-tokens-base', 'src')
const contract = readCss(join(SRC, 'contract.css'))

// The 7 semantic color roles the --oz-* base contract ships (see contract.css).
const COLOR_ROLES = [
	'--oz-bg',
	'--oz-fg',
	'--oz-surface',
	'--oz-muted',
	'--oz-border',
	'--oz-accent',
	'--oz-accent-fg',
] as const
const FONT_SLOTS = [
	'--oz-font-display',
	'--oz-font-body',
	'--oz-font-mono',
] as const

const HEX = /^#[0-9a-f]{3,8}$/i

describe('oz-tokens-base contract.css', () => {
	const light = declaredProps(ruleBody(contract, ':root {'))

	it('declares every color role with a valid hex default', () => {
		for (const role of COLOR_ROLES) expect(light[role]).toMatch(HEX)
	})

	it('declares the three font-family slots', () => {
		for (const slot of FONT_SLOTS) expect(light[slot]).toBeTruthy()
	})

	it('ships the shared space / radii / motion primitives', () => {
		expect(light['--oz-space-1']).toBe('0.25rem')
		expect(light['--oz-radius-full']).toBe('999px')
		expect(light['--oz-dur-base']).toBe('200ms')
		expect(light['--oz-ease-out']).toMatch(/^cubic-bezier\(/)
	})

	it('dark block overrides every color role, not the primitives', () => {
		const dark = declaredProps(
			ruleBody(contract, '@media (prefers-color-scheme: dark)'),
		)
		const darkNames = new Set(Object.keys(dark))
		for (const role of COLOR_ROLES) {
			expect(darkNames.has(role)).toBe(true)
			expect(dark[role]).not.toBe(light[role])
		}
		// Dark must not touch spacing/motion primitives.
		expect(darkNames.has('--oz-space-1')).toBe(false)
		expect(darkNames.has('--oz-dur-base')).toBe(false)
	})
})

describe('primitives are identical across tokens + oz-tokens-base', () => {
	// oz-tokens-base and @chirag127/tokens both ship the shared non-color scale;
	// the overlap MUST match so rhythm stays consistent no matter which is loaded.
	const base = declaredProps(ruleBody(contract, ':root {'))
	const prims = declaredProps(
		readCss(join(__dirname, '..', '..', 'tokens', 'src', 'primitives.css')),
	)
	const shared = [
		'--oz-space-1',
		'--oz-space-2',
		'--oz-space-4',
		'--oz-space-8',
		'--oz-radius-s',
		'--oz-radius-m',
		'--oz-radius-full',
		'--oz-dur-fast',
		'--oz-dur-base',
		'--oz-dur-slow',
		'--oz-ease-out',
		'--oz-ease-in-out',
	]

	it.each(shared)('%s matches in both files', (name) => {
		expect(base[name]).toBe(prims[name])
	})
})
