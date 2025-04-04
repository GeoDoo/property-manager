import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';
import { BrowserRouter } from 'react-router-dom';
import { ROUTES } from '../../config/routes';

// Mock the react-router-dom hooks
const mockNavigate = jest.fn();
const mockLocation = { pathname: '/' };

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    __esModule: true,
    ...originalModule,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation
  };
});

// Mock the ROUTES constant
jest.mock('../../config/routes', () => ({
  ROUTES: {
    HOME: '/',
    PROPERTIES: {
      NEW: '/properties/new'
    }
  }
}));

describe('Layout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the header with logo', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="child-content">Test content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByText('Property Manager')).toBeInTheDocument();
    expect(screen.getByText('Property Manager').closest('a')).toHaveAttribute('href', '/');
  });

  test('renders children content', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="child-content">Test content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders Add Property button when on home page', () => {
    mockLocation.pathname = ROUTES.HOME;

    render(
      <BrowserRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </BrowserRouter>
    );

    const addPropertyLink = screen.getByText('Add Property');
    expect(addPropertyLink).toBeInTheDocument();
    expect(addPropertyLink).toHaveAttribute('href', '/properties/new');
  });

  test('does not render Add Property button when not on home page', () => {
    // Change the mock location to a non-home route
    mockLocation.pathname = '/properties/123';

    render(
      <BrowserRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </BrowserRouter>
    );

    expect(screen.queryByText('Add Property')).not.toBeInTheDocument();
  });

  test('applies correct styles to layout container', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </BrowserRouter>
    );

    // Check that the main layout container has the expected classes
    const container = screen.getByText('Content').closest('div.min-h-screen');
    expect(container).toHaveClass('min-h-screen');
    expect(container).toHaveClass('pb-8');
  });
}); 