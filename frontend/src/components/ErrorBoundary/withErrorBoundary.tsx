import React from 'react';
import { ComponentType, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Link } from 'react-router-dom';

interface ErrorFallbackProps {
  error: Error | null;
  title?: string;
  message?: string;
  showHome?: boolean;
  showRefresh?: boolean;
  customActions?: ReactNode;
}

const ErrorFallback = ({ 
  error, 
  title = "Oops! Something went wrong",
  message,
  showHome = true,
  showRefresh = true,
  customActions
}: ErrorFallbackProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="text-gray-600 mb-6">
          {message || error?.message || 'An unexpected error occurred'}
        </div>
        <div className="space-y-4">
          {showRefresh && (
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-[#00deb6] text-white px-4 py-2 rounded-xl hover:bg-[#00c5a0] transition-colors"
            >
              Refresh Page
            </button>
          )}
          {showHome && (
            <Link
              to="/"
              className="block w-full bg-white text-gray-700 border-2 border-gray-300 px-4 py-2 rounded-xl hover:border-gray-400 transition-colors"
            >
              Go to Home
            </Link>
          )}
          {customActions}
        </div>
      </div>
    </div>
  </div>
);

interface WithErrorBoundaryOptions {
  title?: string;
  message?: string;
  showHome?: boolean;
  showRefresh?: boolean;
  customActions?: ReactNode;
}

export const withErrorBoundary = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
) => {
  const WithErrorBoundaryComponent = (props: P) => (
    <ErrorBoundary
      fallback={
        <ErrorFallback
          error={null}
          {...options}
        />
      }
    >
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `WithErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithErrorBoundaryComponent;
}; 