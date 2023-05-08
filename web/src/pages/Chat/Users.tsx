import React from 'react'
import IUser from '../../interfaces/IUser'
import { RegularText } from '../../styles/typography'
import styled from 'styled-components'

interface UserProps {
  user: IUser
}

export default function Users({ user }: UserProps) {
  return (
    <Container onClick={() => {console.log(user.name)}}>
      <RegularText size='m'>{user.name}</RegularText>
    </Container>
  )
}


const Container = styled.button`
  display: flex;
  overflow: visible;

  border-radius: 8px;
  border-width: 1px;
  border-style: dashed;
  padding: 1rem;

  > p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`