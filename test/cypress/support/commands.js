Cypress.Commands.add('readerControl', (APIName, ...arg) => {
  cy.window().its('readerControl').invoke(APIName, ...arg);
});
