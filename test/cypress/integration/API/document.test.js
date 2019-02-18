/// <reference types="Cypress" />
describe('Document APIs Test', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000/#d=/files/webviewer-demo-annotated.xod&a=1&streaming=true');
    cy.window().its('documentLoaded').should('equal', true);
  });

  describe('closeDocument', function() {
    it('should call docViewer.closeDocument', function() {
      let closeDocument;

      cy.window().then(function(win) {
        closeDocument = cy.stub(win.docViewer, 'closeDocument');
      });
      cy.readerControl('closeDocument').should(function() {
        expect(closeDocument).to.be.calledOnce;
      });
    });
  });

  describe('loadDocument', function() {
    // TODO: think about what we should test in this API. 
    // load different types of documents? office, pdf, images, password-protected xod/pdf, non-exist document?
    // we hope to move helpers/loadDocument.js to core one day.
    // If that happens, testing for this function should be in core instead of here.
  });
});