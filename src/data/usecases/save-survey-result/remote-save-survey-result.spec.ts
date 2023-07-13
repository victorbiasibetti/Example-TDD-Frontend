import { HttpStatusCode } from "@/data/protocols/http";
import { HttpClientSpy, mockRemoteSurveyResultModel } from "@/data/test";
import { RemoteSaveSurveyResult } from "@/data/usecases";
import { AccessDeniedError, UnexpectedError } from "@/domain/erros";
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
    await sut.save({ answer: faker.random.word() });
    expect(httpClientSpy.url).toBe(url);
    expect(httpClientSpy.method).toBe("put");
  });
});
