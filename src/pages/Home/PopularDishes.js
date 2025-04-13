import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { showNotification } from '../../store/slices/uiSlice';

const SectionContainer = styled.section`
  padding: 20px 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
  
  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.heading};
  margin: 0;
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
  
  @media (max-width: 768px) {
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const DishesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 30px;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const DishCard = styled(Card)`
  border-radius: 12px;
  overflow: hidden;
`;

const DishInfo = styled.div`
  padding: 15px;
`;

const DishName = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  color: ${({ theme }) => theme.heading};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DishDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.7rem;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.accent};
  
  svg {
    color: ${({ theme }) => theme.accent};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const CardButton = styled(Button)`
  flex: 1;
  padding: 8px 15px;
  font-size: 0.9rem;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.text};
`;

const PopularDishes = ({ products }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleViewDetails = (slug) => {
        navigate(`/product/${slug}`);
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart({
            product_id: product.id,
            quantity: 1
        }));

        dispatch(showNotification({
            message: `¡${product.name} añadido al carrito!`,
            type: 'success'
        }));
    };

    if (!products || products.length === 0) {
        return (
            <SectionContainer>
                <SectionHeader>
                    <SectionTitle>Platos Populares</SectionTitle>
                    <Button to="/menu" variant="outline">Ver Todos</Button>
                </SectionHeader>
                <NoProducts>No hay productos disponibles en este momento.</NoProducts>
            </SectionContainer>
        );
    }

    // Limitar a 4 productos para la página de inicio
    const displayProducts = products.slice(0, 4);

    return (
        <SectionContainer>
            <SectionHeader>
                <SectionTitle>Platos Populares</SectionTitle>
                <Button to="/menu" variant="outline" cartoon>Ver Todos</Button>
            </SectionHeader>

            <DishesGrid>
                {displayProducts.map(product => (
                    <DishCard
                        key={product.id}
                        elevated
                        hoverable
                    >
                        <img
                            src={product.image || `/assets/images/food-items/default-dish.jpg`}
                            alt={product.name}
                            style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                        />

                        <DishInfo>
                            <DishName>{product.name}</DishName>
                            <DishDescription>{product.description}</DishDescription>

                            <PriceRow>
                                <Price>{product.price} €</Price>
                                {product.average_rating > 0 && (
                                    <Rating>
                                        <FiStar />
                                        {product.average_rating.toFixed(1)}
                                    </Rating>
                                )}
                            </PriceRow>

                            <ButtonsContainer>
                                <CardButton
                                    small
                                    variant="outline"
                                    onClick={() => handleViewDetails(product.slug)}
                                >
                                    Ver Detalles
                                </CardButton>
                                <CardButton
                                    small
                                    onClick={() => handleAddToCart(product)}
                                    cartoon
                                >
                                    <FiShoppingCart /> Añadir
                                </CardButton>
                            </ButtonsContainer>
                        </DishInfo>
                    </DishCard>
                ))}
            </DishesGrid>
        </SectionContainer>
    );
};

export default PopularDishes;