/// <reference types="Cypress" />
describe('Element APIs Test', function () {
  beforeEach(function () {
    cy.visit('http://localhost:3000/#d=/files/webviewer-demo-annotated.xod&a=1&streaming=true');
    cy.window().its('documentLoaded').should('equal', true);
  });

  describe('openElement', function() {
    it('should open an element', function() {
      cy.readerControl('openElement', 'leftPanel');
      cy.get('.LeftPanel').should('be.visible');
    });
  });

  describe('openElements', function() {
    it('should open an element if argument is typeof string', function() {
      cy.readerControl('openElements', 'leftPanel');
      cy.get('.LeftPanel').should('be.visible');
    });
    
    it('should open elements if argument is typeof array', function() {
      cy.readerControl('openElements', ['leftPanel', 'menuOverlay']);
      cy.get('.LeftPanel').should('be.visible');
      cy.get('.MenuOverlay').should('be.visible');
    });
  });

  describe('closeElement', function() {
    it('should close an element', function() {
      cy.readerControl('openElement', 'leftPanel');
      cy.readerControl('closeElement', 'leftPanel');
      cy.get('.LeftPanel').should('not.be.visible');
    });
  });

  describe('closeElements', function() {
    const elements = ['leftPanel', 'menuOverlay'];

    beforeEach(function() {
      cy.readerControl('openElements',elements);
    });

    it('should close an element if argument is typeof string', function() {
      cy.readerControl('closeElements', 'leftPanel');
      cy.get('.LeftPanel').should('not.be.visible');
    });

    it('should close elements if argument is typeof array', function() {
      cy.readerControl('closeElements', elements);
      cy.get('.LeftPanel').should('not.be.visible');
      cy.get('.MenuOverlay').should('not.be.visible');
    });
  });

  describe('disableElement', function() {
    it('should disable an element', function() {
      cy.readerControl('disableElement', 'leftPanelButton');
      cy.get('.HeaderItems').find('[data-element="leftPanelButton"]').should('not.exist');
    });
  });

  describe('disableElements', function() {
    it('should disable an element if argument is typeof string', function() {
      cy.readerControl('disableElements', 'leftPanelButton');
      cy.get('.HeaderItems').find('[data-element="leftPanelButton"]').should('not.exist');
    });

    it('should disable elements if argument is typeof array', function() {
      cy.readerControl('disableElements', ['leftPanelButton', 'zoomInButton']);
      cy.get('.HeaderItems').find('[data-element="leftPanelButton"]').should('not.exist');
      cy.get('.HeaderItems').find('[data-element="zoomInButton"]').should('not.exist');
    });
  });

  describe('enableElement', function() {
    it('should enable an element', function() {
      cy.readerControl('disableElement', 'leftPanelButton');
      cy.readerControl('enableElement', 'leftPanelButton');
      cy.get('.HeaderItems').find('[data-element="leftPanelButton"]').should('exist');
    });
  });

  describe('enableElements', function() {
    const elements = ['leftPanelButton', 'zoomInButton'];

    beforeEach(function() {
      cy.readerControl('disableElements',elements);
    });

    it('should enable an element if argument is typeof string', function() {
      cy.readerControl('enableElements', 'leftPanelButton');
      cy.get('.HeaderItems').find('[data-element="leftPanelButton"]').should('exist');
    });

    it('should enable elements if argument is typeof array', function() {
      cy.readerControl('enableElements', elements);
      cy.get('.HeaderItems').find('[data-element="leftPanelButton"]').should('exist');
      cy.get('.HeaderItems').find('[data-element="zoomInButton"]').should('exist');
    });
  });

  describe('isElementDisabled', function() {
    it('should return if an element is disabled', function() {
      cy.readerControl('isElementDisabled', 'leftPanelButton').should('be.false');
      cy.readerControl('disableElement', 'leftPanelButton');
      cy.readerControl('isElementDisabled', 'leftPanelButton').should('be.true');
    });
  });

  describe('isElementOpen', function() {
    it('should return if an element is open', function() {
      cy.readerControl('isElementOpen', 'leftPanel').should('be.false');
      cy.readerControl('openElement', 'leftPanel');
      cy.readerControl('isElementOpen', 'leftPanel').should('be.true');
    });
  });

  describe('toggleElement', function() {
    it.only('should toggle an element', function() {
      cy.readerControl('isElementOpen', 'leftPanel').should('be.false');
      cy.readerControl('toggleElement', 'leftPanel');
      cy.readerControl('isElementOpen', 'leftPanel').should('be.true');
      cy.readerControl('toggleElement', 'leftPanel');
      cy.readerControl('isElementOpen', 'leftPanel').should('be.false');
    });
  });
});