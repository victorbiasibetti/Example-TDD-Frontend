import { AddAccountParams } from '../usecases'
import faker from 'faker'

export const mockAddAccount = (): AddAccountParams => {
  const password = faker.internet.password()
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    password,
    passwordConfirmation: password
  }
}
