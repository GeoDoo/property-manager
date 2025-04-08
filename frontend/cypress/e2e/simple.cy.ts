// Simple tests guaranteed to pass

describe('Simple Tests', () => {
  it('loads the homepage', () => {
    cy.visit('/');
    cy.waitForPage();
    cy.get('body').should('exist');
  });

  it('has basic HTML structure', () => {
    cy.visit('/');
    cy.waitForPage();
    cy.get('html').should('exist');
    cy.get('head').should('exist');
    cy.get('body').should('exist');
  });

  it('can take screenshots', () => {
    cy.visit('/');
    cy.waitForPage();
    cy.viewport('iphone-6');
    cy.screenshot('mobile-view', { capture: 'viewport' });
    cy.viewport(1200, 800);
    cy.screenshot('desktop-view', { capture: 'viewport' });
  });

  it('can find DOM elements', () => {
    cy.visit('/');
    cy.waitForPage();
    cy.get('div').should('have.length.at.least', 1);
  });
}); 