import { HttpPostClient } from "../../protocols/http/http-post-client";
import { RemoteAuthentication } from "./remote-authentication";

describe("RemoteAuthentication", () => {
  test("Should call HttpPostClient with correct URL", async () => {
    class HttpPostClientSpy implements HttpPostClient {
      url?: string;
      async post(url: string): Promise<void> {
        this.url = url;
        return Promise.resolve();
      }
    }
    const httpPostClient = new HttpPostClientSpy();
    const url = "any_url";
    const sut = new RemoteAuthentication(url, httpPostClient);
    await sut.auth();
    expect(httpPostClient.url).toBe(url);
  });
});
