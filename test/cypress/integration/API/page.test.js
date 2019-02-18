/// <reference types="Cypress" />

const mapFileNameTotalPages = {
  'webviewer-demo-annotated.xod': 3
};

describe('Page APIs Test', function() {
  const fileName = 'webviewer-demo-annotated.xod';
  const totalPages = mapFileNameTotalPages[fileName];

  beforeEach(function() {
    cy.visit(`http://localhost:3000/#d=/files/${fileName}&a=1&streaming=true`);
    cy.window().its('documentLoaded').should('equal', true);
  });

  describe('getPageCount', function() {
    it(`should get total pages for ${fileName}`, function() {
      cy.readerControl('getPageCount').should('equal', totalPages);
    });
  });

  describe('getCurrentPageNumber', function() {
    it('should get current page number', function() {
      cy.readerControl('getCurrentPageNumber').should('equal', 1);
    });
  });

  describe('setCurrentPageNumber', function() {
    it('should be able to set the current page number', function() {
      cy.readerControl('setCurrentPageNumber', 2);
      cy.readerControl('getCurrentPageNumber').should('equal', 2);
    });

    it('should not be able to set invalid page numbers', function() {
      cy.readerControl('setCurrentPageNumber', 0);
      cy.readerControl('getCurrentPageNumber').should('equal', 1);

      cy.readerControl('setCurrentPageNumber', 999);
      cy.readerControl('getCurrentPageNumber').should('equal', 1);
    });
  });

  describe('goToFirstPage', function() {
    it('should go to first page', function() {
      cy.readerControl('setCurrentPageNumber', 2);
      cy.readerControl('goToFirstPage');
      cy.readerControl('getCurrentPageNumber').should('equal', 1);
    });
  });

  describe('goToLastPage', function() {
    it('should go to last page', function() {
      cy.readerControl('goToLastPage');
      cy.readerControl('getCurrentPageNumber').should('equal', totalPages);
    });
  });

  describe('goToPrevPage', function() {
    it('should not go to previous page if current page number is 1', function() {
      cy.readerControl('goToPrevPage');
      cy.readerControl('getCurrentPageNumber').should('equal', 1);
    });

    it('should go to previous page if current page number is not 1', function() {
      cy.readerControl('setCurrentPageNumber', 2);
      cy.readerControl('goToPrevPage');
      cy.readerControl('getCurrentPageNumber').should('equal', 1);
    });
  });
  
  describe('goToNextPage', function() {
    it('should not go to next page if current page number is the last page', function() {
      cy.readerControl('goToLastPage');
      cy.readerControl('goToNextPage');
      cy.readerControl('getCurrentPageNumber').should('equal', totalPages);
    });

    it('should go to next page if current page number is not the last page', function() {
      cy.readerControl('goToNextPage');
      cy.readerControl('getCurrentPageNumber').should('equal', 2);
    });
  });
});