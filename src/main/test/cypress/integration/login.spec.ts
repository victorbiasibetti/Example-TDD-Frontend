import faker from 'faker'

const baseUrl:string = Cypress.config().baseUrl

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
  
  it('Should present error if invalid credentials are provided', () => {
    cy.get('[data-testid="email"]')
      .type(faker.internet.email())
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(5))
    cy.get('[data-testid="submit"]').click()
    cy.get('[data-testid="error-wrap"]')
      .get('[data-testid="spinner"]').should('exist')
      .get('[data-testid="main-error"]').should('not.exist')
      .get('[data-testid="spinner"]').should('not.exist')
      .get('[data-testid="main-error"]').should('exist')
      // TODO: adicionar quando resolver problema da API
      // .get('[data-testid="main-error"]').should('contain-text', 'Credenciais inválidas')
    cy.url().should('eq', `${baseUrl}/login`)
    })
  
  it('Should present save accessToken if valid credentials are provided', () => {
    cy.get('[data-testid="email"]')
      .type('mango@gmail.com')
    cy.get('[data-testid="password"]')
      .type('12345')
    cy.get('[data-testid="submit"]').click()
    cy.get('[data-testid="error-wrap"]')
      .get('[data-testid="spinner"]').should('exist')
      .get('[data-testid="main-error"]').should('not.exist')
      .get('[data-testid="spinner"]').should('not.exist')
    // TODO: adicionar quando resolver problema da API
      // .get('[data-testid="main-error"]').should('contain-text', 'Credenciais inválidas')
    // cy.url().should('eq', `${baseUrl}/`)
    // cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
    })
})
