import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/common/Button';
import { showNotification } from '../../store/slices/uiSlice';
import { useDispatch } from 'react-redux';
import { FiSend, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const ContactContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 30px;
  text-align: center;
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ContactFormContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.heading};
  margin: 0 0 20px 0;
`;

const ContactForm = styled.form`
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
`;

const SubmitButton = styled(Button)`
  align-self: flex-end;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 0.9rem;
  margin-top: 5px;
`;

const ContactInfoContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.heading};
  margin: 0 0 20px 0;
`;

const InfoItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-bottom: 30px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  
  .icon-container {
    background-color: ${({ theme }) => theme.primaryLight};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.primary};
    
    /* Cartoon style */
    border: 2px solid ${({ theme }) => theme.outlineColor};
  }
  
  .info-content {
    .label {
      font-weight: bold;
      color: ${({ theme }) => theme.heading};
      margin-bottom: 5px;
    }
    
    .value {
      color: ${({ theme }) => theme.text};
      line-height: 1.5;
    }
  }
`;

const MapContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  height: 200px;
  background-color: ${({ theme }) => theme.shadow};
  position: relative;
  
  /* Placeholder for map */
  &::after {
    content: 'Mapa no disponible en modo de demostración';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${({ theme }) => theme.text};
    text-align: center;
    width: 100%;
    padding: 0 20px;
  }
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
`;

const Contact = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Limpiar error para este campo si existe
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'El asunto es obligatorio';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'El mensaje es obligatorio';
        } else if (formData.message.trim().length < 20) {
            newErrors.message = 'El mensaje debe tener al menos 20 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            setLoading(true);

            // Simulación de envío
            setTimeout(() => {
                setLoading(false);

                // Limpiar formulario
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });

                dispatch(showNotification({
                    message: '¡Mensaje enviado correctamente! Te responderemos lo antes posible.',
                    type: 'success'
                }));
            }, 1500);
        }
    };

    return (
        <ContactContainer>
            <PageTitle>Contacto</PageTitle>

            <ContactContent>
                <ContactFormContainer>
                    <FormTitle>Envíanos un mensaje</FormTitle>

                    <ContactForm onSubmit={handleSubmit}>
                        <FormGroup>
                            <label htmlFor="name">Nombre</label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="email">Email</label>
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

                        <FormGroup>
                            <label htmlFor="subject">Asunto</label>
                            <Input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.subject && <ErrorMessage>{errors.subject}</ErrorMessage>}
                        </FormGroup>

                        <FormGroup>
                            <label htmlFor="message">Mensaje</label>
                            <TextArea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                            />
                            {errors.message && <ErrorMessage>{errors.message}</ErrorMessage>}
                        </FormGroup>

                        <SubmitButton
                            type="submit"
                            cartoon
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : (
                                <>
                                    <FiSend /> Enviar Mensaje
                                </>
                            )}
                        </SubmitButton>
                    </ContactForm>
                </ContactFormContainer>

                <ContactInfoContainer>
                    <InfoTitle>Información de Contacto</InfoTitle>

                    <InfoItems>
                        <InfoItem>
                            <div className="icon-container">
                                <FiMapPin />
                            </div>
                            <div className="info-content">
                                <div className="label">Dirección</div>
                                <div className="value">
                                    Armenia, Quindío<br />
                                </div>
                            </div>
                        </InfoItem>

                        <InfoItem>
                            <div className="icon-container">
                                <FiPhone />
                            </div>
                            <div className="info-content">
                                <div className="label">Teléfono</div>
                                <div className="value">+57 318 348 7086</div>
                            </div>
                        </InfoItem>

                        <InfoItem>
                            <div className="icon-container">
                                <FiMail />
                            </div>
                            <div className="info-content">
                                <div className="label">Email</div>
                                <div className="value">Cabaron_23@cue.edu.co</div>
                            </div>
                        </InfoItem>

                        <InfoItem>
                            <div className="icon-container">
                                <FiClock />
                            </div>
                            <div className="info-content">
                                <div className="label">Horario</div>
                                <div className="value">
                                    Lunes - Viernes: 12:00 - 22:00<br />
                                    Fines de Semana: 12:00 - 23:00
                                </div>
                            </div>
                        </InfoItem>
                    </InfoItems>

                    <MapContainer />
                </ContactInfoContainer>
            </ContactContent>
        </ContactContainer>
    );
};

export default Contact;