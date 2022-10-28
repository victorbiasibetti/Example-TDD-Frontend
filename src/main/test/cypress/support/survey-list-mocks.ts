import * as Http from '../support/http-mocks'
import faker from 'faker'

export const mockUnexpectedError = ():void => Http.mockServerError(/surveys/, 'GET')
export const mockAccessDeniedError = ():void => Http.mockForbiddenError(/surveys/, 'GET')


