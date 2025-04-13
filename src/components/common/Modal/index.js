// src/components/common/Modal/index.js
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX } from 'react-icons/fi';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  width: ${({ size }) => {
    switch (size) {
        case 'sm': return '350px';
        case 'lg': return '800px';
        case 'xl': return '1000px';
        default: return '550px'; // medium is default
    }
}};
  max-width: 95%;
  max-height: 90vh;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: ${slideIn} 0.4s ease;
  
  ${({ cartoon, theme }) => cartoon && `
    border: 3px solid ${theme.outlineColor};
    box-shadow: 8px 8px 0 ${theme.shadowStrong};
  `}
`;

const ModalHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.heading};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.shadow};
    color: ${({ theme }) => theme.primary};
    transform: rotate(90deg);
  }
`;

const ModalContent = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  padding: 15px 20px;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: ${({ align }) => align || 'flex-end'};
  gap: 10px;
`;

const Modal = ({
                   isOpen,
                   onClose,
                   title,
                   children,
                   footer,
                   size,
                   cartoon,
                   footerAlign
               }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <ModalOverlay onClick={handleOverlayClick}>
            <ModalContainer size={size} cartoon={cartoon}>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                    <CloseButton onClick={onClose}>
                        <FiX />
                    </CloseButton>
                </ModalHeader>
                <ModalContent>{children}</ModalContent>
                {footer && <ModalFooter align={footerAlign}>{footer}</ModalFooter>}
            </ModalContainer>
        </ModalOverlay>
    );
};

export default Modal;