import faker from 'faker'

describe('Login', () => {
  beforeEach(() => {
    cy.visit('login')
  })

  it('Should load with correct initial state', () => {
    cy.get('[data-testid="email-status"]')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴')
    cy.get('[data-testid="password-status"]')
      .should('have.attr', 'title', 'Campo obrigatório')
      .should('contain.text', '🔴')
    cy.get('[data-testid="submit"]').should('have.attr', 'disabled')
    cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
  })
  
  it('Should present error state if form is invalid', () => {
    cy.get('[data-testid="email"]')
      .type(faker.random.word())
    cy.get('[data-testid="email-status"]')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(3))  
    cy.get('[data-testid="password-status"]')
      .should('have.attr', 'title', 'Valor inválido')
      .should('contain.text', '🔴')
    cy.get('[data-testid="submit"]').should('have.attr', 'disabled')
    cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
  })
  
  it('Should present valid state if form is valid', () => {
    cy.get('[data-testid="email"]')
      .type(faker.internet.email())
    cy.get('[data-testid="email-status"]')
      .should('have.attr', 'title', 'ok')
      .should('contain.text', '🟢')
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(5))  
    cy.get('[data-testid="password-status"]')
      .should('have.attr', 'title', 'ok')
      .should('contain.text', '🟢')
    cy.get('[data-testid="submit"]').should('not.have.attr', 'disabled')
    cy.get('[data-testid="error-wrap"]').should('not.have.descendants')
  })
})
