import React from 'react'

import faker from 'faker'
import { mockUnexpectedError } from '../support/survey-list-mocks'
import { setLocalStorageItem, testHttpCallsCount, testLocalStorageItem, testUrl } from '../support/helpers'

describe('SurveyList', () => {
  beforeEach(() => {
    setLocalStorageItem('account', {accessToken: faker.datatype.uuid(), name: faker.name.findName()})
  })
  
  it('Should present error on UnexpectedError', () => {
    mockUnexpectedError()
    cy.visit('')
    cy.get('[data-testid="error"]').should('contain.text', 'Algo de errado aconteceu. Tente novamente mais tarde.')
  })
  
})
