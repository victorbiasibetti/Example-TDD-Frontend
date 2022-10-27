import { AccountModel } from '@/domain/models'
import { Header } from '@/presentation/components'
import { ApiContext } from '@/presentation/contexts'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate
}))

type SutTypes = {
  setCurrectAccountMock: (account: AccountModel) => void
}

const makeSut = (): SutTypes => {
  const setCurrectAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrectAccountMock }}>
      <Header />
    </ApiContext.Provider>
  )
  return { setCurrectAccountMock }
}

describe('Header Component', () => {
  test('Should call setCurrentAccount with null', () => {
    const { setCurrectAccountMock } = makeSut()
    fireEvent.click(screen.getByTestId('logout'))
    expect(setCurrectAccountMock).toHaveBeenCalledWith(undefined)
    expect(mockUseNavigate).toHaveBeenCalledWith('/login', { replace: true })
  })
})
