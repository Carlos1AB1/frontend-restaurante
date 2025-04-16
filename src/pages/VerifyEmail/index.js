// src/pages/VerifyEmail/index.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { showNotification } from '../../store/slices/uiSlice';
import { FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';

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
  color: ${({ success, warning, theme }) =>
    success ? theme.success :
        warning ? theme.warning :
            theme.error};
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  margin-top: 30px;
`;

const ErrorDetails = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: ${({ theme }) => theme.shadow};
  border-radius: 8px;
  text-align: left;
  
  h4 {
    margin-top: 0;
    margin-bottom: 10px;
    color: ${({ theme }) => theme.heading};
  }
  
  pre {
    overflow-x: auto;
    background-color: ${({ theme }) => theme.cardBg};
    padding: 10px;
    border-radius: 4px;
    font-size: 0.85rem;
  }
`;

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState('');
    const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [errorDetails, setErrorDetails] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                setLoading(true);

                // Verificar si el token es válido antes de hacer la solicitud
                if (!token) {
                    setError('No se proporcionó un token de verificación válido');
                    setLoading(false);
                    return;
                }

                // URL base de la API - asegúrate de que coincida con tu configuración
                const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
                const url = `${baseUrl}/users/verify-email/${token}/`;

                console.log("Intentando verificar token en:", url);

                // Llamada a la API para verificar el token
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                // Verificar si la respuesta es JSON
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();

                    if (response.ok) {
                        // Verificar si el mensaje indica que la cuenta ya estaba verificada
                        if (data.status === "already_verified" ||
                            (data.message && data.message.includes("ya está activa"))) {
                            setIsAlreadyVerified(true);
                        } else {
                            setVerified(true);
                        }

                        dispatch(showNotification({
                            message: data.message || 'Email verificado correctamente',
                            type: 'success'
                        }));
                    } else {
                        setError(data.error || 'Error al verificar el token');
                        setErrorDetails(JSON.stringify(data, null, 2));

                        dispatch(showNotification({
                            message: data.error || 'Error al verificar el email',
                            type: 'error'
                        }));
                    }
                } else {
                    // La respuesta no es JSON
                    const textResponse = await response.text();
                    console.error("Respuesta no JSON:", textResponse);
                    setError('El servidor devolvió una respuesta no válida');
                    setErrorDetails(textResponse);
                    setConnectionError(true);
                }

            } catch (error) {
                console.error("Error durante la verificación:", error);
                setError('Error al conectar con el servidor');
                setErrorDetails(error.toString());
                setConnectionError(true);

                dispatch(showNotification({
                    message: 'Error de conexión al verificar el email',
                    type: 'error'
                }));
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token, dispatch]);

    if (loading) {
        return <Loader type="cartoon" text="Verificando correo electrónico..." />;
    }

    return (
        <VerifyContainer>
            <PageTitle>Verificación de Cuenta</PageTitle>

            <MessageCard>
                {verified && (
                    <>
                        <StatusIcon success>
                            <FiCheckCircle />
                        </StatusIcon>
                        <h2>¡Cuenta Verificada Correctamente!</h2>
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
                )}

                {isAlreadyVerified && (
                    <>
                        <StatusIcon success>
                            <FiCheckCircle />
                        </StatusIcon>
                        <h2>Cuenta ya Verificada</h2>
                        <Message>
                            Esta cuenta ya fue verificada anteriormente.
                            Puedes iniciar sesión normalmente.
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
                )}

                {connectionError && (
                    <>
                        <StatusIcon warning>
                            <FiAlertTriangle />
                        </StatusIcon>
                        <h2>Error de Conexión</h2>
                        <Message>
                            Error al conectar con el servidor. Por favor, verifica que el servidor esté en funcionamiento
                            e intenta nuevamente más tarde.
                        </Message>
                        <ButtonContainer>
                            <Button
                                onClick={() => window.location.reload()}
                                cartoon
                                variant="secondary"
                                style={{ marginRight: '10px' }}
                            >
                                Intentar Nuevamente
                            </Button>
                            <Button
                                to="/"
                                cartoon
                            >
                                Ir al Inicio
                            </Button>
                        </ButtonContainer>

                        {errorDetails && (
                            <ErrorDetails>
                                <h4>Detalles del error (para desarrolladores):</h4>
                                <pre>{errorDetails}</pre>
                            </ErrorDetails>
                        )}
                    </>
                )}

                {error && !verified && !isAlreadyVerified && !connectionError && (
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

                        {errorDetails && (
                            <ErrorDetails>
                                <h4>Detalles del error (para desarrolladores):</h4>
                                <pre>{errorDetails}</pre>
                            </ErrorDetails>
                        )}
                    </>
                )}
            </MessageCard>
        </VerifyContainer>
    );
};

export default VerifyEmail;