import { HttpGetClient } from '@/data/protocols/http'
import { AuthorizaHttpGetClientDecorator } from '@/main/decorators'
import { makeLocalStorageAdapter } from '@/main/factories/cache'
import { makeAxiosHttpClient } from '@/main/factories/http'

export const makeAuthorizaHttpGetClientDecorator = (): HttpGetClient => {
  return new AuthorizaHttpGetClientDecorator(makeLocalStorageAdapter(), makeAxiosHttpClient())
}
