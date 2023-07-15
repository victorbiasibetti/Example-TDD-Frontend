import { HttpClient, HttpRequest, HttpResponse } from "@/data/protocols/http";
import axios, { AxiosResponse } from "axios";

export class AxiosHttpClient implements HttpClient<any> {
  async request(data: HttpRequest): Promise<HttpResponse<any>> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await axios.request({
        url: data.url,
        data: data?.body,
        method: data.method,
        headers: data?.headers,
      });
    } catch (error) {
      axiosResponse = error.response;
    }
    return {
      statusCode: axiosResponse.status,
      body: axiosResponse.data,
    };
  }
}
