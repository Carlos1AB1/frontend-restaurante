// src/pages/Home/Testimonials.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiStar } from 'react-icons/fi';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SectionContainer = styled.section`
  padding: 20px 0 60px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.heading};
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &::after {
    content: '';
    position: absolute;
    left: 25%;
    right: 25%;
    bottom: -10px;
    height: 4px;
    background-color: ${({ theme }) => theme.accent};
    border-radius: 2px;
  }
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TestimonialCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 25px;
  position: relative;
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: ${({ index }) => `${index * 0.2}s`};
  animation-fill-mode: both;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
  
  &::before {
    content: '"';
    position: absolute;
    top: 10px;
    left: 15px;
    font-size: 4rem;
    font-family: 'Georgia', serif;
    color: ${({ theme }) => theme.primaryLight};
    opacity: 0.5;
    line-height: 1;
  }
`;

const TestimonialText = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
  font-style: italic;
`;

const CustomerInfo = styled.div`
  display: flex;
  align-items: center;
`;

const CustomerAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primaryLight};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.primary};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CustomerName = styled.h4`
  font-size: 1.1rem;
  margin: 0 0 5px 0;
  color: ${({ theme }) => theme.heading};
`;

const Rating = styled.div`
  display: flex;
  color: ${({ theme }) => theme.accent};
`;

// --- CORRECCIÓN AQUÍ ---
// Renombra la prop a '$filled'
const StarIcon = styled(FiStar)`
  width: 16px;
  height: 16px;
  margin-right: 2px;
  // Usa '$filled' para el estilo
  fill: ${({ $filled, theme }) => $filled ? theme.accent : 'none'};
`;

const Testimonials = () => {
    // Array de testimonios de ejemplo
    const testimonials = [
        {
            id: 1,
            text: "¡Las mejores hamburguesas que he probado! El servicio de entrega fue rápido y la comida llegó caliente. Definitivamente volveré a pedir.",
            customer: {
                name: "María García",
                avatar: "/assets/images/avatars/avatar1.jpg",
                rating: 5
            }
        },
        {
            id: 2,
            text: "Me encantó la pizza con ingredientes frescos. La aplicación es muy fácil de usar y el seguimiento del pedido en tiempo real es genial.",
            customer: {
                name: "Carlos Rodríguez",
                avatar: "/assets/images/avatars/avatar2.jpg",
                rating: 4
            }
        },
        {
            id: 3,
            text: "La comida siempre llega a tiempo y con excelente temperatura. Sus ofertas son geniales y la variedad del menú es amplia. Un acierto seguro.",
            customer: {
                name: "Laura Martínez",
                avatar: "/assets/images/avatars/avatar3.jpg",
                rating: 5
            }
        }
    ];

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    // --- CORRECCIÓN AQUÍ ---
                    // Pasa la prop como '$filled'
                    $filled={i <= rating}
                />
            );
        }
        return stars;
    };

    return (
        <SectionContainer>
            <SectionTitle>Testimonios</SectionTitle>

            <TestimonialsGrid>
                {testimonials.map((testimonial, index) => (
                    <TestimonialCard key={testimonial.id} index={index}>
                        <TestimonialText>
                            {testimonial.text}
                        </TestimonialText>
                        <CustomerInfo>
                            <CustomerAvatar>
                                {/* Añadir alt text descriptivo */}
                                <img src={testimonial.customer.avatar} alt={`Avatar de ${testimonial.customer.name}`} />
                            </CustomerAvatar>
                            <div>
                                <CustomerName>{testimonial.customer.name}</CustomerName>
                                {/* Añadir aria-label para accesibilidad */}
                                <Rating aria-label={`Valoración: ${testimonial.customer.rating} de 5 estrellas`}>
                                    {renderStars(testimonial.customer.rating)}
                                </Rating>
                            </div>
                        </CustomerInfo>
                    </TestimonialCard>
                ))}
            </TestimonialsGrid>
        </SectionContainer>
    );
};

export default Testimonials;