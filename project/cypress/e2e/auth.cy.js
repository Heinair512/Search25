describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should show login page', () => {
    cy.contains('Welcome to Search25!');
    cy.contains('Please sign in');
  });

  it('should show validation errors', () => {
    cy.get('button').contains('Sign in').click();
    cy.contains('Email is required');
    cy.contains('Password is required');
  });

  it('should login successfully', () => {
    cy.login();
    cy.url().should('include', '/dashboard');
  });

  it('should redirect to login when not authenticated', () => {
    cy.visit('/dashboard');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});