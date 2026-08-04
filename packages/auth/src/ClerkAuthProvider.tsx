import { ClerkProvider } from '@clerk/clerk-react'
import type { ReactNode } from 'react'

// Minimal ambient declaration — avoids pulling @types/node into a browser package.
// Access is guarded by `typeof process !== 'undefined'` for non-Node runtimes.
declare const process: { env?: Record<string, string | undefined> } | undefined

export interface ClerkAuthProviderProps {
	/**
	 * Clerk publishable key. Defaults to the env var
	 * PUBLIC_CLERK_PUBLISHABLE_KEY (Astro) or
	 * NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (Next.js).
	 * Pass explicitly when the env var name differs.
	 */
	publishableKey?: string
	children: ReactNode
}

/**
 * Wraps @clerk/clerk-react ClerkProvider.
 * Mount as a React island with client:load in Astro static sites.
 *
 * @example
 * // Astro
 * <ClerkAuthProvider client:load>
 *   <AccountPanel />
 * </ClerkAuthProvider>
 */
export function ClerkAuthProvider({
	publishableKey,
	children,
}: ClerkAuthProviderProps) {
	const key =
		publishableKey ??
		// Astro / Vite public env
		(typeof import.meta !== 'undefined'
			? (import.meta as { env?: Record<string, string> }).env
					?.PUBLIC_CLERK_PUBLISHABLE_KEY
			: undefined) ??
		// Next.js / CRA
		(typeof process !== 'undefined'
			? process.env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
			: undefined) ??
		''

	if (!key) {
		console.warn(
			'[@chirag127/auth] No Clerk publishable key found. ' +
				'Set PUBLIC_CLERK_PUBLISHABLE_KEY in env or pass publishableKey prop.',
		)
	}

	return <ClerkProvider publishableKey={key}>{children}</ClerkProvider>
}
