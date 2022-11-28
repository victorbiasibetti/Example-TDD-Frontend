import { HttpStatusCode } from '@/data/protocols/http'
import { HttpGetClientSpy, mockRemoteSurveyResultModel } from '@/data/test'
import { RemoteLoadSurveyResult } from '@/data/usecases'
import { AccessDeniedError, UnexpectedError } from '@/domain/erros'
import faker from 'faker'

type SutTypes = {
  sut: RemoteLoadSurveyResult
  httpGetClientSpy: HttpGetClientSpy
}
const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy()
  const sut = new RemoteLoadSurveyResult(url, httpGetClientSpy)
  return {
    sut, httpGetClientSpy
  }
}

describe('RemoteLoadSurveyResult', () => {
  test('Should call HttpGetClient with corect URL', async () => {
    const url = faker.internet.url()
    const { httpGetClientSpy, sut } = makeSut(url)
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteSurveyResultModel()
    }
    await sut.load()
    expect(httpGetClientSpy.url).toBe(url)
  })
  test('Should throw AccessDeniedError with HttpGetClient return 403', async () => {
    const { httpGetClientSpy, sut } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })
  test('Should throw UnexpectedError with HttpGetClient return 404', async () => {
    const { httpGetClientSpy, sut } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should throw UnexpectedError with HttpGetClient return 500', async () => {
    const { httpGetClientSpy, sut } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.load()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should return SurveryResult on 200', async () => {
    const { httpGetClientSpy, sut } = makeSut()
    const httpResult = mockRemoteSurveyResultModel()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const httpResponse = await sut.load()
    expect(httpResponse).toEqual({
      question: httpResult.question,
      answers: httpResult.answers,
      date: new Date(httpResult.date)
    })
  })
})
