import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ApiContext } from '@/presentation/contexts'
import {
  makeLogin as MakeLogin,
  makeSignUp as MakeSignUp,
  makeSurveyList as MakeSurveyList
} from '@/main/factories/pages'
import { getCurrentAccountAdapter, setCurrentAccountAdapter } from '@/main/adapters/currentAccountAdapter'
import { PrivateRoute } from '@/presentation/components'
import { SurveyResult } from '@/presentation/pages'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
    value={{
      setCurrentAccount: setCurrentAccountAdapter,
      getCurrentAccount: getCurrentAccountAdapter
    }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<MakeLogin />} />
          <Route path="/signup" element={<MakeSignUp />} />
          <Route path="/" element={
            <PrivateRoute>
              <MakeSurveyList />
            </PrivateRoute>}>
          </Route>
          <Route path="/surveys" element={
            <PrivateRoute>
              <SurveyResult />
            </PrivateRoute>}>
          </Route>
        </Routes>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}
export default Router
