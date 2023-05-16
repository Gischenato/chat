import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '@contexts/AuthContextProvider'
import { useFindUser } from '@hooks/useFindUser'
import { RegularText, TitleText } from '@styles/typography'
import { getMessages } from '@util/api/messages/getMessages'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Message from './Message'
import Input from './Input'
import { useChat } from '@contexts/ChatContextProvider'
import IMessage from '@interfaces/IMessage'
import { SOCKET_EVENTS } from '@util/socket/socket_events'

export default function Chat() {
  const { chatId, userId } = useParams()
  const { user:myUser } = useAuth()
  const { data:otherUser } = useFindUser(userId)

  const { sendMessage:sendMessageSocket, 
    socket, messages, setMessages, shouldFetchChat, updateFetchedChats,
    updateMessages
  } = useChat()

  const refScroll = useRef<HTMLDivElement>(null)

  const fetchMessagesPage = async (page: number) => {
    if (!chatId) return
    try {
      const data = await getMessages(chatId, page)
      // updateFetchedChats(chatId)
      console.log("dasdasasddskodsko")
      updateMessages(chatId, data, "old")
    } catch(err: any) {
      return
    }
  }

  const createNewChat = () => {
    setMessages(old => {
      if (!chatId || old[chatId] !== undefined) return old
      console.log('creating new chat')
      return {...old, [chatId]: []}
    })
  }
  
  useEffect(() => {
    if (!chatId) return
    createNewChat()
    const page = shouldFetchChat(chatId)
    if (page === 1) fetchMessagesPage(page)
  }, [chatId])



   
  useEffect(() => {
    if (!socket) return
    socket.on(SOCKET_EVENTS.PRIVATE_MESSAGE, (data: IMessage) => {
      console.log('received message', data)
      updateMessages(data.chatId, [data])
    })
    return () => {
      socket.off(SOCKET_EVENTS.PRIVATE_MESSAGE)
    }
  }, [socket])
  
  const sendMessage = (text: string) => {
    if (text === '') return
    // console.log('sending message', text)
    if (!myUser || !chatId) return
    sendMessageSocket(text, otherUser!._id, chatId)
    refScroll.current?.scrollIntoView({ behavior: 'smooth' })

  }

  const currentMessages = chatId ? messages[chatId] ? messages[chatId] : [] : []

  return (
    <Container>
      <TitleText>Chat with {otherUser?.name}</TitleText>
      <button onClick={() => {fetchMessagesPage(shouldFetchChat(chatId!))}}>More</button>
      <ChatContainer>
        <MessagesContainer ref={refScroll}>
        { currentMessages.length > 0 && currentMessages!.map(msg => 
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
