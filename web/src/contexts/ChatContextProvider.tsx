import React, { createContext, useContext, useState } from 'react'
import { UseMutationResult, useMutation, useQuery } from '@tanstack/react-query'
import { getChat } from '@util/api/chats/getChat'
import IUser from '@interfaces/IUser'
import { getAllUsers } from '@util/api/users/getAll'
import IChat from '@interfaces/IChat'
import { postNewChat } from '@util/api/chats/createNewChat'
import IPostNewChat from '@interfaces/IPostNewChat'
import { Id, toast } from 'react-toastify'
import IPostNewChatResponse from '@interfaces/IPostNewChatResponse'

interface ChatContextData {
  userChats: IChat[] | undefined
  isUserChatsLoading: boolean
  userChatsError: boolean
  potentialChats: IUser[] | undefined
  createNewChatMutation: UseMutationResult<IPostNewChatResponse, unknown, IPostNewChat, unknown>
}

interface ChatContextProviderProps {
  children: React.ReactNode
  user: IUser | undefined
}

const ChatContext = createContext<ChatContextData>({} as ChatContextData)

export const useChat = () => useContext(ChatContext)

export default function ChatContextProvider({ children, user }: ChatContextProviderProps) {
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

  const [potentialChats, setPotentialChats] = useState<Array<any>>([])

  return (
    <ChatContext.Provider value={{
      userChats: chatsQuery.data,
      isUserChatsLoading: chatsQuery.isLoading,
      userChatsError: chatsQuery.isError,
      potentialChats,
      createNewChatMutation,
    }}>
      {children}
    </ChatContext.Provider>
  )
}
