import { Authentication } from '@/domain/usecases'
import { mockAccountModel } from '@/domain/test'

export class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: Authentication.Params
  callCount = 0
  async auth (params: Authentication.Params): Promise<Authentication.Model> {
    this.params = params
    this.callCount++
    return Promise.resolve(this.account)
  }
}
