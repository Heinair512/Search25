describe('Curation', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should create new curation', () => {
    cy.contains('New Curation').click();
    cy.get('input[placeholder*="Search"]').type('hammer');
    cy.get('button').contains('Search').click();
    cy.get('.pi-star').first().click();
    cy.contains('Article has been pinned');
  });

  it('should pin KBNs', () => {
    cy.contains('Pin KBNs').click();
    cy.get('#search-term').type('test-kbns');
    cy.get('#kbn-list').type('123456\n789012');
    cy.get('button').contains('Save').click();
    cy.contains('KBNs have been saved');
  });

  it('should manage curations', () => {
    cy.contains('Manage Curations').click();
    cy.get('.p-inputtext').type('hammer');
    cy.get('.p-datatable-tbody tr').should('have.length.at.least', 1);
    cy.get('.pi-trash').first().click();
    cy.get('button').contains('Delete Curation').click();
    cy.contains('Curation has been deleted');
  });
});