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
import { v4 as uuidv4 } from 'uuid'
import IMessage from '@interfaces/IMessage'

type ISendMessage = {
  message: IMessage
  receiver: string
}

interface ChatContextData {
  userChats: IChat[] | undefined
  isUserChatsLoading: boolean
  userChatsError: boolean
  potentialChats: IUser[] | undefined
  createNewChatMutation: UseMutationResult<IPostNewChatResponse, unknown, IPostNewChat, unknown>
  sendNewMessageMutation: UseMutationResult<IPostMessageResponse, unknown, IPostMessage, unknown>
  // sendMessage: () => void
  sendMessage: (obj: ISendMessage) => void
  socket: Socket | null
  messages: MessageTest
  setMessages: React.Dispatch<React.SetStateAction<MessageTest>>
  updateFetchedChats: (chatId: string, current: number) => void
  shouldFetchChat: (chatId: string) => number
  updateMessages: (chatId: string | undefined, data: IMessage[], type?:"new" | "old") => void
}

interface ChatContextProviderProps {
  children: React.ReactNode
  user: IUser | undefined
}

type MessageTest = {
  [key: string]: IMessage[]
}

type FetchetChats = {
  [key: string]: number
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData)

export const useChat = () => useContext(ChatContext)

export default function ChatContextProvider({ children, user }: ChatContextProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)

  const [messages, setMessages] = useState<MessageTest>({})
  const [fetchedChats, setFetchedChats] = useState<FetchetChats>({})

  const navigate = useNavigate()

  useEffect(() => {
    console.log('fetchedChats', fetchedChats)
  }, [fetchedChats])

  const updateFetchedChats = (chatId: string, current: number) => {
    console.log('UPDATING FETCHED', chatId, current, fetchedChats)
    setFetchedChats((prev) => ({
      ...prev,
      [chatId]: current + (chatId in prev ? prev[chatId] : 0),
    }))
  }

  const shouldFetchChat = (chatId: string) => {
    return fetchedChats[chatId] === undefined ? 0 : fetchedChats[chatId]
  }

  useEffect(() => {
    if (!user) {
      // navigate('/')
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

  const sendMessage = (obj: ISendMessage) => {
    if (!socket || !user) return
    // const msg = {
    //   text: message,
    //   senderId: user._id,
    //   receiver: to,
    //   chatId,
    //   id: uuidv4(),
    // }
    console.log('Sending message')
    console.log(obj)
    socket.emit(SOCKET_EVENTS.PRIVATE_MESSAGE, obj)
  }

  const updateMessages = (chatId: string | undefined, data: IMessage[], type?:"new" | "old") => {
    if (!type) type = "new"
    if (!chatId) return
    console.log('updating messages')
    setMessages(old => {
      const newData = type === 'old' ? [...old[chatId], ...data] : [...data, ...old[chatId]]
      return {...old, [chatId]: newData}
    })
    updateFetchedChats(chatId, data.length)
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
      socket,
      messages,
      setMessages,
      updateFetchedChats,
      shouldFetchChat,
      updateMessages,
    }}>
      {children}
    </ChatContext.Provider>
  )
}
