export type SurveyResultModel = {
  question: string;
  date: Date;
  answers: Array<SurveyResultAnswerModel>;
};

export type SurveyResultAnswerModel = {
  image?: string;
  answer: string;
  count: number;
  percent: number;
  isCurrentAccountAnswer: boolean;
};
