/**
 * @chirag127/oz-chrome — shared oriz.in Astro chrome.
 *
 * Runtime exports = pure helpers the .astro components consume.
 * Components are imported directly as .astro files (see package exports).
 */

export const ORIZ_HOME = 'https://oriz.in'

export interface ChromeMeta {
	/** Site slug, e.g. "cards" — powers "cards.oriz.in" wordmark tail. */
	site: string
	/** Page/tool title shown in the header. */
	title?: string
	/** Absolute URL the wordmark links to. Defaults to https://oriz.in. */
	wordmarkHref?: string
	/** theme-color meta value; falls back to the --oz-accent token at runtime. */
	themeColor?: string
}

export interface ResolvedChrome {
	wordmarkHref: string
	title: string
	site: string
	/** "oriz.in" or "cards.oriz.in" — the rendered wordmark text. */
	wordmark: string
	themeColor: string
}

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

/** Normalize + validate a subdomain slug; empty/invalid → "". */
export function normalizeSite(site: string | undefined): string {
	const s = (site ?? '').trim().toLowerCase()
	return SLUG_RE.test(s) ? s : ''
}

/**
 * Resolve chrome props to a fully-defaulted shape the components render.
 * Pure — no DOM, safe to unit-test.
 */
export function resolveChrome(meta: ChromeMeta): ResolvedChrome {
	const site = normalizeSite(meta.site)
	const wordmark = site ? `${site}.oriz.in` : 'oriz.in'
	return {
		wordmarkHref: meta.wordmarkHref?.trim() || ORIZ_HOME,
		title: meta.title?.trim() || wordmark,
		site,
		wordmark,
		themeColor: meta.themeColor?.trim() || 'var(--oz-accent)',
	}
}
