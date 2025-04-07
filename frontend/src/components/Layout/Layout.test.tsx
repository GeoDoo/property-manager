import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';
import { BrowserRouter } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { AuthProvider } from '../../context/AuthContext';

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

// Mock the auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    isAdmin: true,
    user: { username: 'admin', isAdmin: true },
    logout: jest.fn()
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.pathname = '/';
  });

  test('renders the header with logo', () => {
    renderWithProviders(
      <Layout>
        <div data-testid="child-content">Test content</div>
      </Layout>
    );

    expect(screen.getByText('Property Manager')).toBeInTheDocument();
    expect(screen.getByText('Property Manager').closest('a')).toHaveAttribute('href', '/');
  });

  test('renders children content', () => {
    renderWithProviders(
      <Layout>
        <div data-testid="child-content">Test content</div>
      </Layout>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('renders Add Property button when on home page and user is admin', () => {
    mockLocation.pathname = ROUTES.HOME;

    renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const addPropertyLink = screen.getByText('Add Property');
    expect(addPropertyLink).toBeInTheDocument();
    expect(addPropertyLink).toHaveAttribute('href', '/properties/new');
  });

  test('does not render Add Property button when not on home page', () => {
    mockLocation.pathname = '/properties/123';

    renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.queryByText('Add Property')).not.toBeInTheDocument();
  });

  test('does not render Add Property button when user is not admin', () => {
    // Override the auth mock for this test
    jest.spyOn(require('../../context/AuthContext'), 'useAuth').mockImplementation(() => ({
      isAdmin: false,
      user: { username: 'user', isAdmin: false },
      logout: jest.fn()
    }));

    mockLocation.pathname = ROUTES.HOME;

    renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.queryByText('Add Property')).not.toBeInTheDocument();
  });

  test('applies correct styles to layout container', () => {
    renderWithProviders(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const container = screen.getByText('Content').closest('.min-h-screen');
    expect(container).toHaveClass('min-h-screen');
    expect(container).toHaveClass('pb-8');
  });
}); 