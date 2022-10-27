import React, { memo, useContext } from 'react'
import { Logo } from '@/presentation/components'
import Styles from './header-styles.scss'
import { ApiContext } from '@/presentation/contexts'
import { useNavigate } from 'react-router-dom'

const Header: React.FC = () => {
  const { setCurrentAccount } = useContext(ApiContext)
  const navigate = useNavigate()
  const logout = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    event.preventDefault()
    setCurrentAccount(undefined)
    navigate('/login', { replace: true })
  }
  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span>Victor</span>
          <a data-testid='logout' href="#" onClick={logout}>Logout</a>
        </div>
      </div>
    </header>
  )
}
export default memo(Header)
