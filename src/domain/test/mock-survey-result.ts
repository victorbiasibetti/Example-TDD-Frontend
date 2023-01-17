import faker from 'faker'
import { LoadSurveyResult } from '../usecases'

export const mockSurveyResultModel = (): LoadSurveyResult.Model => ({
  question: faker.random.words(10),
  date: faker.datatype.datetime(),
  answers: [{
    image: faker.internet.url(),
    answer: faker.random.word(),
    count: faker.datatype.number(),
    percent: faker.datatype.number(),
    isCurrentAccountAnswer: faker.datatype.boolean()
  },{
    answer: faker.random.word(),
    count: faker.datatype.number(),
    percent: faker.datatype.number(),
    isCurrentAccountAnswer: faker.datatype.boolean()
  }]
})

export class LoadSurveyResultSpy implements LoadSurveyResult {
  callsCount = 0
  surveyResult = mockSurveyResultModel()

  async load (): Promise<LoadSurveyResult.Model> {
    this.callsCount++
    return this.surveyResult
  }
}
