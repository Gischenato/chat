import { useParams } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContextProvider'
import styled from 'styled-components'
import { TitleText } from '@styles/typography'
import { useChat } from '@contexts/ChatContextProvider'
import User from './User'
import IChat from '@interfaces/IChat'
import CreateNewChat from './CreateNewChat'
import { Outlet } from 'react-router-dom'

export default function Home() {
  const { isAuthenticated, user:myUser } = useAuth()
  const { isUserChatsLoading, userChats, userChatsError } = useChat()
  
  return (
    <Container>
      <Sidebar>
        <CreateNewChat />
        <TitleText size='m' color='purple'>Chat list</TitleText>
        {(isAuthenticated && !isUserChatsLoading) && 
          userChats!.map((chat: IChat) => (
          <User key={chat._id} chat={chat} user={myUser!}/>
        ))}
      </Sidebar>
      <Outlet />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  box-sizing: border-box;
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
  background-color: ${({ theme }) => theme.colors['background']};
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
