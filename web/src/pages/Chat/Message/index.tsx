import IMessage from '@interfaces/IMessage'
import { RegularText } from '@styles/typography'
import React from 'react'
import styled from 'styled-components'

interface MessageProps {
  message: IMessage
}

export default function Message({ message }: MessageProps ) {
  return (
    <Container>
      <RegularText font='title' size={'l'}>{message.text}</RegularText>
    </Container>
  )
}


const Container = styled.div`

`