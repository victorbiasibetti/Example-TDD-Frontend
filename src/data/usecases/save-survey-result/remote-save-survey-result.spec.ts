import { HttpStatusCode } from "@/data/protocols/http";
import { HttpClientSpy, mockRemoteSurveyResultModel } from "@/data/test";
import { RemoteSaveSurveyResult } from "@/data/usecases";
import { AccessDeniedError, UnexpectedError } from "@/domain/erros";
import { mockSaveSurveyResultParams } from "@/domain/test";
import faker from "faker";

type SutTypes = {
  sut: RemoteSaveSurveyResult;
  httpClientSpy: HttpClientSpy<any, any>;
};
const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy();
  const sut = new RemoteSaveSurveyResult(url, httpClientSpy);
  return {
    sut,
    httpClientSpy,
  };
};

describe("RemoteSaveSurveyResult", () => {
  test("Should call HttpClient with corect URL and method", async () => {
    const url = faker.internet.url();
    const { httpClientSpy, sut } = makeSut(url);
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel(),
    };
    const saveSurveyResultParams = mockSaveSurveyResultParams();
    await sut.save(saveSurveyResultParams);
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("put");
    expect(httpClientSpy.body).toEqual(saveSurveyResultParams);
  });

  test("Should throw AccessDeniedError with HttpClient return 403", async () => {
    const { httpClientSpy, sut } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new AccessDeniedError());
  });

  test("Should throw UnexpectedError with HttpClient return 404", async () => {
    const { httpClientSpy, sut } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should throw UnexpectedError with HttpClient return 500", async () => {
    const { httpClientSpy, sut } = makeSut();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };
    const promise = sut.save(mockSaveSurveyResultParams());
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test("Should return SurveryResult on 200", async () => {
    const { httpClientSpy, sut } = makeSut();
    const httpResult = mockRemoteSurveyResultModel();
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };
    const httpResponse = await sut.save(mockSaveSurveyResultParams());
    expect(httpResponse).toEqual({
      question: httpResult.question,
      answers: httpResult.answers,
      date: new Date(httpResult.date),
    });
  });
});
