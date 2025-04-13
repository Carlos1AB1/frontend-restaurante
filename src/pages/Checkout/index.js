// src/pages/Checkout/index.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCart } from '../../store/slices/cartSlice';
import { createOrder, clearOrderCreated } from '../../store/slices/ordersSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { FiChevronLeft, FiClock, FiCreditCard } from 'react-icons/fi';

const CheckoutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 30px;
  text-align: center;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  
  .step-number {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: ${({ active, completed, theme }) =>
    completed ? theme.success :
        active ? theme.primary :
            theme.border};
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    margin-bottom: 10px;
    position: relative;
    z-index: 2;
    
    /* Cartoon style */
    border: 2px solid ${({ theme }) => theme.outlineColor};
  }
  
  .step-label {
    font-size: 0.9rem;
    color: ${({ active, completed, theme }) =>
    completed || active ? theme.heading : theme.text};
    font-weight: ${({ active, completed }) =>
    completed || active ? 'bold' : 'normal'};
    text-align: center;
  }
`;

const StepDivider = styled.div`
  width: 60px;
  height: 2px;
  background-color: ${({ completed, theme }) =>
    completed ? theme.success : theme.border};
  margin-top: 17px; /* Half of step circle height */
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const FormTitle = styled.h2`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.heading};
  margin: 0 0 20px 0;
`;

const FormRow = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  border-radius: 3px;
  cursor: pointer;
`;

const PaymentMethodsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const PaymentMethod = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid ${({ selected, theme }) =>
    selected ? theme.primary : theme.border};
  background-color: ${({ selected, theme }) =>
    selected ? theme.primaryLight + '30' : theme.background};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.shadow};
  }
  
  input {
    width: 18px;
    height: 18px;
  }
  
  .payment-icon {
    color: ${({ theme }) => theme.primary};
    font-size: 1.2rem;
  }
`;

const ScheduleContainer = styled.div`
  margin-top: 15px;
  padding: 15px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.shadow};
  display: ${({ visible }) => visible ? 'block' : 'none'};
`;

const DateTimeInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 10px;
`;

const OrderSummary = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  align-self: flex-start;
  
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

const OrderItems = styled.div`
  margin-bottom: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  
  .item-name {
    display: flex;
    align-items: center;
    gap: 5px;
    
    .quantity {
      color: ${({ theme }) => theme.primary};
      font-weight: bold;
    }
  }
  
  .item-price {
    font-weight: bold;
  }
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

const SubmitButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
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

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.error};
  font-size: 0.9rem;
  margin-top: 5px;
`;

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalPrice, loading: cartLoading } = useSelector(state => state.cart);
    const { loading: orderLoading, error: orderError, orderCreated, currentOrder } = useSelector(state => state.orders);
    const { user } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        delivery_address: user?.address || '',
        phone_number: user?.phone_number || '',
        notes: '',
        is_scheduled: false,
        scheduled_date: '',
        scheduled_time: '',
        payment_method: 'cash'
    });

    const [errors, setErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        // Cargar el carrito al montar
        dispatch(fetchCart());

        // Redirigir a confirmación si ya se ha creado un pedido
        if (orderCreated && currentOrder) {
            navigate(`/order-confirmation/${currentOrder.id}`);
            dispatch(clearOrderCreated());
        }
    }, [dispatch, orderCreated, currentOrder, navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Limpiar error para este campo si existe
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.delivery_address.trim()) {
            newErrors.delivery_address = 'La dirección de entrega es obligatoria';
        }

        if (!formData.phone_number.trim()) {
            newErrors.phone_number = 'El número de teléfono es obligatorio';
        } else if (!/^\d{9,}$/.test(formData.phone_number.replace(/\s/g, ''))) {
            newErrors.phone_number = 'El número de teléfono debe tener al menos 9 dígitos';
        }

        if (formData.is_scheduled) {
            const now = new Date();
            const selected = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`);

            if (!formData.scheduled_date) {
                newErrors.scheduled_date = 'Selecciona una fecha';
            }

            if (!formData.scheduled_time) {
                newErrors.scheduled_time = 'Selecciona una hora';
            }

            if (formData.scheduled_date && formData.scheduled_time && selected <= now) {
                newErrors.scheduled_time = 'La fecha y hora deben ser futuras';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Preparar datos para la API
            const orderData = {
                delivery_address: formData.delivery_address,
                phone_number: formData.phone_number,
                notes: formData.notes,
                is_scheduled: formData.is_scheduled,
                payment_method: formData.payment_method
            };

            // Añadir fecha programada si es necesario
            if (formData.is_scheduled) {
                orderData.scheduled_datetime = `${formData.scheduled_date}T${formData.scheduled_time}:00`;
            }

            // Crear el pedido
            dispatch(createOrder(orderData));
        } else {
            setCurrentStep(1); // Volver al paso 1 si hay errores
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const goToStep = (step) => {
        if (step <= currentStep) {
            setCurrentStep(step);
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1 && validateForm()) {
            setCurrentStep(2);
        }
    };

    if (cartLoading || orderLoading) {
        return <Loader type="cartoon" text="Procesando..." />;
    }

    if (!items || items.length === 0) {
        // Redirigir al carrito si está vacío
        navigate('/cart');
        return null;
    }

    // Calcular subtotal y envío
    const subtotal = totalPrice;
    const shipping = subtotal > 20 ? 0 : 2.99;
    const total = subtotal + shipping;

    // Configurar fecha mínima para pedidos programados (hoy)
    const today = new Date().toISOString().split('T')[0];

    return (
        <CheckoutContainer>
            <BackButton onClick={handleBack}>
                <FiChevronLeft />
                Volver
            </BackButton>

            <PageTitle>Checkout</PageTitle>

            <StepsContainer>
                <Step
                    active={currentStep === 1}
                    completed={currentStep > 1}
                    onClick={() => goToStep(1)}
                >
                    <div className="step-number">1</div>
                    <div className="step-label">Entrega</div>
                </Step>

                <StepDivider completed={currentStep > 1} />

                <Step
                    active={currentStep === 2}
                    completed={currentStep > 2}
                    onClick={() => goToStep(2)}
                >
                    <div className="step-number">2</div>
                    <div className="step-label">Pago</div>
                </Step>

                <StepDivider completed={currentStep > 2} />

                <Step active={currentStep === 3}>
                    <div className="step-number">3</div>
                    <div className="step-label">Confirmación</div>
                </Step>
            </StepsContainer>

            <form onSubmit={handleSubmit}>
                <CheckoutContent>
                    <FormContainer>
                        {currentStep === 1 && (
                            <>
                                <FormTitle>Información de Entrega</FormTitle>

                                <FormRow>
                                    <Label htmlFor="delivery_address">Dirección de Entrega *</Label>
                                    <TextArea
                                        id="delivery_address"
                                        name="delivery_address"
                                        value={formData.delivery_address}
                                        onChange={handleInputChange}
                                        placeholder="Nombre, calle, número, piso, código postal, ciudad..."
                                        required
                                    />
                                    {errors.delivery_address && <ErrorMessage>{errors.delivery_address}</ErrorMessage>}
                                </FormRow>

                                <FormRow>
                                    <Label htmlFor="phone_number">Teléfono de Contacto *</Label>
                                    <Input
                                        id="phone_number"
                                        name="phone_number"
                                        type="tel"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        placeholder="Ej. 123456789"
                                        required
                                    />
                                    {errors.phone_number && <ErrorMessage>{errors.phone_number}</ErrorMessage>}
                                </FormRow>

                                <FormRow>
                                    <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                                    <TextArea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Instrucciones especiales para la entrega, preferencias, etc."
                                    />
                                </FormRow>

                                <CheckboxContainer>
                                    <Checkbox
                                        type="checkbox"
                                        id="is_scheduled"
                                        name="is_scheduled"
                                        checked={formData.is_scheduled}
                                        onChange={handleInputChange}
                                    />
                                    <Label htmlFor="is_scheduled" style={{ marginBottom: 0 }}>
                                        Programar entrega para una fecha específica
                                    </Label>
                                </CheckboxContainer>

                                <ScheduleContainer visible={formData.is_scheduled}>
                                    <FormRow>
                                        <Label>Selecciona fecha y hora</Label>
                                        <DateTimeInputs>
                                            <div>
                                                <Input
                                                    type="date"
                                                    name="scheduled_date"
                                                    min={today}
                                                    value={formData.scheduled_date}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.scheduled_date && <ErrorMessage>{errors.scheduled_date}</ErrorMessage>}
                                            </div>
                                            <div>
                                                <Input
                                                    type="time"
                                                    name="scheduled_time"
                                                    value={formData.scheduled_time}
                                                    onChange={handleInputChange}
                                                />
                                                {errors.scheduled_time && <ErrorMessage>{errors.scheduled_time}</ErrorMessage>}
                                            </div>
                                        </DateTimeInputs>
                                    </FormRow>
                                </ScheduleContainer>

                                <Button type="button" onClick={handleNextStep} cartoon fullWidth>
                                    Continuar al pago
                                </Button>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <FormTitle>Método de Pago</FormTitle>

                                <PaymentMethodsContainer>
                                    <PaymentMethod selected={formData.payment_method === 'cash'}>
                                        <input
                                            type="radio"
                                            id="cash"
                                            name="payment_method"
                                            value="cash"
                                            checked={formData.payment_method === 'cash'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="payment-icon">💵</span>
                                        <span>Efectivo en la entrega</span>
                                    </PaymentMethod>

                                    <PaymentMethod selected={formData.payment_method === 'card'}>
                                        <input
                                            type="radio"
                                            id="card"
                                            name="payment_method"
                                            value="card"
                                            checked={formData.payment_method === 'card'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="payment-icon"><FiCreditCard /></span>
                                        <span>Tarjeta en la entrega</span>
                                    </PaymentMethod>

                                    <PaymentMethod selected={formData.payment_method === 'online'}>
                                        <input
                                            type="radio"
                                            id="online"
                                            name="payment_method"
                                            value="online"
                                            checked={formData.payment_method === 'online'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="payment-icon">🔒</span>
                                        <span>Pago online (próximamente)</span>
                                    </PaymentMethod>
                                </PaymentMethodsContainer>

                                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                    <Button type="button" onClick={() => setCurrentStep(1)} variant="outline">
                                        Volver
                                    </Button>
                                    <Button type="submit" cartoon fullWidth>
                                        Confirmar Pedido
                                    </Button>
                                </div>

                                {orderError && (
                                    <ErrorMessage style={{ marginTop: '20px' }}>
                                        Error al crear el pedido: {orderError.message}
                                    </ErrorMessage>
                                )}
                            </>
                        )}
                    </FormContainer>

                    <OrderSummary>
                        <SummaryTitle>Resumen del Pedido</SummaryTitle>

                        <OrderItems>
                            {items.map(item => (
                                <OrderItem key={item.id}>
                                    <div className="item-name">
                                        <span className="quantity">{item.quantity}x</span>
                                        <span>{item.product.name}</span>
                                    </div>
                                    <div className="item-price">
                                        {(item.quantity * item.product.price).toFixed(2)} €
                                    </div>
                                </OrderItem>
                            ))}
                        </OrderItems>

                        <SummaryRow>
                            <span>Subtotal</span>
                            <span>{subtotal.toFixed(2)} €</span>
                        </SummaryRow>

                        <SummaryRow>
                            <span>Envío</span>
                            <span>{shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)} €`}</span>
                        </SummaryRow>

                        {formData.is_scheduled && (
                            <SummaryRow>
                                <span>Entrega programada</span>
                                <span><FiClock /></span>
                            </SummaryRow>
                        )}

                        <SummaryRow large>
                            <span>Total</span>
                            <TotalValue>{total.toFixed(2)} €</TotalValue>
                        </SummaryRow>
                    </OrderSummary>
                </CheckoutContent>
            </form>
        </CheckoutContainer>
    );
};

export default Checkout;