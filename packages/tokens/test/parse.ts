import { readFileSync } from 'node:fs'

/** Read a CSS file relative to a package src dir. */
export function readCss(path: string): string {
	return readFileSync(path, 'utf8')
}

/**
 * Collect every `--oz-*` custom-property declaration in a CSS string as a
 * name -> value map (last write wins, like the cascade). Comments stripped.
 * Pure — no CSS engine, just what the tokens actually declare.
 */
export function declaredProps(css: string): Record<string, string> {
	const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
	const out: Record<string, string> = {}
	const re = /(--oz-[a-z0-9-]+)\s*:\s*([^;]+);/gi
	for (const m of noComments.matchAll(re)) {
		out[m[1]] = m[2].trim().replace(/\s+/g, ' ')
	}
	return out
}

/** Just the set of declared `--oz-*` property names. */
export function declaredNames(css: string): Set<string> {
	return new Set(Object.keys(declaredProps(css)))
}

/**
 * Extract the `{ ... }` body of the first rule whose selector text contains
 * `selectorNeedle`. Used to compare light vs dark blocks in an identity file.
 */
export function ruleBody(css: string, selectorNeedle: string): string {
	const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '')
	const idx = noComments.indexOf(selectorNeedle)
	if (idx === -1) return ''
	const open = noComments.indexOf('{', idx)
	if (open === -1) return ''
	// Walk braces to find the matching close (handles nested @media blocks).
	let depth = 0
	for (let i = open; i < noComments.length; i++) {
		if (noComments[i] === '{') depth++
		else if (noComments[i] === '}') {
			depth--
			if (depth === 0) return noComments.slice(open + 1, i)
		}
	}
	return ''
}
