/**
 * aria.ts — lightweight ARIA attribute helpers.
 *
 * These are thin wrappers that keep ARIA bookkeeping in one place and avoid
 * typos in attribute names.
 */

/** Set multiple ARIA attributes in one call. */
export function setAria(
	el: Element,
	attrs: Record<string, string | boolean | null>,
): void {
	for (const [k, v] of Object.entries(attrs)) {
		const name = k.startsWith('aria-') ? k : `aria-${k}`
		if (v === null) {
			el.removeAttribute(name)
		} else {
			el.setAttribute(name, String(v))
		}
	}
}

/** Announce a live message to screen readers. */
export function announce(
	message: string,
	opts: { politeness?: 'polite' | 'assertive'; clearMs?: number } = {},
): void {
	const { politeness = 'polite', clearMs = 3000 } = opts
	let region = document.getElementById('oz-live-region')
	if (!region) {
		region = document.createElement('div')
		region.id = 'oz-live-region'
		region.setAttribute('aria-live', politeness)
		region.setAttribute('aria-atomic', 'true')
		Object.assign(region.style, {
			position: 'absolute',
			width: '1px',
			height: '1px',
			overflow: 'hidden',
			clip: 'rect(0 0 0 0)',
			whiteSpace: 'nowrap',
		})
		document.body.appendChild(region)
	} else {
		region.setAttribute('aria-live', politeness)
	}
	region.textContent = ''
	// Tiny timeout forces screen readers to re-announce identical strings.
	setTimeout(() => {
		if (region) region.textContent = message
	}, 50)
	if (clearMs > 0)
		setTimeout(() => {
			if (region) region.textContent = ''
		}, clearMs + 50)
}

/**
 * visually-hidden utility — returns an inline style string that hides content
 * visually while keeping it accessible to assistive technology.
 */
export const visuallyHiddenStyles: Readonly<Partial<CSSStyleDeclaration>> = {
	position: 'absolute',
	width: '1px',
	height: '1px',
	padding: '0',
	margin: '-1px',
	overflow: 'hidden',
	clip: 'rect(0,0,0,0)',
	whiteSpace: 'nowrap',
	borderWidth: '0',
}

/** Apply visually-hidden styles to an element. */
export function visuallyHide(el: HTMLElement): void {
	Object.assign(el.style, visuallyHiddenStyles)
}

/** Manage aria-expanded + aria-controls for a toggle (button → panel). */
export function createToggle(
	trigger: HTMLElement,
	panel: HTMLElement,
): { open(): void; close(): void; toggle(): boolean } {
	const id = panel.id || `oz-panel-${Math.random().toString(36).slice(2, 7)}`
	panel.id = id
	trigger.setAttribute('aria-controls', id)
	trigger.setAttribute('aria-expanded', 'false')
	panel.setAttribute('aria-hidden', 'true')

	function open() {
		trigger.setAttribute('aria-expanded', 'true')
		panel.removeAttribute('aria-hidden')
	}
	function close() {
		trigger.setAttribute('aria-expanded', 'false')
		panel.setAttribute('aria-hidden', 'true')
	}
	function toggle() {
		const expanded = trigger.getAttribute('aria-expanded') === 'true'
		expanded ? close() : open()
		return !expanded
	}

	return { open, close, toggle }
}
