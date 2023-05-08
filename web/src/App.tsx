import { Routes, Route, Navigate} from 'react-router-dom'
import Chat from './pages/Chat'
import Register from './pages/Register'
import Login from './pages/Login'
import Default from './layouts/Default'
import Initial from './layouts/Initial'
import { useQuery } from '@tanstack/react-query'
import ChatContextProvider from './contexts/ChatContextProvider'
import { useAuth } from './contexts/AuthContextProvider'
import Router from './routes/Router'

// create a wait function
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function App() {
  const { user } = useAuth()

  const postQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => wait(1).then(() => [{ name: 'Teste', password: '123' }]),
  })

  if(postQuery.isLoading) return <p>Loading...</p>
  if(postQuery.isError) return <p>ERRO</p>

  return (<ChatContextProvider user={user}>
    <Router />
  </ChatContextProvider>
  )
}

export default App
