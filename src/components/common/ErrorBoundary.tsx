import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50 backdrop-blur-sm rounded-lg border border-red-200/50">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-sm text-gray-600 mb-6">
            The application encountered an error while loading this content.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
