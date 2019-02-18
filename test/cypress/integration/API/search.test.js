/// <reference types="Cypress" />
describe('Search APIs Test', function() {
  const textToSearch = 'Web';

  beforeEach(function() {
    cy.visit('http://localhost:3000/#d=/files/webviewer-demo-annotated.xod&a=1&streaming=true');
    cy.window().its('documentLoaded').should('equal', true);
  });

  describe('addSearchListener', function() {
    it('should add a search listener correctly', function() {
      const listener = cy.stub();

      cy.readerControl('addSearchListener', listener);
      cy.readerControl('searchText', textToSearch);
      cy.wrap(listener).should(function(listener) {
        expect(listener).to.be.calledOnce;
      });
    });
  });

  describe('removeSearchListener', function() {
    it('should remove the search listener correctly', function() {
      const listener = cy.stub();

      cy.readerControl('addSearchListener', listener);
      cy.readerControl('removeSearchListener', listener);
      cy.readerControl('searchText', textToSearch);
      cy.wrap(listener).should(function(listener) {
        expect(listener).to.have.callCount(0);
      });
    });
  });

  describe('searchText', function() {
    it('should search text correctly', function() {
      cy.readerControl('searchText', textToSearch);
      cy.get('.HeaderItems').children('[data-element="searchButton"]').should('have.class', 'active');
      cy.get('.SearchOverlay').should(function($searchOverlay) {
        expect($searchOverlay).to.be.visible;
        expect($searchOverlay.find('input')).to.have.value(textToSearch);
      });
    });
  });

  describe('searchTextFull', function() {
    it('should search all the pages for matching text', function() {
      cy.readerControl('searchTextFull', textToSearch);
      cy.get('.HeaderItems').children('[data-element="searchButton"]').should('have.class', 'active');
      cy.get('.SearchOverlay').should(function($searchOverlay) {
        expect($searchOverlay).to.be.visible;
        expect($searchOverlay.find('input')).to.have.value(textToSearch);
      });
      cy.get('.SearchPanel').as('searchPanel').should('be.visible');
      cy.pause();
    });

    it('should be able to search with options', function() {
      const options = {
        caseSensitive: true,
        wholeWord: true,
      };

      cy.readerControl('searchTextFull', textToSearch, options);
      cy.get('.SearchOverlay').should(function($searchOverlay) {
        expect($searchOverlay.find('#case-sensitive-option')).to.be.checked;
        expect($searchOverlay.find('#whole-word-option')).to.be.checked;
      });
      cy.pause();
    });
  });
});