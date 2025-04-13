// src/pages/Menu/MenuHeader.js
import React from 'react';
import styled from 'styled-components';
import { FiFilter } from 'react-icons/fi';

const HeaderContainer = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }
`;

const TitleSection = styled.div`
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 10px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 80px;
    height: 4px;
    background-color: ${({ theme }) => theme.accent};
    border-radius: 2px;
  }
`;

const ResultCount = styled.p`
  color: ${({ theme }) => theme.text};
  margin-top: 20px;
  font-size: 0.9rem;
`;

const SortingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SortLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }

  /* Estilo de caricatura */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
  
  &:hover {
    box-shadow: 2px 2px 0 ${({ theme }) => theme.shadowStrong};
    transform: translate(1px, 1px);
  }
`;

const MenuHeader = ({ title, totalProducts, sortBy, setSortBy }) => {
    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    return (
        <HeaderContainer>
            <TitleSection>
                <PageTitle>{title}</PageTitle>
                <ResultCount>
                    {totalProducts} {totalProducts === 1 ? 'producto encontrado' : 'productos encontrados'}
                </ResultCount>
            </TitleSection>

            <SortingContainer>
                <SortLabel htmlFor="sort-select">
                    <FiFilter />
                    Ordenar por:
                </SortLabel>
                <SortSelect
                    id="sort-select"
                    value={sortBy}
                    onChange={handleSortChange}
                >
                    <option value="name">Nombre</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                    <option value="rating">Mejor Valorados</option>
                </SortSelect>
            </SortingContainer>
        </HeaderContainer>
    );
};

export default MenuHeader;