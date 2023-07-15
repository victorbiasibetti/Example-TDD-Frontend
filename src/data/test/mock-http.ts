import {
  HttpResponse,
  HttpStatusCode,
  HttpRequest,
  HttpClient,
} from "../protocols/http";
import faker from "faker";

export const mockHttpRequest = (): HttpRequest => ({
  url: faker.internet.url(),
  method: faker.random.arrayElement(["get", "post", "delete", "put", "patch"]),
  body: faker.random.objectElement(),
  headers: faker.random.objectElement(),
});

export class HttpClientSpy<BodyType, ResponseType = any>
  implements HttpClient<ResponseType>
{
  url?: string;
  body?: BodyType;
  method?: string;
  headers?: any;
  response: HttpResponse<ResponseType> = {
    statusCode: HttpStatusCode.ok,
  };

  async request(data: HttpRequest): Promise<HttpResponse<ResponseType>> {
    this.url = data.url;
    this.body = data.body;
    this.method = data.method;
    this.headers = data.headers;
    return Promise.resolve(this.response);
  }
}
