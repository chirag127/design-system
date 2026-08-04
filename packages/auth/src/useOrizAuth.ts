import { useClerk, useUser } from '@clerk/clerk-react'

/** Clerk user resource, derived from useUser so no @clerk/types dep is needed. */
type UserResource = NonNullable<ReturnType<typeof useUser>['user']>

export interface OrizAuth {
	/** True once Clerk has resolved the session. */
	isLoaded: boolean
	/** True when a user session is active. */
	isSignedIn: boolean
	/** Clerk user, or null/undefined while loading or signed-out. */
	user: UserResource | null | undefined
	/** Clerk user ID — null when signed-out or loading. */
	uid: string | null
	/** Primary email — null when signed-out or loading. */
	email: string | null
	/** Open Clerk sign-in; defaults redirect to current page. */
	signIn: (redirectUrl?: string) => void
	/** Sign out; defaults redirect to '/'. */
	signOut: (redirectUrl?: string) => void
}

/**
 * Thin hook over Clerk with an oriz-flavoured surface.
 * Returns the Clerk user, loaded state, sign-in and sign-out helpers.
 */
export function useOrizAuth(): OrizAuth {
	const { isLoaded, isSignedIn, user } = useUser()
	const { openSignIn, signOut } = useClerk()

	return {
		isLoaded,
		isSignedIn: isSignedIn ?? false,
		user,
		/** Clerk user ID — null when signed-out or loading. */
		uid: user?.id ?? null,
		/** Primary email — null when signed-out or loading. */
		email: user?.primaryEmailAddress?.emailAddress ?? null,
		signIn: (redirectUrl?: string) =>
			openSignIn({ redirectUrl: redirectUrl ?? window.location.href }),
		signOut: (redirectUrl = '/') => signOut({ redirectUrl }),
	}
}
