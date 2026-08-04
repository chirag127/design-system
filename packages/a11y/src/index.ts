/**
 * @chirag127/a11y — public API
 */

export {
	announce,
	createToggle,
	setAria,
	visuallyHiddenStyles,
	visuallyHide,
} from './aria.js'
export type { FocusTrap } from './focus-trap.js'
export { createFocusTrap } from './focus-trap.js'
export type { Rover, RoverOptions } from './roving-tabindex.js'
export { createRover } from './roving-tabindex.js'
