import React, { useEffect, useRef } from 'react'
import { useAuth } from '@contexts/AuthContextProvider'
import { useFindUser } from '@hooks/useFindUser'
import { RegularText, TitleText } from '@styles/typography'
import { useQuery } from '@tanstack/react-query'
import { getMessages } from '@util/api/messages/getMessages'
import { findUser } from '@util/api/users/findUser'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Message from './Message'
import Input from './Input'
import { useChat } from '@contexts/ChatContextProvider'
import { toast } from 'react-toastify'
import IMessage from '@interfaces/IMessage'
import { SOCKET_EVENTS } from '@util/socket/socket_events'

export default function Chat() {
  const { chatId, userId } = useParams()
  const { user:myUser } = useAuth()
  const { data:otherUser } = useFindUser(userId)

  const { sendNewMessageMutation, sendMessage:sendMessageSocket, socket } = useChat()

  const [page, setPage] = React.useState(1)
  const [messages, setMessages] = React.useState<IMessage[]>([])

  const refScroll = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setMessages([])
  }, [chatId])

  const messagesQuery = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId, page),
    onSuccess: (data) => {
      if (data.length === 0) return
      // setMessages([...messages, ...data])
      setMessages(data)
      setPage(page+1)
    },
    refetchOnWindowFocus: false,
    
  })
   
  useEffect(() => {
    if (!socket) return
    socket.on(SOCKET_EVENTS.PRIVATE_MESSAGE, (data: any) => {
      console.log('received message', data)
      setMessages((prev) => [data, ...prev])
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
    
    // sendNewMessageMutation.mutate({ chatId, text, senderId: myUser._id },{
    //   onSuccess: () => {
    //     messagesQuery.refetch()
    //   },
    //   onError: (err) => {
    //     toast.error('Error sending message')
    //   }
    // })
  }
  
  return (
    <Container>
      <TitleText>Chat with {otherUser?.name}</TitleText>
      {/* <button onClick={() => {messagesQuery.refetch}}>More {page}</button> */}
      <ChatContainer>
        <MessagesContainer ref={refScroll}>
        { messagesQuery.status === 'loading' && <p>Loading...</p>}
        { messagesQuery.status === 'error' && <p>Error fetching messages</p>}
        { messagesQuery.status === 'success' && messages!.map(msg => 
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
