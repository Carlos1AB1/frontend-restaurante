// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Bubblegum+Sans&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Bubblegum Sans', cursive;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.heading};
  }

  h1 {
    font-size: 2.5rem;
    
    @media (min-width: 768px) {
      font-size: 3rem;
    }
  }

  h2 {
    font-size: 2rem;
  }

  h3 {
    font-size: 1.75rem;
  }

  p {
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${({ theme }) => theme.primaryDark};
    }
  }

  button {
    font-family: 'Poppins', sans-serif;
    cursor: pointer;
    border: none;
    border-radius: 50px;
    padding: 10px 20px;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  img {
    max-width: 100%;
  }

  /* Animated Background Style */
  .animated-bg {
    position: relative;
    overflow: hidden;
    
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url('/assets/images/backgrounds/pattern.svg');
      background-size: 200px;
      opacity: 0.05;
      z-index: -1;
    }
  }

  /* Cartoon-style shadows */
  .cartoon-shadow {
    filter: drop-shadow(3px 5px 0px rgba(0, 0, 0, 0.2));
  }

  /* Bouncy animations */
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }

  .bounce {
    animation: bounce 2s ease infinite;
    transform-origin: center bottom;
  }

  /* Wiggle animation */
  @keyframes wiggle {
    0%, 100% {
      transform: rotate(-3deg);
    }
    50% {
      transform: rotate(3deg);
    }
  }

  .wiggle {
    animation: wiggle 1s ease-in-out infinite;
  }

  /* Pop animation */
  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  .pop {
    animation: pop 0.3s ease-in-out;
  }
`;