import { useClerk } from '@clerk/clerk-react'

export interface SignOutButtonProps {
	/** URL to redirect to after sign-out. Defaults to '/'. */
	redirectUrl?: string
	children?: React.ReactNode
	className?: string
}

/**
 * Signs the user out via Clerk and optionally redirects.
 * Unstyled — theme via [data-oriz-auth-sign-out] CSS selector.
 */
export function SignOutButton({
	redirectUrl = '/',
	children,
	className,
}: SignOutButtonProps) {
	const { signOut } = useClerk()
	return (
		<button
			type="button"
			data-oriz-auth-sign-out
			className={className}
			onClick={() => signOut({ redirectUrl })}
		>
			{children ?? 'Sign out'}
		</button>
	)
}
