import React from 'react'

import { render } from '@testing-library/react'

import PrivateRoute from './private-route'
import { MemoryHistory, createMemoryHistory } from 'history'
import { Route, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { mockAccountModel } from '@/domain/test'

type SutTypes = {
  history: MemoryHistory
}

const makeSut = (account = mockAccountModel()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  render(
    <ApiContext.Provider value={{ getCurrentAccount: () => account }}>
      <HistoryRouter history={history}>
        <Routes>
          <Route index element={<PrivateRoute />} />
        </Routes>
      </HistoryRouter>
    </ApiContext.Provider>
  )
  return { history }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSut(null)
    expect(history.location.pathname).toBe('/login')
  })
  test('Should render current component if token is not empty', () => {
    const { history } = makeSut()
    expect(history.location.pathname).toBe('/')
  })
})
