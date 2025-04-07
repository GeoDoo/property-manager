// Setup file for integration tests that need authentication
import { AUTH_CONFIG } from '../config/appConfig';

// Function to set up authentication for tests
export const setupAuthentication = (enabled = true) => {
  // Configure authentication
  AUTH_CONFIG.setEnabled(enabled);
  
  // Clear localStorage before each test
  localStorage.clear();
  
  // Mock user data if auth is disabled
  if (!enabled) {
    return {
      mockUser: {
        username: 'testuser',
        isAdmin: true
      }
    };
  }
  
  return {};
};

// Clean up after tests
export const cleanupAuthentication = () => {
  // Reset auth state
  AUTH_CONFIG.setEnabled(true);
  
  // Clear localStorage
  localStorage.clear();
};

// Test utility for authenticated component testing
export const renderWithAuth = (ui: React.ReactElement, options: any = {}) => {
  // This will be implemented when we have the testing library setup
};

// Test utility for checking auth-protected routes
export const checkAuthProtection = async (route: string) => {
  // This will be implemented when we have the testing library setup
}; 