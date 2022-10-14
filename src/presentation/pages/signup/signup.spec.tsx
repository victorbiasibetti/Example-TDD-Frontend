import { cleanup, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import React from 'react'
import faker from 'faker'
import SignUp from './signup'
import { Helper, ValidationStub, AddAccountSpy, UpdateCurrentAccountMock } from '@/presentation/test'
import { EmailInUseError } from '@/domain/erros'

type SutTypes = {
  sut: RenderResult
  addAccountSpy: AddAccountSpy
  updateCurrentAccountMock: UpdateCurrentAccountMock
}

type SutParams = {
  validationError: string
}
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const addAccountSpy = new AddAccountSpy()
  const updateCurrentAccountMock = new UpdateCurrentAccountMock()
  const sut = render(
    <SignUp
    validation={validationStub}
    addAccount={addAccountSpy}
    updateCurrentAccount={updateCurrentAccountMock}
    />)
  return { sut, addAccountSpy, updateCurrentAccountMock }
}

const simulateValidSubmit = (
  sut: RenderResult,
  name = faker.name.findName(),
  email = faker.internet.email(),
  password = faker.internet.password()
): void => {
  Helper.populateField(sut, 'name', name)
  Helper.populateField(sut, 'email', email)
  Helper.populateField(sut, 'password', password)
  Helper.populateField(sut, 'passwordConfirmation', password)
  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}

const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate
}))

describe('Login Component', () => {
  afterEach(cleanup)

  test('Should start with initial state', () => {
    const validationError = faker.random.word()
    const { sut } = makeSut({ validationError })
    Helper.testChildCount(sut, 'error-wrap',0)
    Helper.testButtonIsDisabled(sut, 'submit', true)
    Helper.testStatusForField(sut, 'name', validationError)
    Helper.testStatusForField(sut, 'email', validationError)
    Helper.testStatusForField(sut, 'password', validationError)
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })

  test('Should show name error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name', validationError)
  })

  test('Should show email error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email', validationError)
  })

  test('Should show password error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password', validationError)
  })

  test('Should show passwordConfirmation error if validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut, 'passwordConfirmation', validationError)
  })

  test('Should show valid name state if Validation success', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name')
    Helper.testStatusForField(sut, 'name')
  })

  test('Should show valid email state if Validation success', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'email')
    Helper.testStatusForField(sut, 'email')
  })

  test('Should show valid password state if Validation success', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'password')
    Helper.testStatusForField(sut, 'password')
  })

  test('Should show valid passwordConfirmation state if Validation success', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testStatusForField(sut, 'passwordConfirmation')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()
    Helper.populateField(sut, 'name')
    Helper.populateField(sut, 'email')
    Helper.populateField(sut, 'password')
    Helper.populateField(sut, 'passwordConfirmation')
    Helper.testButtonIsDisabled(sut, 'submit', false)
  })

  test('Should show spinner on submit', () => {
    const { sut } = makeSut()
    simulateValidSubmit(sut)
    Helper.testElementExists(sut, 'spinner')
  })

  test('Should call AddAccount with correct values', () => {
    const { sut, addAccountSpy } = makeSut()
    const name = faker.name.findName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(sut, name, email, password)

    expect(addAccountSpy.params).toEqual({
      name,
      email,
      password,
      passwordConfirmation: password
    })
  })

  test('Should call AddAccount only once', () => {
    const { sut, addAccountSpy } = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)

    expect(addAccountSpy.callsCount).toBe(1)
  })

  test('Should not call AddAccount if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, addAccountSpy } = makeSut({
      validationError
    })
    Helper.populateField(sut, 'email')

    fireEvent.submit(sut.getByTestId('form'))
    expect(addAccountSpy.callsCount).toBe(0)
  })

  test('Should present error if AddAccount fails', async () => {
    const { sut, addAccountSpy } = makeSut()
    const error = new EmailInUseError()
    jest
      .spyOn(addAccountSpy, 'add')
      .mockRejectedValueOnce(error)
    simulateValidSubmit(sut)
    await waitFor(() => {
      Helper.testElementText(sut, 'main-error', error.message)
    })
    Helper.testChildCount(sut,'error-wrap', 1)
  })

  test('Should call UpdateCurrentAccount on success', async () => {
    const { sut, addAccountSpy, updateCurrentAccountMock } = makeSut()
    simulateValidSubmit(sut)
    await waitFor(() => {
      sut.getByTestId('form')
      expect(updateCurrentAccountMock.account).toEqual(addAccountSpy.account)
      expect(mockUseNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  test('Should present error if UpdateCurrentAccount fails', async () => {
    const { sut, updateCurrentAccountMock } = makeSut()
    const error = new EmailInUseError()
    jest
      .spyOn(updateCurrentAccountMock, 'save')
      .mockRejectedValueOnce(error)
    simulateValidSubmit(sut)

    await waitFor(() => {
      Helper.testElementText(sut, 'main-error', error.message)
    })

    Helper.testChildCount(sut,'error-wrap', 1)
  })

  test('Should go to login page', async () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('login-link')
    fireEvent.click(register)
    expect(mockUseNavigate).toHaveBeenCalledWith('/login')
  })
})
