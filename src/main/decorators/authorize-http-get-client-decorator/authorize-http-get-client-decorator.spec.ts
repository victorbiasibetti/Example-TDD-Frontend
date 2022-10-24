import { GetStorageSpy, mockGetRequest } from '@/data/test'
import { AuthorizaHttpGetClientDecorator } from '@/main/decorators/authorize-http-get-client-decorator/authorize-http-get-client-decorator'

describe('AuthorizaHttpGetClientDecorator', () => {
  test('Should call GetStorage with correct value', () => {
    const getStorageSpy = new GetStorageSpy()
    const sut = new AuthorizaHttpGetClientDecorator(getStorageSpy)
    sut.get(mockGetRequest())
    expect(getStorageSpy.key).toBe('account')
  })
})
