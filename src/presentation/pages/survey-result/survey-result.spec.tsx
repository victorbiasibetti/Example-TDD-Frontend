import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { SurveyResult } from '@/presentation/pages'
import { ApiContext } from '@/presentation/contexts'
import { LoadSurveyResultSpy, mockAccountModel } from '@/domain/test'

const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate
}))

type SutTypes = {
  loadSurveyResultSpy: LoadSurveyResultSpy
}

const makeSut = (): SutTypes => {
  const loadSurveyResultSpy = new LoadSurveyResultSpy()
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel() }}>
      <SurveyResult loadSurveyResult={loadSurveyResultSpy}/>
    </ApiContext.Provider>
  )
  return {
    loadSurveyResultSpy
  }
}
describe('SurveyResult Component', () => {
  test('Should present correct inital state', async () => {
    makeSut()
    const surveyResult = screen.getByTestId('survey-result')
    expect(surveyResult.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
    await waitFor(() => surveyResult)
  })
  test('Should call LoadSurveyResult', async () => {
    const { loadSurveyResultSpy } = makeSut()
    await waitFor(() => {
      screen.getByTestId('survey-result')
      expect(loadSurveyResultSpy.callsCount).toBe(1)
    })
  })
})
