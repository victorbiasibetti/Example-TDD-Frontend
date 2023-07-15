import { HttpMethod, HttpRequest } from "@/data/protocols/http";
import { GetStorageSpy, HttpClientSpy, mockHttpRequest } from "@/data/test";
import { mockAccountModel } from "@/domain/test";
import faker from "faker";
import { AuthorizaHttpClientDecorator } from "./authorize-http-client-decorator";

type SutTypes = {
  sut: AuthorizaHttpClientDecorator;
  getStorageSpy: GetStorageSpy;
  httpGetClientSpy: HttpClientSpy<any, any>;
};

const makeSut = (): SutTypes => {
  const getStorageSpy = new GetStorageSpy();
  const httpGetClientSpy = new HttpClientSpy();
  const sut = new AuthorizaHttpClientDecorator(getStorageSpy, httpGetClientSpy);
  return { sut, getStorageSpy, httpGetClientSpy };
};

const generateMethod = (): HttpMethod =>
  faker.random.arrayElement(["post", "get", "put", "patch", "delete"]);

describe("AuthorizaHttpGetClientDecorator", () => {
  test("Should call GetStorage with correct value", async () => {
    const { sut, getStorageSpy } = makeSut();
    await sut.request(mockHttpRequest());
    expect(getStorageSpy.key).toBe("account");
  });

  test("Should not add headers if GetStorage is invalid", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: generateMethod(),
      headers: {
        field: faker.random.words(),
      },
    };
    await sut.request(httpRequest);
    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.method).toBe(httpRequest.method);
    expect(httpGetClientSpy.headers).toEqual(httpRequest.headers);
  });

  test("Should add headers to HttpClient", async () => {
    const { sut, httpGetClientSpy, getStorageSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: generateMethod(),
    };
    await sut.request(httpRequest);
    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.method).toBe(httpRequest.method);
    expect(httpGetClientSpy.headers).toEqual({
      // Nome do header na API -> pode ser substituido dependendo da API
      "x-access-token": getStorageSpy.value.accessToken,
    });
  });

  test("Should merge headers to HttpClient", async () => {
    const { sut, httpGetClientSpy, getStorageSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();
    const field = faker.random.words();
    const httpRequest: HttpRequest = {
      url: faker.internet.url(),
      method: generateMethod(),
      headers: {
        field,
      },
    };
    await sut.request(httpRequest);
    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.method).toBe(httpRequest.method);
    expect(httpGetClientSpy.headers).toEqual({
      field,
      // Nome do header na API -> pode ser substituido dependendo da API
      "x-access-token": getStorageSpy.value.accessToken,
    });
  });

  test("Should return the same result as HttpClient", async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const httpResponse = await sut.request(mockHttpRequest());
    expect(httpResponse).toEqual(httpGetClientSpy.response);
  });
});
