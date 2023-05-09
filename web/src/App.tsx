import ChatContextProvider from '@contexts/ChatContextProvider'
import { useAuth } from '@contexts/AuthContextProvider'
import Router from '@routes/Router'

function App() {
  const { user } = useAuth()
  return (
  <ChatContextProvider user={user}>
    <Router />
  </ChatContextProvider>
  )
}

export default App
