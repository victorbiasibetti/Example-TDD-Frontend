import { HttpClient, HttpStatusCode } from "@/data/protocols/http";
import { AccessDeniedError, UnexpectedError } from "@/domain/erros";
import { SaveSurveyResult } from "@/domain/usecases";

export class RemoteSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteSaveSurveyResult.Model>
  ) {}

  async save(params: SaveSurveyResult.Params): Promise<SaveSurveyResult.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      body: params,
      method: "put",
    });
    // const remoteSurveyResult = httpResponse.body;
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok:
        return null;
      // return Object.assign({}, remoteSurveyResult, {
      //   date: new Date(remoteSurveyResult.date),
      // });
      case HttpStatusCode.forbidden:
        throw new AccessDeniedError();
      default:
        throw new UnexpectedError();
    }
  }
}

export namespace RemoteSaveSurveyResult {
  export type Model = RemoteSaveSurveyResult;
}
