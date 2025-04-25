/// <reference types="cypress" />

describe('Property Details Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginAsAdmin(); // Use the more reliable admin login
    cy.visit('/properties');
    
    // Wait for properties to load and find the first property
    cy.get('[data-testid="property-list-container"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="property-card"]', { timeout: 10000 }).should('be.visible').first().click();
    // Wait for property details to load
    cy.get('[data-testid="property-details"]', { timeout: 10000 }).should('be.visible');
  });

  it('should display property details', () => {
    cy.get('[data-testid="property-address"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="property-price"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="property-description"]', { timeout: 10000 }).should('be.visible');
  });

  describe('Admin functionality', () => {
    beforeEach(() => {
      // Login as admin before each admin test
      cy.loginAsAdmin();
      // Navigate to a property detail page
      cy.visit('/properties');
      cy.get('[data-testid="property-card"]', { timeout: 10000 }).should('be.visible').first().click();
      cy.get('[data-testid="property-details"]', { timeout: 10000 }).should('be.visible');
    });

    it('should display edit and delete buttons for admin users', () => {
      // Verify admin controls are visible
      cy.get('[data-testid="edit-property-button"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="delete-property-button"]', { timeout: 10000 }).should('be.visible');
    });

    it('should navigate to edit page when clicking edit button', () => {
      cy.get('[data-testid="edit-property-button"]', { timeout: 10000 }).should('be.visible').click();
      
      // Verify we're on the edit page
      cy.url().should('include', '/properties/edit/');
      
      // Verify edit form is loaded with property data
      cy.get('[data-testid="property-form"]', { timeout: 10000 }).should('be.visible');
      cy.get('[name="address"]', { timeout: 10000 }).should('be.visible').should('not.be.empty');
      cy.get('[name="price"]', { timeout: 10000 }).should('be.visible').should('not.be.empty');
    });

    it('should show delete confirmation when clicking delete button', () => {
      // Click delete button
      cy.get('[data-testid="delete-property-button"]', { timeout: 10000 }).should('be.visible').click();
      
      // Verify confirmation dialog appears
      cy.get('[data-testid="delete-confirmation-dialog"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="confirm-delete-button"]', { timeout: 10000 }).should('be.visible');
      cy.get('[data-testid="cancel-delete-button"]', { timeout: 10000 }).should('be.visible');
      
      // Verify cancel works
      cy.get('[data-testid="cancel-delete-button"]').click();
      cy.get('[data-testid="delete-confirmation-dialog"]').should('not.exist');
      
      // Verify delete works
      cy.get('[data-testid="delete-property-button"]').click();
      cy.get('[data-testid="confirm-delete-button"]').click();
      
      // Should redirect to property listing after delete
      cy.url().should('include', '/properties');
      
      // Should show success message
      cy.get('[data-testid="success-message"]', { timeout: 10000 }).should('be.visible')
        .should('contain', 'Property deleted successfully');
    });
  });
}); 