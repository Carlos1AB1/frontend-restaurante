// src/pages/Home/CategorySection.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { pop, wiggle } from '../../styles/animations';
import { getCategoryImage, handleImageError } from '../../utils/imageHelpers';
import { FiGrid, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SectionContainer = styled.section`
  padding: 20px 0;
  position: relative;
  /* Agregar padding lateral para que las flechas no se corten */
  padding-left: 40px;
  padding-right: 40px;
  
  @media (max-width: 768px) {
    padding-left: 30px;
    padding-right: 30px;
  }
  
  @media (max-width: 480px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin: 0;
  color: ${({ theme }) => theme.heading};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 60px;
    height: 4px;
    background-color: ${({ theme }) => theme.accent};
    border-radius: 2px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const CarouselContainer = styled.div`
  position: relative;
  /* Cambiar a visible para que las flechas se vean */
  overflow: visible;
  border-radius: 12px;
  /* Agregar margen para las flechas */
  margin: 0 30px;
  
  /* El contenido interno sí debe tener overflow hidden */
  .carousel-content {
    overflow: hidden;
    border-radius: 12px;
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.primary};
    outline-offset: 4px;
  }
  
  @media (max-width: 768px) {
    margin: 0 25px;
  }
  
  @media (max-width: 480px) {
    margin: 0;
  }
`;

const CarouselWrapper = styled.div`
  display: flex;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${props => props.translateX}%);
  will-change: transform;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  min-width: 100%;
  flex-shrink: 0;
  padding: 15px 10px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
    padding: 12px 8px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    padding: 10px 5px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
    gap: 15px;
    padding: 8px 5px;
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  border: 3px solid ${({ theme }) => theme.outlineColor};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  /* Posicionar las flechas completamente fuera del contenido */
  ${props => props.direction === 'left' ? 'left: -60px;' : 'right: -60px;'}
  
  /* Estilos específicos para los íconos */
  svg {
    width: 20px !important;
    height: 20px !important;
    color: white !important;
    stroke-width: 2 !important;
    flex-shrink: 0;
    display: block !important;
    fill: none !important;
    stroke: currentColor !important;
  }
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryDark};
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    
    svg {
      color: white;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${({ theme }) => theme.shadow};
    
    svg {
      color: #ccc;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
  
  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
    ${props => props.direction === 'left' ? 'left: -50px;' : 'right: -50px;'}
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
    ${props => props.direction === 'left' ? 'left: -45px;' : 'right: -45px;'}
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 480px) {
    /* En móviles pequeños, posicionar dentro del contenedor */
    ${props => props.direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
    
    svg {
      width: 14px;
      height: 14px;
      color: white;
    }
  }
`;

const CarouselIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
  
  @media (max-width: 480px) {
    margin-top: 20px;
    gap: 6px;
  }
`;

const Indicator = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${props => props.active ? props.theme.primary : props.theme.shadow};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    transform: scale(1.2);
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
  
  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
  }
`;

const CategoryCard = styled(Card)`
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  opacity: 1;
  transform: translateY(0);
  /* Asegurar que el hover no se corte */
  margin: 10px 0;
  
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
    const [currentSlide, setCurrentSlide] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const carouselRef = useRef(null);

    const handleCategoryClick = (slug) => {
        navigate(`/menu/category/${slug}`);
    };

    const handleViewAllMenu = () => {
        navigate('/menu');
    };

    // Configuración del carrusel
    const categoriesPerSlide = 4;
    const totalSlides = categories?.length ? Math.ceil(categories.length / categoriesPerSlide) : 0;
    const canGoNext = currentSlide < totalSlides - 1;
    const canGoPrev = currentSlide > 0;

    const nextSlide = () => {
        if (canGoNext) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (canGoPrev) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const goToSlide = (slideIndex) => {
        setCurrentSlide(slideIndex);
    };

    // Funciones para el deslizamiento táctil
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe && canGoNext) {
            nextSlide();
        }
        if (isRightSwipe && canGoPrev) {
            prevSlide();
        }

        // Reset
        setTouchStart(0);
        setTouchEnd(0);
    };

    // Navegación por teclado - Mover ANTES del return condicional
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft' && canGoPrev) {
                prevSlide();
            } else if (e.key === 'ArrowRight' && canGoNext) {
                nextSlide();
            }
        };

        // Solo agregar listener si el carrusel está en foco
        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener('keydown', handleKeyDown);
            return () => carousel.removeEventListener('keydown', handleKeyDown);
        }
    }, [canGoPrev, canGoNext, currentSlide]);

    // Return condicional DESPUÉS de todos los hooks
    if (!categories || categories.length === 0) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>Nuestras Categorías</SectionTitle>
                </SectionHeader>
                <NoCategories>No hay categorías disponibles en este momento.</NoCategories>
            </SectionContainer>
        );
    }

    // Crear grupos de categorías para cada slide
    const categorySlides = [];
    for (let i = 0; i < totalSlides; i++) {
        const start = i * categoriesPerSlide;
        const end = start + categoriesPerSlide;
        categorySlides.push(categories.slice(start, end));
    }

    // Calcular el desplazamiento
    const translateX = currentSlide * -100;

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>Nuestras Categorías</SectionTitle>
                <HeaderActions>
                    <Button 
                        variant="outline" 
                        onClick={handleViewAllMenu}
                    >
                        <FiGrid />
                        Ver Menú Completo
                    </Button>
                </HeaderActions>
            </SectionHeader>
            
            <CarouselContainer 
                ref={carouselRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                tabIndex={0}
                role="region"
                aria-label="Carrusel de categorías"
            >
                {/* Botón anterior */}
                {canGoPrev && (
                    <NavigationButton 
                        direction="left" 
                        onClick={prevSlide}
                        disabled={!canGoPrev}
                        aria-label="Categorías anteriores"
                    >
                        <FiChevronLeft size={20} />
                    </NavigationButton>
                )}

                {/* Contenedor con overflow hidden para el carrusel */}
                <div className="carousel-content">
                    <CarouselWrapper translateX={translateX}>
                        {categorySlides.map((slideCategories, slideIndex) => (
                            <CategoriesGrid key={slideIndex}>
                                {slideCategories.map(category => (
                                    <CategoryCard
                                        key={category.id}
                                        elevated
                                        onClick={() => handleCategoryClick(category.slug)}
                                        cartoon
                                    >
                                        <CategoryImage 
                                            src={getCategoryImage(category)} 
                                            alt={category.name}
                                            onError={(e) => handleImageError(e, '/assets/images/food-icons/burger.png')}
                                        />
                                        <CategoryName>{category.name}</CategoryName>
                                    </CategoryCard>
                                ))}
                            </CategoriesGrid>
                        ))}
                    </CarouselWrapper>
                </div>

                {/* Botón siguiente */}
                {canGoNext && (
                    <NavigationButton 
                        direction="right" 
                        onClick={nextSlide}
                        disabled={!canGoNext}
                        aria-label="Categorías siguientes"
                    >
                        <FiChevronRight size={20} />
                    </NavigationButton>
                )}
            </CarouselContainer>

            {/* Indicadores */}
            {totalSlides > 1 && (
                <CarouselIndicators>
                    {Array.from({ length: totalSlides }, (_, index) => (
                        <Indicator
                            key={index}
                            active={index === currentSlide}
                            onClick={() => goToSlide(index)}
                        />
                    ))}
                </CarouselIndicators>
            )}
        </SectionContainer>
    );
};

export default CategorySection;