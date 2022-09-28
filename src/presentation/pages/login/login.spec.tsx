/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import faker from 'faker'
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  RenderResult
} from '@testing-library/react'
import Login from './login'
import { ValidationStub, AuthenticationSpy, SaveAccessTokenMock } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/erros'

type SutTypes = {
  sut: RenderResult
  authenticationSpy: AuthenticationSpy
  saveAccessTokenMock: SaveAccessTokenMock
}
type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError
  const saveAccessTokenMock = new SaveAccessTokenMock()
  const sut = render(
    <BrowserRouter>
      <Login
      validation={validationStub}
      authentication={authenticationSpy}
      saveAccessToken={saveAccessTokenMock}/>
    </BrowserRouter>
  )
  return { sut, authenticationSpy, saveAccessTokenMock }
}

const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate
}))

const simulateValidSubmit = (
  sut: RenderResult,
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}

const populateEmailField = (
  sut: RenderResult,
  email = faker.internet.email()
): void => {
  const emailInput = sut.getByTestId('email')

  fireEvent.input(emailInput, {
    target: { value: email }
  })
}
const populatePasswordField = (
  sut: RenderResult,
  password = faker.internet.password()
): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, {
    target: { value: password }
  })
}

const testStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const emailStatus = sut.getByTestId(`${fieldName}-status`)
  expect(emailStatus.title).toBe(validationError || 'ok')
  expect(emailStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const element = sut.getByTestId(fieldName)
  expect(element).toBeTruthy()
}

const testElementText = (
  sut: RenderResult,
  fieldName: string,
  text: string
): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.textContent).toEqual(text)
}

const testButtonIsDisabled = (
  sut: RenderResult,
  fieldName: string,
  isDisabled: boolean
): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError
    })
    testErrorWrapChildCount(sut, 0)

    testButtonIsDisabled(sut, 'submit', true)

    testStatusForField(sut, 'email', validationError)
    testStatusForField(sut, 'password', validationError)
  })

  test('Should show email error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError
    })
    populateEmailField(sut)
    testStatusForField(sut, 'email', validationError)
  })

  test('Should show password error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({
      validationError
    })
    populatePasswordField(sut)
    testStatusForField(sut, 'password', validationError)
  })

  test('Should show valid password state if Validation success', () => {
    const { sut } = makeSut()
    populatePasswordField(sut)
    testStatusForField(sut, 'password')
  })

  test('Should show valid email state if Validation success', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    testStatusForField(sut, 'email')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    populateEmailField(sut)
    populatePasswordField(sut)
    testButtonIsDisabled(sut, 'submit', false)
  })

  test('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)

    testElementExists(sut, 'spinner')
  })

  test('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)

    expect(authenticationSpy.callCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({
      validationError
    })
    populateEmailField(sut)

    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.callCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest
      .spyOn(authenticationSpy, 'auth')
      .mockResolvedValueOnce(Promise.reject(error))
    simulateValidSubmit(sut)

    await waitFor(() => {
      testElementText(sut, 'main-error', error.message)
    })

    testErrorWrapChildCount(sut, 1)
  })

  test('Should call SaveAccessToken on success', async () => {
    const { sut, authenticationSpy, saveAccessTokenMock } = makeSut()
    simulateValidSubmit(sut)
    await waitFor(() => {
      sut.getByTestId('form')
      expect(saveAccessTokenMock.accessToken).toBe(authenticationSpy.account.accessToken)
      expect(mockUseNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  test('Should go to signup page', async () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup')
    fireEvent.click(register)
    expect(mockUseNavigate).toHaveBeenCalledWith('/signup')
  })
})
