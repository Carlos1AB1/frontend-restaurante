// src/components/common/Card/index.js
import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const CardContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: ${({ cartoon }) => cartoon ? '12px' : '8px'};
  overflow: hidden;
  transition: all 0.3s ease;
  height: ${({ height }) => height || 'auto'};
  
  ${({ hoverable }) => hoverable && css`
    &:hover {
      transform: translateY(-8px);
    }
  `}
  
  ${({ clickable }) => clickable && css`
    cursor: pointer;
  `}
  
  ${({ cartoon, theme }) => cartoon && css`
    border: 3px solid ${theme.outlineColor};
    box-shadow: 8px 8px 0 ${theme.shadowStrong};
    
    &:hover {
      box-shadow: 5px 5px 0 ${theme.shadowStrong};
      transform: translate(3px, 3px);
    }
  `}
  
  ${({ elevated, theme }) => elevated && css`
    box-shadow: 0 8px 24px ${theme.shadow};
    
    &:hover {
      box-shadow: 0 12px 28px ${theme.shadowStrong};
    }
  `}
`;

const CardContent = styled.div`
  padding: ${({ noPadding }) => noPadding ? '0' : '20px'};
`;

const CardImage = styled.div`
  width: 100%;
  height: ${({ height }) => height || '200px'};
  background-image: url(${({ src }) => src});
  background-size: cover;
  background-position: center;
  position: relative;
  
  ${({ overlay, theme }) => overlay && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, transparent 0%, ${theme.shadowStrong} 100%);
    }
  `}
  
  ${({ ribbon, theme }) => ribbon && css`
    &::before {
      content: '${ribbon}';
      position: absolute;
      top: 15px;
      right: -30px;
      background: ${theme.accent};
      color: ${theme.text};
      padding: 5px 30px;
      transform: rotate(45deg);
      font-size: 0.8rem;
      font-weight: bold;
      z-index: 1;
      box-shadow: 0 2px 5px ${theme.shadow};
    }
  `}
`;

const CardTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.heading};
  
  ${({ center }) => center && css`
    text-align: center;
  `}
`;

const CardText = styled.p`
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  line-height: 1.5;
  
  ${({ center }) => center && css`
    text-align: center;
  `}
`;

const CardFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Card = ({
                  children,
                  title,
                  image,
                  imageHeight,
                  text,
                  footer,
                  to,
                  onClick,
                  cartoon,
                  elevated,
                  hoverable,
                  ribbon,
                  center,
                  height,
                  noPadding,
                  overlay,
                  className
              }) => {
    const cardContent = (
        <>
            {image && (
                <CardImage
                    src={image}
                    height={imageHeight}
                    ribbon={ribbon}
                    overlay={overlay}
                />
            )}
            <CardContent noPadding={noPadding}>
                {title && <CardTitle center={center}>{title}</CardTitle>}
                {text && <CardText center={center}>{text}</CardText>}
                {children}
            </CardContent>
            {footer && <CardFooter>{footer}</CardFooter>}
        </>
    );

    // Si es un enlace
    if (to) {
        return (
            <CardContainer
                as={Link}
                to={to}
                cartoon={cartoon}
                elevated={elevated}
                hoverable={hoverable}
                clickable
                height={height}
                className={className}
            >
                {cardContent}
            </CardContainer>
        );
    }

    // Si es un div con onClick
    return (
        <CardContainer
            onClick={onClick}
            cartoon={cartoon}
            elevated={elevated}
            hoverable={hoverable}
            clickable={!!onClick}
            height={height}
            className={className}
        >
            {cardContent}
        </CardContainer>
    );
};

export default Card;