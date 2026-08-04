/**
 * @chirag127/react — thin React wrappers over @chirag127/atoms web components.
 *
 * These are typed React components that render the oz-* custom elements.
 * They forward all standard HTML attributes + the oz-specific variant/size/tone.
 * Import the styles + register atoms once in your app:
 *
 *   import '@chirag127/theme/editorial.css'
 *   import '@chirag127/atoms/styles.css'
 *   import '@chirag127/atoms'          // registers custom elements
 */

import type { HTMLAttributes, ReactNode, Ref } from 'react'

// ── Shared prop helpers ──────────────────────────────────────────────────────

type DataAttributes = Record<`data-${string}`, string | undefined>

interface OzBase extends HTMLAttributes<HTMLElement>, DataAttributes {
	class?: string
	ref?: Ref<HTMLElement>
}

// ── oz-button ────────────────────────────────────────────────────────────────

export interface ButtonProps extends OzBase {
	variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
	size?: 'sm' | 'md' | 'lg'
	href?: string
	target?: string
	rel?: string
	disabled?: boolean
	type?: 'button' | 'submit' | 'reset'
	children?: ReactNode
}

interface OzIntrinsicElements {
	'oz-button': OzBase & {
		variant?: string
		size?: string
		href?: string
		target?: string
		rel?: string
		disabled?: boolean
	}
	'oz-chip': OzBase & { tone?: string; href?: string }
	'oz-card': OzBase & { hoverable?: boolean; href?: string }
	'oz-badge': OzBase & { tone?: string }
	'oz-nav-link': OzBase & { active?: boolean; href?: string }
	'oz-divider': OzBase
	'oz-kicker': OzBase
	'oz-field': OzBase
	'oz-prose': OzBase
}

// React 19 resolves JSX via the `React.JSX` namespace; older setups + other
// tooling still read the global `JSX`. Augment both so the oz-* elements type
// under any consumer.
declare global {
	namespace JSX {
		interface IntrinsicElements extends OzIntrinsicElements {}
	}
}

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements extends OzIntrinsicElements {}
	}
}

export function Button({
	variant,
	size,
	href,
	target,
	rel,
	disabled,
	type,
	children,
	...rest
}: ButtonProps) {
	const props: Record<string, unknown> = { ...rest }
	if (variant) props.variant = variant
	if (size) props.size = size
	if (href) props.href = href
	if (target) props.target = target
	if (rel) props.rel = rel
	if (disabled) props.disabled = true
	if (type) props['data-type'] = type
	return <oz-button {...(props as OzBase)}>{children}</oz-button>
}

// ── oz-chip ──────────────────────────────────────────────────────────────────

export interface ChipProps extends OzBase {
	tone?: 'accent' | 'neutral'
	href?: string
	children?: ReactNode
}

export function Chip({ tone, href, children, ...rest }: ChipProps) {
	const props: Record<string, unknown> = { ...rest }
	if (tone) props.tone = tone
	if (href) props.href = href
	return <oz-chip {...(props as OzBase)}>{children}</oz-chip>
}

// ── oz-card ──────────────────────────────────────────────────────────────────

export interface CardProps extends OzBase {
	hoverable?: boolean
	href?: string
	children?: ReactNode
}

export function Card({ hoverable, href, children, ...rest }: CardProps) {
	const props: Record<string, unknown> = { ...rest }
	if (hoverable) props.hoverable = true
	if (href) props.href = href
	return <oz-card {...(props as OzBase)}>{children}</oz-card>
}

// ── oz-badge ─────────────────────────────────────────────────────────────────

export interface BadgeProps extends OzBase {
	tone?: 'accent' | 'success' | 'danger' | 'neutral'
	children?: ReactNode
}

export function Badge({ tone, children, ...rest }: BadgeProps) {
	const props: Record<string, unknown> = { ...rest }
	if (tone) props.tone = tone
	return <oz-badge {...(props as OzBase)}>{children}</oz-badge>
}

// ── oz-nav-link ───────────────────────────────────────────────────────────────

export interface NavLinkProps extends OzBase {
	active?: boolean
	href?: string
	children?: ReactNode
}

export function NavLink({ active, href, children, ...rest }: NavLinkProps) {
	const props: Record<string, unknown> = { ...rest }
	if (active) props.active = true
	if (href) props.href = href
	return <oz-nav-link {...(props as OzBase)}>{children}</oz-nav-link>
}

// ── oz-divider ───────────────────────────────────────────────────────────────

export function Divider({
	children,
	...rest
}: OzBase & { children?: ReactNode }) {
	return <oz-divider {...rest}>{children}</oz-divider>
}

// ── oz-kicker ─────────────────────────────────────────────────────────────────

export function Kicker({
	children,
	...rest
}: OzBase & { children?: ReactNode }) {
	return <oz-kicker {...rest}>{children}</oz-kicker>
}

// ── oz-field ──────────────────────────────────────────────────────────────────

export function Field({
	children,
	...rest
}: OzBase & { children?: ReactNode }) {
	return <oz-field {...rest}>{children}</oz-field>
}

// ── oz-prose ──────────────────────────────────────────────────────────────────

export function Prose({
	children,
	...rest
}: OzBase & { children?: ReactNode }) {
	return <oz-prose {...rest}>{children}</oz-prose>
}

// ── useFocusTrap (a11y hook) ──────────────────────────────────────────────────

export { announce, createToggle, setAria } from '@chirag127/a11y/aria'
export { createFocusTrap } from '@chirag127/a11y/focus-trap'
export { createRover } from '@chirag127/a11y/roving-tabindex'
