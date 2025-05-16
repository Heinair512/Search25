describe('Profile', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should update profile', () => {
    cy.get('.p-menuitem-text').contains('Profile').click();
    cy.get('#name').clear().type('Updated Name');
    cy.get('#password').type('newpassword');
    cy.get('#confirmPassword').type('newpassword');
    cy.get('button').contains('Save').click();
    cy.contains('Your changes have been saved');
  });

  it('should show password mismatch error', () => {
    cy.get('.p-menuitem-text').contains('Profile').click();
    cy.get('#password').type('password1');
    cy.get('#confirmPassword').type('password2');
    cy.contains('Passwords do not match');
  });
});