/**
 * @chirag127/atoms — framework-agnostic atomic web components.
 *
 * Vanilla custom elements, zero dependencies. Light DOM (no shadow root), so
 * the components inherit your page CSS and can be styled/overridden like any
 * element. All colors/types/spacing come from the semantic --oz-* tokens set
 * by whichever @chirag127/theme archetype you loaded — swap the theme, the
 * atoms follow.
 *
 *   <link rel="stylesheet" href="@chirag127/theme/editorial.css" />
 *   <link rel="stylesheet" href="@chirag127/atoms/styles.css" />
 *   <script type="module" src="@chirag127/atoms"></script>
 *
 *   <oz-button variant="primary">Read more</oz-button>
 */
;(() => {
  const UPGRADED = Symbol('oz-upgraded')

  /** Upgrade an element to a real anchor when it carries an href. */
  function upgradeToAnchor(el) {
    if (el.hasAttribute('href') && !el[UPGRADED]) {
      const href = el.getAttribute('href')
      const target = el.getAttribute('target')
      const cls = el.className || ''
      const rel = el.getAttribute('rel') || ''
      const label = el.innerHTML
      const a = document.createElement('a')
      a.href = href
      if (target) a.target = target
      if (rel || target === '_blank') a.rel = rel || 'noopener noreferrer'
      a.className = cls
      a.setAttribute('data-oz-kind', el.tagName.toLowerCase())
      // Preserve variant/size/tone attributes for styling.
      for (const name of ['variant', 'size', 'tone']) {
        if (el.hasAttribute(name)) a.setAttribute(name, el.getAttribute(name))
      }
      a.setAttribute('aria-label', el.getAttribute('aria-label') || '')
      a.innerHTML = label
      el[UPGRADED] = true
      el.replaceWith(a)
    }
  }

  class OzButton extends HTMLElement {
    connectedCallback() {
      upgradeToAnchor(this)
      if (this.hasAttribute('href')) return
      if (this.getAttribute('tabindex') === null) this.tabIndex = 0
      if (this.getAttribute('role') === null) this.setAttribute('role', 'button')
      this.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          this.click()
        }
      })
    }
  }

  class OzChip extends HTMLElement {
    connectedCallback() {
      upgradeToAnchor(this)
    }
  }

  class OzCard extends HTMLElement {
    connectedCallback() {
      upgradeToAnchor(this)
    }
  }

  class OzNavLink extends HTMLElement {
    connectedCallback() {
      upgradeToAnchor(this)
    }
  }

  class OzBadge extends HTMLElement {}
  class OzDivider extends HTMLElement {}
  class OzKicker extends HTMLElement {}
  class OzField extends HTMLElement {}
  class OzProse extends HTMLElement {}

  const registry = [
    ['oz-button', OzButton],
    ['oz-chip', OzChip],
    ['oz-card', OzCard],
    ['oz-badge', OzBadge],
    ['oz-nav-link', OzNavLink],
    ['oz-divider', OzDivider],
    ['oz-kicker', OzKicker],
    ['oz-field', OzField],
    ['oz-prose', OzProse],
  ]

  for (const [tag, ctor] of registry) {
    if (!customElements.get(tag)) customElements.define(tag, ctor)
  }

  if (!window.ozAtoms) window.ozAtoms = { version: '0.1.0' }
})()
