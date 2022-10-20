/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from './login-styles.scss'
import {
  LoginHeader,
  Footer,
  Input,
  FormStatus,
  SubmitButton
} from '@/presentation/components'
import { FormContext, ApiContext } from '@/presentation/contexts'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)
  const [state, setState] = useState({
    isLoading: false,
    isFormIsInvalid: true,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })

  const navigate = useNavigate()

  useEffect(() => {
    const { email, password } = state
    const formData = { email, password }
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)
    setState({
      ...state,
      emailError ,
      passwordError,
      isFormIsInvalid: !!emailError || !!passwordError
    })
  }, [state.email, state.password])

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || state.isFormIsInvalid) return
      setState({ ...state, isLoading: true })
      // const account = await authentication.auth({
      //   email: state.email,
      //   password: state.password
      // })
      // await setCurrentAccount(account)
      await setCurrentAccount({ accessToken: 'accessToken', name: 'Victor' })
      navigate('/', { replace: true })
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        mainError: error.message
      })
    }
  }

  return (
    <div className={Styles.loginWrap}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form
          data-testid="form"
          className={Styles.form}
          onSubmit={handleSubmit}
        >
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />

          <SubmitButton text='Entrar' />

          <span
            data-testid="signup-link"
            className={Styles.link}
            onClick={() => navigate('/signup')}
          >
            Criar conta
          </span>
          <FormStatus />
        </form>
      </FormContext.Provider>

      <Footer />
    </div>
  )
}

export default Login
