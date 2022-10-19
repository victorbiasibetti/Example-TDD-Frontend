/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Styles from './signup-styles.scss'
import {
  LoginHeader,
  Footer,
  Input,
  FormStatus,
  SubmitButton
} from '@/presentation/components'
import { Validation } from '@/presentation/protocols/validation'
import { AddAccount } from '@/domain/usecases'
import { ApiContext, FormContext } from '@/presentation/contexts'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)
  const [state, setState] = useState({
    isLoading: false,
    isFormIsInvalid: true,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: '',
    mainError: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const { email, name, password, passwordConfirmation } = state
    const formData = { email, name, password, passwordConfirmation }
    const nameError = validation.validate('name', formData)
    const emailError = validation.validate('email', formData)
    const passwordError = validation.validate('password', formData)
    const passwordConfirmationError = validation.validate('passwordConfirmation', formData)
    setState({
      ...state,
      nameError,
      emailError,
      passwordError,
      passwordConfirmationError,
      isFormIsInvalid: !!nameError || !!emailError || !!passwordError || !!passwordConfirmationError
    })
  }, [state.name, state.email, state.password, state.passwordConfirmation])

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || state.isFormIsInvalid) return
      setState({ ...state, isLoading: true })
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation
      })
      setCurrentAccount(account)
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
    <div className={Styles.signupWrap}>
      <LoginHeader />
      <FormContext.Provider value={{ state, setState }}>
        <form
          className={Styles.form}
            data-testid="form"
            onSubmit={handleSubmit}
          >
          <h2>Cadastro</h2>
          <Input type="text" name="name" placeholder="Digite seu nome" />
          <Input type="email" name="email" placeholder="Digite seu e-mail" />

          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <Input
            type="password"
            name="passwordConfirmation"
            placeholder="Repita sua senha"
          />

          <SubmitButton text='Criar Conta' />

          <span
            data-testid="login-link"
            className={Styles.link}
            onClick={() => navigate('/login')}
          >
            Voltar para Login
          </span>
          <FormStatus />
        </form>
      </FormContext.Provider>

      <Footer />
    </div>
  )
}

export default SignUp
