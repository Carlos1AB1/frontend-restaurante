// src/components/common/Layout/index.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Header from '../Header';
import Footer from '../Footer';
import { closeMobileMenu } from '../../../store/slices/uiSlice';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background};
  transition: background-color 0.3s ease;
`;

const Main = styled.main`
  flex: 1;
  padding: 20px;
  margin-top: 70px; // Altura del header
  
  @media (min-width: 768px) {
    padding: 30px 50px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9;
  transition: opacity 0.3s ease;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
`;

const Layout = ({ children }) => {
    const dispatch = useDispatch();
    const { mobileMenuOpen } = useSelector(state => state.ui);

    const handleOverlayClick = () => {
        dispatch(closeMobileMenu());
    };

    return (
        <LayoutContainer>
            <Header />
            <Overlay isOpen={mobileMenuOpen} onClick={handleOverlayClick} />
            <Main>{children}</Main>
            <Footer />
        </LayoutContainer>
    );
};

export default Layout;