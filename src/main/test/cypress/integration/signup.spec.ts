import { testInputStatus } from "../support/form-helper"
import faker from 'faker'

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

    it('Should present error state if form is invalid', () => {
        cy.get('[data-testid="name"]')
          .type(faker.random.alphaNumeric(2))
        testInputStatus('name', 'Valor inválido')
        
        cy.get('[data-testid="email"]')
          .type(faker.random.word())
        testInputStatus('email', 'Valor inválido')
        
        cy.get('[data-testid="password"]')
          .type(faker.random.alphaNumeric(3))  
        testInputStatus('password', 'Valor inválido')

        cy.get('[data-testid="passwordConfirmation"]')
          .type(faker.random.alphaNumeric(5))  
        testInputStatus('passwordConfirmation', 'Valor inválido')
          
        cy.get('[data-testid="submit"]').should('have.attr', 'disabled')
        cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
      })
})