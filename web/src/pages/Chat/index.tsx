import { useParams } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContextProvider'
import styled from 'styled-components'
import { TitleText } from '@styles/typography'
import { useChat } from '@contexts/ChatContextProvider'
import User from './User'
import IChat from '@interfaces/IChat'
import CreateNewChat from './CreateNewChat'

export default function Chat() {
  const { isAuthenticated, user:myUser } = useAuth()
  const { isUserChatsLoading, userChats, userChatsError } = useChat()
  
  const { userId } = useParams()

  return (
    <Container>
      <Sidebar>
        <CreateNewChat />
        <TitleText size='m' color='purple'>Chat list</TitleText>
        {(isAuthenticated && !isUserChatsLoading) && 
          userChats!.map((user: IChat) => (
          <User key={user._id} chat={user} user={myUser!}/>
        ))}
      </Sidebar>
      {userId}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
  gap: 12px;
  background-color: aquamarine;
  flex: 1;
  overflow: hidden;
  `

const Sidebar = styled.aside`
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 15%;
  gap: 12px;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors['base-button']};
  overflow-y: auto;
  overflow-x: hidden;

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
