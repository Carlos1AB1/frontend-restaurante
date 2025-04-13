// src/pages/Home/CategorySection.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../components/common/Card';
import { pop, wiggle } from '../../styles/animations';

const SectionContainer = styled.section`
  padding: 20px 0;
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

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
  }
`;

const CategoryCard = styled(Card)`
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    
    img {
      animation: ${wiggle} 0.5s ease;
    }
  }
`;

const CategoryImage = styled.img`
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const CategoryName = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  color: ${({ theme }) => theme.heading};
`;

const NoCategories = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.text};
`;

const CategorySection = ({ categories }) => {
    const navigate = useNavigate();

    const handleCategoryClick = (slug) => {
        navigate(`/menu/category/${slug}`);
    };

    if (!categories || categories.length === 0) {
        return (
            <SectionContainer>
                <SectionTitle>Nuestras Categorías</SectionTitle>
                <NoCategories>No hay categorías disponibles en este momento.</NoCategories>
            </SectionContainer>
        );
    }

    // Limitar a 4 categorías para la página de inicio
    const displayCategories = categories.slice(0, 4);

    return (
        <SectionContainer>
            <SectionTitle>Nuestras Categorías</SectionTitle>
            <CategoriesGrid>
                {displayCategories.map(category => {
                    // Asignar una imagen predeterminada basada en el nombre o slug de la categoría
                    let imageSrc = '/assets/images/food-icons/default.svg';
                    if (category.name.toLowerCase().includes('burger') ||
                        category.name.toLowerCase().includes('hamburguesa')) {
                        imageSrc = '/assets/images/food-icons/burger.png';
                    } else if (category.name.toLowerCase().includes('pizza')) {
                        imageSrc = '/assets/images/food-icons/pizza.png';
                    } else if (category.name.toLowerCase().includes('bebida') ||
                        category.name.toLowerCase().includes('drink')) {
                        imageSrc = '/assets/images/food-icons/bebida.png';
                    } else if (category.name.toLowerCase().includes('postre') ||
                        category.name.toLowerCase().includes('dessert')) {
                        imageSrc = '/assets/images/food-icons/postres.png';
                    }

                    return (
                        <CategoryCard
                            key={category.id}
                            elevated
                            onClick={() => handleCategoryClick(category.slug)}
                            cartoon
                        >
                            <CategoryImage src={imageSrc} alt={category.name} />
                            <CategoryName>{category.name}</CategoryName>
                        </CategoryCard>
                    );
                })}
            </CategoriesGrid>
        </SectionContainer>
    );
};

export default CategorySection;