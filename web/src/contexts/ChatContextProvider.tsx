/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getChat } from '../util/api/chats/getChat'
import IUser from '../interfaces/IUser'

interface ChatContextData {
  userChats: Array<any>
  isUserChatsLoading: boolean
  userChatsError: boolean
}

interface ChatContextProviderProps {
  children: React.ReactNode
  user: IUser | undefined
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData)

export const useChat = () => useContext(ChatContext)

export default function ChatContextProvider({ children, user }: ChatContextProviderProps) {
  const chatsQuery = useQuery({
    queryKey: ['chats', user?._id],
    enabled: user !== undefined && user !== null,
    queryFn: () => {
      return getChat(user!._id)
    },
  })

  return (
    <ChatContext.Provider value={{
      userChats: chatsQuery.data,
      isUserChatsLoading: chatsQuery.isLoading,
      userChatsError: chatsQuery.isError,    
    }}>
      {children}
    </ChatContext.Provider>
  )
}
