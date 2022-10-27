import Styles from './survey-list-styles.scss'
import { Footer, Header } from '@/presentation/components'
import { SurveyContext,List, Error } from '@/presentation/pages/survey-list/components'
import { LoadSurveyList } from '@/domain/usecases'
import React, { useContext, useEffect, useState } from 'react'
import { AccessDeniedError } from '@/domain/erros'
import { ApiContext } from '@/presentation/contexts'
import { useNavigate } from 'react-router-dom'

type Props = {
  loadSurveyList: LoadSurveyList
}

const SurveyList: React.FC<Props> = ({ loadSurveyList }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)
  const navigate = useNavigate()

  const [state, setState] = useState({
    surveys: [] as LoadSurveyList.Model[],
    error: '',
    reload: false
  })

  useEffect(() => {
    loadSurveyList.loadAll()
      .then(surveys => setState({ ...state, surveys }))
      .catch(error => {
        console.log(error)
        if (error instanceof AccessDeniedError) {
          setCurrentAccount(undefined)
          navigate('/login', { replace: true })
        } else {
          setState({ ...state, error: error.message })
        }
      })
  }, [state.reload])

  return (
  <div className={Styles.surveyListWrap}>
    <Header />
    <div className={Styles.contentWrap}>
      <SurveyContext.Provider value={{ state, setState }}>
        <h2>Enquetes</h2>
        { state.error ? <Error /> : <List /> }
      </SurveyContext.Provider>
    </div>
    <Footer />
  </div>
  )
}

export default SurveyList
