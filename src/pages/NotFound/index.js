// src/pages/NotFound/index.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import Button from '../../components/common/Button';
import { FiHome, FiShoppingBag } from 'react-icons/fi';

const float = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0);
  }
`;

const NotFoundContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  margin: 0;
  line-height: 1;
  position: relative;
  
  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const FoodImage = styled.img`
  width: 120px;
  height: 120px;
  position: relative;
  margin: -30px 0;
  animation: ${float} 3s infinite ease-in-out;
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    margin: -20px 0;
  }
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 40px;
  max-width: 600px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const NotFound = () => {
    return (
        <NotFoundContainer>
            <ErrorCode>4<FoodImage src="/assets/images/food-icons/burger.svg" alt="0" />4</ErrorCode>
            <Title>¡Página no encontrada!</Title>
            <Message>
                Parece que te has perdido en nuestro menú. La página que estás buscando ha sido movida, eliminada o nunca existió.
            </Message>
            <ButtonsContainer>
                <Button to="/" cartoon>
                    <FiHome /> Volver al Inicio
                </Button>
                <Button to="/menu" variant="outline">
                    <FiShoppingBag /> Ver Menú
                </Button>
            </ButtonsContainer>
        </NotFoundContainer>
    );
};

export default NotFound;