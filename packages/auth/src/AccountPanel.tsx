import { UserButton, useUser } from '@clerk/clerk-react'
import { SignInButton } from './SignInButton'

export interface AccountPanelProps {
	/** Site display name shown in the signed-in state. */
	siteName?: string
	/** URL to redirect after sign-in. */
	signInRedirectUrl?: string
	/** URL to redirect after sign-out. */
	signOutRedirectUrl?: string
}

/**
 * Full account panel — loading state, signed-in profile with UserButton
 * and sign-out, signed-out state with sign-in button.
 *
 * Unstyled — theme via data attributes:
 *   [data-oriz-auth-panel]
 *   [data-oriz-auth-panel-state="loading|signed-in|signed-out"]
 *   [data-oriz-auth-panel-me]
 *   [data-oriz-auth-panel-note]
 *   [data-oriz-auth-panel-heading]
 */
export function AccountPanel({
	siteName = 'oriz',
	signInRedirectUrl,
	signOutRedirectUrl = '/',
}: AccountPanelProps) {
	const { isLoaded, isSignedIn, user } = useUser()

	if (!isLoaded) {
		return (
			<div data-oriz-auth-panel data-oriz-auth-panel-state="loading">
				<span data-oriz-auth-panel-spinner aria-hidden="true">
					⟳
				</span>
				<p>Loading…</p>
			</div>
		)
	}

	if (isSignedIn && user) {
		return (
			<div data-oriz-auth-panel data-oriz-auth-panel-state="signed-in">
				<div data-oriz-auth-panel-me>
					<UserButton afterSignOutUrl={signOutRedirectUrl} />
					<div>
						<p data-oriz-auth-panel-name>
							{user.fullName ??
								user.primaryEmailAddress?.emailAddress ??
								'Signed in'}
						</p>
						{user.primaryEmailAddress && (
							<p data-oriz-auth-panel-email>
								{user.primaryEmailAddress.emailAddress}
							</p>
						)}
					</div>
				</div>
				<p data-oriz-auth-panel-note>
					You are signed in across every oriz site. Visit any subdomain — your
					session is already there.
				</p>
			</div>
		)
	}

	return (
		<div data-oriz-auth-panel data-oriz-auth-panel-state="signed-out">
			<h2 data-oriz-auth-panel-heading>Sign in to {siteName}</h2>
			<p data-oriz-auth-panel-note>
				Sign-in is optional. Use it to sync bookmarks across devices.
			</p>
			<SignInButton redirectUrl={signInRedirectUrl} />
		</div>
	)
}
