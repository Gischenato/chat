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
import Input from './Input'

export default function Chat() {
  const { chatId, userId } = useParams()
  const { user:myUser } = useAuth()
  const { data:otherUser } = useFindUser(userId)

  const messagesQuery = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId),
  })

  const sendMessage = (text: string) => {
    console.log('sending message', text)
  }
  
  
  return (
    <Container>
      <TitleText>Chat with {otherUser?.name}</TitleText>
      <ChatContainer>
        <MessagesContainer>
        { messagesQuery.status === 'loading' && <p>Loading...</p>}
        { messagesQuery.status === 'error' && <p>Error fetching messages</p>}
        { messagesQuery.status === 'success' && messagesQuery.data.map(msg => 
            <Message key={msg._id} message={msg} isMine={msg.senderId===myUser?._id}/>
        )}
        </MessagesContainer>
        <div id='inp'>
          <Input onSubmit={sendMessage}/>
        </div>
      </ChatContainer>
    </Container>
  )
}


const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  line-height: 1.3;
  position: relative;

  background-color: violet;
  padding: 2rem;
  overflow: hidden;
  box-sizing: border-box;

  max-height: 100%;

  overflow-y: auto;
  
  `

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  position: relative;
  padding: 1rem;
  height: 100%;
  overflow: hidden;
  justify-content: flex-end;
  
  #inp {
    margin-top: 8px;
  }
  `

const MessagesContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;

  height: 100%;

  gap: 8px;

  ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #a3a3a3;
    border-radius: 8px;
  }
`
