import { HttpResponse } from '@/data/protocols/http'

export type HttpGetParams = {
  url: string
  headers?: any
}

export interface HttpGetClient<ResponseType = any> {
  get: (params: HttpGetParams) => Promise<HttpResponse<ResponseType>>
}
