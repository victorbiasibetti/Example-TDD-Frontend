export type RemoteSurveyResultModel = {
  question: string;
  date: string;
  answers: Array<RemoteSurveyResultAnswerModel>;
};

export type RemoteSurveyResultAnswerModel = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
  isCurrentAccountAnswer: boolean;
};
