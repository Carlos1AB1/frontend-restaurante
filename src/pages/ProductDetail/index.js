// src/pages/ProductDetail/index.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchProductDetail, clearCurrentProduct } from '../../store/slices/menuSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { showNotification } from '../../store/slices/uiSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ProductReviews from './ProductReviews';
import RelatedProducts from './RelatedProducts';
import { FiShoppingCart, FiMinus, FiPlus, FiStar, FiArrowLeft } from 'react-icons/fi';

const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.text};
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 0;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(-5px);
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const ProductContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProductImage = styled.div`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 8px 8px 0 ${({ theme }) => theme.shadowStrong};
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 10px;
`;

const ProductDescription = styled.p`
  color: ${({ theme }) => theme.text};
  line-height: 1.6;
  margin-bottom: 20px;
`;

const PriceRating = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  
  svg {
    color: ${({ theme }) => theme.accent};
  }
  
  span {
    font-weight: bold;
  }
`;

const CategoryTag = styled.div`
  display: inline-block;
  background-color: ${({ theme }) => theme.secondary};
  color: white;
  padding: 5px 15px;
  border-radius: 50px;
  font-size: 0.9rem;
  margin-bottom: 20px;
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const QuantityLabel = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  border-radius: 8px;
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background: ${({ theme }) => theme.cardBg};
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.shadow};
    color: ${({ theme }) => theme.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: ${({ theme }) => theme.cardBg};
`;

const AddToCartButton = styled(Button)`
  margin-bottom: 20px;
`;

const Availability = styled.div`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: ${({ available, theme }) => available ? theme.success : theme.error}30;
  color: ${({ available, theme }) => available ? theme.success : theme.error};
  margin-bottom: 20px;
  
  .status {
    font-weight: bold;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 30px 0;
`;

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct, loading, error } = useSelector(state => state.menu);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (slug) {
            dispatch(fetchProductDetail(slug));
        }

        // Limpiar producto actual al desmontar
        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, slug]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleQuantityChange = (value) => {
        setQuantity(prevQuantity => {
            const newQuantity = prevQuantity + value;
            return newQuantity < 1 ? 1 : newQuantity;
        });
    };

    const handleAddToCart = () => {
        if (currentProduct) {
            dispatch(addToCart({
                product_id: currentProduct.id,
                quantity: quantity
            }));

            dispatch(showNotification({
                message: `${quantity}x ${currentProduct.name} añadido al carrito`,
                type: 'success'
            }));
        }
    };

    if (loading) {
        return <Loader type="cartoon" text="Cargando producto..." />;
    }

    if (error || !currentProduct) {
        return (
            <ProductDetailContainer>
                <BackButton onClick={handleBack}>
                    <FiArrowLeft /> Volver
                </BackButton>
                <h1>Producto no encontrado</h1>
                <p>Lo sentimos, no pudimos encontrar el producto que buscas.</p>
                <Button to="/menu" cartoon>Ver Menú</Button>
            </ProductDetailContainer>
        );
    }

    return (
        <ProductDetailContainer>
            <BackButton onClick={handleBack}>
                <FiArrowLeft /> Volver al menú
            </BackButton>

            <ProductContent>
                <ProductImage>
                    <img
                        src={currentProduct.image || '/assets/images/food-items/default-dish.jpg'}
                        alt={currentProduct.name}
                    />
                </ProductImage>

                <ProductInfo>
                    <ProductTitle>{currentProduct.name}</ProductTitle>

                    <CategoryTag>{currentProduct.category}</CategoryTag>

                    <PriceRating>
                        <Price>{parseFloat(currentProduct.price || 0).toFixed(2)} €</Price>

                        {currentProduct.average_rating > 0 && (
                            <Rating>
                                <FiStar />
                                <span>{parseFloat(currentProduct.average_rating || 0).toFixed(1)}</span>
                                <span>({currentProduct.review_count || 0})</span>
                            </Rating>
                        )}
                    </PriceRating>

                    <Availability available={currentProduct.is_available}>
            <span className="status">
              {currentProduct.is_available ? 'Disponible' : 'No disponible'}
            </span>
                    </Availability>

                    <ProductDescription>{currentProduct.description}</ProductDescription>

                    <QuantitySelector>
                        <QuantityLabel>Cantidad:</QuantityLabel>
                        <QuantityControls>
                            <QuantityButton
                                onClick={() => handleQuantityChange(-1)}
                                disabled={quantity <= 1}
                            >
                                <FiMinus />
                            </QuantityButton>
                            <QuantityDisplay>{quantity}</QuantityDisplay>
                            <QuantityButton
                                onClick={() => handleQuantityChange(1)}
                            >
                                <FiPlus />
                            </QuantityButton>
                        </QuantityControls>
                    </QuantitySelector>

                    <AddToCartButton
                        onClick={handleAddToCart}
                        disabled={!currentProduct.is_available}
                        cartoon
                    >
                        <FiShoppingCart /> Añadir al Carrito
                    </AddToCartButton>
                </ProductInfo>
            </ProductContent>

            <Divider />

            <ProductReviews productId={currentProduct.id} productSlug={slug} />

            <Divider />

            <RelatedProducts category={currentProduct.category_id} currentProductId={currentProduct.id} />
        </ProductDetailContainer>
    );
};

export default ProductDetail;