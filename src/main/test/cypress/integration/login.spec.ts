import faker from 'faker'

const baseUrl:string | null = Cypress.config().baseUrl

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
  
  it('Should present InvalidCredentialsError on 401', () => {
    cy.intercept('POST', /login/, {
      statusCode: 401,
      body: {
        error: faker.random.words()
      }
    })
    cy.get('[data-testid="email"]')
      .type(faker.internet.email())
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(5))
    cy.get('[data-testid="submit"]').click()
    cy.get('[data-testid="spinner"]').should('not.exist')
    cy.get('[data-testid="main-error"]').should('contain.text', 'Credenciais inválidas')
    cy.url().should('eq', `${baseUrl}/login`)
    })

  it('Should present UnexpectedError on 401', () => {
    cy.intercept('POST', /login/, {
      statusCode: 400,
      body: {
        error: faker.random.words()
      }
    })
    cy.get('[data-testid="email"]')
      .type(faker.internet.email())
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(5))
    cy.get('[data-testid="submit"]').click()
    cy.get('[data-testid="spinner"]').should('not.exist')
    cy.get('[data-testid="main-error"]').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde.')
    cy.url().should('eq', `${baseUrl}/login`)
    })
  
  it('Should present UnexpectedError if data is invalid', () => {
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        invalidProperty: faker.datatype.uuid()
      }
    })    
    cy.get('[data-testid="email"]')
      .type(faker.internet.email())
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(5)).type('{enter}')
    cy.get('[data-testid="spinner"]').should('not.exist')
    cy.get('[data-testid="main-error"]').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde.')
    cy.url().should('eq', `${baseUrl}/login`)
    })

  it('Should present save accessToken if valid credentials are provided', () => {
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        accessToken: faker.datatype.uuid()
      }
    })    
    cy.get('[data-testid="email"]')
      .type(faker.internet.email())
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(5))
    cy.get('[data-testid="submit"]').click()
    cy.get('[data-testid="main-error"]').should('not.exist')
    cy.get('[data-testid="spinner"]').should('not.exist')
    cy.url().should('eq', `${baseUrl}/`)
    cy.window().then(window => assert.isOk(window.localStorage.getItem('accessToken')))
    })

  it('Should present multiples submits', () => {
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        accessToken: faker.datatype.uuid()
      }
    }).as('request')
    cy.get('[data-testid="email"]')
      .type(faker.internet.email())
    cy.get('[data-testid="password"]')
      .type(faker.random.alphaNumeric(5))
    cy.get('[data-testid="submit"]').dblclick()
    cy.get('@request.all').should('have.length', 1)
    })

  it('Should not call submit if form is invalid', () => {
    cy.intercept('POST', /login/, {
      statusCode: 200,
      body: {
        accessToken: faker.datatype.uuid()
      }
    }).as('request')
    cy.get('[data-testid="email"]')
      .type(faker.internet.email()).type('{enter}')
    cy.get('@request.all').should('have.length', 0)
    })
})
