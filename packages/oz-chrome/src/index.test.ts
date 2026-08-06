import { describe, expect, it } from 'vitest'
import { normalizeSite, ORIZ_HOME, resolveChrome } from './index.js'

describe('normalizeSite', () => {
	it('lowercases + trims valid slugs', () => {
		expect(normalizeSite('  Cards ')).toBe('cards')
		expect(normalizeSite('portfolio-lab')).toBe('portfolio-lab')
	})
	it('rejects invalid slugs', () => {
		expect(normalizeSite('-bad')).toBe('')
		expect(normalizeSite('bad-')).toBe('')
		expect(normalizeSite('a b')).toBe('')
		expect(normalizeSite(undefined)).toBe('')
	})
})

describe('resolveChrome', () => {
	it('builds subdomain wordmark + defaults title to it', () => {
		const r = resolveChrome({ site: 'cards' })
		expect(r.wordmark).toBe('cards.oriz.in')
		expect(r.title).toBe('cards.oriz.in')
		expect(r.wordmarkHref).toBe(ORIZ_HOME)
		expect(r.themeColor).toBe('var(--oz-accent)')
	})
	it('falls back to bare oriz.in for empty/invalid site', () => {
		expect(resolveChrome({ site: '' }).wordmark).toBe('oriz.in')
		expect(resolveChrome({ site: 'a b' }).wordmark).toBe('oriz.in')
	})
	it('honors explicit title, href, themeColor', () => {
		const r = resolveChrome({
			site: 'lore',
			title: 'Lorebook',
			wordmarkHref: 'https://oriz.in/lore',
			themeColor: '#7c3aed',
		})
		expect(r.title).toBe('Lorebook')
		expect(r.wordmarkHref).toBe('https://oriz.in/lore')
		expect(r.themeColor).toBe('#7c3aed')
	})
})
