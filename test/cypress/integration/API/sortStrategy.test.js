/// <reference types="Cypress" />
describe('SortStrategy APIs Test', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000/#d=/files/webviewer-demo-annotated.xod&a=1&streaming=true');
    cy.window().its('documentLoaded').should('equal', true);
  });

  describe('addSortStrategy', function () {
    it('should add sortStrategy and set current notes panel sort strategy to it', function () {
      const strategy = {
        name: 'annotationType',
        getSortedNotes: notes => {
          return notes.sort((a, b) => {
            if (a.Subject < b.Subject) {
              return -1;
            }
            if (a.Subject > b.Subject) {
              return 1;
            }
            if (a.Subject === b.Subject) {
              return 0;
            }
          });
        },
        shouldRenderSeparator: (prevNote, currNote) => prevNote.Subject !== currNote.Subject,
        getSeparatorContent: (prevNote, currNote) => `${currNote.Subject}`
      };

      cy.readerControl('addSortStrategy', strategy);
      cy.get('.HeaderItems').children('[data-element="leftPanelButton"]').click();
      cy.get('.LeftPanel').find('.Dropdown').find('.display-item').should('have.text', 'annotationType');
      cy.pause();
    });
  });
});