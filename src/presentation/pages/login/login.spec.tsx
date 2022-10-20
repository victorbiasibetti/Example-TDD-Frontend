import React from 'react'
import faker from 'faker'
import {
  render,
  fireEvent,
  waitFor,
  screen
} from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy, Helper } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/erros'
import { ApiContext } from '@/presentation/contexts'
import { AccountModel } from '@/domain/models'

type SutTypes = {
  authenticationSpy: AuthenticationSpy
  setCurrentAccountMock: (account: AccountModel) => void
}
type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const authenticationSpy = new AuthenticationSpy()
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Login
      validation={validationStub}
      authentication={authenticationSpy}
      />
    </ApiContext.Provider>
  )
  return { authenticationSpy, setCurrentAccountMock }
}

const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate
}))

const simulateValidSubmit = (
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  Helper.populateField('email', email)
  Helper.populateField('password', password)
  const submitButton = screen.getByTestId('submit')
  fireEvent.click(submitButton)
}

describe('Login Component', () => {
  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    makeSut({
      validationError
    })
    Helper.testChildCount('error-wrap', 0)

    Helper.testButtonIsDisabled('submit', true)

    Helper.testStatusForField('email', validationError)
    Helper.testStatusForField('password', validationError)
  })

  test('Should show email error if validation fails', () => {
    const validationError = faker.random.words()
    makeSut({
      validationError
    })
    Helper.populateField('email')
    Helper.testStatusForField('email', validationError)
  })

  test('Should show password error if validation fails', () => {
    const validationError = faker.random.words()
    makeSut({
      validationError
    })
    Helper.populateField('password')
    Helper.testStatusForField('password', validationError)
  })

  test('Should show valid password state if Validation success', () => {
    makeSut()
    Helper.populateField('password')
    Helper.testStatusForField('password')
  })

  test('Should show valid email state if Validation success', () => {
    makeSut()
    Helper.populateField('email')
    Helper.testStatusForField('email')
  })

  test('Should enable submit button if form is valid', () => {
    makeSut()
    Helper.populateField('email')
    Helper.populateField('password')
    Helper.testButtonIsDisabled('submit', false)
  })

  test('Should show spinner on submit', () => {
    makeSut()
    simulateValidSubmit()

    Helper.testElementExists('spinner')
  })

  test('Should call Authentication with correct values', () => {
    const { authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call Authentication only once', () => {
    const { authenticationSpy } = makeSut()
    simulateValidSubmit()
    simulateValidSubmit()

    expect(authenticationSpy.callCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { authenticationSpy } = makeSut({
      validationError
    })
    Helper.populateField('email')

    fireEvent.submit(screen.getByTestId('form'))
    expect(authenticationSpy.callCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest
      .spyOn(authenticationSpy, 'auth')
      .mockRejectedValueOnce(error)
    simulateValidSubmit()

    await waitFor(() => {
      Helper.testElementText('main-error', error.message)
    })

    Helper.testChildCount('error-wrap', 1)
  })

  test('Should call UpdateCurrentAccount on success', async () => {
    const { authenticationSpy, setCurrentAccountMock } = makeSut()
    simulateValidSubmit()
    await waitFor(() => {
      screen.getByTestId('form')
      expect(setCurrentAccountMock).toHaveBeenCalledWith(authenticationSpy.account)
      expect(mockUseNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  test('Should go to signup page', async () => {
    makeSut()
    const register = screen.getByTestId('signup-link')
    fireEvent.click(register)
    expect(mockUseNavigate).toHaveBeenCalledWith('/signup')
  })
})
