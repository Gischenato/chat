import React from 'react'
import styled from 'styled-components'

import { useAuth } from '../contexts/AuthContextProvider'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')

  const { signInMutation } = useAuth()

  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    signInMutation.mutate({
      name, password
    },{
      onSuccess: (data) => { 
          navigate('/')
       },
    })
    setName('')
    setPassword('')
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) {
    setter(e.target.value)
  }

  return (
    <Container>
      <h1>Login</h1>  
      <Form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={name} autoComplete='current-username' onChange={(e) => handleTextChange(e, setName)}/>
          <input type="password" placeholder="Password" value={password} autoComplete='current-password' onChange={(e) => handleTextChange(e, setPassword)}/>

          <input type="submit" value="SignIn"/>
      </Form>
    </Container>
  )
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  place-items: center;
  height: 100%;

  font-family: 'Roboto';
  font-size: 2rem;
  font-weight: 400;
  gap: 1rem;

  > h1 {
    color: #4c4b4b;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: .5rem;

  > input {
    padding: .5rem;
    border: 1px solid #cacaca;
    border-radius: 15px;
    font-size: 1rem;
    font-family: 'Quicksand';
    font-weight: 400;
  }
`