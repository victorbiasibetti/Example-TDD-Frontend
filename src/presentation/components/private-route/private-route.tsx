import { ApiContext } from '@/presentation/contexts'
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

const PrivateRoute: React.FC = ({ children }: { children: any }) => {
  const { getCurrentAccount } = useContext(ApiContext)

  return getCurrentAccount()?.accessToken
    ? children
    : <Navigate to="/login" replace />
}

export default PrivateRoute
