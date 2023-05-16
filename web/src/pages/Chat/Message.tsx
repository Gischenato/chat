import IMessage from '@interfaces/IMessage'
import { RegularText } from '@styles/typography'
import React from 'react'
import styled, { css } from 'styled-components'

interface MessageProps {
  message: IMessage
  isMine?: boolean
}

export default function Message({ message, isMine }: MessageProps ) {
  return (
    <Container isMine={isMine}>
      <RegularText font='title' size={'l'}>{message.text}</RegularText>
    </Container>
  )
}


const Container = styled.div<{ isMine?: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ isMine }) => css`
  width: fit-content;
  align-self: ${isMine ? 'flex-end' : 'flex-start'};
  background-color: ${isMine ? 'aliceblue' : 'aquamarine'};
  max-width: 50%;
  padding: 8px;
  border-radius: 8px;
  `}
`