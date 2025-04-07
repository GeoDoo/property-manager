import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { withErrorBoundary } from './withErrorBoundary';
import { BrowserRouter } from 'react-router-dom';

// Mock console.error to avoid noisy logs during tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

const TestComponent = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>Test Component Content</div>;
};

describe('withErrorBoundary', () => {
  it('renders wrapped component when there is no error', () => {
    const WrappedComponent = withErrorBoundary(TestComponent);
    
    render(<WrappedComponent />);
    
    expect(screen.getByText('Test Component Content')).toBeInTheDocument();
  });

  it('renders error UI with custom title and message', () => {
    const WrappedComponent = withErrorBoundary(TestComponent, {
      title: 'Custom Error Title',
      message: 'Custom error message'
    });
    
    render(
      <BrowserRouter>
        <WrappedComponent shouldThrow={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('shows/hides home button based on showHome prop', () => {
    const WrappedComponent = withErrorBoundary(TestComponent, {
      showHome: false
    });
    
    render(
      <BrowserRouter>
        <WrappedComponent shouldThrow={true} />
      </BrowserRouter>
    );
    
    expect(screen.queryByText('Go to Home')).not.toBeInTheDocument();
  });

  it('shows/hides refresh button based on showRefresh prop', () => {
    const WrappedComponent = withErrorBoundary(TestComponent, {
      showRefresh: false
    });
    
    render(
      <BrowserRouter>
        <WrappedComponent shouldThrow={true} />
      </BrowserRouter>
    );
    
    expect(screen.queryByText('Refresh Page')).not.toBeInTheDocument();
  });

  it('renders custom actions when provided', () => {
    const customAction = <button>Custom Action</button>;
    const WrappedComponent = withErrorBoundary(TestComponent, {
      customActions: customAction
    });
    
    render(
      <BrowserRouter>
        <WrappedComponent shouldThrow={true} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('sets correct display name', () => {
    const WrappedComponent = withErrorBoundary(TestComponent);
    expect(WrappedComponent.displayName).toBe('WithErrorBoundary(TestComponent)');
  });
}); 