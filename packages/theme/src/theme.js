/**
 * @chirag127/theme — theme.js
 *
 * Framework-agnostic light/dark switcher. Zero dependencies.
 *
 *   <script type="module" src="@chirag127/theme/theme.js"></script>
 *
 * Exposes:
 *   window.ozTheme.get()      -> 'light' | 'dark' | 'auto'
 *   window.ozTheme.set('dark') -> persists + applies
 *   window.ozTheme.cycle()     -> light → dark → auto
 *
 * Persists to localStorage (`oz-theme`), honors `data-oz-theme` on <html>,
 * falls back to the OS preference.
 */
;(() => {
  const KEY = 'oz-theme'
  const root = document.documentElement

  function apply(value) {
    if (value === 'auto') {
      root.removeAttribute('data-oz-theme')
    } else {
      root.setAttribute('data-oz-theme', value)
    }
  }

  function get() {
    return localStorage.getItem(KEY) || 'auto'
  }

  function set(value) {
    localStorage.setItem(KEY, value)
    apply(value)
  }

  function cycle() {
    const order = ['light', 'dark', 'auto']
    const next = order[(order.indexOf(get()) + 1) % order.length]
    set(next)
    return next
  }

  window.ozTheme = { get, set, cycle, apply }

  // Apply on load (before first paint via inline usage if needed).
  const stored = get()
  if (stored !== 'auto') apply(stored)
})()
