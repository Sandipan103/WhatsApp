import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import PowerButton from './PowerButton'
import { YinYang } from './Allsvg'
import img1 from '../assets/start.png'; 
import Intro from './intro.jsx'
import LogoComponent from './Logo.jsx'
const Image = styled.img`
  width: ${({ click }) => (click ? '120px' : '200px')};
  height: ${({ click }) => (click ? '120px' : '200px')};
`;


const MainContainer = styled.div`
background: ${props => props.theme.body};
width: 100vw;
height: 100vh;
overflow:hidden;

position: relative;

h3,h4,h5,h6{
//   font-family:'Karla', sans-serif ;
  font-weight:900;
}
`

const Container = styled.div`
padding: 2rem;
`

const Contact = styled.a`
color: ${props => props.theme.text};
position: absolute;
top: 2rem;
right: calc(1rem + 2vw);
text-decoration: none;
z-index:1;
`

const BottomBar = styled.div`
position: absolute;
bottom: 1rem;
left: 0;
right: 0;
width: 100%;


display: flex;
justify-content: space-evenly;
`

const ABOUT = styled(NavLink)`
color: white;
font-weight: bold; 
// text-shadow: 2px 2px 4px rgba(12, 237, 233, .5);
font-size: 1.5em; 
z-index:1;
`
const Features = styled(NavLink)`
color: white;
font-weight: bold; 
// text-shadow: 2px 2px 4px rgba(12, 237, 233, .5);
font-size: 1.5em; 
text-decoration: none;
z-index:1;
`

const colorChange = keyframes`
  from {
    filter: hue-rotate(0deg);
  }
  to {
    filter: hue-rotate(360deg);
  }
`;

const scaleAnimation = keyframes`
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.2);
  }
`;

const textAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(0);
  }
`;

const Center = styled.button`
  position: absolute;
  top: ${props => (props.click ? '85%' : '50%')};
  left: ${props => (props.click ? '92%' : '50%')};
  transform: translate(-50%, -50%);
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;
  font-family: 'Pacifico',cursive;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 1s ease;

  & > :first-child {
    animation: ${colorChange} 5s infinite alternate, ${scaleAnimation} 3s infinite alternate;
  }

  & > :last-child {
    display: ${props => (props.click ? 'none' : 'inline-block')};
    padding-top: 1rem;
    color: white;
    animation: ${textAnimation} 2s infinite; /* Animate text */
    transform: translateY(5px); /* Move text down */
  }
`;

const DarkDiv = styled.div`
position: absolute;
top: 0;
background-color: #000;
bottom: 0;
right: 50%;
width: ${props => props.click ? '50%' : '0%'};
height: ${props => props.click ? '100%' : '0%'};
z-index:1;
transition: height 0.5s ease, width 1s ease 0.5s;
`


const Main = () => {

    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);

    return (
        <MainContainer>
         <DarkDiv   click={click}/>
            <Container>
            <PowerButton />
            <LogoComponent theme={click ? 'dark' :'light'}/>
            <Center click={click}>
                <Image src={img1} alt="Sherlock Image" onClick={handleClick} />
                <h1>Click me to enter into the world of Sherlock Holmes..</h1>
            </Center>

            <Contact target="_blank" href="mailto:test@gmail.com">
                <motion.h2
                initial={{
                    y:-200,
                    transition: { type:'spring', duration: 1.5, delay:1}
                }}
                animate={{
                    y:0,
                    transition: { type:'spring', duration: 1.5, delay:1}
                }}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                
                >
                    Contact us...
                </motion.h2>
            </Contact>
           
       
            <BottomBar>
            <ABOUT to="/about" click={+click}>
                <motion.h2
                initial={{
                    y:200,
                    transition: { type:'spring', duration: 1.5, delay:1}
                }}
                animate={{
                    y:0,
                    transition: { type:'spring', duration: 1.5, delay:1}
                }}
                 whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                >
                    ABOUT
                </motion.h2>
            </ABOUT>
            <Features to="/features">
                <motion.h2
                initial={{
                    y:200,
                    transition: { type:'spring', duration: 1.5, delay:1}
                }}
                animate={{
                    y:0,
                    transition: { type:'spring', duration: 1.5, delay:1}
                }}
                 whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                >
                    FEATURES
                </motion.h2>
            </Features>

            </BottomBar>

            </Container>
            {click ? <Intro click={click} /> : null }
        </MainContainer>
    )
}

export default Main
