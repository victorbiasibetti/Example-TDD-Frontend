import { SaveSurveyResult } from "@/domain/usecases";
import { makeApiUrl } from "@/main/factories/http/api-url-factory";
import { makeAuthorizaHttpClientDecorator } from "@/main/factories/decorators";
import { RemoteSaveSurveyResult } from "@/data/usecases";

export const makeRemoteSaveSurveyResult = (id: string): SaveSurveyResult => {
  return new RemoteSaveSurveyResult(
    makeApiUrl(`/surveys/${id}/results`),
    makeAuthorizaHttpClientDecorator()
  );
};
