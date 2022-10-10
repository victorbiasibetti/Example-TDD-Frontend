import axios from 'axios'
import faker from 'faker'

export const mockHttpResponse = (): any => ({
  body: faker.random.objectElement(),
  statusCode: faker.datatype.number()
})

export const mockAxios = (): jest.Mocked<typeof axios> => {
  const mockedAxios = axios as jest.Mocked<typeof axios>

  mockedAxios.post.mockResolvedValue(mockHttpResponse())
  mockedAxios.get.mockResolvedValue(mockHttpResponse())

  return mockedAxios
}
