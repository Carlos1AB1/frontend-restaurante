// src/components/common/Footer/index.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiInstagram, FiFacebook, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { float } from '../../../styles/animations';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.footer};
  color: ${({ theme }) => theme.footerText};
  padding: 40px 20px 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: ${({ theme }) => theme.cartoonGradient};
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FooterSection = styled.div`
  animation: ${float} 6s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  font-family: 'Bubblegum Sans', cursive;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 15px;
  
  img {
    height: 40px;
    margin-right: 10px;
  }
`;

const FooterText = styled.p`
  margin-bottom: 15px;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const FooterTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  color: ${({ theme }) => theme.primary};
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 50px;
    height: 3px;
    background-color: ${({ theme }) => theme.primary};
    border-radius: 2px;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 10px;
  
  a {
    color: ${({ theme }) => theme.footerText};
    transition: all 0.3s ease;
    position: relative;
    padding-left: 15px;
    
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.primary};
    }
    
    &:hover {
      color: ${({ theme }) => theme.primary};
      transform: translateX(5px);
    }
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  svg {
    margin-right: 10px;
    color: ${({ theme }) => theme.primary};
    font-size: 1.2rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  margin-top: 20px;
`;

const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background-color: ${({ theme }) => theme.primaryDark};
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
`;

const FooterDecorations = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  height: 200px;
  pointer-events: none;
  opacity: 0.1;
  overflow: hidden;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const DoodleIcon = styled.img`
  position: absolute;
  width: 50px;
  height: 50px;
  animation: ${float} 6s ease-in-out infinite;
  opacity: 0.3;
  
  &:nth-child(1) {
    left: 10%;
    top: 20px;
    animation-delay: 0s;
  }
  
  &:nth-child(2) {
    left: 20%;
    top: 80px;
    animation-delay: 1s;
  }
  
  &:nth-child(3) {
    left: 50%;
    top: 60px;
    animation-delay: 2s;
  }
  
  &:nth-child(4) {
    left: 70%;
    top: 20px;
    animation-delay: 3s;
  }
  
  &:nth-child(5) {
    left: 80%;
    top: 70px;
    animation-delay: 4s;
  }
`;

const Footer = () => {
    return (
        <FooterContainer>
            <FooterContent>
                <FooterSection delay="0s">
                    <LogoContainer to="/">
                        <img src="/assets/images/logo.png" alt="Restaurant Logo" />
                        Foodie
                    </LogoContainer>
                    <FooterText>
                        Deliciosa comida preparada con ingredientes frescos y mucho amor.
                        Disfruta de nuestra variedad de platos en un ambiente acogedor o desde la
                        comodidad de tu casa.
                    </FooterText>
                    <SocialLinks>
                        <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FiInstagram />
                        </SocialIcon>
                        <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FiFacebook />
                        </SocialIcon>
                        <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FiTwitter />
                        </SocialIcon>
                    </SocialLinks>
                </FooterSection>

                <FooterSection delay="0.1s">
                    <FooterTitle>Enlaces Rápidos</FooterTitle>
                    <FooterLinks>
                        <FooterLink>
                            <Link to="/">Inicio</Link>
                        </FooterLink>
                        <FooterLink>
                            <Link to="/menu">Menú</Link>
                        </FooterLink>
                        <FooterLink>
                            <Link to="/orders">Mis Pedidos</Link>
                        </FooterLink>
                        <FooterLink>
                            <Link to="/contact">Contacto</Link>
                        </FooterLink>
                    </FooterLinks>
                </FooterSection>

                <FooterSection delay="0.2s">
                    <FooterTitle>Horarios</FooterTitle>
                    <FooterText>
                        <strong>Lunes - Viernes</strong>
                        <br />
                        12:00 PM - 10:00 PM
                    </FooterText>
                    <FooterText>
                        <strong>Sábados y Domingos</strong>
                        <br />
                        12:00 PM - 11:00 PM
                    </FooterText>
                    <FooterText>
                        <strong>Servicio a domicilio</strong>
                        <br />
                        Todos los días hasta las 9:30 PM
                    </FooterText>
                </FooterSection>

                <FooterSection delay="0.3s">
                    <FooterTitle>Contacto</FooterTitle>
                    <ContactItem>
                        <FiMapPin />
                        <span>Calle Ejemplo 123, Ciudad</span>
                    </ContactItem>
                    <ContactItem>
                        <FiPhone />
                        <span>+34 123 456 789</span>
                    </ContactItem>
                    <ContactItem>
                        <FiMail />
                        <span>info@foodie.com</span>
                    </ContactItem>
                </FooterSection>
            </FooterContent>

            <FooterBottom>
                <p>&copy; {new Date().getFullYear()} Foodie. Todos los derechos reservados.</p>
            </FooterBottom>

            <FooterDecorations>
                <DoodleIcon src="/assets/images/food-icons/pizza.svg" alt="" />
                <DoodleIcon src="/assets/images/food-icons/burger.svg" alt="" />
                <DoodleIcon src="/assets/images/food-icons/taco.svg" alt="" />
                <DoodleIcon src="/assets/images/food-icons/soda.svg" alt="" />
                <DoodleIcon src="/assets/images/food-icons/salad.svg" alt="" />
            </FooterDecorations>
        </FooterContainer>
    );
};

export default Footer;