import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: '2rem',
            color: '#f87171',
            fontFamily: 'monospace',
            background: '#0a0815',
            minHeight: '100vh',
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>💥 Runtime Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', opacity: 0.8 }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
