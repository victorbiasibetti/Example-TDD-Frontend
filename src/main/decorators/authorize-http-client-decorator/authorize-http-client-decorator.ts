import { GetStorage } from "@/data/protocols/cache";
import { HttpClient, HttpRequest, HttpResponse } from "@/data/protocols/http";

export class AuthorizaHttpClientDecorator implements HttpClient {
  constructor(
    private readonly getStorage: GetStorage,
    private readonly httpClient: HttpClient
  ) {}

  async request(data: HttpRequest): Promise<HttpResponse<any>> {
    const account = this.getStorage.get("account");
    if (account?.accessToken) {
      Object.assign(data, {
        headers: Object.assign(data.headers || {}, {
          // Nome do header na API -> pode ser substituido dependendo da API
          "x-access-token": account.accessToken,
        }),
      });
    }
    const httpResponse = await this.httpClient.request(data);
    return httpResponse;
  }
}
