import Input from './input'
import Context from '@/presentation/contexts/form/form-context'

import { render, fireEvent, screen } from '@testing-library/react'
import React from 'react'
import faker from 'faker'

const makeSut = (fieldName: string): void => {
  render(
    <Context.Provider value={{ state: {} }}>
        <Input name={fieldName} />
    </Context.Provider>
  )
}

describe('Input Component', () => {
  test('Should focus input on label click', () => {
    const field = faker.database.column()
    makeSut(field)
    const input = screen.getByTestId(field)
    const label = screen.getByTestId(`${field}-label`)

    fireEvent.click(label)

    expect(document.activeElement).toBe(input)
  })
})
