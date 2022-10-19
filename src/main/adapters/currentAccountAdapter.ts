import { UnexpectedError } from '@/domain/erros'
import { AccountModel } from '@/domain/models'
import { makeLocalStorageAdapter } from '../factories/cache/local-storage-adapter-factory'

export const setCurrentAccountAdapter = (account: AccountModel): void => {
  if (!account?.accessToken) throw new UnexpectedError()
  makeLocalStorageAdapter().set('account', account)
}
