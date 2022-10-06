import { testInputStatus } from "../support/form-helper"


describe('SignUp', () => {
    beforeEach(() => {
      cy.visit('signup')
    })
  
    it('Should load with correct initial state', () => {
      testInputStatus('name', 'Campo obrigatório')
      testInputStatus('email', 'Campo obrigatório')
      testInputStatus('password', 'Campo obrigatório')
      testInputStatus('passwordConfirmation', 'Campo obrigatório')
      
      cy.get('[data-testid="submit"]').should('have.attr', 'disabled')
      cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
    })

})