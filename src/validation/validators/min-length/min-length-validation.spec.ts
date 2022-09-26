import { InvaliedFieldError } from "@/validation/errors/invalid-field-error";
import { MinLengthValidation } from "./min-length-validation";

describe("MinLengthValidation", () => {
  test("Should return erro value is invalid", () => {
    const sut = new MinLengthValidation("field", 5);
    const error = sut.validate("123");
    expect(error).toEqual(new InvaliedFieldError());
  });

  //   test("Should return success if email is valid", () => {
  //     const sut = makeSut();
  //     const error = sut.validate(faker.internet.email());
  //     expect(error).toBeFalsy();
  //   });
});
