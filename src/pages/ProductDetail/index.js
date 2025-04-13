// src/pages/OrderDetail/index.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchOrderDetail, cancelOrder } from '../../store/slices/ordersSlice';
import { showNotification } from '../../store/slices/uiSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { FiChevronLeft, FiDownload, FiX, FiClock, FiMapPin, FiPhone, FiFileText, FiLoader } from 'react-icons/fi';

// *** PASO 1: Importa tu cliente/módulo API ***
// Ajusta la ruta y el nombre si es necesario.
// Esto asume que '../../api/orders' exporta un objeto (quizás Axios instance) como default
// o un objeto que contiene el método .downloadInvoice
import apiClient from '../../api/orders';
// Si exporta una función nombrada, sería algo como:
// import { downloadInvoice as downloadInvoiceApi } from '../../api/orders';


// --- Styled Components (Sin cambios) ---
const OrderDetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
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
        case 'PENDING': return theme.warning;
        case 'PROCESSING': return theme.info;
        case 'SCHEDULED': return theme.accent;
        case 'OUT_FOR_DELIVERY': return theme.secondary;
        case 'DELIVERED': return theme.success;
        case 'CANCELLED': return '#999';
        case 'FAILED': return theme.error;
        default: return theme.primary;
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
  border-bottom: 2px solid ${({ theme }) => theme.outlineColor || theme.border};
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
    white-space: pre-line;
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
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .item-details {
      flex-grow: 1;
      margin-right: 10px;
  }

  .item-name {
    color: ${({ theme }) => theme.heading};
    .quantity {
      font-weight: bold;
      color: ${({ theme }) => theme.primary};
      margin-right: 5px;
    }
  }

  .item-price {
    font-weight: bold;
    color: ${({ theme }) => theme.text};
    white-space: nowrap;
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
  border-bottom: 2px solid ${({ theme }) => theme.outlineColor || theme.border};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: ${({ large }) => (large ? '1.2rem' : '1rem')};
  font-weight: ${({ large }) => (large ? 'bold' : 'normal')};
  color: ${({ large, theme }) => (large ? theme.heading : theme.text)};

  span:last-child {
    white-space: nowrap;
    margin-left: 10px;
  }
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

const RotatingLoader = styled(FiLoader)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
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


// --- Componente React ---
const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentOrder, loading, error } = useSelector(state => state.orders);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetail(orderId));
        }
    }, [dispatch, orderId]);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/orders');
        }
    };

    // --- handleDownloadInvoice CORREGIDA ---
    const handleDownloadInvoice = async () => {
        if (!orderId) {
            console.warn("No orderId found for download.");
            dispatch(showNotification({ message: 'ID de pedido no encontrado.', type: 'error' }));
            return;
        }

        setIsDownloadingInvoice(true);
        dispatch(showNotification({ message: 'Preparando descarga de factura...', type: 'info' }));

        try {
            // *** PASO 2: Usa la función/método del cliente API importado ***
            // Asegúrate que 'apiClient.downloadInvoice' o 'downloadInvoiceApi' existe y funciona como esperas.
            // Esta línea asume que `apiClient` tiene un método `downloadInvoice` que recibe el ID
            // y devuelve un objeto de respuesta (como Axios) con los datos en `response.data`.
            const response = await apiClient.downloadInvoice(orderId);
            // Si usaste importación nombrada: const response = await downloadInvoiceApi(orderId);

            // *** PASO 3: Crea el Blob desde response.data (como en OrderHistory) ***
            // Esto es crucial si tu cliente API (como Axios) está configurado para devolver
            // los datos binarios directamente en el campo `data`.
            // Si tu cliente devuelve otra cosa, ajusta esta línea.
            const blob = new Blob([response.data], { type: 'application/pdf' });

            // Validaciones básicas del blob
            if (blob.size === 0) {
                console.error("Error: El blob recibido está vacío. La respuesta del API puede ser incorrecta.");
                throw new Error("El servidor devolvió un archivo vacío.");
            }
            // El tipo 'application/octet-stream' a veces es devuelto por APIs genéricas,
            // pero si esperas PDF, es bueno advertir si no es estrictamente 'application/pdf'.
            if (blob.type && blob.type !== 'application/pdf') {
                console.warn(`Advertencia: El tipo de blob recibido es '${blob.type}', se esperaba 'application/pdf'. Intentando descargar de todos modos.`);
            }

            // Crear URL y enlace para la descarga (igual que antes)
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Usar currentOrder.order_number si existe para un nombre más amigable
            const filename = `factura_${currentOrder?.order_number || orderId}.pdf`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // Limpieza
            document.body.removeChild(link); // Mejor usar removeChild directamente
            window.URL.revokeObjectURL(url);

            dispatch(showNotification({ message: '¡Factura descargada!', type: 'success' }));

        } catch (error) {
            console.error('Error al descargar la factura:', error);
            // Intenta mostrar un mensaje de error más específico si está disponible
            const message = error?.response?.data?.message // Común en Axios
                || error?.response?.data?.detail // Común en Django Rest Framework
                || error?.message
                || 'Hubo un problema al descargar la factura. Revisa la consola para más detalles.';
            dispatch(showNotification({ message, type: 'error' }));
        } finally {
            // Asegurar que el estado de carga se desactiva siempre
            setIsDownloadingInvoice(false);
        }
    };
    // --- FIN handleDownloadInvoice CORREGIDA ---


    const handleCancelOrder = () => {
        setCancelModalOpen(true);
    };

    const confirmCancelOrder = () => {
        if (orderId) {
            dispatch(cancelOrder(orderId))
                .unwrap()
                .then(() => {
                    dispatch(showNotification({ message: 'Pedido cancelado correctamente', type: 'success' }));
                    setCancelModalOpen(false);
                })
                .catch((cancelError) => {
                    console.error("Error al cancelar el pedido:", cancelError);
                    dispatch(showNotification({ message: cancelError.message || 'No se pudo cancelar el pedido.', type: 'error' }));
                    setCancelModalOpen(false);
                });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) { return 'Fecha inválida'; }
            return date.toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false
            });
        } catch (e) {
            console.error("Error formateando fecha:", dateString, e);
            return 'Error de fecha';
        }
    };

    const formatNumber = (value, decimals = 2) => {
        const number = parseFloat(value || 0);
        if (isNaN(number)) { return (0).toFixed(decimals); }
        return number.toFixed(decimals);
    };

    // ---- Renderizado ----

    if (loading) {
        return <Loader type="cartoon" text="Cargando detalles del pedido..." />;
    }

    if (error || !currentOrder) {
        console.error("Error al cargar OrderDetail:", error, "CurrentOrder:", currentOrder);
        return (
            <OrderDetailContainer>
                <BackButton onClick={handleBack} aria-label="Volver">
                    <FiChevronLeft /> Volver
                </BackButton>
                <NotFound>
                    <h2>{error ? 'Error al cargar el pedido' : 'Pedido no encontrado'}</h2>
                    <p>{error?.message || 'No pudimos encontrar los detalles del pedido que buscas.'}</p>
                    <Button to="/orders" cartoon>Ver todos mis pedidos</Button>
                </NotFound>
            </OrderDetailContainer>
        );
    }

    // Cálculos seguros de precios
    const numericSubtotal = parseFloat(currentOrder.total_price || 0);
    const shippingCost = numericSubtotal > 20 ? 0 : 2.99; // Asumiendo lógica de envío
    const numericTotal = numericSubtotal + shippingCost;

    return (
        <OrderDetailContainer>
            <BackButton onClick={handleBack} aria-label="Volver a mis pedidos">
                <FiChevronLeft /> Volver a mis pedidos
            </BackButton>

            <OrderHeader>
                <div>
                    <OrderTitle>Detalles del Pedido</OrderTitle>
                    {currentOrder.order_number && <OrderNumber>{currentOrder.order_number}</OrderNumber>}
                </div>
                {currentOrder.status && currentOrder.status_display && (
                    <OrderStatus status={currentOrder.status}>
                        {currentOrder.status_display}
                    </OrderStatus>
                )}
            </OrderHeader>

            <OrderContent>
                {/* --- OrderDetailsCard --- */}
                <OrderDetailsCard>
                    <SectionHeader>
                        <SectionTitle>Información del Pedido</SectionTitle>
                    </SectionHeader>
                    <SectionContent>
                        <OrderInfoGrid>
                            {/* Info items... */}
                            <InfoItem>
                                <h4><FiClock /> Fecha de Pedido</h4>
                                <p>{formatDate(currentOrder.created_at)}</p>
                            </InfoItem>
                            {currentOrder.is_scheduled && currentOrder.scheduled_datetime && (
                                <InfoItem>
                                    <h4><FiClock /> Fecha Programada</h4>
                                    <p>{formatDate(currentOrder.scheduled_datetime)}</p>
                                </InfoItem>
                            )}
                            <InfoItem>
                                <h4><FiMapPin /> Dirección de Entrega</h4>
                                <p>{currentOrder.delivery_address || 'No especificada'}</p>
                            </InfoItem>
                            <InfoItem>
                                <h4><FiPhone /> Teléfono de Contacto</h4>
                                <p>{currentOrder.phone_number || 'No especificado'}</p>
                            </InfoItem>
                        </OrderInfoGrid>
                        {currentOrder.notes && (
                            <>
                                <Divider />
                                <InfoItem>
                                    <h4><FiFileText /> Notas</h4>
                                    <p style={{ whiteSpace: 'pre-line' }}>{currentOrder.notes}</p>
                                </InfoItem>
                            </>
                        )}
                        <Divider />
                        <OrderItems>
                            <h3>Productos</h3>
                            <ItemsList>
                                {(currentOrder.items || []).map((item, index) => (
                                    <OrderItem key={item.id || index}>
                                        <div className="item-details">
                                            <span className="item-name">
                                                <span className="quantity">{item.quantity || 1}x</span>
                                                {item.product_name || 'Producto desconocido'}
                                            </span>
                                        </div>
                                        <div className="item-price">
                                            {formatNumber(parseFloat(item.price || 0) * (item.quantity || 1))} €
                                        </div>
                                    </OrderItem>
                                ))}
                            </ItemsList>
                        </OrderItems>
                    </SectionContent>
                </OrderDetailsCard>

                {/* --- OrderSummary --- */}
                <OrderSummary>
                    <SummaryTitle>Resumen</SummaryTitle>
                    <SummaryRow>
                        <span>Subtotal</span>
                        <span>{formatNumber(numericSubtotal)} €</span>
                    </SummaryRow>
                    <SummaryRow>
                        <span>Envío</span>
                        <span>{shippingCost === 0 ? 'Gratis' : `${formatNumber(shippingCost)} €`}</span>
                    </SummaryRow>
                    <SummaryRow large>
                        <span>Total</span>
                        <TotalValue>{formatNumber(numericTotal)} €</TotalValue>
                    </SummaryRow>

                    {/* --- Botones de Acción --- */}
                    <Actions>
                        {currentOrder.can_cancel === true && currentOrder.status !== 'CANCELLED' && (
                            <ActionButton
                                variant="outline"
                                onClick={handleCancelOrder}
                            >
                                <FiX aria-hidden="true" /> Cancelar Pedido
                            </ActionButton>
                        )}

                        <ActionButton
                            cartoon
                            onClick={handleDownloadInvoice} // Llama a la función corregida
                            disabled={isDownloadingInvoice} // Deshabilitar mientras carga
                            aria-label="Descargar Factura en formato PDF"
                        >
                            {isDownloadingInvoice ? (
                                <RotatingLoader aria-hidden="true" />
                            ) : (
                                <FiFileText aria-hidden="true" />
                            )}
                            {isDownloadingInvoice ? 'Descargando...' : 'Descargar Factura'}
                        </ActionButton>
                    </Actions>
                </OrderSummary>
            </OrderContent>

            {/* --- Modal --- */}
            <CancelConfirmModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                title="Confirmar Cancelación"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
                            No, mantener pedido
                        </Button>
                        <Button variant="primary" onClick={confirmCancelOrder} className="danger-button">
                            Sí, cancelar pedido
                        </Button>
                    </>
                }
            >
                <div className="warning-text">¿Estás seguro de que quieres cancelar este pedido?</div>
                <p>Esta acción no se puede deshacer. El estado del pedido cambiará a "Cancelado".</p>
            </CancelConfirmModal>
        </OrderDetailContainer>
    );
};

export default OrderDetail;