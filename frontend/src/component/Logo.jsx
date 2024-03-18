import React from 'react'
import styled from 'styled-components'
import { lightTheme } from './theme'




const Logo = styled.h1`
display: inline-block;
color: ${props => props.color === 'dark' ? lightTheme.text : lightTheme.body};
font-family: 'Pacifico',cursive;

position: fixed;
left: 2rem;
top: 2rem;
z-index:3;
`

const LogoComponent = (props) => {
    return (
        <Logo color={props.theme}>
          CryptGuard
        </Logo>
    )
}

export default LogoComponent