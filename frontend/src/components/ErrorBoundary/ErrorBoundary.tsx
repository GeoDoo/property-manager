import React from 'react';
import { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
              <div className="text-gray-600 mb-6">
                {this.state.error?.message || 'An unexpected error occurred'}
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-[#00deb6] text-white px-4 py-2 rounded-xl hover:bg-[#00c5a0] transition-colors"
                >
                  Refresh Page
                </button>
                <Link
                  to="/"
                  className="block w-full bg-white text-gray-700 border-2 border-gray-300 px-4 py-2 rounded-xl hover:border-gray-400 transition-colors"
                >
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
} 