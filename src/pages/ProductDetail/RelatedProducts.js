// src/pages/ProductDetail/RelatedProducts.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchProducts } from '../../store/slices/menuSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/common/Loader';

const Container = styled.div`
  margin-top: 40px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.heading};
`;

const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
`;

const ProductCard = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.cardBg};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 20px ${({ theme }) => theme.shadow};
  }
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 4px 4px 0 ${({ theme }) => theme.shadowStrong};
`;

const ProductImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const ProductInfo = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  font-size: 1rem;
  margin: 0 0 10px 0;
  color: ${({ theme }) => theme.heading};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
`;

const NoProducts = styled.p`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.text};
`;

const RelatedProducts = ({ category, currentProductId }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading } = useSelector(state => state.menu);

    useEffect(() => {
        if (category) {
            dispatch(fetchProducts({ category__id: category, limit: 4 }));
        }
    }, [dispatch, category]);

    const handleProductClick = (slug) => {
        navigate(`/product/${slug}`);
    };

    if (loading) {
        return <Loader />;
    }

    // Filtrar el producto actual de la lista de relacionados
    const relatedProducts = products.filter(product => product.id !== currentProductId);

    if (relatedProducts.length === 0) {
        return (
            <Container>
                <Title>Productos Relacionados</Title>
                <NoProducts>No hay productos relacionados disponibles.</NoProducts>
            </Container>
        );
    }

    // Mostrar máximo 4 productos relacionados
    const displayProducts = relatedProducts.slice(0, 4);

    return (
        <Container>
            <Title>Productos Relacionados</Title>
            <ProductsContainer>
                {displayProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        onClick={() => handleProductClick(product.slug)}
                    >
                        <ProductImage
                            src={product.image || '/assets/images/food-items/default-dish.jpg'}
                            alt={product.name}
                        />
                        <ProductInfo>
                            <ProductName>{product.name}</ProductName>
                            <ProductPrice>{product.price.toFixed(2)} €</ProductPrice>
                        </ProductInfo>
                    </ProductCard>
                ))}
            </ProductsContainer>
        </Container>
    );
};

export default RelatedProducts;
