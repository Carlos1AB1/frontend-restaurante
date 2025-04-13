// src/pages/ResetPasswordConfirm/index.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import { showNotification } from '../../store/slices/uiSlice';
import { FiLock, FiCheck } from 'react-icons/fi';

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

const TokenError = styled.div`
  background-color: ${({ theme }) => theme.error + '30'};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  
  h3 {
    color: ${({ theme }) => theme.error};
    margin-bottom: 10px;
  }
  
  p {
    color: ${({ theme }) => theme.text};
    margin-bottom: 15px;
  }
`;

const ResetPasswordConfirm = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        password: '',
        password2: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);

    useEffect(() => {
        // Simular validación del token
        if (!token || token.length < 10) {
            setTokenValid(false);
        }
    }, [token]);

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
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
        }

        if (formData.password !== formData.password2) {
            newErrors.password2 = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);

            // Simular la solicitud de cambio de contraseña
            setTimeout(() => {
                setLoading(false);
                setSuccess(true);

                dispatch(showNotification({
                    message: 'Tu contraseña ha sido restablecida correctamente',
                    type: 'success'
                }));

                // Redirigir al login después de unos segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }, 1500);
        }
    };

    if (!tokenValid) {
        return (
            <ResetContainer>
                <PageTitle>Enlace Inválido</PageTitle>

                <TokenError>
                    <h3>El enlace ha expirado o es inválido</h3>
                    <p>El enlace para restablecer la contraseña no es válido o ha expirado. Por favor, solicita un nuevo enlace.</p>
                    <Button to="/reset-password" cartoon>Solicitar Nuevo Enlace</Button>
                </TokenError>
            </ResetContainer>
        );
    }

    return (
        <ResetContainer>
            <PageTitle>Crear Nueva Contraseña</PageTitle>

            <ResetCard>
                {success ? (
                    <SuccessMessage>
                        <h3><FiCheck /> Contraseña Actualizada</h3>
                        <p>Tu contraseña ha sido restablecida correctamente.</p>
                        <p>Serás redirigido a la página de inicio de sesión en unos segundos...</p>
                        <Button to="/login" cartoon>Ir a Iniciar Sesión</Button>
                    </SuccessMessage>
                ) : (
                    <>
                        <InfoText>
                            Introduce tu nueva contraseña a continuación.
                        </InfoText>

                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <label htmlFor="password">
                                    <FiLock /> Nueva Contraseña
                                </label>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="password2">
                                    <FiLock /> Confirmar Contraseña
                                </label>
                                <Input
                                    type="password"
                                    id="password2"
                                    name="password2"
                                    value={formData.password2}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.password2 && <ErrorMessage>{errors.password2}</ErrorMessage>}
                            </FormGroup>

                            <Button
                                type="submit"
                                cartoon
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? 'Actualizando...' : (
                                    <>
                                        <FiCheck /> Restablecer Contraseña
                                    </>
                                )}
                            </Button>
                        </Form>
                    </>
                )}
            </ResetCard>
        </ResetContainer>
    );
};

export default ResetPasswordConfirm;