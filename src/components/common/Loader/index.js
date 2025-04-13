import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: ${({ fullScreen }) => fullScreen ? '100vh' : '200px'};
  width: 100%;
`;

const SpinnerLoader = styled.div`
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  border: 4px solid ${({ theme }) => theme.shadow};
  border-top: 4px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;

const CartoonLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FoodItem = styled.div`
  width: ${({ size }) => size || '40px'};
  height: ${({ size }) => size || '40px'};
  background-image: url(${({ icon }) => icon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0 10px;
  animation: ${bounce} 0.8s ease infinite;
  animation-delay: ${({ delay }) => delay || '0s'};
`;

const LoadingText = styled.p`
  margin-top: 20px;
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
`;

const Loader = ({ type = 'spinner', text, fullScreen, size }) => {
    if (type === 'cartoon') {
        return (
            <LoaderContainer fullScreen={fullScreen}>
                <CartoonLoader>
                    <FoodItem
                        icon="/assets/images/food-icons/burger.svg"
                        size={size}
                        delay="0s"
                    />
                    <FoodItem
                        icon="/assets/images/food-icons/pizza.svg"
                        size={size}
                        delay="0.2s"
                    />
                    <FoodItem
                        icon="/assets/images/food-icons/taco.svg"
                        size={size}
                        delay="0.4s"
                    />
                </CartoonLoader>
                {text && <LoadingText>{text}</LoadingText>}
            </LoaderContainer>
        );
    }

    return (
        <LoaderContainer fullScreen={fullScreen}>
            <SpinnerLoader size={size} />
            {text && <LoadingText>{text}</LoadingText>}
        </LoaderContainer>
    );
};

export default Loader;