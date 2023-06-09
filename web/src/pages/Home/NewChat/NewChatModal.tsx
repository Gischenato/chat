import React from 'react'
import styled from 'styled-components'
import { useChat } from '@contexts/ChatContextProvider'
import NewUser from './NewUser'
import { TitleText } from '@styles/typography'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContextProvider'
import { toast } from 'react-toastify'
import IUser from '@interfaces/IUser'

interface NewChatModalProps {
  isOpen: boolean,
  closeModal: () => void
}

export default function NewChatModal({ isOpen, closeModal }: NewChatModalProps) {
  const handleInnerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
  }
  const { user:myUser } = useAuth()
  const { potentialChats, createNewChatMutation } = useChat()
  const navigate = useNavigate()

  const createNewChat = (user: IUser) => {
    if (!myUser) return
    console.log("create new chat with", user)
    createNewChatMutation.mutate({
      firstId: myUser._id,
      secondId: user._id,
    }, {
      onSuccess: (data) => {
        const { _id } = data
        navigate(`/chat/${_id}/${user._id}`)
      },
      onError: (error) => {
        console.log(error)
        toast('Error creating new chat')
      },
      onSettled: () => {
        closeModal()
      }
    }
    )
    navigate(`/chat/teste`)
  }

  return (
    <ModalContainer isOpen={isOpen} onClick={closeModal}>
      <InnerContainer onClick={handleInnerClick}>
        <TitleText color='yellow-dark'>New chat with</TitleText>
        { potentialChats &&
          potentialChats.map(user => <NewUser key={user._id} user={user} createNewChat={createNewChat}/>)
        }
      </InnerContainer>
    </ModalContainer>
  )
}


const ModalContainer = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'grid' : 'none'};
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  


  height: 100vh;
  width: 100vw;
  background-color: rgba(0,0,0,.5);
`

const InnerContainer = styled.div`
  position: absolute;
  padding: 2rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: fit-content;
  max-height: 75%;
  overflow: auto;
  background-color: ${({ theme }) => theme.colors['background']};
  border-radius: 8px;

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

  display: flex;
  flex-direction: column;
  gap: .5rem;
`