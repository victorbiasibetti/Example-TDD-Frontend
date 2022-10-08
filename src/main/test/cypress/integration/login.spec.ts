import faker from 'faker'
import { testHttpCallsCount, testInputStatus, testLocalStorageItem, testMainError, testUrl } from '../support/form-helper'
import { mockInvalidCredentialsError, mockInvalidData, mockOk, mockUnexpectedError } from './login-mocks'

const simulateValidSubmit = ():void => {
  cy.get('[data-testid="email"]')
      .type(faker.internet.email())
  cy.get('[data-testid="password"]')
    .type(faker.random.alphaNumeric(5))
  cy.get('[data-testid="submit"]').click()
}

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    testInputStatus('email', 'Campo obrigatório')
    testInputStatus('password', 'Campo obrigatório')
    
    cy.get('[data-testid="submit"]').should('have.attr', 'disabled')
    cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
  })
  
  it('Should present error state if form is invalid', () => {
    cy.get('[data-testid="email"]')
      .type(faker.random.word())
    testInputStatus('email', 'Valor inválido')
    
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(3))  
    testInputStatus('password', 'Valor inválido')
      
    cy.get('[data-testid="submit"]').should('have.attr', 'disabled')
    cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
  })
  
  it('Should present valid state if form is valid', () => {
    cy.get('[data-testid="email"]')
      .type(faker.internet.email())
    testInputStatus('email')
      
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(5))  
    testInputStatus('password')
    
    cy.get('[data-testid="submit"]').should('not.have.attr', 'disabled')
    cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
  })
  
  it('Should present InvalidCredentialsError on 401', () => {
    mockInvalidCredentialsError();
    simulateValidSubmit()    
    testMainError('Credenciais inválidas')    
    testUrl(`/login`)
  })

  it('Should present UnexpectedError on 401', () => {
    mockUnexpectedError()
    simulateValidSubmit()    
    testMainError('Algo de errado aconteceu. Tente novamente mais tarde.')    
    testUrl(`/login`)
  })
  
  it('Should present UnexpectedError if data is invalid', () => {
    mockInvalidData()
    simulateValidSubmit()    
    testMainError('Algo de errado aconteceu. Tente novamente mais tarde.')    
    testUrl(`/login`)
  })

  it('Should present save accessToken if valid credentials are provided', () => {
    mockOk()   
    simulateValidSubmit()
    cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
    testUrl(`/`)
    testLocalStorageItem('accessToken')
  })

  it('Should present multiples submits', () => {
    mockOk()
    cy.get('[data-testid="email"]')
      .type(faker.internet.email())
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(5))
    cy.get('[data-testid="submit"]').dblclick()
    testHttpCallsCount(1)
  })

  it('Should not call submit if form is invalid', () => {
    mockOk()
    cy.get('[data-testid="email"]')
      .type(faker.internet.email()).type('{enter}')
    testHttpCallsCount(0)
  })
})
