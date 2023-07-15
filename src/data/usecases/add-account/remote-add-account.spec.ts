import { HttpClientSpy } from "@/data/test";
import { AddAccount } from "@/domain/usecases";
import { RemoteAddAccount } from "@/data/usecases/add-account/remote-add-account";
import { mockAccountModel, mockAddAccountParams } from "@/domain/test";
import faker from "faker";
import { HttpStatusCode } from "@/data/protocols/http";
import { EmailInUseError, UnexpectedError } from "@/domain/erros";

type SutTypes = {
  sut: RemoteAddAccount;
  httpClientSpy: HttpClientSpy<AddAccount.Params, RemoteAddAccount.Model>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<
    AddAccount.Params,
    RemoteAddAccount.Model
  >();
  const sut = new RemoteAddAccount(url, httpClientSpy);
  return {
    sut,
    httpClientSpy,
  };
};

describe("RemoteAddAccount", () => {
  test("Should call HttpClient with correct values", async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const addAccountParams = mockAddAccountParams();
    await sut.add(addAccountParams);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("post");
    expect(httpClientSpy.body).toEqual(addAccountParams);
  });

  test("Should throw EmailInUseError with HttpClient return 403", () => {
    const { httpClientSpy, sut } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };
    const promise = sut.add(mockAddAccountParams());
    expect(promise).rejects.toThrow(new EmailInUseError());
  });

  test("Should throw Unexpected Error with HttpClient return 400", () => {
    const { httpClientSpy, sut } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };
    const promise = sut.add(mockAddAccountParams());
    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw Unexpected Error with HttpClient return 500", () => {
    const { httpClientSpy, sut } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };
    const promise = sut.add(mockAddAccountParams());
    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw Unexpected Error with HttpClient return 404", () => {
    const { httpClientSpy, sut } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };
    const promise = sut.add(mockAddAccountParams());
    expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should return an AddAccount.Model if HttpClient return 200", async () => {
    const { httpClientSpy, sut } = makeSut();
    const httpResult = mockAccountModel();

    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };
    const account = await sut.add(mockAddAccountParams());
    expect(account).toEqual(httpResult);
  });
});
