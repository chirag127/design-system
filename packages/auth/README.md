# @chirag127/auth

Clerk auth adapter for oriz family sites. React island components and a
hook — unstyled, themed per site via `data-oriz-auth-*` CSS hooks.

## Install

```bash
pnpm add @chirag127/auth @clerk/clerk-react react
```

## Env

```
PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...   # Astro/Vite
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_ # Next.js
CLERK_SECRET_KEY=sk_live_...               # server-only, never expose
```

## Astro static site (islands)

```astro
---
import { ClerkAuthProvider, AccountPanel } from '@chirag127/auth'
---
<ClerkAuthProvider client:load>
  <AccountPanel client:load siteName="oriz / blog" />
</ClerkAuthProvider>
```

Or split provider in a wrapper island when multiple components share state:

```tsx
// src/components/AuthIsland.tsx
import { ClerkAuthProvider, AccountPanel } from '@chirag127/auth'

export default function AuthIsland() {
  return (
    <ClerkAuthProvider>
      <AccountPanel siteName="oriz / blog" />
    </ClerkAuthProvider>
  )
}
```

```astro
<AuthIsland client:load />
```

## Next.js

Wrap `_app.tsx` / root layout with `ClerkAuthProvider`. The publishable key
is read automatically from `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.

```tsx
import { ClerkAuthProvider } from '@chirag127/auth'

export default function App({ Component, pageProps }) {
  return (
    <ClerkAuthProvider>
      <Component {...pageProps} />
    </ClerkAuthProvider>
  )
}
```

## API

| Export | Description |
|---|---|
| `ClerkAuthProvider` | Wraps `@clerk/clerk-react`'s `ClerkProvider`. Reads key from env or prop. |
| `SignInButton` | Button that opens Clerk sign-in modal. |
| `SignOutButton` | Button that calls `clerk.signOut()`. |
| `AccountPanel` | Full panel: loading / signed-in profile (UserButton) / signed-out CTA. |
| `useOrizAuth` | Hook: `{ isLoaded, isSignedIn, user, uid, email, signIn, signOut }`. |

## Theming

All components expose `data-oriz-auth-*` attributes for CSS targeting:

```css
[data-oriz-auth-panel-state="signed-out"] [data-oriz-auth-sign-in] {
  background: var(--color-accent);
  color: var(--paper);
}
[data-oriz-auth-panel-state="loading"] {
  opacity: 0.5;
}
```

Clerk's own `UserButton` popup can be styled via Clerk's `appearance` prop —
pass it through `ClerkAuthProvider` if needed:

```tsx
<ClerkAuthProvider appearance={{ variables: { colorPrimary: '#e85d3b' } }}>
```
