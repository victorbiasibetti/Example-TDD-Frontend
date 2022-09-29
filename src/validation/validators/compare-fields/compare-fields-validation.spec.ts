import { InvaliedFieldError } from '@/validation/errors/invalid-field-error'
import faker from 'faker'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (valueToCompare: string = faker.database.column()): CompareFieldsValidation =>
  new CompareFieldsValidation(faker.database.column(), valueToCompare)

describe('CompareFieldsValidation', () => {
  test('Should return erro if compare is invalid', () => {
    const sut = makeSut()
    const error = sut.validate('')
    expect(error).toEqual(new InvaliedFieldError())
  })
})
