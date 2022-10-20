import { ApiContext } from '@/presentation/contexts'
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

type PrivateRouteProps = {
  children?: JSX.Element
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }: PrivateRouteProps) => {
  const { getCurrentAccount } = useContext(ApiContext)

  return getCurrentAccount()?.accessToken
    ? <>{children }</>
    : <Navigate to="/login" replace />
}

export default PrivateRoute
