import React, { createContext, useContext, useEffect, useState } from 'react'
import { UseMutationResult, useMutation, useQuery } from '@tanstack/react-query'
import { getChat } from '@util/api/chats/getUserChat'
import IUser from '@interfaces/IUser'
import { getAllUsers } from '@util/api/users/getAll'
import IChat from '@interfaces/IChat'
import { postNewChat } from '@util/api/chats/createNewChat'
import IPostNewChat from '@interfaces/IPostNewChat'
import { Id, toast } from 'react-toastify'
import IPostNewChatResponse from '@interfaces/IPostNewChatResponse'
import { postMessage } from '@util/api/messages/postMessage'
import IPostMessageResponse from '@interfaces/IPostMessageResponse'
import IPostMessage from '@interfaces/IPostMessage'
import { Socket, io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom'
import { SOCKET_EVENTS } from '@util/socket/socket_events'

interface ChatContextData {
  userChats: IChat[] | undefined
  isUserChatsLoading: boolean
  userChatsError: boolean
  potentialChats: IUser[] | undefined
  createNewChatMutation: UseMutationResult<IPostNewChatResponse, unknown, IPostNewChat, unknown>
  sendNewMessageMutation: UseMutationResult<IPostMessageResponse, unknown, IPostMessage, unknown>
  sendMessage: (message: string, to: string, chatId: string) => void
  socket: Socket | null
}

interface ChatContextProviderProps {
  children: React.ReactNode
  user: IUser | undefined
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData)

export const useChat = () => useContext(ChatContext)

export default function ChatContextProvider({ children, user }: ChatContextProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    console.log('Connecting to socket.io server')
    const newSocket = io("http://localhost:3000", { 
      query: { id: user!._id },
      auth: { id: user!._id },
    })


    newSocket.on(SOCKET_EVENTS.CONNECT, () => {
      document.title = 'Connected'
      console.log('Connected to socket.io server')
    })

    newSocket.on(SOCKET_EVENTS.DISCONNECT, () => {
      document.title = 'Disconnected'
      console.log('Disconnected from socket.io server')
    })

    setSocket(newSocket)

    return () => {
      console.log('Disconnecting from socket.io server')
      newSocket.disconnect()
      setSocket(null)
    }
  }, [user])

  const chatsQuery = useQuery<IChat[]>({
    queryKey: ['chats', user?._id],
    enabled: user !== undefined && user !== null,
    queryFn: async () => {
      const response = await getChat(user!._id)
      response.sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1)
      return response
    },
  })

  const allUsersQuery = useQuery<IUser[]>({
    queryFn: getAllUsers,
    queryKey: ['allUsers', user?._id],
    enabled: chatsQuery.data !== undefined && chatsQuery.data !== null,
    onSuccess: (data) => {
      const potentialChats = data.filter((u) => {
        if (u._id === user?._id) return false
        return true
      })
      setPotentialChats(potentialChats)
    },
    refetchOnWindowFocus: false,
  })

  const createNewChatMutation = useMutation<IPostNewChatResponse, any, IPostNewChat, {id:Id}>({
    mutationFn: postNewChat,
    onSuccess: (data, variables) => {
      console.log('0k')
      // chatsQuery.data?.push(data) / if we want to add the new chat to the list without refetching
      chatsQuery.refetch() // refetching to get the new chat
    },
    onError: (error, variables, context) => {
      console.warn(error)
    },
    onMutate: (variables) => {
      const id = toast.loading('Creating new chat...')
      return {id}
    },
    onSettled(data, error, variables, context) {
      const id = context?.id
      if (id) toast.dismiss(id)
      if (error) {
        toast.error('Error creating new chat')
      } else {
        toast.success('New chat created')
      }
    }  
  })

  const sendNewMessageMutation = useMutation({
    mutationFn: postMessage,
    onSuccess: (data, variables) => {
      console.log('Message sent successfully')
    },
    onError: (error, variables, context) => {
      console.log('Error sending message');
    }
  })

  const sendMessage = (message: string, to: string, chatId:string) => {
    if (!socket || !user) return
    const msg = {
      text: message,
      sender: user._id,
      receiver: to,
      chatId
    }
    socket.emit(SOCKET_EVENTS.PRIVATE_MESSAGE, msg)
  }


  const [potentialChats, setPotentialChats] = useState<Array<any>>([])

  return (
    <ChatContext.Provider value={{
      userChats: chatsQuery.data,
      isUserChatsLoading: chatsQuery.isLoading,
      userChatsError: chatsQuery.isError,
      potentialChats,
      createNewChatMutation,
      sendNewMessageMutation,
      sendMessage,
      socket
    }}>
      {children}
    </ChatContext.Provider>
  )
}
