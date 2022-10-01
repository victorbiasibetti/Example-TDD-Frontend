import { InvaliedFieldError } from '@/validation/errors/invalid-field-error'
import { EmailValidation } from './email-validation'
import faker from 'faker'

const makeSut = (field: string): EmailValidation =>
  new EmailValidation(field)

describe('EmailValidation', () => {
  test('Should return erro if email is invalid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.word() })
    expect(error).toEqual(new InvaliedFieldError())
  })

  test('Should return falsy if email is valid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.internet.email() })
    expect(error).toBeFalsy()
  })

  test('Should return falsy if email is empty', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: '' })
    expect(error).toBeFalsy()
  })
})
