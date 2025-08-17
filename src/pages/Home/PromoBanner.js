// src/pages/Home/PromoBanner.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '../../components/common/Button';
import { FiArrowRight } from 'react-icons/fi';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const wiggle = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
  100% { transform: rotate(0deg); }
`;

const BannerContainer = styled.div`
  background: ${({ theme }) => theme.cartoonGradient};
  border-radius: 20px;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
    padding: 60px 40px;
  }
  
  /* Cartoon style */
  border: 4px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 8px 8px 0 ${({ theme }) => theme.shadowStrong};
`;

const DiscountCircle = styled.div`
  position: absolute;
  top: -20px;
  right: -20px;
  width: 120px;
  height: 120px;
  background-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Bubblegum Sans', cursive;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.outlineColor};
  transform: rotate(15deg);
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 4px 4px 0 ${({ theme }) => theme.shadowStrong};
  z-index: 1;
  
  &:hover {
    animation: ${wiggle} 0.5s ease;
  }
`;

const BannerContent = styled.div`
  flex: 1;
  z-index: 1;
  
  @media (min-width: 768px) {
    padding-right: 30px;
  }
`;

const BannerTitle = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 15px;
  
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const BannerText = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin-bottom: 30px;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const BannerImage = styled.div`
  margin-top: 30px;
  
  @media (min-width: 768px) {
    margin-top: 0;
  }
  
  img {
    width: 200px;
    height: 200px;
    object-fit: contain;
    filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2));
    
    @media (min-width: 768px) {
      width: 250px;
      height: 250px;
    }
  }
`;

const BackgroundShape = styled.div`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  
  &:nth-child(1) {
    width: 60px;
    height: 60px;
    top: 20px;
    left: 10%;
  }
  
  &:nth-child(2) {
    width: 120px;
    height: 120px;
    bottom: -30px;
    left: 30%;
  }
  
  &:nth-child(3) {
    width: 80px;
    height: 80px;
    top: 50%;
    right: 20%;
    animation: ${rotate} 20s linear infinite;
  }
`;

const PromoBanner = () => {
    return (
        <BannerContainer>
            <BackgroundShape />
            <BackgroundShape />
            <BackgroundShape />

            <DiscountCircle>-20%</DiscountCircle>

            <BannerContent>
                <BannerTitle>¡Oferta Especial del Día!</BannerTitle>
                <BannerText>
                    Disfruta de un 20% de descuento en todas nuestras hamburguesas premium.
                    ¡Oferta por tiempo limitado!
                </BannerText>
                <Button to="/menu/category/hamburguesas" cartoon>
                    Pedir Ahora <FiArrowRight />
                </Button>
            </BannerContent>

            <BannerImage>
                <img src="/assets/images/food-items/burger-promo.png" alt="Hamburguesa en oferta" />
            </BannerImage>
        </BannerContainer>
    );
};

export default PromoBanner;