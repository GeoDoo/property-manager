import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorBoundary } from './ErrorBoundary';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// Mock console.error to avoid noisy logs during tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

const ThrowError = ({ message }: { message: string }) => {
  throw new Error(message);
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    renderWithRouter(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders default error UI when child throws', () => {
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
    expect(screen.getByText('Go to Home')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const CustomFallback = () => <div>Custom Error UI</div>;
    
    renderWithRouter(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
  });

  it('calls componentDidCatch when error occurs', () => {
    const spy = jest.spyOn(console, 'error');
    
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError message="Test error" />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalled();
  });
}); 