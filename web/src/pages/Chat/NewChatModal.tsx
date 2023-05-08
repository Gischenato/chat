import React from 'react'
import styled from 'styled-components'

interface NewChatModalProps {
  isOpen: boolean,
  closeModal: () => void
}

export default function NewChatModal({ isOpen, closeModal }: NewChatModalProps) {
  const handleInnerClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
  }

  return (
    <ModalContainer isOpen={isOpen} onClick={closeModal}>
      <div onClick={handleInnerClick}>
        <h1>Modal</h1>
      </div>
    </ModalContainer>
  )
}


const ModalContainer = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;

  place-content: center;
  place-items: center;

  height: 100vh;
  width: 100vw;
  background-color: rgba(0,0,0,.5);

  >div {
    padding: 100px;
    background-color: red;
  }
`