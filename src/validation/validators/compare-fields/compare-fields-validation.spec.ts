import { InvaliedFieldError } from '@/validation/errors/invalid-field-error'
import { CompareFieldsValidation } from './compare-fields-validation'
import faker from 'faker'

const makeSut = (valueToCompare: string = faker.database.column()): CompareFieldsValidation =>
  new CompareFieldsValidation(faker.database.column(), valueToCompare)

describe('CompareFieldsValidation', () => {
  test('Should return erro if compare is invalid', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toEqual(new InvaliedFieldError())
  })

  test('Should return falsy if compare is valid', () => {
    const valueToCompare = faker.database.column()
    const sut = makeSut(valueToCompare)
    const error = sut.validate(valueToCompare)
    expect(error).toBeFalsy()
  })
})
