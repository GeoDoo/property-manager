// Mock for Vite environment variables in Jest tests
const env = {
  VITE_API_URL: 'http://localhost:8081/api',
  VITE_AUTH_ENABLED: 'true' // Default to enabled, tests can override
};

// Set up global variables for tests
if (typeof global !== 'undefined') {
  global.env = env;
}

// Handle import.meta.env for Jest
if (typeof globalThis !== 'undefined') {
  if (!globalThis.import) {
    globalThis.import = {};
  }
  if (!globalThis.import.meta) {
    globalThis.import.meta = {};
  }
  globalThis.import.meta.env = env;
}

export default env; 