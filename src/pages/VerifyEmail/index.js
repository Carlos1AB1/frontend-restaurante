// src/pages/VerifyEmail/index.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { showNotification } from '../../store/slices/uiSlice';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const VerifyContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 30px;
`;

const MessageCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const StatusIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  color: ${({ success, theme }) => success ? theme.success : theme.error};
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
`;

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyToken = async () => {
            // Simulación de verificación de token
            setTimeout(() => {
                if (token && token.length >= 10) {
                    setVerified(true);

                    dispatch(showNotification({
                        message: 'Email verificado correctamente',
                        type: 'success'
                    }));
                } else {
                    setError('El token no es válido o ha expirado');

                    dispatch(showNotification({
                        message: 'Error al verificar el email',
                        type: 'error'
                    }));
                }

                setLoading(false);
            }, 1500);
        };

        verifyToken();
    }, [token, dispatch]);

    if (loading) {
        return <Loader type="cartoon" text="Verificando correo electrónico..." />;
    }

    return (
        <VerifyContainer>
            <PageTitle>Verificación de Email</PageTitle>

            <MessageCard>
                {verified ? (
                    <>
                        <StatusIcon success>
                            <FiCheckCircle />
                        </StatusIcon>
                        <h2>¡Email Verificado!</h2>
                        <Message>
                            Tu dirección de correo electrónico ha sido verificada correctamente.
                            Ya puedes iniciar sesión en tu cuenta.
                        </Message>
                        <ButtonContainer>
                            <Button
                                to="/login"
                                cartoon
                                animated
                            >
                                Iniciar Sesión
                            </Button>
                        </ButtonContainer>
                    </>
                ) : (
                    <>
                        <StatusIcon>
                            <FiXCircle />
                        </StatusIcon>
                        <h2>Error de Verificación</h2>
                        <Message>
                            {error || 'No se pudo verificar tu dirección de correo electrónico.'}
                        </Message>
                        <Message>
                            El enlace puede haber expirado o ser inválido. Por favor, intenta registrarte de nuevo
                            o contacta con el servicio de soporte.
                        </Message>
                        <ButtonContainer>
                            <Button
                                to="/register"
                                cartoon
                            >
                                Volver a Registrarse
                            </Button>
                        </ButtonContainer>
                    </>
                )}
            </MessageCard>
        </VerifyContainer>
    );
};

export default VerifyEmail;