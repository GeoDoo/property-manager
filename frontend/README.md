## Authentication System

The application includes a pluggable authentication system that can be enabled or disabled for development and testing purposes.

### Key Features

- Toggle authentication on/off using environment variables
- Test components with or without authentication
- Wrapper components for protected routes
- Comprehensive test utilities

### Configuration

Authentication can be configured in the `.env` file:

```
# Enable/disable authentication (default is true)
VITE_AUTH_ENABLED=true
```

### Usage in Components

Components that need authentication should use the `AuthenticatedRoute` component:

```tsx
import AuthenticatedRoute from './components/AuthenticatedRoute';

function MyProtectedComponent() {
  return (
    <AuthenticatedRoute>
      <YourComponent />
    </AuthenticatedRoute>
  );
}

// For admin-only routes
function AdminOnlyComponent() {
  return (
    <AuthenticatedRoute adminOnly={true}>
      <AdminComponent />
    </AuthenticatedRoute>
  );
}
```

### Testing

The application includes utilities for testing components with or without authentication:

```tsx
import { renderWithProviders, setupAuth, cleanupAuth } from './test/test-utils';

// Test with auth enabled
test('protected component with auth', () => {
  const { authState } = setupAuth({
    enabled: true,
    isAuthenticated: true
  });
  
  renderWithProviders(<YourComponent />, {
    authState
  });
  
  // Your test assertions
  
  cleanupAuth();
});

// Test with auth disabled
test('component without auth', () => {
  renderWithProviders(<YourComponent />, {
    authEnabled: false
  });
  
  // Your test assertions
});
``` 