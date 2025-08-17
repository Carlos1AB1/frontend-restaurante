// src/pages/Register/index.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { register, clearError, clearRegistrationSuccess } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';

const RegisterContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 30px;
  text-align: center;
`;

const RegisterCard = styled.div`
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
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

const SubmitButton = styled(Button)`
  margin-top: 10px;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  
  a {
    color: ${({ theme }) => theme.primary};
    font-weight: bold;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SuccessMessage = styled.div`
  background-color: ${({ theme }) => theme.success + '30'};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  
  h3 {
    color: ${({ theme }) => theme.success};
    margin-bottom: 10px;
  }
  
  p {
    color: ${({ theme }) => theme.text};
    margin-bottom: 15px;
  }
`;

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error, registrationSuccess } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password2: ''
    });

    const [errors, setErrors] = useState({});

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }

        // Limpiar estado de éxito al desmontar
        return () => {
            if (registrationSuccess) {
                dispatch(clearRegistrationSuccess());
            }
        };
    }, [isAuthenticated, navigate, registrationSuccess, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar errores de formulario local
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }

        // Limpiar error de redux si estamos escribiendo
        if (error) {
            dispatch(clearError());
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = 'El nombre es obligatorio';
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = 'Los apellidos son obligatorios';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

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
            dispatch(register(formData));
        }
    };

    return (
        <RegisterContainer>
            <PageTitle>Crear Cuenta</PageTitle>

            {registrationSuccess ? (
                <SuccessMessage>
                    <h3>¡Registro exitoso!</h3>
                    <p>Tu cuenta ha sido creada. Hemos enviado un correo electrónico con un enlace para verificar tu dirección de correo.</p>
                    <p>Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.</p>
                    <Button to="/login" cartoon>Ir a Iniciar Sesión</Button>
                </SuccessMessage>
            ) : (
                <RegisterCard>
                    <Form onSubmit={handleSubmit}>
                        <FormRow>
                            <FormGroup>
                                <label htmlFor="first_name">
                                    <FiUser /> Nombre
                                </label>
                                <Input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.first_name && <ErrorMessage>{errors.first_name}</ErrorMessage>}
                            </FormGroup>

                            <FormGroup>
                                <label htmlFor="last_name">
                                    <FiUser /> Apellidos
                                </label>
                                <Input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    required
                                />
                                {errors.last_name && <ErrorMessage>{errors.last_name}</ErrorMessage>}
                            </FormGroup>
                        </FormRow>

                        <FormGroup>
                            <label htmlFor="email">
                                <FiMail /> Email
                            </label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                        </FormGroup>

                        <FormRow>
                            <FormGroup>
                                <label htmlFor="password">
                                    <FiLock /> Contraseña
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
                        </FormRow>

                        {error && (
                            <ErrorMessage>
                                {error.message || 'Error al registrarse. Por favor, inténtalo de nuevo.'}
                            </ErrorMessage>
                        )}

                        <SubmitButton
                            type="submit"
                            cartoon
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'Procesando...' : (
                                <>
                                    <FiUserPlus /> Crear Cuenta
                                </>
                            )}
                        </SubmitButton>
                    </Form>

                    <LoginLink>
                        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                    </LoginLink>
                </RegisterCard>
            )}
        </RegisterContainer>
    );
};

export default Register;