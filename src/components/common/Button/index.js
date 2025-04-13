// src/components/common/Button/index.js
import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { pop } from '../../../styles/animations';

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledButton = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.small ? '8px 16px' : '12px 24px'};
  font-size: ${props => props.small ? '0.9rem' : '1rem'};
  font-family: 'Bubblegum Sans', cursive;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 3px solid transparent;
  position: relative;
  overflow: hidden;
  
  /* Variants */
  ${props => {
    switch (props.variant) {
        case 'secondary':
            return css`
          background: ${props.theme.secondary};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.secondaryDark};
            transform: translateY(-3px);
            box-shadow: 0 7px 14px rgba(78, 205, 196, 0.4);
          }
          
          &:active:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(78, 205, 196, 0.4);
          }
        `;
        case 'outline':
            return css`
          background: transparent;
          color: ${props.theme.primary};
          border: 3px solid ${props.theme.primary};
          
          &:hover:not(:disabled) {
            background: rgba(255, 107, 107, 0.1);
            transform: translateY(-3px);
            box-shadow: 0 7px 14px rgba(255, 107, 107, 0.2);
          }
          
          &:active:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(255, 107, 107, 0.2);
          }
        `;
        case 'text':
            return css`
          background: transparent;
          color: ${props.theme.primary};
          padding: 8px 16px;
          
          &:hover:not(:disabled) {
            background: rgba(255, 107, 107, 0.1);
            transform: translateY(-2px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(-1px);
          }
        `;
        default: // primary
            return css`
          background: ${props.theme.primary};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${props.theme.primaryDark};
            transform: translateY(-3px);
            box-shadow: 0 7px 14px rgba(255, 107, 107, 0.4);
          }
          
          &:active:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 3px 8px rgba(255, 107, 107, 0.4);
          }
        `;
    }
}}
  
  /* Animations */
  ${props => props.animated && css`
    &:hover:not(:disabled) {
      animation: ${pulse} 0.8s infinite;
    }
  `}
  
  /* Disabled state */
  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
  
  /* Full width */
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  /* Cartoon style */
  ${props => props.cartoon && css`
    border: 3px solid ${props.theme.outlineColor};
    box-shadow: 4px 4px 0 ${props.theme.outlineColor};
    
    &:hover:not(:disabled) {
      box-shadow: 2px 2px 0 ${props.theme.outlineColor};
      transform: translate(2px, 2px);
    }
    
    &:active:not(:disabled) {
      box-shadow: 0px 0px 0 ${props.theme.outlineColor};
      transform: translate(4px, 4px);
    }
  `}
  
  /* Icon spacing */
  svg {
    margin-right: ${props => props.iconOnly ? '0' : '8px'};
    font-size: ${props => props.small ? '0.9rem' : '1.1rem'};
  }
`;

const ButtonElement = styled.button`
  ${StyledButton}
`;

const LinkElement = styled(Link)`
  ${StyledButton}
`;

const ExternalLinkElement = styled.a`
  ${StyledButton}
`;

const Button = ({
                    children,
                    to,
                    href,
                    variant = 'primary',
                    type = 'button',
                    onClick,
                    disabled,
                    small,
                    fullWidth,
                    animated,
                    cartoon,
                    iconOnly,
                    className,
                    ...props
                }) => {
    // Si es un enlace interno (React Router)
    if (to) {
        return (
            <LinkElement
                to={to}
                variant={variant}
                disabled={disabled}
                small={small}
                fullWidth={fullWidth}
                animated={animated}
                cartoon={cartoon}
                iconOnly={iconOnly}
                className={className}
                {...props}
            >
                {children}
            </LinkElement>
        );
    }

    // Si es un enlace externo
    if (href) {
        return (
            <ExternalLinkElement
                href={href}
                variant={variant}
                disabled={disabled}
                small={small}
                fullWidth={fullWidth}
                animated={animated}
                cartoon={cartoon}
                iconOnly={iconOnly}
                className={className}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
            >
                {children}
            </ExternalLinkElement>
        );
    }

    // Si es un botón
    return (
        <ButtonElement
            type={type}
            onClick={onClick}
            variant={variant}
            disabled={disabled}
            small={small}
            fullWidth={fullWidth}
            animated={animated}
            cartoon={cartoon}
            iconOnly={iconOnly}
            className={className}
            {...props}
        >
            {children}
        </ButtonElement>
    );
};

export default Button;