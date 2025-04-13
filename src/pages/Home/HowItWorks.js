// src/pages/Home/HowItWorks.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiSearch, FiShoppingCart, FiTruck } from 'react-icons/fi';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const SectionContainer = styled.section`
  padding: 20px 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.heading};
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &::after {
    content: '';
    position: absolute;
    left: 25%;
    right: 25%;
    bottom: -10px;
    height: 4px;
    background-color: ${({ theme }) => theme.accent};
    border-radius: 2px;
  }
`;

const StepsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StepCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-10px);
    
    .step-icon {
      animation: ${float} 2s infinite ease-in-out;
    }
  }
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 6px 6px 0 ${({ theme }) => theme.shadowStrong};
`;

const StepNumber = styled.div`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Bubblegum Sans', cursive;
  font-size: 1.3rem;
  color: white;
  border: 2px solid ${({ theme }) => theme.outlineColor};
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primaryLight};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
  
  svg {
    font-size: 2rem;
    color: ${({ theme }) => theme.primary};
  }
`;

const StepTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.heading};
`;

const StepDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.5;
`;

const HowItWorks = () => {
    return (
        <SectionContainer>
            <SectionTitle>¿Cómo Funciona?</SectionTitle>

            <StepsContainer>
                <StepCard>
                    <StepNumber>1</StepNumber>
                    <IconContainer className="step-icon">
                        <FiSearch />
                    </IconContainer>
                    <StepTitle>Recibe tu comida</StepTitle>
                    <StepDescription>
                        Siéntate y relájate. Nuestro equipo de reparto llevará tu pedido
                        a tu puerta en el menor tiempo posible.
                    </StepDescription>
                </StepCard>
            </StepsContainer>
        </SectionContainer>
    );
};

export default HowItWorks;