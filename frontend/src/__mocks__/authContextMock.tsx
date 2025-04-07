import React, { ReactNode } from 'react';

interface User {
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: jest.Mock;
  logout: jest.Mock;
  loading: boolean;
}

// Create a mock for the auth context
export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false
});

// Default props for the mock provider
const defaultProps: AuthContextType = {
  user: { username: 'testuser', isAdmin: false },
  isAuthenticated: true,
  isAdmin: false,
  login: jest.fn(),
  logout: jest.fn(),
  loading: false
};

// Mock Auth Provider
export const AuthProvider = ({ children, userProps }: { children: ReactNode, userProps?: Partial<AuthContextType> }) => {
  const authValue = { ...defaultProps, ...userProps };
  
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock hook for using the auth context
export const useAuth = () => React.useContext(AuthContext); 