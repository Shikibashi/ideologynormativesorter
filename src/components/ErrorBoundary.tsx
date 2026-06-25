import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    window.location.hash = ''
    window.location.reload()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <section className="screen">
          <h1>Something went wrong</h1>
          <p className="muted">An unexpected error occurred. You can start over to try again.</p>
          <button type="button" className="scale-button" onClick={this.handleReset}>
            Start over
          </button>
        </section>
      )
    }

    return this.props.children
  }
}
