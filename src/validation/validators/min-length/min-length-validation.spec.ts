import { InvaliedFieldError } from "@/validation/errors/invalid-field-error";
import { MinLengthValidation } from "./min-length-validation";
import faker from "faker";

const makeSut = (): MinLengthValidation =>
  new MinLengthValidation(faker.database.column(), 5);

describe("MinLengthValidation", () => {
  test("Should return erro value is invalid", () => {
    const sut = makeSut();
    const error = sut.validate(faker.random.alphaNumeric(4));
    expect(error).toEqual(new InvaliedFieldError());
  });

  test("Should return false if value is valid", () => {
    const sut = makeSut();
    const error = sut.validate(faker.random.alphaNumeric(5));
    expect(error).toBeFalsy();
  });
});
