import { useEffect, useLayoutEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface SiteShellProps {
  children: ReactNode
}

type Appearance = 'system' | 'dark' | 'light'
type Theme = Exclude<Appearance, 'system'>
type Density = 'automatic' | 'compact' | 'comfortable'
type ResolvedDensity = Exclude<Density, 'automatic'>

const APPEARANCE_STORAGE_KEY = 'political-judgment-appearance-v1'
const LEGACY_THEME_STORAGE_KEY = 'political-judgment-theme-v1'
const DENSITY_STORAGE_KEY = 'political-judgment-density-v1'

function readAppearance(): Appearance {
  if (typeof window === 'undefined') return 'system'

  try {
    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY)
      ?? window.localStorage.getItem(LEGACY_THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
  } catch {
    return 'system'
  }
}

function systemPrefersDark(): boolean {
  return typeof window === 'undefined' || typeof window.matchMedia !== 'function'
    ? true
    : window.matchMedia('(prefers-color-scheme: dark)').matches
}

function readDensity(): Density {
  if (typeof window === 'undefined') return 'automatic'

  try {
    const stored = window.localStorage.getItem(DENSITY_STORAGE_KEY)
    return stored === 'compact' || stored === 'comfortable' || stored === 'automatic' ? stored : 'automatic'
  } catch {
    return 'automatic'
  }
}

function systemPrefersComfortable(): boolean {
  if (typeof window === 'undefined') return false
  const coarsePointer = typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches
  const noHover = typeof window.matchMedia === 'function'
    && window.matchMedia('(hover: none)').matches
  return coarsePointer || noHover || window.innerWidth < 720
}

export function SiteShell({ children }: SiteShellProps) {
   const [appearance, setAppearance] = useState<Appearance>(() => readAppearance())
   const [systemDark, setSystemDark] = useState(systemPrefersDark)
   const [density, setDensity] = useState<Density>(() => readDensity())
   const [comfortableInput, setComfortableInput] = useState(systemPrefersComfortable)
   const theme: Theme = appearance === 'system' ? (systemDark ? 'dark' : 'light') : appearance
   const resolvedDensity: ResolvedDensity = density === 'automatic'
      ? comfortableInput ? 'comfortable' : 'compact'
      : density

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = () => setSystemDark(media.matches)
    update()
    if (media.addEventListener) {
      media.addEventListener('change', update)
      return () => media.removeEventListener('change', update)
    }
    media.addListener?.(update)
    return () => media.removeListener?.(update)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQueries = typeof window.matchMedia === 'function'
      ? [window.matchMedia('(pointer: coarse)'), window.matchMedia('(hover: none)')]
      : []
    const update = () => setComfortableInput(systemPrefersComfortable())
    update()
    window.addEventListener('resize', update)
    mediaQueries.forEach((media) => {
      if (media.addEventListener) media.addEventListener('change', update)
      else media.addListener?.(update)
    })
    return () => {
      window.removeEventListener('resize', update)
      mediaQueries.forEach((media) => {
        if (media.removeEventListener) media.removeEventListener('change', update)
        else media.removeListener?.(update)
      })
    }
  }, [])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.density = resolvedDensity
  }, [resolvedDensity, theme])

  useEffect(() => {
    try {
      window.localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance)
    } catch {
      // The visual preference still applies when storage is unavailable.
    }
  }, [appearance])

  useEffect(() => {
    try {
      window.localStorage.setItem(DENSITY_STORAGE_KEY, density)
    } catch {
      // The visual preference still applies when storage is unavailable.
    }
  }, [density])

  return (
    <div className="site-shell" data-theme={theme}>
      <header className="site-masthead">
        <div className="site-brand">
          <p className="site-kicker">EDRIFFLES WEB 99 / POLITICAL JUDGMENT LAB</p>
          <a className="site-title" href={import.meta.env.BASE_URL}>Political Judgment Lab</a>
          <p className="site-tagline">A layered profile of values, beliefs, and strategy.</p>
        </div>
        <div className="site-utility">
          <div className="site-meta" aria-label="Application information">
            <span>FORMAT</span>
            <strong>WEB 99</strong>
            <span>SESSION</span>
            <strong>BROWSER</strong>
          </div>
          <nav className="site-actions" aria-label="Site navigation">
            <a className="site-home-link" href={import.meta.env.BASE_URL}>HOME</a>
            <details
              className="display-control"
              onKeyDown={(event) => {
                if (event.key !== 'Escape') return
                event.preventDefault()
                event.currentTarget.removeAttribute('open')
                event.currentTarget.querySelector('summary')?.focus()
              }}
            >
              <summary>DISPLAY</summary>
              <div className="display-popover">
              <fieldset>
                <legend>Appearance</legend>
                <label className="display-option">
                  <input
                    type="radio"
                    name="appearance"
                    value="system"
                    checked={appearance === 'system'}
                    onChange={() => setAppearance('system')}
                  />
                  <span>System</span>
                </label>
                <label className="display-option">
                  <input
                    type="radio"
                    name="appearance"
                    value="light"
                    checked={appearance === 'light'}
                    onChange={() => setAppearance('light')}
                  />
                  <span>Light</span>
                </label>
                <label className="display-option">
                  <input
                    type="radio"
                    name="appearance"
                    value="dark"
                    checked={appearance === 'dark'}
                    onChange={() => setAppearance('dark')}
                  />
                  <span>Dark</span>
                </label>
                {appearance === 'system' && <p className="display-status">currently {theme}</p>}
              </fieldset>

              <fieldset>
                <legend>Density</legend>
                <label className="display-option">
                  <input
                    type="radio"
                    name="density"
                    value="automatic"
                    checked={density === 'automatic'}
                    onChange={() => setDensity('automatic')}
                  />
                  <span>Automatic</span>
                </label>
                <label className="display-option">
                  <input
                    type="radio"
                    name="density"
                    value="compact"
                    checked={density === 'compact'}
                    onChange={() => setDensity('compact')}
                  />
                  <span>Compact</span>
                </label>
                <label className="display-option">
                  <input
                    type="radio"
                    name="density"
                    value="comfortable"
                    checked={density === 'comfortable'}
                    onChange={() => setDensity('comfortable')}
                  />
                  <span>Comfortable</span>
                </label>
                {density === 'automatic' && <p className="display-status">currently {resolvedDensity}</p>}
              </fieldset>

              <button
                type="button"
                className="display-reset"
                onClick={() => {
                  setAppearance('system')
                  setDensity('automatic')
                }}
              >
                Restore display defaults
              </button>
              </div>
            </details>
          </nav>
        </div>
      </header>

      <aside className="app-context" aria-label="Application context">
        <div className="context-item">
          <span className="context-label">MODE</span>
          <strong>Assessment</strong>
        </div>
        <div className="context-item">
          <span className="context-label">STORAGE</span>
          <strong>Browser local</strong>
        </div>
        <div className="context-item">
          <span className="context-label">OUTPUT</span>
          <strong>Three-layer profile</strong>
        </div>
      </aside>

      <main id="app-content" className="app-workspace">{children}</main>

      <footer className="site-footer">
        <span>Political Judgment Decomposition</span>
        <span>No account required · local browser storage</span>
      </footer>
    </div>
  )
}
