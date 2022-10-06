/* eslint-disable react/prop-types */
import React, { useContext, useRef } from 'react'
import Styles from './input-styles.scss'
import Context from '@/presentation/contexts/form/form-context'

type Props = React.DetailedHTMLProps<
React.InputHTMLAttributes<HTMLInputElement>,
HTMLInputElement
>

const Input: React.FC<Props> = (props: Props) => {
  const { state, setState } = useContext(Context)
  const inputRef = useRef<HTMLInputElement>()
  const error = state[`${props?.name}Error`]

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState({ ...state, [event.target.name]: event.target.value })
  }
  return (
    <div
      data-testid={`${props?.name}-wrap`}
      className={Styles.inputWrap}
      data-status={error ? 'invalid' : 'valid'}
    >
      <input {...props}
        placeholder=" "
        title={error}
        data-testid={props?.name}
        onChange={handleChange}
        ref={inputRef}
        />
      <label
        data-testid={`${props?.name}-label`}
        onClick={() => inputRef.current.focus()}
        title={error}
      >
        {props?.placeholder}
      </label>
    </div>
  )
}

export default Input
