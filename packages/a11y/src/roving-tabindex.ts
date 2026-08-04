/**
 * roving-tabindex.ts — single-focus roving tabindex for toolbars,
 * listboxes, and radio groups.
 *
 * Usage:
 *   const rover = createRover(toolbarEl, { orientation: 'horizontal' })
 *   // Arrow keys cycle; Home/End jump to first/last.
 *   rover.destroy() // cleanup
 */

export interface RoverOptions {
	/** 'horizontal' | 'vertical' | 'both' — default 'horizontal' */
	orientation?: 'horizontal' | 'vertical' | 'both'
	/** called after focus moves to newIndex */
	onChange?: (newIndex: number) => void
}

export interface Rover {
	focus(index: number): void
	destroy(): void
}

const FOCUSABLE =
	'a[href],input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex]:not([tabindex="-1"]),[role="option"],[role="menuitem"],[role="tab"],[role="radio"],[role="treeitem"]'

export function createRover(
	container: HTMLElement,
	opts: RoverOptions = {},
): Rover {
	const { orientation = 'horizontal', onChange } = opts

	function items(): HTMLElement[] {
		return Array.from(
			container.querySelectorAll<HTMLElement>(FOCUSABLE),
		).filter(
			(el) =>
				el.closest(container.tagName.toLowerCase()) === container ||
				container.contains(el),
		)
	}

	function setIndex(i: number) {
		const els = items()
		if (!els.length) return
		const clamped = Math.max(0, Math.min(i, els.length - 1))
		els.forEach((el, idx) => {
			el.tabIndex = idx === clamped ? 0 : -1
		})
		els[clamped].focus()
		onChange?.(clamped)
	}

	function onKeydown(e: KeyboardEvent) {
		const els = items()
		if (!els.length) return
		const cur = els.indexOf(document.activeElement as HTMLElement)
		if (cur === -1) return
		const fwd = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
		const bwd = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
		const fwd2 = orientation === 'both' ? 'ArrowDown' : null
		const bwd2 = orientation === 'both' ? 'ArrowUp' : null

		if (e.key === fwd || e.key === fwd2) {
			e.preventDefault()
			setIndex((cur + 1) % els.length)
		} else if (e.key === bwd || e.key === bwd2) {
			e.preventDefault()
			setIndex((cur - 1 + els.length) % els.length)
		} else if (e.key === 'Home') {
			e.preventDefault()
			setIndex(0)
		} else if (e.key === 'End') {
			e.preventDefault()
			setIndex(els.length - 1)
		}
	}

	// Initialise: first item focusable, rest -1.
	const init = items()
	init.forEach((el, i) => {
		el.tabIndex = i === 0 ? 0 : -1
	})
	container.addEventListener('keydown', onKeydown)

	return {
		focus: setIndex,
		destroy() {
			container.removeEventListener('keydown', onKeydown)
		},
	}
}
