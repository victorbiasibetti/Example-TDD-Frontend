import { RemoteLoadSurveyList } from "@/data/usecases/load-survey-list/remote-load-survey-list";
import { LoadSurveyList } from "@/domain/usecases";
import { makeApiUrl } from "@/main/factories/http/api-url-factory";
import { makeAuthorizaHttpClientDecorator } from "@/main/factories/decorators";

export const makeRemoteLoadSurveyList = (): LoadSurveyList => {
  return new RemoteLoadSurveyList(
    makeApiUrl("/surveys"),
    makeAuthorizaHttpClientDecorator()
  );
};
