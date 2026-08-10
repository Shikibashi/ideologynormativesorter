import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './desktop-layout.css'
import { DesktopShell } from './components/DesktopShell'
import { ErrorBoundary } from './components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <DesktopShell>
        <App />
      </DesktopShell>
    </ErrorBoundary>
  </StrictMode>,
)
