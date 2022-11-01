import React from 'react'

import { getLocalStorageItem, setLocalStorageItem,  testUrl } from '../utils/helpers'
import * as Http from '../utils/http-mocks'

const path = /surveys/
export const mockUnexpectedError = ():void => Http.mockServerError(path, 'GET')
export const mockAccessDeniedError = ():void => Http.mockForbiddenError(path, 'GET')


describe('SurveyList', () => {
  beforeEach(() => {
    cy.fixture('account').then(account => setLocalStorageItem('account', account))
    
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
