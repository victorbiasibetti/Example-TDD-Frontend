
export const testInputStatus = (field: string, error?: string): void => {
    cy.get(`[data-testid="${field}-wrap"]`).should('have.attr', 'data-status', error? 'invalid': 'valid')
    const attr = `${error ? '' : 'not.'}have.attr`
    cy.get(`[data-testid="${field}"]`).should(attr, 'title', error)
    cy.get(`[data-testid="${field}-label"]`).should(attr, 'title', error)
}

export const testMainError = (error: string):void => {
    cy.get('[data-testid="spinner"]').should('not.exist')
    cy.get('[data-testid="main-error"]').should('contain.text', error)
}