import { HttpPostClient, HttpStatusCode } from '@/data/protocols/http'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/erros'
import { Authentication } from '@/domain/usecases'

export class RemoteAuthentication implements Authentication {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<
    Authentication.Params,
    RemoteAuthentication.Model
    >
  ) {}

  async auth (params: Authentication.Params): Promise<Authentication.Model> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return httpResponse.body
      case HttpStatusCode.unathorized:
        throw new InvalidCredentialsError()
      default:
        throw new UnexpectedError()
    }
  }
}

export namespace RemoteAuthentication {
  export type Model = Authentication.Model
}
