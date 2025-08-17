// src/pages/Home/HeroBanner.js
import React from 'react';
import styled, { keyframes } from 'styled-components';
import Button from '../../components/common/Button';
import { float } from '../../styles/animations';

// Animaciones
const float1 = keyframes`
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
`;

const float2 = keyframes`
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(-5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
`;

// Estilos base
const HeroSection = styled.section`
    padding: 40px 20px;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: 30px;
    position: relative;
    overflow: hidden;

    @media (min-width: 768px) {
        flex-direction: row;
        padding: 40px 0;
        min-height: calc(100vh - 200px);
    }
`;

const HeroContent = styled.div`
    text-align: center;
    z-index: 2;

    @media (min-width: 768px) {
        flex: 1;
        text-align: left;
    }
`;

const HeroTitle = styled.h1`
    font-size: 2.5rem;
    color: ${({ theme }) => theme.heading};
    margin-bottom: 20px;

    span {
        color: ${({ theme }) => theme.primary};
        position: relative;

        &::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            bottom: 5px;
            height: 8px;
            background-color: ${({ theme }) => theme.accent};
            z-index: -1;
            opacity: 0.5;
        }
    }

    @media (min-width: 768px) {
        font-size: 3.5rem;
    }
`;

const HeroSubtitle = styled.h2`
    font-size: 1.2rem;
    color: ${({ theme }) => theme.text};
    margin-bottom: 30px;
    font-weight: 400;

    @media (min-width: 768px) {
        font-size: 1.5rem;
        max-width: 90%;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
    justify-content: center;

    @media (min-width: 768px) {
        justify-content: flex-start;
    }
`;

const HeroImage = styled.div`
    position: relative;
    width: 100%;
    max-width: 500px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;

    @media (min-width: 768px) {
        flex: 1;
        height: 450px;
    }
`;

const MainFoodImage = styled.img`
    width: 280px;
    height: 280px;
    object-fit: contain;
    filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.2));
    z-index: 2;
    position: relative;

    @media (min-width: 768px) {
        width: 400px;
        height: 400px;
    }
`;

// EMOJI 1 - TAMAÑO CAMBIADO A 40px (móvil) y 50px (desktop)
const FloatingFood1 = styled.img`
    position: absolute;
    width: 65px;
    height: 65px;
    object-fit: contain;
    top: 55px;
    left: 20px;
    animation: ${float1} 5s ease-in-out infinite;
    filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.2));
    z-index: 5;

    @media (min-width: 768px) {
        width: 80px;
        height: 80px;
        top: 80px;
        left: 20px;
    }
`;

// EMOJI 2 - TAMAÑO CAMBIADO A 40px (móvil) y 50px (desktop)
const FloatingFood2 = styled.img`
    position: absolute;
    width: 65px;
    height: 65px;
    object-fit: contain;
    bottom: 25px;
    right: 65px;
    animation: ${float2} 6s ease-in-out infinite;
    filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.2));
    z-index: 5;

    @media (min-width: 768px) {
        width: 80px;
        height: 80px;
        bottom: 55px;
        right: 125px;
    }
`;

// EMOJI 3 - TAMAÑO CAMBIADO A 40px (móvil) y 50px (desktop)
const FloatingFood3 = styled.img`
    position: absolute;
    width: 65px;
    height: 65px;
    object-fit: contain;
    top: 20%;
    right: 10px;
    animation: ${float} 7s ease-in-out infinite;
    filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.2));
    z-index: 5;

    @media (min-width: 768px) {
        width: 80px;
        height: 80px;
        top: 20%;
        right: 20px;
    }
`;

const FloatingEmoji = styled.img`
    position: absolute;
    width: 65px;
    height: 65px;
    object-fit: contain;
    animation: ${float} 5s ease-in-out infinite;
    z-index: 5;
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));

    @media (min-width: 768px) {
        width: 50px;
        height: 50px;
    }
`;

const BackgroundCircle = styled.div`
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.primaryLight};
    opacity: 0.15;
    z-index: 1;

    @media (min-width: 768px) {
        width: 450px;
        height: 450px;
    }
`;

const HeroBanner = () => {
    return (
        <HeroSection>
            <HeroContent>
                <HeroTitle>
                    Deliciosa comida <span>a domicilio</span> desde tu dispositivo
                </HeroTitle>
                <HeroSubtitle>
                    Disfruta de nuestro menú de deliciosas hamburguesas, pizzas y mucho más sin salir de casa.
                </HeroSubtitle>
                <ButtonGroup>
                    <Button to="/menu" cartoon animated>
                        Ver Menú
                    </Button>
                    <Button to="/contact" variant="outline">
                        Contactar
                    </Button>
                </ButtonGroup>
            </HeroContent>

            <HeroImage>
                <BackgroundCircle />

                {/* Imagen principal */}
                <MainFoodImage src="/assets/images/food-items/imgmainARCHU.png" alt="Hamburguesa" />

                {/* Imágenes de emojis flotantes - ahora con tamaño ajustado y z-index mayor */}
                <FloatingFood1
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Drooling%20Face.png"
                    alt="Drooling Face"
                />
                <FloatingFood2
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Symbols/Check%20Mark%20Button.png"
                    alt="Check Mark Button"
                />
                <FloatingFood3
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Hearts.png"
                    alt="Smiling Face with Hearts"
                />
            </HeroImage>
        </HeroSection>
    );
};

export default HeroBanner;