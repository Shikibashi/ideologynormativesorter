import type { ReactNode } from 'react'

interface SiteShellProps {
  children: ReactNode
}

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-shell">
      <header className="site-masthead">
        <div className="site-brand">
          <p className="site-kicker">EDRIFFLES WEB 99 / POLITICAL JUDGMENT LAB</p>
          <p className="site-title">Political Judgment Decomposition</p>
          <p className="site-tagline">A layered profile of values, beliefs, and strategy.</p>
        </div>
        <div className="site-meta" aria-label="Application information">
          <span>FORMAT</span>
          <strong>WEB 99</strong>
          <span>SESSION</span>
          <strong>BROWSER</strong>
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
