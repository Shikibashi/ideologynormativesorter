import { useLayoutEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface SiteShellProps {
  children: ReactNode
}

type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'political-judgment-theme-v1'

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'dark'
  } catch {
    return 'dark'
  }
}

export function SiteShell({ children }: SiteShellProps) {
  const [theme, setTheme] = useState<Theme>(() => readTheme())

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // The visual preference still applies when storage is unavailable.
    }
  }, [theme])

  const lightMode = theme === 'light'

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
          <button
            type="button"
            className="theme-toggle"
            aria-pressed={lightMode}
            aria-label={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
            onClick={() => setTheme(lightMode ? 'dark' : 'light')}
          >
            <span aria-hidden="true">{lightMode ? '☾' : '☀'}</span>
            {lightMode ? 'Dark mode' : 'Light mode'}
          </button>
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
