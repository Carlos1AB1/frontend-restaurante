// src/pages/OrderDetail/index.js
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchOrderDetail, cancelOrder } from '../../store/slices/ordersSlice';
import { showNotification } from '../../store/slices/uiSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { FiChevronLeft, FiDownload, FiX, FiClock, FiMapPin, FiPhone, FiFileText } from 'react-icons/fi';

const OrderDetailContainer = styled.div`
  max-width: 1000px;
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

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const OrderTitle = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.heading};
  margin: 0;
`;

const OrderNumber = styled.span`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.primary};
  display: block;
`;

const OrderStatus = styled.div`
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: ${({ status, theme }) => {
    switch (status) {
        case 'PENDING':
            return theme.warning;
        case 'PROCESSING':
            return theme.info;
        case 'SCHEDULED':
            return theme.accent;
        case 'OUT_FOR_DELIVERY':
            return theme.secondary;
        case 'DELIVERED':
            return theme.success;
        case 'CANCELLED':
            return '#999';
        case 'FAILED':
            return theme.error;
        default:
            return theme.primary;
    }
}};
  
  /* Cartoon style */
  border: 2px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 3px 3px 0 ${({ theme }) => theme.shadowStrong};
`;

const OrderContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const OrderDetailsCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  overflow: hidden;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const SectionHeader = styled.div`
  padding: 15px 20px;
  background-color: ${({ theme }) => theme.shadow};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.heading};
  margin: 0;
`;

const SectionContent = styled.div`
  padding: 20px;
`;

const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const InfoItem = styled.div`
  h4 {
    margin: 0 0 5px 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text};
    display: flex;
    align-items: center;
    gap: 5px;
    
    svg {
      color: ${({ theme }) => theme.primary};
    }
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.heading};
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 20px 0;
`;

const OrderItems = styled.div`
  h3 {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.heading};
    margin: 0 0 15px 0;
  }
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .item-name {
    .quantity {
      font-weight: bold;
      color: ${({ theme }) => theme.primary};
    }
  }
  
  .item-price {
    font-weight: bold;
  }
`;

const OrderSummary = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 20px;
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

const Actions = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ActionButton = styled(Button)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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

const CancelConfirmModal = styled(Modal)`
  .warning-text {
    color: ${({ theme }) => theme.error};
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  p {
    margin-bottom: 15px;
    color: ${({ theme }) => theme.text};
  }
`;

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentOrder, loading, error } = useSelector(state => state.orders);
    const [cancelModalOpen, setCancelModalOpen] = React.useState(false);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetail(orderId));
        }
    }, [dispatch, orderId]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleDownloadInvoice = () => {
        window.open(`/api/invoices/download/${orderId}`, '_blank');
    };

    const handleCancelOrder = () => {
        setCancelModalOpen(true);
    };

    const confirmCancelOrder = () => {
        dispatch(cancelOrder(orderId));
        setCancelModalOpen(false);

        dispatch(showNotification({
            message: 'Pedido cancelado correctamente',
            type: 'success'
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <Loader type="cartoon" text="Cargando detalles del pedido..." />;
    }

    if (error || !currentOrder) {
        return (
            <OrderDetailContainer>
                <BackButton onClick={handleBack}>
                    <FiChevronLeft />
                    Volver
                </BackButton>

                <NotFound>
                    <h2>Pedido no encontrado</h2>
                    <p>No pudimos encontrar el pedido que estás buscando.</p>
                    <Button to="/orders" cartoon>Ver todos mis pedidos</Button>
                </NotFound>
            </OrderDetailContainer>
        );
    }

    // Calcular subtotal y envío
    const subtotal = currentOrder.total_price;
    const shipping = subtotal > 20 ? 0 : 2.99;
    const total = subtotal;

    return (
        <OrderDetailContainer>
            <BackButton onClick={handleBack}>
                <FiChevronLeft />
                Volver a mis pedidos
            </BackButton>

            <OrderHeader>
                <div>
                    <OrderTitle>Detalles del Pedido</OrderTitle>
                    <OrderNumber>{currentOrder.order_number}</OrderNumber>
                </div>
                <OrderStatus status={currentOrder.status}>
                    {currentOrder.status_display}
                </OrderStatus>
            </OrderHeader>

            <OrderContent>
                <OrderDetailsCard>
                    <SectionHeader>
                        <SectionTitle>Información del Pedido</SectionTitle>
                    </SectionHeader>

                    <SectionContent>
                        <OrderInfoGrid>
                            <InfoItem>
                                <h4><FiClock /> Fecha de Pedido</h4>
                                <p>{formatDate(currentOrder.created_at)}</p>
                            </InfoItem>

                            {currentOrder.is_scheduled && (
                                <InfoItem>
                                    <h4><FiClock /> Fecha Programada</h4>
                                    <p>{formatDate(currentOrder.scheduled_datetime)}</p>
                                </InfoItem>
                            )}

                            <InfoItem>
                                <h4><FiMapPin /> Dirección de Entrega</h4>
                                <p>{currentOrder.delivery_address}</p>
                            </InfoItem>

                            <InfoItem>
                                <h4><FiPhone /> Teléfono de Contacto</h4>
                                <p>{currentOrder.phone_number}</p>
                            </InfoItem>
                        </OrderInfoGrid>

                        {currentOrder.notes && (
                            <>
                                <Divider />
                                <InfoItem>
                                    <h4>Notas</h4>
                                    <p>{currentOrder.notes}</p>
                                </InfoItem>
                            </>
                        )}

                        <Divider />

                        <OrderItems>
                            <h3>Productos</h3>
                            <ItemsList>
                                {currentOrder.items.map((item, index) => (
                                    <OrderItem key={index}>
                                        <div className="item-name">
                                            <span className="quantity">{item.quantity}x</span> {item.product_name}
                                        </div>
                                        <div className="item-price">
                                            {(item.price * item.quantity).toFixed(2)} €
                                        </div>
                                    </OrderItem>
                                ))}
                            </ItemsList>
                        </OrderItems>
                    </SectionContent>
                </OrderDetailsCard>

                <OrderSummary>
                    <SummaryTitle>Resumen</SummaryTitle>

                    <SummaryRow>
                        <span>Subtotal</span>
                        <span>{subtotal.toFixed(2)} €</span>
                    </SummaryRow>

                    <SummaryRow>
                        <span>Envío</span>
                        <span>{shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)} €`}</span>
                    </SummaryRow>

                    <SummaryRow large>
                        <span>Total</span>
                        <TotalValue>{total.toFixed(2)} €</TotalValue>
                    </SummaryRow>

                    <Actions>
                        {currentOrder.can_cancel && currentOrder.status !== 'CANCELLED' && (
                            <ActionButton
                                variant="outline"
                                onClick={handleCancelOrder}
                            >
                                <FiX /> Cancelar Pedido
                            </ActionButton>
                        )}

                        <ActionButton
                            cartoon
                            onClick={handleDownloadInvoice}
                        >
                            <FiFileText /> Descargar Factura
                        </ActionButton>
                    </Actions>
                </OrderSummary>
            </OrderContent>

            <CancelConfirmModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                title="Cancelar Pedido"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
                            No, mantener pedido
                        </Button>
                        <Button variant="primary" onClick={confirmCancelOrder}>
                            Sí, cancelar pedido
                        </Button>
                    </>
                }
            >
                <div className="warning-text">¿Estás seguro de que quieres cancelar este pedido?</div>
                <p>Una vez cancelado, no podrás revertir esta acción. Si tienes alguna duda, contacta con nuestro servicio de atención al cliente.</p>
            </CancelConfirmModal>
        </OrderDetailContainer>
    );
};

export default OrderDetail;