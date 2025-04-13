// src/pages/ProductDetail/index.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchProductDetail, clearCurrentProduct } from '../../store/slices/menuSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { showNotification } from '../../store/slices/uiSlice';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import RelatedProducts from './RelatedProducts';
import ProductReviews from './ProductReviews';
import { FiStar, FiShoppingCart, FiChevronLeft, FiPlus, FiMinus, FiHeart } from 'react-icons/fi';

const ProductDetailContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const BackToMenu = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
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

const ProductContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 60px;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ProductImageContainer = styled.div`
  flex: 1;
  position: relative;
  
  @media (min-width: 768px) {
    max-width: 500px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 8px 8px 0 ${({ theme }) => theme.shadowStrong};
`;

const WishlistButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  color: ${({ theme, active }) => active ? theme.primary : theme.text};
  
  svg {
    fill: ${({ active, theme }) => active ? theme.primary : 'none'};
  }
  
  &:hover {
    transform: scale(1.1);
    color: ${({ theme }) => theme.primary};
  }
`;

const ProductInfoContainer = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 15px;
`;

const ProductCategory = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
  display: block;
  margin-bottom: 15px;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Stars = styled.div`
  display: flex;
  color: ${({ theme }) => theme.accent};
`;

const ReviewCount = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.8;
`;

const ProductPrice = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 20px;
`;

const ProductDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text};
  margin-bottom: 30px;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.cardBg};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.shadow};
    color: ${({ theme }) => theme.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.cardBg};
  font-weight: bold;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 30px 0;
`;

const ProductFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 20px;
  border-bottom: 2px solid ${({ theme }) => theme.border};
  margin-bottom: 30px;
`;

const Tab = styled.button`
  padding: 15px 5px;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ active, theme }) => active ? theme.primary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.primary : theme.text};
  font-weight: ${({ active }) => active ? 'bold' : 'normal'};
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const NotFound = styled.div`
  text-align: center;
  padding: 40px;
  
  h2 {
    color: ${({ theme }) => theme.heading};
    margin-bottom: 15px;
  }
  
  p {
    color: ${({ theme }) => theme.text};
    margin-bottom: 20px;
  }
`;

const ProductDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct, loading, error } = useSelector(state => state.menu);

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        dispatch(fetchProductDetail(slug));

        // Limpiar producto al desmontar
        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, slug]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncreaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        if (!currentProduct) return;

        dispatch(addToCart({
            product_id: currentProduct.id,
            quantity: quantity
        }));

        dispatch(showNotification({
            message: `¡${quantity} x ${currentProduct.name} añadido al carrito!`,
            type: 'success'
        }));
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);

        // Mensaje de notificación diferente según si se añade o quita de favoritos
        dispatch(showNotification({
            message: !isFavorite
                ? `¡${currentProduct.name} añadido a favoritos!`
                : `${currentProduct.name} eliminado de favoritos`,
            type: !isFavorite ? 'success' : 'info'
        }));
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FiStar key={i} style={{ fill: 'currentColor' }} />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FiStar key={i} style={{ fill: 'currentColor', clipPath: 'inset(0 50% 0 0)' }} />);
            } else {
                stars.push(<FiStar key={i} />);
            }
        }

        return stars;
    };

    if (loading) {
        return <Loader type="cartoon" text="Cargando producto..." />;
    }

    if (error) {
        return (
            <NotFound>
                <h2>Error al cargar el producto</h2>
                <p>{error.message || 'Ha ocurrido un error al cargar el producto.'}</p>
                <Button onClick={handleBack} cartoon>Volver</Button>
            </NotFound>
        );
    }

    if (!currentProduct) {
        return (
            <NotFound>
                <h2>Producto no encontrado</h2>
                <p>El producto que estás buscando no existe o ha sido eliminado.</p>
                <Button to="/menu" cartoon>Ver Menú</Button>
            </NotFound>
        );
    }

    return (
        <ProductDetailContainer>
            <BackToMenu onClick={handleBack}>
                <FiChevronLeft />
                Volver
            </BackToMenu>

            <ProductContainer>
                <ProductImageContainer>
                    <ProductImage src={currentProduct.image || '/assets/images/food-items/default-dish.jpg'} alt={currentProduct.name} />
                    <WishlistButton
                        active={isFavorite ? 1 : 0}
                        onClick={toggleFavorite}
                    >
                        <FiHeart />
                    </WishlistButton>
                </ProductImageContainer>

                <ProductInfoContainer>
                    <ProductCategory>{currentProduct.category}</ProductCategory>
                    <ProductTitle>{currentProduct.name}</ProductTitle>

                    {currentProduct.average_rating > 0 && (
                        <ProductRating>
                            <Stars>
                                {renderStars(currentProduct.average_rating)}
                            </Stars>
                            <ReviewCount>
                                {currentProduct.average_rating.toFixed(1)} ({currentProduct.review_count} {currentProduct.review_count === 1 ? 'opinión' : 'opiniones'})
                            </ReviewCount>
                        </ProductRating>
                    )}

                    <ProductPrice>{currentProduct.price.toFixed(2)} €</ProductPrice>

                    <ProductDescription>{currentProduct.description}</ProductDescription>

                    <QuantityContainer>
                        <span>Cantidad:</span>
                        <QuantityControls>
                            <QuantityButton
                                onClick={handleDecreaseQuantity}
                                disabled={quantity <= 1}
                            >
                                <FiMinus />
                            </QuantityButton>
                            <QuantityDisplay>{quantity}</QuantityDisplay>
                            <QuantityButton onClick={handleIncreaseQuantity}>
                                <FiPlus />
                            </QuantityButton>
                        </QuantityControls>
                    </QuantityContainer>

                    <ActionButtons>
                        <Button
                            onClick={handleAddToCart}
                            cartoon
                            animated
                        >
                            <FiShoppingCart /> Añadir al carrito
                        </Button>
                    </ActionButtons>
                </ProductInfoContainer>
            </ProductContainer>

            <Tabs>
                <Tab
                    active={activeTab === 'description' ? 1 : 0}
                    onClick={() => setActiveTab('description')}
                >
                    Descripción
                </Tab>
                <Tab
                    active={activeTab === 'reviews' ? 1 : 0}
                    onClick={() => setActiveTab('reviews')}
                >
                    Opiniones ({currentProduct.review_count})
                </Tab>
            </Tabs>

            {activeTab === 'description' ? (
                <div>
                    <p>{currentProduct.description}</p>
                    <Divider />
                    <RelatedProducts category={currentProduct.category_id} currentProductId={currentProduct.id} />
                </div>
            ) : (
                <ProductReviews productId={currentProduct.id} productSlug={currentProduct.slug} />
            )}
        </ProductDetailContainer>
    );
};

export default ProductDetail;