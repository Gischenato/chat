import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '@contexts/AuthContextProvider'
import { RegularText, TitleText } from '@styles/typography'

export default function Initial() {
  const { user, isAuthenticated, signOut } = useAuth()

  return (
    <LayoutContainer>
      <nav>
        <Link to={'/'}>Chat</Link>
        <Link to={'/login'}>Login</Link>
        <Link to={'/register'}>Register</Link>
        <TitleText font='sand'>{user ? `Logged as ${user.name}` : `Not logged`}</TitleText>
        {isAuthenticated && <button onClick={signOut}>SignOut</button>}
      </nav>
      <Outlet />
    </LayoutContainer>
  )
}


const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  
  > nav {
    display: flex;
    gap: 2rem;
    padding: 1rem;

    font-size: 2rem;
    font-family: 'Quicksand';
    
    > a {
      text-decoration: none;
      :hover {
        text-decoration: underline;
      }
    }
  }
`

// const Nav = styled.nav`
//   display: flex;
//   background-color: ${({ theme }) => theme.colors.background};
//   /* gap: 2rem; */
//   display: flex;
//     gap: 2rem;
//     background-color: #ececec;
//     padding: 1rem;

//     font-size: 2rem;
//     font-family: 'Quicksand';
    
//     > a {
//       text-decoration: none;
//       :hover {
//         text-decoration: underline;
//       }
//     }
// `