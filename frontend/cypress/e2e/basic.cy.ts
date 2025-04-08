// Basic test to verify Cypress is set up correctly
describe('Cypress Setup Test', () => {
  it('should verify that Cypress is working', () => {
    // This test passes automatically
    expect(true).to.equal(true);
  });

  it('should be able to visit the site', () => {
    // Visit the base URL defined in cypress.config.ts
    cy.visit('/');
    
    // Check that the page loads
    cy.get('body').should('exist');
  });

  it('should be able to interact with DOM elements', () => {
    // Visit the base URL
    cy.visit('/');
    
    // Find and click on any element
    cy.get('body').click();
  });
}); 