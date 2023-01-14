import React from 'react'
import Styles from './calendar-styles.scss'

type Props = {
  date: Date
  className?: string
}

const Calendar: React.FC<Props> = ({ className, date }) => {
  return (
    <div className={[Styles.calendarWrapper, className].join(' ')}>
      <time>
        <span data-testid="day" className={Styles.day}>
          {date.toString().padStart(2, '0')}
        </span>
        <span data-testid="month" className={Styles.month}>
          {date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}
        </span>
        <span data-testid="year" className={Styles.year}>
          {date.getFullYear()}
        </span>
      </time>
    </div>
  )
}

export default Calendar
