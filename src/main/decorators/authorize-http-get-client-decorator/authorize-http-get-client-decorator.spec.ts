import { GetStorageSpy, mockGetRequest } from '@/data/test'
import { AuthorizaHttpGetClientDecorator } from '@/main/decorators/authorize-http-get-client-decorator/authorize-http-get-client-decorator'

type SutTypes = {
  sut: AuthorizaHttpGetClientDecorator
  getStorageSpy: GetStorageSpy
}

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy()
  const sut = new AuthorizaHttpGetClientDecorator(getStorageSpy)
  return { sut, getStorageSpy }
}

describe('AuthorizaHttpGetClientDecorator', () => {
  test('Should call GetStorage with correct value', () => {
    const { sut, getStorageSpy } = makeSut()
    sut.get(mockGetRequest())
    expect(getStorageSpy.key).toBe('account')
  })
})
