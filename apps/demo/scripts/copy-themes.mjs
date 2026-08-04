/**
 * copy-themes.mjs — copies @chirag127/theme CSS + @chirag127/atoms styles into
 * public/themes/ with the token @imports INLINED, so the demo can swap themes
 * at runtime by changing a <link> href (bundlers can't do that for you).
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'themes')
mkdirSync(outDir, { recursive: true })

function resolveFile(spec, fromDir) {
	try {
		return require.resolve(spec, { paths: [fromDir] })
	} catch {
		// bare package spec — resolve via node_modules package.json exports
		const pkg = require.resolve(`${spec}/package.json`, { paths: [fromDir] })
		const json = JSON.parse(readFileSync(pkg, 'utf8'))
		const main = json.main || json.exports?.['.']
		return resolve(dirname(pkg), typeof main === 'string' ? main : '')
	}
}

function inlineImports(cssPath, seen = new Set()) {
	const abs = resolve(cssPath)
	if (seen.has(abs)) return ''
	seen.add(abs)
	let css = readFileSync(abs, 'utf8')
	css = css.replace(/@import\s+['"]([^'"]+)['"]\s*;/g, (_m, spec) => {
		const target = spec.startsWith('.')
			? resolve(dirname(abs), spec)
			: resolveFile(spec, dirname(abs))
		return inlineImports(target, seen)
	})
	return css
}

const themes = ['editorial.css', 'marketing.css', 'dashboard.css', 'docs.css']
for (const t of themes) {
	const p = require.resolve(`@chirag127/theme/${t}`)
	writeFileSync(join(outDir, t), inlineImports(p), 'utf8')
}

writeFileSync(
	join(outDir, 'atoms.css'),
	readFileSync(require.resolve('@chirag127/atoms/styles.css'), 'utf8'),
	'utf8',
)

writeFileSync(
	join(outDir, 'theme.js'),
	readFileSync(require.resolve('@chirag127/theme/theme.js'), 'utf8'),
	'utf8',
)

console.log('themes copied to public/themes/')
