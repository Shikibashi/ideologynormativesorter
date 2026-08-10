import { useEffect, useLayoutEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface SiteShellProps {
  children: ReactNode
}

type Appearance = 'system' | 'dark' | 'light'
type Theme = Exclude<Appearance, 'system'>

const APPEARANCE_STORAGE_KEY = 'political-judgment-appearance-v1'
const LEGACY_THEME_STORAGE_KEY = 'political-judgment-theme-v1'

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

export function SiteShell({ children }: SiteShellProps) {
  const [appearance, setAppearance] = useState<Appearance>(() => readAppearance())
  const [systemDark, setSystemDark] = useState(systemPrefersDark)
  const theme: Theme = appearance === 'system' ? (systemDark ? 'dark' : 'light') : appearance

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

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    try {
      window.localStorage.setItem(APPEARANCE_STORAGE_KEY, appearance)
    } catch {
      // The visual preference still applies when storage is unavailable.
    }
  }, [appearance])

  return (
    <div className="site-shell" data-theme={theme}>
      <header className="site-masthead">
        <div className="site-brand">
          <p className="site-kicker">EDRIFFLES WEB 99 / POLITICAL JUDGMENT LAB</p>
          <p className="site-title">Political Judgment Decomposition</p>
          <p className="site-tagline">A layered profile of values, beliefs, and strategy.</p>
        </div>
        <div className="site-utility">
          <div className="site-meta" aria-label="Application information">
            <span>FORMAT</span>
            <strong>WEB 99</strong>
            <span>SESSION</span>
            <strong>BROWSER</strong>
          </div>
          <label className="appearance-control">
            <span>Appearance</span>
            <select
              aria-label="Appearance"
              value={appearance}
              onChange={(event) => {
                const value = event.target.value
                if (value === 'system' || value === 'light' || value === 'dark') setAppearance(value)
              }}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
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
