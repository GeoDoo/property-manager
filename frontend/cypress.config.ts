import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  
  // Set a reasonable viewport size by default
  viewportWidth: 1280,
  viewportHeight: 800,
  
  // Configure retry behavior
  retries: {
    runMode: 2,
    openMode: 0,
  },
  
  // Configure video settings
  video: true,
  videoCompression: 32,
  
  // Define default environment variables
  env: {
    apiUrl: 'http://localhost:8081/api',
  },
}); 