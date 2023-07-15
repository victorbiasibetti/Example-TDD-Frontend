import { HttpClient } from "@/data/protocols/http";
import { AuthorizaHttpClientDecorator } from "@/main/decorators";
import { makeLocalStorageAdapter } from "@/main/factories/cache";
import { makeAxiosHttpClient } from "@/main/factories/http";

export const makeAuthorizaHttpClientDecorator = (): HttpClient => {
  return new AuthorizaHttpClientDecorator(
    makeLocalStorageAdapter(),
    makeAxiosHttpClient()
  );
};
