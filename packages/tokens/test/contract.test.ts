import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { declaredNames, declaredProps, readCss, ruleBody } from './parse'

const SRC = join(__dirname, '..', 'src')
const identityCss = (id: string) =>
	readCss(join(SRC, 'identities', `${id}.css`))

const IDENTITIES = ['editorial', 'marketing', 'dashboard', 'docs'] as const

// The semantic contract every identity must satisfy — documented in index.css
// and consumed by @chirag127/theme + @chirag127/atoms.
const COLOR_ROLES = [
	'--oz-paper',
	'--oz-paper-2',
	'--oz-ink',
	'--oz-ink-mute',
	'--oz-rule',
	'--oz-accent',
	'--oz-accent-soft',
	'--oz-accent-fg',
	'--oz-success',
	'--oz-danger',
] as const
const FONT_SLOTS = [
	'--oz-font-display',
	'--oz-font-body',
	'--oz-font-mono',
] as const
const CONTRACT = [...COLOR_ROLES, ...FONT_SLOTS]

const HEX = /^#[0-9a-f]{3,8}$/i

describe.each(IDENTITIES)('identity contract: %s', (id) => {
	const css = identityCss(id)
	const lightBody = ruleBody(css, ':root,')
	const light = declaredProps(lightBody)

	it('light block declares every contract prop, and nothing extra', () => {
		expect(new Set(Object.keys(light))).toEqual(new Set(CONTRACT))
	})

	it('color roles are valid hex', () => {
		for (const role of COLOR_ROLES) expect(light[role]).toMatch(HEX)
	})

	it('font slots are non-empty family lists', () => {
		for (const slot of FONT_SLOTS) {
			expect(light[slot]).toBeTruthy()
			expect(light[slot]).toMatch(/(serif|sans-serif|monospace|system-ui)/)
		}
	})

	it('sets color-scheme: light on the light block', () => {
		expect(lightBody).toMatch(/color-scheme:\s*light/)
	})

	// Two dark surfaces: prefers-color-scheme media query + explicit opt-in.
	it.each([
		'@media (prefers-color-scheme: dark)',
		':root[data-oz-theme="dark"]',
	])('dark surface %s overrides all 10 color roles', (needle) => {
		const dark = declaredNames(ruleBody(css, needle))
		for (const role of COLOR_ROLES) expect(dark.has(role)).toBe(true)
	})

	it('dark and light differ for at least the paper/ink surfaces', () => {
		const dark = declaredProps(ruleBody(css, ':root[data-oz-theme="dark"]'))
		expect(dark['--oz-paper']).not.toBe(light['--oz-paper'])
		expect(dark['--oz-ink']).not.toBe(light['--oz-ink'])
	})
})

describe('identities are mutually consistent', () => {
	it('all four expose the identical set of contract props', () => {
		const sets = IDENTITIES.map((id) => {
			const light = ruleBody(identityCss(id), ':root,')
			return [...declaredNames(light)].sort()
		})
		for (const s of sets) expect(s).toEqual(sets[0])
	})

	it('each identity uses a distinct accent (own look, shared mechanism)', () => {
		const accents = IDENTITIES.map(
			(id) => declaredProps(ruleBody(identityCss(id), ':root,'))['--oz-accent'],
		)
		expect(new Set(accents).size).toBe(IDENTITIES.length)
	})
})

describe('primitives.css — shared non-color scale', () => {
	const prims = declaredProps(readCss(join(SRC, 'primitives.css')))

	it('declares no color roles (identity-agnostic)', () => {
		for (const role of COLOR_ROLES) expect(prims[role]).toBeUndefined()
	})

	it('ships the 4px space scale and radii', () => {
		expect(prims['--oz-space-1']).toBe('0.25rem')
		expect(prims['--oz-space-4']).toBe('1rem')
		expect(prims['--oz-radius-full']).toBe('999px')
	})

	it('ships motion durations in ms', () => {
		for (const d of ['--oz-dur-fast', '--oz-dur-base', '--oz-dur-slow'])
			expect(prims[d]).toMatch(/^\d+ms$/)
	})
})
