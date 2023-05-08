import React from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

export default function Default() {
  return (
    <LayoutContainer>
      <div id='header'>Header</div>
      <div id='container'>
        <div id='left'></div>
        <Outlet />
      </div>
      <div id='footer'>footer</div>
    </LayoutContainer>
  )
}


const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* background-color: red; */
  
  #header {
    /* background-color: blue; */
    height: 5%;
  }
  
  #left {
    display: flex;
    /* background-color: green; */
    width: 15%;
  }
  
  #footer {
    /* background-color: yellow; */
    height: 5%;
  }
  
  #container {
    display: flex;
    flex: 1
  }
`
