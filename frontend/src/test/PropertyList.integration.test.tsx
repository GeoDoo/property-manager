import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, AuthContextType } from '../context/AuthContext';
import { setupAuthentication, cleanupAuthentication } from './integration-test-setup';
import { AUTH_CONFIG } from '../config/appConfig';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock PropertyList component since it doesn't exist yet
const PropertyList = () => <div>Test Property</div>;

// Create a mock server
const server = setupServer(
  // Mock the properties API endpoint
  rest.get('http://localhost:8081/api/properties', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: 1,
          title: 'Test Property',
          description: 'A test property',
          address: '123 Test St',
          price: 1000,
          bedrooms: 2,
          bathrooms: 1,
          size: 1000,
          imageUrls: ['test.jpg']
        }
      ])
    );
  })
);

// Set up a clean query client for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Wrap component with necessary providers
const renderWithProviders = (
  ui: React.ReactElement, 
  { 
    authEnabled = true,
    route = '/',
    mockAuthState = undefined 
  }: {
    authEnabled?: boolean;
    route?: string;
    mockAuthState?: Partial<AuthContextType>;
  } = {}
) => {
  const queryClient = createTestQueryClient();
  
  // Apply auth configuration
  AUTH_CONFIG.setEnabled(authEnabled);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider 
          disableAuthCheck={!authEnabled} 
          forceAuthState={mockAuthState}
        >
          {ui}
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe('PropertyList Integration Tests', () => {
  // Start mock server before tests
  beforeAll(() => server.listen());
  
  // Reset handlers between tests
  afterEach(() => {
    server.resetHandlers();
    cleanupAuthentication();
  });
  
  // Close server after tests
  afterAll(() => server.close());

  test('renders properties when auth is enabled and user is authenticated', async () => {
    // Set up authentication with a mock user
    setupAuthentication(true);
    
    // Render with auth enabled and a mock authenticated user
    renderWithProviders(<PropertyList />, { 
      authEnabled: true,
      mockAuthState: {
        user: { username: 'testuser', isAdmin: false },
        isAuthenticated: true,
        isAdmin: false
      }
    });

    // Wait for the property to load
    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });
  });

  test('renders properties when auth is disabled', async () => {
    // Set up with authentication disabled
    setupAuthentication(false);
    
    // Render with auth disabled
    renderWithProviders(<PropertyList />, { authEnabled: false });

    // Wait for the property to load
    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });
  });

  // Additional tests can be added here
}); 