import React from 'react'
import { PlusCircle, } from 'phosphor-react'
import styled, { useTheme } from 'styled-components'
import { RegularText } from '../../../styles/typography'
import NewChatModal from './NewChatModal'

export default function NewChat() {
  const { colors } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (<>
    <Container onClick={openModal}>
      <PlusCircle size={22} color={colors['purple']} />
      <RegularText size='m' color='purple'>New chat</RegularText>
    </Container>
    <NewChatModal isOpen={isOpen} closeModal={closeModal}/>
  </>
  )
}


const Container = styled.button`
  display: flex;
  position: relative;
  align-items: center;
  gap: .5rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  &:hover {
    opacity: .5;
  }
`