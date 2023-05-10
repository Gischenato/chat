import { useAuth } from '@contexts/AuthContextProvider'
import { useFetchChat } from '@hooks/useFetchChatMessages'
import { useFetchUser } from '@hooks/useFetchUser'
import { useFindUser } from '@hooks/useFindUser'
import { RegularText, TitleText } from '@styles/typography'
import { useQuery } from '@tanstack/react-query'
import { getMessages } from '@util/api/messages/getMessages'
import { findUser } from '@util/api/users/findUser'
import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Message from './Message'

export default function Chat() {
  const { chatId, userId } = useParams()
  const { user:myUser } = useAuth()
  const { data:otherUser } = useFindUser(userId)

  const messagesQuery = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId),
  })
  
  
  return (
    <Container>
      <TitleText>Chat with </TitleText>
      <RegularText>Chat  id: {chatId}</RegularText>
      <RegularText>My    id: {myUser?._id}</RegularText>
      <RegularText>Other id: {userId}</RegularText>
      {/* <RegularText>Other id: {._id}</RegularText> */}
      <br/>
      <br/>
      <RegularText>Messages:</RegularText>
      { messagesQuery.status === 'loading' && <p>Loading...</p>}
      { messagesQuery.status === 'error' && <p>Error fetching messages</p>}
      { messagesQuery.status === 'success' && messagesQuery.data.map(msg => <Message key={msg._id} message={msg}/>)}
    </Container>
  )
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.3;
`