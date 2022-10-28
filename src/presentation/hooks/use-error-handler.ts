import { AccessDeniedError } from '@/domain/erros'
import { useLogout } from '@/presentation/hooks'

type CallbackType = (error: Error) => void

type ResultType = CallbackType

export const useErrorHandler = (callback: CallbackType): ResultType => {
  const logout = useLogout()

  return (error: Error): void => {
    if (error instanceof AccessDeniedError) {
      logout()
    } else {
      callback(error)
    }
  }
}
