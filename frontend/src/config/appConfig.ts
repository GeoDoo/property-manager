// App-wide configuration

// Authentication configuration
export const AUTH_CONFIG = {
  // Whether authentication is enabled (default to true)
  enabled: true,
  
  // Function to check if authentication is enabled
  isEnabled: () => AUTH_CONFIG.enabled,
  
  // Toggle authentication (mainly for testing)
  setEnabled: (value: boolean) => {
    AUTH_CONFIG.enabled = value;
  }
};

// Export all app configurations
export default {
  auth: AUTH_CONFIG
}; 