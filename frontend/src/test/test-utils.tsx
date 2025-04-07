import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, AuthContextType } from '../context/AuthContext';
import { AUTH_CONFIG } from '../config/appConfig';

// Default test user
const testUser = {
  username: 'testuser',
  isAdmin: false
};

// Create a fresh query client for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0
    },
  },
});

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  route?: string;
  routes?: ReactElement;
  authEnabled?: boolean;
  authState?: Partial<AuthContextType>;
  disableAuthCheck?: boolean;
}

/**
 * Render a component with all providers and optional authentication
 * 
 * @param ui - Component to render
 * @param options - Configuration options
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    route = '/',
    routes,
    authEnabled = true,
    authState,
    disableAuthCheck = false,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  // Set up authentication
  AUTH_CONFIG.setEnabled(authEnabled);
  
  // Create query client
  const queryClient = createTestQueryClient();
  
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider
            disableAuthCheck={disableAuthCheck}
            forceAuthState={authState}
          >
            {routes || children}
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  }
  
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Set up authentication for tests
 */
export function setupAuth(options: {
  enabled?: boolean;
  user?: typeof testUser;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
} = {}) {
  const {
    enabled = true,
    user = testUser,
    isAuthenticated = true,
    isAdmin = false
  } = options;
  
  // Configure auth
  AUTH_CONFIG.setEnabled(enabled);
  
  // Clear any previous state
  localStorage.clear();
  
  // Set up auth context state
  const authState: Partial<AuthContextType> = {
    user: isAuthenticated ? user : null,
    isAuthenticated,
    isAdmin
  };
  
  return { authState };
}

/**
 * Clean up after tests
 */
export function cleanupAuth() {
  // Reset auth config
  AUTH_CONFIG.setEnabled(true);
  
  // Clear storage
  localStorage.clear();
} 