/// <reference types="Cypress" />
import { getMinZoomLevel, getMaxZoomLevel } from 'constants/zoomFactors';

describe('Zoom APIs Test', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3000/#d=/files/webviewer-demo-annotated.xod&a=1&streaming=true');
    cy.window().its('documentLoaded').should('equal', true);
  });

  describe('setZoomLevel and getZoomLevel', function() {
    it('should be able to set the zoom level with a number', function() {
      const newZoomLevel = 2.0;

      cy.readerControl('getZoomLevel').should('not.equal', newZoomLevel);
      cy.readerControl('setZoomLevel', newZoomLevel);
      cy.readerControl('getZoomLevel').should('equal', newZoomLevel);
    });


    it('should be able to set the zoom level with a string', function() {
      const newZoomLevel = '130%';

      cy.readerControl('setZoomLevel', newZoomLevel);
      cy.readerControl('getZoomLevel').should('equal', 1.3);
    });

    it('should be able to set the zoom level with a string, but the string does not end with a %', function() {
      const newZoomLevel = '130';
      
      cy.readerControl('setZoomLevel', newZoomLevel);
      cy.readerControl('getZoomLevel').should('equal', 1.3);
    });
  });

  describe('setMaxZoomLevel', function() {
    it('should be able to set max zoom level correctly', function() {
      const maxZoomLevel = getMaxZoomLevel();
      cy.readerControl('setZoomLevel', maxZoomLevel);
      cy.get('.HeaderItems').children('[data-element="zoomInButton"]').as('zoomInButton').click();
      cy.readerControl('getZoomLevel').should('equal', maxZoomLevel);


      const newMaxZoomLevel = maxZoomLevel + 10;
      cy.readerControl('setMaxZoomLevel', newMaxZoomLevel);
      cy.get('@zoomInButton').click();
      cy.readerControl('getZoomLevel').should('greaterThan', maxZoomLevel);
    });
  });

  describe('setMinZoomLevel', function() {
    it('should be able to set min zoom level correctly', function() {
      const minZoomLevel = getMinZoomLevel();
      cy.readerControl('setZoomLevel', minZoomLevel);
      cy.get('.HeaderItems').children('[data-element="zoomOutButton"]').as('zoomOutButton').click();
      cy.readerControl('getZoomLevel').should('equal', minZoomLevel);


      const newMinZoomLevel = minZoomLevel - 0.02;
      cy.readerControl('setMinZoomLevel', newMinZoomLevel);
      cy.get('@zoomOutButton').click();
      cy.readerControl('getZoomLevel').should('lessThan', minZoomLevel);
    });
  });
});