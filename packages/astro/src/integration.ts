/**
 * @chirag127/astro — integration entry point.
 *
 * Registers the atoms script + chosen theme stylesheet via Astro's
 * injectScript / injectRoute API.
 *
 * Usage (astro.config.mjs):
 *   import oz from '@chirag127/astro'
 *   export default defineConfig({
 *     integrations: [oz({ identity: 'editorial' })]
 *   })
 */
import type { AstroIntegration } from 'astro'

export interface OzIntegrationOptions {
	/** Which theme identity to inject. Default: 'editorial' */
	identity?: 'editorial' | 'marketing' | 'dashboard' | 'docs'
}

export function ozIntegration(
	opts: OzIntegrationOptions = {},
): AstroIntegration {
	const { identity = 'editorial' } = opts

	return {
		name: '@chirag127/astro',
		hooks: {
			'astro:config:setup'({ injectScript }) {
				// Inject theme CSS + atoms registration once, in <head> before page content.
				injectScript(
					'page-ssr',
					`import '@chirag127/tokens/primitives.css';
import '@chirag127/tokens/${identity}.css';
import '@chirag127/atoms/styles.css';
import '@chirag127/theme/theme.js';
import '@chirag127/atoms';`,
				)
			},
		},
	}
}

export default ozIntegration
