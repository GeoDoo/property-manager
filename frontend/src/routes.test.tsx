import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

// Component that throws an error
const ErrorComponent = () => {
  throw new Error('Test error');
};

// Create a wrapped component with error boundary
const ComponentWithErrorBoundary = ({ title, message }: { title: string, message: string }) => (
  <MemoryRouter>
    <ErrorBoundary
      fallback={
        <div>
          <h3>{title}</h3>
          <p>{message}</p>
        </div>
      }
    >
      <ErrorComponent />
    </ErrorBoundary>
  </MemoryRouter>
);

describe('Error Boundaries in Routes', () => {
  // Mock console.error to suppress error logs during tests
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows property list error UI when there is an error', () => {
    render(
      <ComponentWithErrorBoundary 
        title="Unable to Load Properties"
        message="We couldn't load the property listings. Please try again later."
      />
    );
    
    expect(screen.getByText('Unable to Load Properties')).toBeInTheDocument();
    expect(screen.getByText("We couldn't load the property listings. Please try again later.")).toBeInTheDocument();
  });

  it('shows property form error UI when there is an error', () => {
    render(
      <ComponentWithErrorBoundary 
        title="Form Error"
        message="There was a problem with the property form. Please try again."
      />
    );
    
    expect(screen.getByText('Form Error')).toBeInTheDocument();
    expect(screen.getByText('There was a problem with the property form. Please try again.')).toBeInTheDocument();
  });

  it('shows property details error UI when there is an error', () => {
    render(
      <ComponentWithErrorBoundary 
        title="Property Not Found"
        message="We couldn't load this property's details. It may have been removed or you may not have permission to view it."
      />
    );
    
    expect(screen.getByText('Property Not Found')).toBeInTheDocument();
    expect(screen.getByText("We couldn't load this property's details. It may have been removed or you may not have permission to view it.")).toBeInTheDocument();
  });

  it('shows login error UI when there is an error', () => {
    render(
      <ComponentWithErrorBoundary 
        title="Login Error"
        message="There was a problem with the login process. Please try again."
      />
    );
    
    expect(screen.getByText('Login Error')).toBeInTheDocument();
    expect(screen.getByText('There was a problem with the login process. Please try again.')).toBeInTheDocument();
  });
}); 