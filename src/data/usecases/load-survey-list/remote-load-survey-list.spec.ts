import faker from 'faker'
import { HttpGetClientSpy , mockRemoteSurveyListModel } from '@/data/test'
import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { HttpStatusCode } from '@/data/protocols/http'
import { UnexpectedError } from '@/domain/erros'

type SutTypes = {
  sut: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<RemoteLoadSurveyList.Model[]>
}
const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<RemoteLoadSurveyList.Model[]>()
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)
  return { sut, httpGetClientSpy }
}

describe('RemoteLoadSurveyList', () => {
  test('Should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    await sut.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })

  test('Should throw UnexpectedError with HttpGetClient return 403', () => {
    const { httpGetClientSpy, sut } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.loadAll()
    expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError with HttpGetClient return 404', () => {
    const { httpGetClientSpy, sut } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.loadAll()
    expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw UnexpectedError with HttpGetClient return 500', () => {
    const { httpGetClientSpy, sut } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.loadAll()
    expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return a list of SurveyModels if HttpGetClient return 200', async () => {
    const { httpGetClientSpy, sut } = makeSut()
    const httpResult = mockRemoteSurveyListModel()

    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const surveyList = await sut.loadAll()
    expect(surveyList).toEqual([
      {
        id: httpResult[0].id,
        question: httpResult[0].question,
        didAnswer: httpResult[0].didAnswer,
        date: new Date(httpResult[0].date)
      },
      {
        id: httpResult[1].id,
        question: httpResult[1].question,
        didAnswer: httpResult[1].didAnswer,
        date: new Date(httpResult[1].date)
      },
      {
        id: httpResult[2].id,
        question: httpResult[2].question,
        didAnswer: httpResult[2].didAnswer,
        date: new Date(httpResult[2].date)
      }
    ])
  })

  test('Should return an empty list if HttpGetClient return 204', async () => {
    const { httpGetClientSpy, sut } = makeSut()

    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const surveyList = await sut.loadAll()
    expect(surveyList).toEqual([])
  })
})
