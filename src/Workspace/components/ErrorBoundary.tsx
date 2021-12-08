import React from 'react'

interface ErrorBoundaryProps {
  message?: React.ReactNode;
  description?: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  {
    error?: Error | null;
    info: {
      componentStack?: string;
    };
  }
> {
  state = {
    error: undefined,
    info: {
      componentStack: '',
    },
  }

  componentDidCatch(error: Error | null, info: object) {
    this.setState({
      error,
      info,
    })
  }

  render() {
    const {
      message, description, children,
    } = this.props
    const { error, info } = this.state
    const componentStack = info && info.componentStack ? info.componentStack : null
    const errorMessage = typeof message === 'undefined' ? (error || '').toString() : message
    const errorDescription = typeof description === 'undefined' ? componentStack : description
    if (error) {
      return (
        <div>
          {errorMessage}
          <pre>{errorDescription}</pre>
        </div>
      )
    }
    return children
  }
}