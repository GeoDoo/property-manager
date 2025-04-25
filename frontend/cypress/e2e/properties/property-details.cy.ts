/// <reference types="cypress" />

describe('Property Details Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.loginAsAdmin(); // Use the more reliable admin login
    cy.visit('/properties');
    cy.document().should('have.property', 'readyState', 'complete');
    
    // Wait for properties to load and find the first property
    cy.get('[data-testid="property-list-container"]').should('exist');
    cy.get('[data-testid="property-card"]').should('exist').first().click();
    cy.document().should('have.property', 'readyState', 'complete');
  });

  it('should display property details', () => {
    cy.get('[data-testid="property-details"]').should('exist');
    cy.get('[data-testid="property-address"]').should('be.visible');
    cy.get('[data-testid="property-price"]').should('be.visible');
    cy.get('[data-testid="property-description"]').should('be.visible');
  });

  describe('Admin functionality', () => {
    beforeEach(() => {
      // Login as admin before each admin test
      cy.loginAsAdmin();
      // Navigate to a property detail page
      cy.visit('/properties');
      cy.get('[data-testid="property-card"]').first().click();
    });

    it('should display edit and delete buttons for admin users', () => {
      // Verify admin controls are visible
      cy.get('[data-testid="edit-property-button"]').should('be.visible');
      cy.get('[data-testid="delete-property-button"]').should('be.visible');
    });

    it('should navigate to edit page when clicking edit button', () => {
      cy.get('[data-testid="edit-property-button"]').click();
      
      // Verify we're on the edit page
      cy.url().should('include', '/properties/edit/');
      
      // Verify edit form is loaded with property data
      cy.get('[data-testid="property-form"]').should('exist');
      cy.get('[name="address"]').should('not.be.empty');
      cy.get('[name="price"]').should('not.be.empty');
    });

    it('should show delete confirmation when clicking delete button', () => {
      // Click delete button
      cy.get('[data-testid="delete-property-button"]').click();
      
      // Verify confirmation dialog appears
      cy.get('[data-testid="delete-confirmation-dialog"]').should('be.visible');
      cy.get('[data-testid="confirm-delete-button"]').should('be.visible');
      cy.get('[data-testid="cancel-delete-button"]').should('be.visible');
      
      // Verify cancel works
      cy.get('[data-testid="cancel-delete-button"]').click();
      cy.get('[data-testid="delete-confirmation-dialog"]').should('not.exist');
      
      // Verify delete works
      cy.get('[data-testid="delete-property-button"]').click();
      cy.get('[data-testid="confirm-delete-button"]').click();
      
      // Should redirect to property listing after delete
      cy.url().should('include', '/properties');
      
      // Should show success message
      cy.get('[data-testid="success-message"]').should('contain', 'Property deleted successfully');
    });
  });
}); 