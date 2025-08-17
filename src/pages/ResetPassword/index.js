// src/pages/ResetPassword/index.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import { showNotification } from '../../store/slices/uiSlice';
import { FiMail, FiCheck } from 'react-icons/fi';
import authApi from '../../api/auth';

const ResetContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 30px;
  text-align: center;
`;

const ResetCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    display: flex;
    align-items: center;
    gap: 8px;
    
    svg {
      color: ${({ theme }) => theme.primary};
    }
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 0.9rem;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  background-color: ${({ theme }) => theme.success + '30'};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
  
  h3 {
    color: ${({ theme }) => theme.success};
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    
    svg {
      color: ${({ theme }) => theme.success};
    }
  }
  
  p {
    color: ${({ theme }) => theme.text};
    margin-bottom: 15px;
  }
`;

const InfoText = styled.p`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;

const ResetPassword = () => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [backendError, setBackendError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar errores
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
        setBackendError('');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);
            setBackendError('');

            try {
                // Hacer la llamada real al API
                await authApi.requestPasswordReset(formData.email);
                
                setLoading(false);
                setSuccess(true);

                dispatch(showNotification({
                    message: 'Se ha enviado un enlace de restablecimiento a tu correo electrónico',
                    type: 'success'
                }));

            } catch (error) {
                setLoading(false);
                
                // Manejar diferentes tipos de errores
                if (error.response) {
                    const status = error.response.status;
                    const data = error.response.data;
                    
                    if (status === 400) {
                        // Error de validación
                        if (data.email) {
                            setErrors({ email: Array.isArray(data.email) ? data.email[0] : data.email });
                        } else if (data.non_field_errors) {
                            setBackendError(Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors);
                        } else {
                            setBackendError('Error en los datos proporcionados');
                        }
                    } else if (status === 404) {
                        setErrors({ email: 'No se encontró una cuenta con este correo electrónico' });
                    } else {
                        setBackendError('Error del servidor. Por favor, inténtalo más tarde.');
                    }
                } else {
                    setBackendError('Error de conexión. Por favor, verifica tu conexión a internet.');
                }

                dispatch(showNotification({
                    message: 'Error al solicitar el restablecimiento de contraseña',
                    type: 'error'
                }));
            }
        }
    };

    return (
        <ResetContainer>
            <PageTitle>Restablecer Contraseña</PageTitle>

            <ResetCard>
                {success ? (
                    <SuccessMessage>
                        <h3><FiCheck /> Enlace Enviado</h3>
                        <p>Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico.</p>
                        <p>Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.</p>
                        <Button to="/login" cartoon>Volver al Inicio de Sesión</Button>
                    </SuccessMessage>
                ) : (
                    <>
                        <InfoText>
                            Introduce tu dirección de correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                        </InfoText>

                        {backendError && (
                            <ErrorMessage style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(255, 0, 0, 0.1)', borderRadius: '5px' }}>
                                {backendError}
                            </ErrorMessage>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <label htmlFor="email">
                                    <FiMail /> Correo Electrónico
                                </label>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="tu@ejemplo.com"
                                    required
                                />
                                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                            </FormGroup>

                            <Button
                                type="submit"
                                cartoon
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
                            </Button>
                        </Form>

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button to="/login" variant="outline" cartoon>
                                Volver al Inicio de Sesión
                            </Button>
                        </div>
                    </>
                )}
            </ResetCard>
        </ResetContainer>
    );
};

export default ResetPassword;
