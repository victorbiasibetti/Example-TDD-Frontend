import { SetStorageMock } from '@/data/test/mock-storage'
import { LocalSaveAccessToken } from './local-save-access-token'
import faker from 'faker'

type SutTypes = {
  sut: LocalSaveAccessToken
  setStorageSpy: SetStorageMock
}

const makeSut = (): SutTypes => {
  const setStorageMock = new SetStorageMock()
  const sut = new LocalSaveAccessToken(setStorageMock)
  return {
    sut,
    setStorageSpy: setStorageMock
  }
}

describe('LocalSaveAccessToken', () => {
  test('Should call SetStorage with correct value', async () => {
    const { sut, setStorageSpy } = makeSut()
    const accessToken = faker.datatype.uuid()
    await sut.save(accessToken)
    expect(setStorageSpy.key).toBe('accessToken')
    expect(setStorageSpy.value).toBe(accessToken)
  })

  test('Should throw if SetStorage throws', async () => {
    const { sut, setStorageSpy } = makeSut()
    jest.spyOn(setStorageSpy, 'set').mockRejectedValueOnce(new Error())
    const promise = sut.save(faker.datatype.uuid())
    await expect(promise).rejects.toThrow(new Error())
  })
})
