// src/components/common/Notification/index.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes, css } from 'styled-components';
import { clearNotification } from '../../../store/slices/uiSlice';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-width: 350px;
  animation: ${({ isClosing }) =>
    isClosing
        ? css`${slideOut} 0.3s forwards`
        : css`${slideIn} 0.3s forwards`
};
  
  ${({ type, theme }) => {
    switch(type) {
        case 'success':
            return `
          background-color: ${theme.success};
          color: #fff;
        `;
        case 'error':
            return `
          background-color: ${theme.error};
          color: #fff;
        `;
        case 'warning':
            return `
          background-color: ${theme.warning};
          color: #333;
        `;
        default:
            return `
          background-color: ${theme.info};
          color: #fff;
        `;
    }
}}
`;

const IconWrapper = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: center;
  font-size: 20px;
`;

const Message = styled.p`
  margin: 0;
  font-size: 14px;
`;

const Notification = () => {
    const dispatch = useDispatch();
    const { notification } = useSelector(state => state.ui);
    const [isClosing, setIsClosing] = React.useState(false);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setIsClosing(true);

                // Dar tiempo para que termine la animación antes de quitar la notificación
                setTimeout(() => {
                    dispatch(clearNotification());
                    setIsClosing(false);
                }, 300);
            }, notification.duration || 3000);

            return () => clearTimeout(timer);
        }
    }, [notification, dispatch]);

    if (!notification) return null;

    const getIcon = () => {
        switch(notification.type) {
            case 'success':
                return <FiCheckCircle />;
            case 'error':
                return <FiAlertCircle />;
            case 'warning':
                return <FiAlertCircle />;
            default:
                return <FiInfo />;
        }
    };

    return (
        <NotificationContainer type={notification.type} isClosing={isClosing}>
            <IconWrapper>{getIcon()}</IconWrapper>
            <Message>{notification.message}</Message>
        </NotificationContainer>
    );
};

export default Notification;