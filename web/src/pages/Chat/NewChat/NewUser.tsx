import React from 'react'
import IUser from '../../../interfaces/IUser'
import styled from 'styled-components'
import { RegularText } from '../../../styles/typography'
import { Link } from 'react-router-dom'

interface NewUserProps {
  user: IUser
  createNewChat: (user: IUser) => void
}

export default function NewUser({user, createNewChat}: NewUserProps) {
  const handleCreateNewChat = () => {
    createNewChat(user)
  }

  return (
    <StyledButton onClick={handleCreateNewChat}>
      <RegularText color='base-text'>{user.name}</RegularText>
    </StyledButton>
  )
}

const StyledButton = styled.button`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  text-decoration: none;
  padding: 8px;
  background-color: #dedede;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`
