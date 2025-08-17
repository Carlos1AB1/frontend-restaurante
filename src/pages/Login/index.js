// src/pages/Login/index.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { login } from '../../store/slices/authSlice';
import Button from '../../components/common/Button';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const LoginContainer = styled.div`
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

const LoginCard = styled.div`
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

const ForgotPassword = styled(Link)`
  font-size: 0.9rem;
  text-align: right;
  color: ${({ theme }) => theme.primary};
  margin-top: -10px;
  display: block;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: 10px;
`;

const RegisterLink = styled.div`
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

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, loading, error } = useSelector(state => state.auth);

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    // Obtener la página a redirigir después del login (si viene de otra página)
    const from = location.state?.from || '/';

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials({
            ...credentials,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(credentials));
    };

    return (
        <LoginContainer>
            <PageTitle>Iniciar Sesión</PageTitle>

            <LoginCard>
                <Form onSubmit={handleSubmit}>
                    <FormGroup>
                        <label htmlFor="email">
                            <FiMail /> Email
                        </label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <label htmlFor="password">
                            <FiLock /> Contraseña
                        </label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleInputChange}
                            required
                        />
                    </FormGroup>

                    <ForgotPassword to="/reset-password">
                        ¿Olvidaste tu contraseña?
                    </ForgotPassword>

                    {error && (
                        <ErrorMessage>
                            {error.message || 'Error de autenticación. Por favor, verifica tus credenciales.'}
                        </ErrorMessage>
                    )}

                    <SubmitButton
                        type="submit"
                        cartoon
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Iniciando sesión...' : (
                            <>
                                <FiLogIn /> Iniciar Sesión
                            </>
                        )}
                    </SubmitButton>
                </Form>

                <RegisterLink>
                    ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
                </RegisterLink>
            </LoginCard>
        </LoginContainer>
    );
};

export default Login;