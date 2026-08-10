import type { ReactNode } from 'react'

interface DesktopShellProps {
  children: ReactNode
  status?: string
}

export function DesktopShell({ children, status = 'Ready' }: DesktopShellProps) {
  return (
    <div className="desktop-shell">
      <header className="app-titlebar">
        <div className="app-titlebar-title">
          <span className="app-icon" aria-hidden="true">PJ</span>
          <span>Political Judgment Decomposition</span>
        </div>
        <div className="window-controls" aria-hidden="true">
          <span>_</span>
          <span>□</span>
          <span>×</span>
        </div>
      </header>
      <nav className="app-menubar" aria-label="Application sections">
        <span><u>F</u>ile</span>
        <span><u>T</u>est</span>
        <span><u>R</u>esults</span>
        <span><u>V</u>iew</span>
        <span><u>H</u>elp</span>
      </nav>
      <main className="app-workspace">{children}</main>
      <footer className="app-statusbar">
        <span className="status-panel">{status}</span>
        <span className="status-panel status-panel-secondary">Local-first · progress saved in this browser</span>
      </footer>
    </div>
  )
}
