import React from 'react';
import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';

// Mock the Navigation component
jest.mock('./Navigation', () => ({
  Navigation: () => <div data-testid="mock-navigation">Navigation Component</div>
}));

describe('Layout Component', () => {
  it('renders the Navigation component and children content', () => {
    render(<Layout>Test Content</Layout>);
    
    // Check Navigation component is rendered
    expect(screen.getByTestId('mock-navigation')).toBeInTheDocument();
    
    // Check children content is rendered
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  it('has correct layout structure', () => {
    const { container } = render(<Layout>Content</Layout>);
    
    // Get the outer div directly from the container
    const layoutDiv = container.firstChild as HTMLElement;
    expect(layoutDiv).toHaveClass('min-h-screen');
    expect(layoutDiv).toHaveClass('pb-8');
    
    // Check for the inner container that provides max width and padding
    const innerContainer = layoutDiv.firstChild as HTMLElement;
    expect(innerContainer).toHaveClass('max-w-7xl');
    expect(innerContainer).toHaveClass('mx-auto');
    expect(innerContainer).toHaveClass('px-6');
  });
}); 