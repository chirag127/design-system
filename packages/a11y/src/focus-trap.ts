/**
 * focus-trap.ts — lightweight, zero-dependency focus trap.
 *
 * Usage:
 *   const trap = createFocusTrap(dialogEl)
 *   trap.activate()   // locks focus inside
 *   trap.deactivate() // releases + returns focus to prior element
 */

const FOCUSABLE =
	'a[href],area[href],input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]'

export interface FocusTrap {
	activate(): void
	deactivate(): void
	isActive(): boolean
}

export function createFocusTrap(container: HTMLElement): FocusTrap {
	let prior: HTMLElement | null = null
	let active = false

	function focusable(): HTMLElement[] {
		return Array.from(
			container.querySelectorAll<HTMLElement>(FOCUSABLE),
		).filter((el) => !el.closest('[inert]') && el.offsetParent !== null)
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Tab') return
		const els = focusable()
		if (!els.length) {
			e.preventDefault()
			return
		}
		const first = els[0]
		const last = els[els.length - 1]
		if (e.shiftKey) {
			if (document.activeElement === first) {
				e.preventDefault()
				last.focus()
			}
		} else {
			if (document.activeElement === last) {
				e.preventDefault()
				first.focus()
			}
		}
	}

	return {
		activate() {
			if (active) return
			prior = document.activeElement as HTMLElement | null
			active = true
			container.addEventListener('keydown', onKeydown)
			const els = focusable()
			if (els.length) els[0].focus()
		},
		deactivate() {
			if (!active) return
			active = false
			container.removeEventListener('keydown', onKeydown)
			prior?.focus()
			prior = null
		},
		isActive: () => active,
	}
}
