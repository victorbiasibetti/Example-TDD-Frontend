import { AddAccount } from '../usecases'
import faker from 'faker'

export const mockAddAccountParams = (): AddAccount.Params => {
  const password = faker.internet.password()
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password,
    passwordConfirmation: password
  }
}
