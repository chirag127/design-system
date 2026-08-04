import { useClerk } from '@clerk/clerk-react'

export interface SignInButtonProps {
	/** URL to redirect to after sign-in. Defaults to current page. */
	redirectUrl?: string
	children?: React.ReactNode
	className?: string
}

/**
 * Opens Clerk's sign-in flow (redirect modal).
 * Unstyled — theme via [data-oriz-auth-sign-in] CSS selector.
 */
export function SignInButton({
	redirectUrl,
	children,
	className,
}: SignInButtonProps) {
	const { openSignIn } = useClerk()
	return (
		<button
			type="button"
			data-oriz-auth-sign-in
			className={className}
			onClick={() =>
				openSignIn({ redirectUrl: redirectUrl ?? window.location.href })
			}
		>
			{children ?? 'Sign in'}
		</button>
	)
}
