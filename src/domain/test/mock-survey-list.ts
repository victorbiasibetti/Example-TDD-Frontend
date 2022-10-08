import faker from 'faker'
import { SurveyModel } from '../models'

export const mockSurveyListModel = (): SurveyModel[] => ([
  {
    id: faker.datatype.uuid(),
    question: faker.random.words(10),
    answers: [{
      image: faker.internet.url(),
      answer: faker.random.words(4)
    },{
      answer: faker.random.words(5)
    }
    ],
    didAnswer: faker.datatype.boolean(),
    date: faker.datatype.datetime()

  }
])
