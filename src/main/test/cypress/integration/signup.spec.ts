import faker from 'faker'
import { testInputStatus, testMainError, testUrl } from "../support/form-helper"
import { mockEmailInUseError } from "./signup-mocks"

const simulateValidSubmit = ():void => {
    cy.get('[data-testid="name"]')
        .type(faker.name.findName())
    testInputStatus('name')

    cy.get('[data-testid="email"]')
        .type(faker.internet.email())
    
    const password = faker.random.alphaNumeric(5)
    cy.get('[data-testid="password"]')
        .type(password)  
    testInputStatus('password')     
    cy.get('[data-testid="passwordConfirmation"]')
        .type(password)  
    testInputStatus('passwordConfirmation')

    cy.get('[data-testid="submit"]').click()
}
  
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
  
    it('Should present valid state if form is valid', () => {
        cy.get('[data-testid="name"]')
            .type(faker.name.findName())
        testInputStatus('name')
        cy.get('[data-testid="email"]')
            .type(faker.internet.email())
        testInputStatus('email')        
        
        const password = faker.random.alphaNumeric(5)
        cy.get('[data-testid="password"]')
            .type(password)  
        testInputStatus('password')     
        cy.get('[data-testid="passwordConfirmation"]')
            .type(password)  
        testInputStatus('passwordConfirmation')
        
        cy.get('[data-testid="submit"]').should('not.have.attr', 'disabled')
        cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
    })

    it('Should present EmailInUseError on 403', () => {
        mockEmailInUseError()
        simulateValidSubmit()    
        testMainError('E-mail já está cadastrado')    
        testUrl(`/signup`)
    })
})