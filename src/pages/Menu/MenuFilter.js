// src/pages/Menu/MenuFilter.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiChevronRight, FiStar, FiCheck } from 'react-icons/fi';

const FilterContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  overflow: hidden;
  position: sticky;
  top: 90px;
  
  /* Estilo de caricatura */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const FilterSection = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.heading};
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CategoryItem = styled.li`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  color: ${({ active, theme }) => active ? theme.primary : theme.text};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  
  svg {
    margin-left: auto;
    opacity: ${({ active }) => active ? 1 : 0};
    color: ${({ theme }) => theme.primary};
    transition: all 0.3s ease;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.shadow};
    
    svg {
      opacity: 1;
      transform: translateX(3px);
    }
  }
`;

const PriceRangeContainer = styled.div`
  margin-top: 15px;
`;

const RangeSlider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 5px;
  border-radius: 5px;
  background: ${({ theme }) => theme.border};
  outline: none;
  margin: 10px 0;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.outlineColor};
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    cursor: pointer;
    border: 2px solid ${({ theme }) => theme.outlineColor};
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-left: 10px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${({ theme }) => theme.primary};
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.border};
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const AvailabilityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
`;

const RatingContainer = styled.div`
  margin-top: 15px;
`;

const RatingOption = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.shadow};
  }
  
  ${({ active, theme }) => active && `
    background-color: ${theme.primaryLight};
    font-weight: bold;
  `}
`;

const StarContainer = styled.div`
  display: flex;
  margin-right: 5px;
`;

const StarIcon = styled(FiStar)`
  color: ${({ theme, active }) => active ? theme.accent : theme.border};
  margin-right: 2px;
  ${({ active }) => active && `
    fill: ${({ theme }) => theme.accent};
  `}
`;

const CheckIcon = styled(FiCheck)`
  margin-left: auto;
  color: ${({ theme }) => theme.primary};
  opacity: ${({ visible }) => visible ? 1 : 0};
`;

const MenuFilter = ({
                        categories,
                        currentCategory,
                        priceRange,
                        setPriceRange,
                        selectedAvailability,
                        setSelectedAvailability,
                        selectedRating,
                        setSelectedRating
                    }) => {
    const handlePriceChange = (e) => {
        setPriceRange([0, parseInt(e.target.value)]);
    };

    const handleAvailabilityChange = (e) => {
        setSelectedAvailability(e.target.checked);
    };

    const handleRatingClick = (rating) => {
        // Si ya está seleccionado, lo deselecciona
        if (rating === selectedRating) {
            setSelectedRating(0);
        } else {
            setSelectedRating(rating);
        }
    };

    const renderStars = (count) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <StarIcon
                    key={i}
                    active={i <= count}
                />
            );
        }
        return <StarContainer>{stars}</StarContainer>;
    };

    return (
        <FilterContainer>
            <FilterSection>
                <SectionTitle>Categorías</SectionTitle>
                <CategoryList>
                    <CategoryItem>
                        <CategoryLink
                            to="/menu"
                            active={!currentCategory ? 1 : 0}
                        >
                            Todas las categorías
                            <FiChevronRight />
                        </CategoryLink>
                    </CategoryItem>
                    {categories.map(category => (
                        <CategoryItem key={category.id}>
                            <CategoryLink
                                to={`/menu/category/${category.slug}`}
                                active={currentCategory && currentCategory.id === category.id ? 1 : 0}
                            >
                                {category.name}
                                <FiChevronRight />
                            </CategoryLink>
                        </CategoryItem>
                    ))}
                </CategoryList>
            </FilterSection>

            <FilterSection>
                <SectionTitle>Precio</SectionTitle>
                <PriceRangeContainer>
                    <RangeSlider
                        type="range"
                        min="0"
                        max="100"
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                    />
                    <PriceDisplay>
                        <span>{priceRange[0]}€</span>
                        <span>hasta</span>
                        <span>{priceRange[1]}€</span>
                    </PriceDisplay>
                </PriceRangeContainer>
            </FilterSection>

            <FilterSection>
                <SectionTitle>Disponibilidad</SectionTitle>
                <AvailabilityContainer>
                    <span>Solo productos disponibles</span>
                    <ToggleSwitch>
                        <ToggleInput
                            type="checkbox"
                            checked={selectedAvailability}
                            onChange={handleAvailabilityChange}
                        />
                        <ToggleSlider />
                    </ToggleSwitch>
                </AvailabilityContainer>
            </FilterSection>

            <FilterSection>
                <SectionTitle>Valoración</SectionTitle>
                <RatingContainer>
                    {[5, 4, 3, 2, 1].map(rating => (
                        <RatingOption
                            key={rating}
                            onClick={() => handleRatingClick(rating)}
                            active={rating === selectedRating}
                        >
                            {renderStars(rating)}
                            <span>{rating} {rating === 1 ? 'estrella' : 'estrellas'} o más</span>
                            <CheckIcon visible={rating === selectedRating} />
                        </RatingOption>
                    ))}
                </RatingContainer>
            </FilterSection>
        </FilterContainer>
    );
};

export default MenuFilter;