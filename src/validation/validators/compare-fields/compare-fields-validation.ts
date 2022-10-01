import { InvaliedFieldError } from '@/validation/errors/invalid-field-error'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class CompareFieldsValidation implements FieldValidation {
  constructor (
    readonly field: string,
    private readonly fieldToCompare: string
  ) {}

  validate (input: object): Error {
    return input[this.field] !== input[this.fieldToCompare] ? new InvaliedFieldError() : null
  }
}
