import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import { AUTH_CONFIG } from '../config/appConfig';

// User interface
export interface User {
  username: string;
  isAdmin: boolean;
}

// Auth context interface
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  logout: () => {},
  loading: false,
  error: null,
});

// Interface for auth provider props
interface AuthProviderProps {
  children: ReactNode;
  // For testing: force auth state
  forceAuthState?: Partial<AuthContextType>;
  // For testing: disable auth check
  disableAuthCheck?: boolean;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children,
  forceAuthState,
  disableAuthCheck = false
}) => {
  const [user, setUser] = useState<User | null>(forceAuthState?.user ?? null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if authentication is enabled from config
  const authEnabled = AUTH_CONFIG.isEnabled() && !disableAuthCheck;

  // Effect to load current user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (!authEnabled) {
        // If auth is disabled, set a mock user or leave as null
        setLoading(false);
        return;
      }

      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [authEnabled]);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    // If auth is disabled, simulate successful login
    if (!authEnabled) {
      const mockUser = forceAuthState?.user ?? { username, isAdmin: true };
      setUser(mockUser);
      return true;
    }

    setLoading(true);
    setError(null);
    
    try {
      const success = await authService.login({ username, password });
      if (success) {
        const loggedInUser = authService.getCurrentUser();
        setUser(loggedInUser);
        return true;
      } else {
        setError('Invalid credentials');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // If auth is disabled, just clear the user state
    if (!authEnabled) {
      setUser(null);
      return;
    }

    authService.logout();
    setUser(null);
  };

  // Calculate isAdmin and isAuthenticated
  const isAdmin = Boolean(user?.isAdmin);
  const isAuthenticated = Boolean(user);

  // Context value
  const contextValue: AuthContextType = forceAuthState ? {
    user: forceAuthState.user ?? user,
    isAuthenticated: forceAuthState.isAuthenticated ?? isAuthenticated,
    isAdmin: forceAuthState.isAdmin ?? isAdmin,
    login: forceAuthState.login ?? login,
    logout: forceAuthState.logout ?? logout,
    loading: forceAuthState.loading ?? loading,
    error: forceAuthState.error ?? error
  } : {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 