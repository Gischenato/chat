import React from 'react'
import IChat from '../../interfaces/IChat'
import { useFetchUser } from '../../hooks/useFetchUser'
import IUser from '../../interfaces/IUser'
import styled from 'styled-components'
import { RegularText } from '../../styles/typography'
import { Link } from 'react-router-dom'

interface ChatListProps {
  chat: IChat
  user: IUser
}

export default function ChatList({chat, user}: ChatListProps) {
  const { data, status } = useFetchUser(chat, user)

  console.log(chat)
  if (status === 'loading') return <p>Loading...</p>
  if (status === 'error') return <p>Error fetching {chat._id}</p>

  return (
    <StyledLink to={`/chat/${data!._id}`}>
      <RegularText>{data!.name}</RegularText>
    </StyledLink>
  )
}

const StyledLink = styled(Link)`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  text-decoration: none;
`
