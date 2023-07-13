import { RemoteAuthentication } from "./remote-authentication";
import { mockAccountModel, mockAuthentication } from "@/domain/test";
import { InvalidCredentialsError, UnexpectedError } from "@/domain/erros";
import { HttpStatusCode } from "@/data/protocols/http";
import { Authentication } from "@/domain/usecases";
import { HttpClientSpy } from "@/data/test";
import { RemoteAddAccount } from "../add-account/remote-add-account";
import faker from "faker";

type SutTypes = {
  sut: RemoteAuthentication;
  httpClientSpy: HttpClientSpy<Authentication.Params, RemoteAddAccount.Model>;
};

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<
    Authentication.Params,
    RemoteAddAccount.Model
  >();
  const sut = new RemoteAuthentication(url, httpClientSpy);
  return {
    sut,
    httpClientSpy,
  };
};

describe("RemoteAuthentication", () => {
  test("Should call HttpClient with correct values", async () => {
    const url = faker.internet.url();
    const { sut, httpClientSpy } = makeSut(url);
    const authenticationParams = mockAuthentication();
    await sut.auth(authenticationParams);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("post");
    expect(httpClientSpy.body).toEqual(authenticationParams);
  });

  test("Should throw InvalidCredentialsError with HttpClient return 401", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unathorized,
    };
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow(new InvalidCredentialsError());
  });

  test("Should throw Unexpected Error with HttpClient return 400", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw Unexpected Error with HttpClient return 500", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest,
    };
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw Unexpected Error with HttpClient return 404", async () => {
    const { sut, httpClientSpy } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };
    const promise = sut.auth(mockAuthentication());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should return an RemoteAddAccount.Model if HttpClient return 200", async () => {
    const { sut, httpClientSpy } = makeSut();
    const httpResult = mockAccountModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };
    const account = await sut.auth(mockAuthentication());
    await expect(account).toEqual(httpResult);
  });
});
