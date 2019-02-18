/// <reference types="Cypress" />
import defaultToolStylesMap from 'constants/defaultToolStylesMap';

describe('Local Storage', function() {
  beforeEach(function() {
    cy.visit('http://localhost:3000/#d=/files/webviewer-demo-annotated.xod&a=1&streaming=true');
    cy.window().its('documentLoaded').should('equal', true);
  });

  Object.entries(defaultToolStylesMap).forEach(([ toolName, defaultStyles ]) => {
    it(`should save default ${toolName} styles to localStorage`, function() {
      const actualStyles = JSON.parse(localStorage.getItem(`toolData-${toolName}`));
  
      Object.entries(defaultStyles).forEach(([ key, expectedStyle ]) => {
        expect(actualStyles[key]).to.deep.equal(expectedStyle);
      });
    });
  });

  it('should update localStorage when tool styles change', async function() {
    await changingStickyToolStyles();
 
    const { StrokeColor, Opacity } = JSON.parse(localStorage.getItem('toolData-AnnotationCreateSticky'));
    expect(StrokeColor).to.deep.equal({ R: 241, G: 160, B: 153, A: 1 });
    expect(Opacity).to.closeTo(0, 0.01);
  });

  it('should retain tool styles after users refresh the page', async function() {
    // Cypress clears localStorage before each test to keep it in a clean state
    // so the styles change from the above test is lost, we need to redo that
    await changingStickyToolStyles();

    cy.reload();
    cy.window().its('docViewer').invoke('getTool', 'AnnotationCreateSticky')
      .should(function(stickyNoteTool) {
        const { StrokeColor, Opacity } = JSON.parse(JSON.stringify(stickyNoteTool.defaults));

        expect(StrokeColor).to.deep.equal({ R: 241, G: 160, B: 153, A: 1 });
        expect(Opacity).to.closeTo(0, 0.01);
      });
  });
});

const changingStickyToolStyles = function() {
  return new Promise(resolve => {
    // change the stroke color to the first color in the palette
    // set opacity to almost 0
    cy.get('.HeaderItems').children('[data-element="stickyToolButton"]').click().click();
    cy.get('.cell').first().click();
    cy.get('line').first().click('left').then(resolve);
  });
};