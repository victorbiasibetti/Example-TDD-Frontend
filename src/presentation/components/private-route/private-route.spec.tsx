import React from 'react'

import { render } from '@testing-library/react'

import PrivateRoute from './private-route'
import { MemoryHistory, createMemoryHistory } from 'history'
import { Route, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'

type SutTypes = {
  history: MemoryHistory
}

const makeSut = (): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  render(
    <HistoryRouter history={history}>
    <Routes>
      <Route index element={<PrivateRoute />} />
    </Routes>
    </HistoryRouter>
  )
  return { history }
}

describe('PrivateRoute', () => {
  test('Should redirect to /login if token is empty', () => {
    const { history } = makeSut()
    expect(history.location.pathname).toBe('/login')
  })
})
