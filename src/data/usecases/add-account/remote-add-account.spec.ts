import { HttpPostClientSpy } from '@/data/test'
import { AddAccount } from '@/domain/usecases'
import { RemoteAddAccount } from '@/data/usecases/add-account/remote-add-account'
import { mockAccountModel, mockAddAccountParams } from '@/domain/test'
import faker from 'faker'
import { HttpStatusCode } from '@/data/protocols/http'
import { EmailInUseError, UnexpectedError } from '@/domain/erros'

type SutTypes = {
  sut: RemoteAddAccount
  httpPostClientSpy: HttpPostClientSpy<AddAccount.Params, RemoteAddAccount.Model>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy<AddAccount.Params, RemoteAddAccount.Model>()
  const sut = new RemoteAddAccount(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAddAccount', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    await sut.add(mockAddAccountParams())
    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should call HttpPostClient with correct Body', async () => {
    const { sut, httpPostClientSpy } = makeSut()
    const addAccountParams = mockAddAccountParams()
    await sut.add(addAccountParams)
    expect(httpPostClientSpy.body).toEqual(addAccountParams)
  })

  test('Should throw EmailInUseError with HttpPostClient return 403', () => {
    const { httpPostClientSpy, sut } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.add(mockAddAccountParams())
    expect(promise).rejects.toThrow(new EmailInUseError())
  })

  test('Should throw Unexpected Error with HttpPostClient return 400', () => {
    const { httpPostClientSpy, sut } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.add(mockAddAccountParams())
    expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw Unexpected Error with HttpPostClient return 500', () => {
    const { httpPostClientSpy, sut } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.add(mockAddAccountParams())
    expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should throw Unexpected Error with HttpPostClient return 404', () => {
    const { httpPostClientSpy, sut } = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.add(mockAddAccountParams())
    expect(promise).rejects.toThrow(new UnexpectedError())
  })

  test('Should return an AddAccount.Model if HttpPostClient return 200', async () => {
    const { httpPostClientSpy, sut } = makeSut()
    const httpResult = mockAccountModel()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const account = await sut.add(mockAddAccountParams())
    expect(account).toEqual(httpResult)
  })
})
