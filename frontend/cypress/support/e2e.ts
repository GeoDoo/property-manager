// Import commands.js using ES2015 syntax:
import './commands';

// Additional configuration
Cypress.on('uncaught:exception', (err) => {
  // Returning false here prevents Cypress from failing the test on uncaught exceptions
  console.error('Uncaught exception:', err);
  return false;
});

// Set viewport size for all tests
beforeEach(() => {
  // Set viewport size - use a common desktop resolution
  cy.viewport(1280, 800);
});

// Log the current URL to the console for debugging
Cypress.Commands.add('logUrl', () => {
  cy.url().then((url) => {
    cy.log(`Current URL: ${url}`);
  });
});

// Ensure the application has been loaded correctly
Cypress.Commands.add('ensureAppLoaded', () => {
  // Wait for the app container to be visible
  cy.get('#root', { timeout: 10000 }).should('be.visible');
});

// Force a page reload
Cypress.Commands.add('forceReload', () => {
  cy.window().then((win) => {
    win.location.reload();
  });
}); 