export type HttpMethod = "post" | "get" | "put" | "patch" | "delete";

export enum HttpStatusCode {
  ok = 200,
  noContent = 204,
  badRequest = 400,
  unathorized = 401,
  forbidden = 403,
  notFound = 404,
  serverError = 500,
}

export type HttpResponse<ResponseType> = {
  statusCode: HttpStatusCode;
  body?: ResponseType;
};

export type HttpRequest = {
  url: string;
  method: HttpMethod;
  body?: any;
  headers?: any;
};

export interface HttpClient<ResponseType = any> {
  request: (data: HttpRequest) => Promise<HttpResponse<ResponseType>>;
}
