// src/pages/Cart/index.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../../store/slices/cartSlice';
import { showNotification } from '../../store/slices/uiSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

const CartContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 30px;
  text-align: center;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const CartItemsContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  overflow: hidden;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const CartHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartTitle = styled.h2`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.heading};
  margin: 0;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.error};
    background-color: ${({ theme }) => theme.shadow};
  }
`;

const CartItems = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 5px 0;
  color: ${({ theme }) => theme.heading};
`;

const ItemPrice = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 640px) {
    margin-top: 10px;
    width: 100%;
    justify-content: space-between;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  overflow: hidden;
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 2px 2px 0 ${({ theme }) => theme.shadowStrong};
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
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
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.cardBg};
  font-weight: bold;
  font-size: 0.9rem;
`;

const ItemTotal = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
  min-width: 80px;
  text-align: right;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.error};
    background-color: ${({ theme }) => theme.shadow};
  }
`;

const CartSummary = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 20px;
  align-self: flex-start;
  position: sticky;
  top: 100px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const SummaryTitle = styled.h2`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.heading};
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: ${({ large }) => large ? '1.2rem' : '1rem'};
  font-weight: ${({ large }) => large ? 'bold' : 'normal'};
  color: ${({ large, theme }) => large ? theme.heading : theme.text};
`;

const TotalValue = styled.span`
  color: ${({ theme }) => theme.primary};
`;

const CheckoutButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
`;

const BackToShopLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.text};
  margin-top: 15px;
  justify-content: center;
  padding: 5px 0;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 50px 20px;
  
  svg {
    font-size: 4rem;
    color: ${({ theme }) => theme.border};
    margin-bottom: 20px;
  }
  
  h2 {
    color: ${({ theme }) => theme.heading};
    margin-bottom: 15px;
  }
  
  p {
    color: ${({ theme }) => theme.text};
    margin-bottom: 30px;
  }
`;

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalPrice, loading, error } = useSelector(state => state.cart);
    const { isAuthenticated } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleUpdateQuantity = (itemId, quantity) => {
        dispatch(updateCartItem({ itemId, quantity }));
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeCartItem(itemId));

        dispatch(showNotification({
            message: 'Producto eliminado del carrito',
            type: 'success'
        }));
    };

    const handleClearCart = () => {
        // Mostrar confirmación
        if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            dispatch(clearCart());

            dispatch(showNotification({
                message: 'Carrito vaciado correctamente',
                type: 'success'
            }));
        }
    };

    const handleCheckout = () => {
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            // Redirigir a login con parámetro de retorno
            navigate('/login', { state: { from: '/checkout' } });

            dispatch(showNotification({
                message: 'Debes iniciar sesión para continuar con el pago',
                type: 'info'
            }));
        }
    };

    if (loading) {
        return <Loader type="cartoon" text="Cargando tu carrito..." />;
    }

    if (error) {
        return (
            <EmptyCart>
                <h2>Error al cargar el carrito</h2>
                <p>{error.message || 'Ha ocurrido un error al cargar tu carrito.'}</p>
                <Button onClick={() => dispatch(fetchCart())} cartoon>
                    Intentar de nuevo
                </Button>
            </EmptyCart>
        );
    }

    if (!items || items.length === 0) {
        return (
            <CartContainer>
                <PageTitle>Tu Carrito</PageTitle>
                <EmptyCart>
                    <FiShoppingCart />
                    <h2>Tu carrito está vacío</h2>
                    <p>Parece que aún no has añadido productos a tu carrito.</p>
                    <Button to="/menu" cartoon animated>
                        Ver Menú
                    </Button>
                </EmptyCart>
            </CartContainer>
        );
    }

    // Calcular subtotal y envío
    const subtotal = totalPrice;
    const shipping = subtotal > 20 ? 0 : 2.99;
    const total = subtotal + shipping;

    return (
        <CartContainer>
            <PageTitle>Tu Carrito</PageTitle>

            <CartContent>
                <CartItemsContainer>
                    <CartHeader>
                        <CartTitle>Productos ({items.length})</CartTitle>
                        <ClearButton onClick={handleClearCart}>
                            <FiTrash2 /> Vaciar carrito
                        </ClearButton>
                    </CartHeader>

                    <CartItems>
                        {items.map(item => (
                            <CartItem key={item.id}>
                                <ItemImage
                                    src={item.product.image || '/assets/images/food-items/default-dish.jpg'}
                                    alt={item.product.name}
                                />

                                <ItemInfo>
                                    <ItemName>{item.product.name}</ItemName>
                                    <ItemPrice>{item.product.price.toFixed(2)} € / unidad</ItemPrice>
                                </ItemInfo>

                                <ItemActions>
                                    <QuantityControl>
                                        <QuantityButton
                                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <FiMinus />
                                        </QuantityButton>
                                        <QuantityDisplay>{item.quantity}</QuantityDisplay>
                                        <QuantityButton onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                            <FiPlus />
                                        </QuantityButton>
                                    </QuantityControl>

                                    <ItemTotal>{(item.product.price * item.quantity).toFixed(2)} €</ItemTotal>

                                    <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                                        <FiTrash2 />
                                    </RemoveButton>
                                </ItemActions>
                            </CartItem>
                        ))}
                    </CartItems>
                </CartItemsContainer>

                <CartSummary>
                    <SummaryTitle>Resumen</SummaryTitle>

                    <SummaryRow>
                        <span>Subtotal</span>
                        <span>{subtotal.toFixed(2)} €</span>
                    </SummaryRow>

                    <SummaryRow>
                        <span>Envío</span>
                        <span>{shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)} €`}</span>
                    </SummaryRow>

                    {shipping > 0 && (
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '15px' }}>
                            Gastos de envío gratis para pedidos superiores a 20 €
                        </div>
                    )}

                    <SummaryRow large>
                        <span>Total</span>
                        <TotalValue>{total.toFixed(2)} €</TotalValue>
                    </SummaryRow>

                    <CheckoutButton
                        onClick={handleCheckout}
                        cartoon
                        animated
                    >
                        Proceder al pago
                    </CheckoutButton>

                    <BackToShopLink to="/menu">
                        <FiArrowLeft /> Seguir comprando
                    </BackToShopLink>
                </CartSummary>
            </CartContent>
        </CartContainer>
    );
};

export default Cart;