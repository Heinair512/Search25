Cypress.Commands.add('login', (email = 'Joerg.Wehrenberg@gc-gruppe.de', password = '12345') => {
  cy.visit('/');
  cy.get('#email').type(email);
  cy.get('#password').type(password);
  cy.get('button').contains('Sign in').click();
  cy.url().should('include', '/dashboard');
});

Cypress.Commands.add('selectBusinessUnit', (bu) => {
  cy.get('.p-dropdown').click();
  cy.get('.p-dropdown-item').contains(bu).click();
});