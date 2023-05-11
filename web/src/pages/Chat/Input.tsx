import React from 'react'
import styled from 'styled-components'
import { PaperPlaneRight } from 'phosphor-react' 

interface InputProps {
  onSubmit: (text: string) => void
}

export default function Input({ onSubmit }: InputProps) {
  const [message, setMessage] = React.useState('')
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(message)
    setMessage('')
  }

  return (
    <InputContainer onSubmit={handleSubmit}>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type='submit'><div><PaperPlaneRight size={30}/></div></button>
    </InputContainer>
  )
}

const InputContainer = styled.form`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 3rem;
  align-items: center;
  >input {
    box-sizing: border-box;
    flex: 1;
    height: 100%;
    background-color: ${({theme}) => theme.colors.background};
    border: none;
    border-radius: 100rem 0 0 100rem;
    padding: 10px;

    font-size: medium;
    font-family: 'Quicksand', sans-serif;
    color: ${({theme}) => theme.colors['base-text']};
    font-weight: bold;

    :focus {
      outline: none;
    }
  }
  >button {
    height: 100%;
    background-color: ${({theme}) => theme.colors.background};
    border: none;
    border-radius: 0 100rem 100rem 0;
    cursor: pointer;
    position: relative;
    padding: 0;
    flex: .04;
    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      transition: 250ms ease-in-out;
      :hover {
        background-color: ${({theme}) => theme.colors['base-hover']};
        border-radius: 100rem;
      }
    }
  }
`