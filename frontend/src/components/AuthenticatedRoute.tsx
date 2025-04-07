import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AUTH_CONFIG } from '../config/appConfig';
import { ROUTES } from '../config/routes';

interface AuthenticatedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

/**
 * A route component that requires authentication
 * Can be bypassed if authentication is disabled in config
 */
const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  
  // Authentication checks are disabled
  if (!AUTH_CONFIG.isEnabled()) {
    return <>{children}</>;
  }

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the current location for redirect after login
    return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
  }

  // Admin access required but user is not admin
  if (adminOnly && !isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // User is authenticated and meets access requirements
  return <>{children}</>;
};

export default AuthenticatedRoute; 