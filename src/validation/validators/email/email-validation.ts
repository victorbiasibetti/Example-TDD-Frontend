import { InvaliedFieldError } from '@/validation/errors/invalid-field-error'
import { FieldValidation } from '@/validation/protocols/field-validation'

export class EmailValidation implements FieldValidation {
  constructor (readonly field: string) {}
  validate (input: object): Error {
    if (!input[this.field]) return null
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const isValid = String(input[this.field]).toLowerCase().match(emailRegex)

    return isValid ? null : new InvaliedFieldError()
  }
}
