// src/pages/Menu/ProductGrid.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiStar, FiShoppingCart, FiEye } from 'react-icons/fi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { showNotification } from '../../store/slices/uiSlice';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 30px;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProductCard = styled(Card)`
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const ProductImage = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.shadow};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const OverlayIcons = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  opacity: 0;
  transition: all 0.3s ease;
  
  ${ProductImage}:hover & {
    opacity: 1;
  }
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  color: ${({ theme }) => theme.text};
  
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  color: ${({ theme }) => theme.heading};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ProductDescription = styled.p`
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
  margin-bottom: 15px;
`;

const Price = styled.span`
  font-size: 1.3rem;
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
    fill: ${({ theme }) => theme.accent};
  }
`;

const AddToCartButton = styled(Button)`
  width: 100%;
`;

const ProductGrid = ({ products }) => {
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

    // Función para formatear el precio
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return price.toFixed(2);
        } else if (typeof price === 'string') {
            return parseFloat(price).toFixed(2);
        }
        return price;
    };

    return (
        <Grid>
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    elevated
                >
                    <ProductImage>
                        <img
                            src={product.image || `/assets/images/food-items/default-dish.jpg`}
                            alt={product.name}
                        />
                        <OverlayIcons>
                            <IconButton onClick={() => handleViewDetails(product.slug)}>
                                <FiEye />
                            </IconButton>
                            <IconButton onClick={() => handleAddToCart(product)}>
                                <FiShoppingCart />
                            </IconButton>
                        </OverlayIcons>
                    </ProductImage>

                    <ProductInfo>
                        <ProductName>{product.name}</ProductName>
                        <ProductDescription>{product.description}</ProductDescription>

                        <PriceRow>
                            <Price>{formatPrice(product.price)} €</Price>
                            {product.average_rating > 0 && (
                                <Rating>
                                    <FiStar />
                                    {product.average_rating.toFixed(1)}
                                </Rating>
                            )}
                        </PriceRow>

                        <AddToCartButton
                            small
                            onClick={() => handleAddToCart(product)}
                            cartoon
                        >
                            <FiShoppingCart /> Añadir al carrito
                        </AddToCartButton>
                    </ProductInfo>
                </ProductCard>
            ))}
        </Grid>
    );
};

export default ProductGrid;