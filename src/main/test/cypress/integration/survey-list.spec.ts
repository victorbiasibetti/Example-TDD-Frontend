import React from 'react'

import faker from 'faker'
import { mockAccessDeniedError, mockUnexpectedError } from '../support/survey-list-mocks'
import { getLocalStorageItem, setLocalStorageItem, testHttpCallsCount, testLocalStorageItem, testUrl } from '../support/helpers'

describe('SurveyList', () => {
  beforeEach(() => {
    setLocalStorageItem('account', {accessToken: faker.datatype.uuid(), name: faker.name.findName()})
  })
  
  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.get('[data-testid="error"]').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde.')
  })
  
  it('Should logout on AccessDeniedError', () => {
    mockAccessDeniedError()
    cy.visit('')
    testUrl('/login')
  })
  it('Should present correct username', () => {
    mockUnexpectedError()
    cy.visit('')
    const { name } = getLocalStorageItem('account')
    cy.get('[data-testid="username"]').should('contain.text', name)
  })
  it('Should logout on logout link click', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.get('[data-testid="logout"]').click()
    testUrl('/login')
  })
  
})
