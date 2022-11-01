import { InvaliedFieldError } from '@/validation/errors/invalid-field-error'
import { MinLengthValidation } from './min-length-validation'
import faker from 'faker'

const makeSut = (field: string): MinLengthValidation =>
  new MinLengthValidation(field, 5)

describe('MinLengthValidation', () => {
  test('Should return erro value is invalid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.alphaNumeric(4) })
    expect(error).toEqual(new InvaliedFieldError())
  })

  test('Should return falsy if value is valid', () => {
    const field = faker.database.column()
    const sut = makeSut(field)
    const error = sut.validate({ [field]: faker.random.alphaNumeric(5) })
    expect(error).toBeFalsy()
  })

  test('Should return falsy if field not exists in schema', () => {
    const sut = makeSut('field')
    const error = sut.validate({ invalidField: faker.random.alphaNumeric(5) })
    expect(error).toBeFalsy()
  })
})
