import { Footer, Header, Icon, IconName } from '@/presentation/components'
import Styles from './survey-list-styles.scss'
import React from 'react'

const SurveyList: React.FC = () => {
  return (
  <div className={Styles.surveyListWrap}>
    <Header />
    <div className={Styles.contentWrap}>
      <h2>Enquetes</h2>
      <ul>
        <li>
          <div className={Styles.surveyContent}>
            <Icon iconName={IconName.thumbUp} className={Styles.iconWrap}/>
            <time>
              <span className={Styles.day}>22</span>
              <span className={Styles.month}>10</span>
              <span className={Styles.year}>2022</span>
            </time>
            <p>Qual é seu framework web favorito?</p>
          </div>
          <footer>Ver Resultado</footer>
        </li>

      </ul>
    </div>
    <Footer />
  </div>
  )
}

export default SurveyList
