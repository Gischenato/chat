import React, { createContext, useContext, useState, useEffect } from 'react'
import IUser from '@interfaces/IUser'
import { useQuery, useMutation, UseMutationResult } from '@tanstack/react-query'
import { register } from '@util/api/users/register'
import { AxiosError } from 'axios'
import { login } from '@util/api/auth/login'
import { refresh } from '@util/api/auth/refresh'
import { toast } from 'react-toastify'

interface AuthContextData {
  user: IUser | undefined
  registerMutation: UseMutationResult<LoginResponse, Error, LoginCredentials, unknown>
  signInMutation: UseMutationResult<LoginResponse, Error, LoginCredentials, unknown>
  isAuthenticated: boolean,
  signOut: () => void
}

interface AuthContextProviderProps {
  children: React.ReactNode
}

interface LoginResponse {
  msg: string
  id: string
}

interface RefreshResponse {
  name: string
  id: string
}

interface LoginCredentials {
  name: string
  password: string
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<IUser>()
  
  const registerMutation = useMutation<LoginResponse, AxiosError, LoginCredentials, any>({
    mutationFn: register,
    onSuccess: (data, variables) => {
      setUser({
        _id: data.id,
        name: variables.name,
      })
      setIsAuthenticated(true)
    },
    onError: (error, variables, context) => {
      console.warn(error)
      toast.error("Invalid credentials")
    },
    onMutate() {
      const id = toast.loading('Loading...')
      return {id}
    },
    onSettled(data, error, variables, context) {
      toast.dismiss(context.id)
    },
  })

  const signInMutation = useMutation<LoginResponse, AxiosError, LoginCredentials, any>({
    mutationFn: login,
    onSuccess: (data, variables) => {
      handleLogIn({_id: data.id, name: variables.name})
    },
    onError: (error, variables, context) => {
      console.warn(error)
      toast.error("Invalid credentials")
    },
    onMutate() {
      const id = toast.loading('Loading...')
      return {id}
    },
    onSettled(data, error, variables, context) {
      toast.dismiss(context.id)
    }
  })

  const refreshMutation = useMutation<RefreshResponse, AxiosError, {id: string}, any>({
    mutationFn: refresh,
    onSuccess: (data, variables) => {
      handleLogIn({_id: data.id, name: data.name})
    },
    onMutate() {
      const id = toast.loading('Refreshing...')
      return {id}
    },
    onSettled(data, error, variables, context) {
      toast.dismiss(context.id)
    }
  })

  const handleLogIn = (user:IUser) => {
    setUser(user)
    // localStorage.setItem('@chat:userId', user._id)
    sessionStorage.setItem('@chat:user', JSON.stringify(user))
    setIsAuthenticated(true)
  }

  
  const signOut = () => {
    setUser(undefined)
    setIsAuthenticated(false)
    localStorage.removeItem('@chat:userId')
    sessionStorage.removeItem('@chat:user')
  }
  
  const handleRefresh = () => {
    const user = sessionStorage.getItem('@chat:user')
    if (user !== null) {
      const parsedUser = JSON.parse(user)
      handleLogIn(parsedUser)
      return
    }
    const userId = localStorage.getItem('@chat:userId')
    if (userId === null) return
    refreshMutation.mutate({id: userId})
  }
  
  useEffect(() => {
    handleRefresh()
  }, [])

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      registerMutation,
      signInMutation,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}
