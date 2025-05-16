describe('Analytics', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should show analytics dashboard', () => {
    cy.contains('Analytics Dashboard');
    cy.get('canvas').should('exist');
  });

  it('should filter by business unit', () => {
    cy.selectBusinessUnit('Search');
    cy.get('.p-datatable').should('exist');
  });

  it('should navigate to detailed views', () => {
    cy.contains('Zero Result Searches').click();
    cy.url().should('include', '/analytics/no-results');
    
    cy.contains('Low Click Searches').click();
    cy.url().should('include', '/analytics/low-clicks');
    
    cy.contains('Top Clicked Searches').click();
    cy.url().should('include', '/analytics/top-clicked');
  });

  it('should export data', () => {
    cy.visit('/dashboard/analytics/no-results');
    cy.get('button[class*="p-button-icon-only"]').click();
    cy.readFile('cypress/downloads/no-result-searches-GC Gruppe.csv').should('exist');
  });
});