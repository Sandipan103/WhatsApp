import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link from React Router
import Me from '../assets/sh2.png';

const Box = styled(motion.div)`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 65vw;
    height: 60vh;
    display: flex;
    z-index: 1;
    overflow: hidden;
    border: 3px solid white; /* Added white border */
`;

const BackgroundImage = styled.div`
    width: 100%;
    height: 100%;
    background-image: url(${Me});
    background-size: cover;
    background-position: center;
`;

const SubBox = styled.div`
    width: 50%;
    position: relative;
     justify-content: center; /* Center child elements horizontally */
    align-items: center; 
    .pic {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0%);
        width: 100%;
        height: auto;
    }
`;

const Text = styled.div`
    font-size: calc(1em + 1vw);
    color: white;
    padding: 2rem;
    font-family: 'Pacifico',cursive;

    cursor: pointer;
    display: flex;
    flex-direction: column;
    
    justify-content: space-evenly;

    & > *:last-child {
        color: grey;
        font-size: calc(0.3rem + 1vw);
        font-weight: 200;
    }
`;

const RoundedButton = styled.button`
    color: black;
    background: white;
    box-shadow: 0 0 8px 6px rgba(12, 237, 233,0.5);
    margin-left:  9rem;
    padding: 1rem 2rem;
    cursor: pointer;
    border-radius: 25px;
    border: none;
    outline: none;
    font-family: 'Pacifico',cursive;

    font-size: calc(0.3rem + 1vw);
    font-weight: 200;
    
    &:hover {
        box-shadow: 0 0 8px 6px rgba(0,255,0,0.7);

    }
`;



const Intro = () => {
    return (
        <Box
            initial={{ height: 0 }}
            animate={{ height: '55vh' }}
            transition={{ type: 'spring', duration: 3, delay: .6 }}
        >
            <SubBox>
                <Text>
                    <h1>CryptGuard</h1>
                    <h6>An encrypted platform for Sherlock Holmes and Dr. Watson, offering secure messaging, video calls, and group chats, safeguarding their investigations with confidentiality and versatility</h6>
                </Text>
                {/* Link to the signup page */}
                <Link to="/signup">
                    <RoundedButton>Get Started</RoundedButton>
                </Link>
            </SubBox>
            <SubBox>
                <BackgroundImage />
            </SubBox>
        </Box>
    );
};

export default Intro;
