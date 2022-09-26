import { FieldValidationSpy } from "../test/mock-field-validation";
import { ValidationComposite } from "./validation-composite";

describe("ValidationComposite", () => {
  test("Should return erro if any validation fails", () => {
    const validationSpy = new FieldValidationSpy("any_field");
    const validationSpy2 = new FieldValidationSpy("any_field");
    validationSpy2.error = new Error("any_error_message");
    const sut = new ValidationComposite([validationSpy, validationSpy2]);
    const error = sut.validate("any_field", "any_value");
    expect(error).toBe("any_error_message");
  });

  //   test("Should return falsy if email is valid", () => {
  //     const sut = makeSut();
  //     const error = sut.validate(faker.internet.email());
  //     expect(error).toBeFalsy();
  //   });

  //   test("Should return falsy if email is empty", () => {
  //     const sut = makeSut();
  //     const error = sut.validate("");
  //     expect(error).toBeFalsy();
  //   });
});
