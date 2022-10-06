import * as Helper from '../support/http-mocks'

export const mockEmailInUseError = ():void => Helper.mockEmailInUseError(/signup/)
