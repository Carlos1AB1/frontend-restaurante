// src/pages/OrderDetail/index.js
import React, {useEffect, useState} from 'react'; // Import useState
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {cancelOrder, fetchOrderDetail} from '../../store/slices/ordersSlice';
import {showNotification} from '../../store/slices/uiSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import {FiChevronLeft, FiClock, FiFileText, FiMapPin, FiPhone, FiX} from 'react-icons/fi';

// --- Styled Components (sin cambios) ---
const OrderDetailContainer = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px; // Añadido padding
`;

const BackButton = styled.button`
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 5px;
    color: ${({theme}) => theme.text};
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 8px 0;

    &:hover {
        color: ${({theme}) => theme.primary};
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
    color: ${({theme}) => theme.heading};
    margin: 0;
`;

const OrderNumber = styled.span`
    font-size: 1.2rem;
    color: ${({theme}) => theme.primary};
    display: block;
`;

const OrderStatus = styled.div`
    padding: 8px 20px;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: bold;
    color: white;
    background-color: ${({status, theme}) => {
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
    border: 2px solid ${({theme}) => theme.outlineColor};
    box-shadow: 3px 3px 0 ${({theme}) => theme.shadowStrong};
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
    background-color: ${({theme}) => theme.cardBg};
    border-radius: 12px;
    overflow: hidden;

    /* Cartoon style */
    border: 3px solid ${({theme}) => theme.outlineColor};
    box-shadow: 5px 5px 0 ${({theme}) => theme.shadowStrong};
`;

const SectionHeader = styled.div`
    padding: 15px 20px;
    background-color: ${({theme}) => theme.shadow};
    /* Ajuste: usar border-bottom del tema si existe */
    border-bottom: 2px solid ${({theme}) => theme.outlineColor || theme.border};
`;

const SectionTitle = styled.h2`
    font-size: 1.3rem;
    color: ${({theme}) => theme.heading};
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
        color: ${({theme}) => theme.text};
        display: flex;
        align-items: center;
        gap: 5px;

        svg {
            color: ${({theme}) => theme.primary};
        }
    }

    p {
        margin: 0;
        color: ${({theme}) => theme.heading};
        /* Permitir saltos de línea en la dirección */
        white-space: pre-line;
    }
`;

const Divider = styled.hr`
    border: none;
    height: 1px;
    background-color: ${({theme}) => theme.border};
    margin: 20px 0;
`;

const OrderItems = styled.div`
    h3 {
        font-size: 1.2rem;
        color: ${({theme}) => theme.heading};
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
    align-items: center; // Alinear verticalmente
    padding-bottom: 15px;
    border-bottom: 1px solid ${({theme}) => theme.border};

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    .item-details { // Agrupar nombre y cantidad
        flex-grow: 1; // Ocupar espacio disponible
        margin-right: 10px; // Espacio antes del precio
    }

    .item-name {
        color: ${({theme}) => theme.heading};

        .quantity {
            font-weight: bold;
            color: ${({theme}) => theme.primary};
            margin-right: 5px; // Espacio entre cantidad y nombre
        }
    }

    .item-price {
        font-weight: bold;
        color: ${({theme}) => theme.text}; // Color consistente
        white-space: nowrap; // Evitar que el precio se rompa en dos líneas
    }
`;

const OrderSummary = styled.div`
    background-color: ${({theme}) => theme.cardBg};
    border-radius: 12px;
    padding: 20px;
    align-self: flex-start; // Se mantiene arriba en layout grid

    /* Cartoon style */
    border: 3px solid ${({theme}) => theme.outlineColor};
    box-shadow: 5px 5px 0 ${({theme}) => theme.shadowStrong};
`;

const SummaryTitle = styled.h2`
    font-size: 1.3rem;
    color: ${({theme}) => theme.heading};
    margin: 0 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 2px solid ${({theme}) => theme.outlineColor || theme.border};
`;

const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    // Usar directamente el booleano
    font-size: ${({large}) => (large ? '1.2rem' : '1rem')};
    font-weight: ${({large}) => (large ? 'bold' : 'normal')};
    // Usar directamente el booleano
    color: ${({large, theme}) => (large ? theme.heading : theme.text)};

    /* Asegurar que el valor no se salga */

    span:last-child {
        white-space: nowrap;
        margin-left: 10px; // Espacio entre etiqueta y valor
    }
`;

const TotalValue = styled.span`
    color: ${({theme}) => theme.primary};
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
        color: ${({theme}) => theme.heading};
        margin-bottom: 15px;
    }

    p {
        color: ${({theme}) => theme.text};
        margin-bottom: 20px;
    }
`;

const CancelConfirmModal = styled(Modal)`
    .warning-text {
        color: ${({theme}) => theme.error};
        font-weight: bold;
        margin-bottom: 20px;
    }

    p {
        margin-bottom: 15px;
        color: ${({theme}) => theme.text};
    }
`;

// --- Componente React ---
const OrderDetail = () => {
    const {orderId} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {currentOrder, loading, error} = useSelector(state => state.orders);
    const [cancelModalOpen, setCancelModalOpen] = useState(false); // Usar useState importado
    const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetail(orderId));
        }
        // Opcional: Limpiar currentOrder al desmontar si es necesario
        // return () => dispatch(clearCurrentOrderAction()); // Necesitarías esta acción en tu slice
    }, [dispatch, orderId]);

    const handleBack = () => {
        // Navegar a /orders si no hay historial previo
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/orders');
        }
    };

    // --- FUNCIÓN handleDownloadInvoice ACTUALIZADA ---
    const handleDownloadInvoice = async () => {
        if (!orderId) return; // Salir si no hay orderId

        setIsDownloadingInvoice(true); // Iniciar estado de carga
        dispatch(showNotification({message: 'Preparando descarga de factura...', type: 'info'}));

        try {
            // Reemplaza esta URL con tu endpoint real de API
            const response = await fetch(`/api/invoices/download/${orderId}`);

            if (!response.ok) {
                // Intentar leer un mensaje de error si la API lo envía en JSON
                let errorMsg = `Error del servidor: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorData.detail || errorMsg;
                } catch (jsonError) {
                    // Si no es JSON, usar el texto de estado
                    errorMsg = response.statusText || errorMsg;
                }
                throw new Error(`No se pudo obtener la factura. ${errorMsg}`);
            }

            // Obtener los datos como Blob
            const blob = await response.blob();

            // Verificar si el tipo de contenido es PDF (opcional pero recomendado)
            if (blob.type !== 'application/pdf') {
                console.warn('La respuesta no parece ser un PDF:', blob.type);
                // Podrías mostrar un error más específico aquí si lo deseas
            }

            // Crear URL temporal del Blob
            const url = window.URL.createObjectURL(blob);

            // Crear enlace temporal
            const link = document.createElement('a');
            link.href = url;
            // Establecer el nombre de archivo sugerido para la descarga
            const filename = `factura_${currentOrder?.order_number || orderId}.pdf`;
            link.setAttribute('download', filename);

            // Añadir enlace al DOM (necesario en algunos navegadores)
            document.body.appendChild(link);

            // Simular clic para iniciar descarga
            link.click();

            // Limpiar: remover el enlace y revocar la URL del objeto
            link.remove();
            window.URL.revokeObjectURL(url);

            dispatch(showNotification({message: '¡Factura descargada!', type: 'success'}));

        } catch (err) {
            console.error('Error al descargar la factura:', err);
            dispatch(showNotification({
                message: err.message || 'Hubo un problema al descargar la factura.',
                type: 'error'
            }));
        } finally {
            setIsDownloadingInvoice(false); // Finalizar estado de carga (tanto en éxito como en error)
        }
    };
    // --- FIN FUNCIÓN handleDownloadInvoice ACTUALIZADA ---

    const handleCancelOrder = () => {
        setCancelModalOpen(true);
    };

    const confirmCancelOrder = () => {
        if (orderId) { // Asegurarse de que orderId existe
            dispatch(cancelOrder(orderId))
                .unwrap() // Permite usar .then() y .catch() en thunks
                .then(() => {
                    dispatch(showNotification({message: 'Pedido cancelado correctamente', type: 'success'}));
                    setCancelModalOpen(false);
                    // Opcional: Redirigir o refrescar datos si es necesario
                    // navigate('/orders');
                })
                .catch((cancelError) => {
                    console.error("Error al cancelar el pedido:", cancelError);
                    dispatch(showNotification({
                        message: cancelError.message || 'No se pudo cancelar el pedido.',
                        type: 'error'
                    }));
                    setCancelModalOpen(false); // Cerrar modal incluso si hay error
                });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Fecha no disponible'; // Manejar fecha inválida/nula
        try {
            const date = new Date(dateString);
            // Verificar si la fecha es válida
            if (isNaN(date.getTime())) {
                return 'Fecha inválida';
            }
            return date.toLocaleDateString('es-ES', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: false // Usar formato 24h
            });
        } catch (e) {
            console.error("Error formateando fecha:", dateString, e);
            return 'Error de fecha';
        }
    };

    // Función segura para formatear números (igual que en ProductDetail)
    const formatNumber = (value, decimals = 2) => {
        const number = parseFloat(value || 0);
        if (isNaN(number)) {
            return (0).toFixed(decimals);
        }
        return number.toFixed(decimals);
    };


    // ---- Renderizado ----

    if (loading) {
        return <Loader type="cartoon" text="Cargando detalles del pedido..."/>;
    }

    // Manejo de Error o Pedido no encontrado
    if (error || !currentOrder) {
        console.error("Error al cargar OrderDetail:", error, "CurrentOrder:", currentOrder);
        return (
            <OrderDetailContainer>
                <BackButton onClick={handleBack} aria-label="Volver">
                    <FiChevronLeft/>
                    Volver
                </BackButton>
                <NotFound>
                    <h2>{error ? 'Error al cargar el pedido' : 'Pedido no encontrado'}</h2>
                    <p>{error?.message || 'No pudimos encontrar los detalles del pedido que buscas.'}</p>
                    <Button to="/orders" cartoon>Ver todos mis pedidos</Button>
                </NotFound>
            </OrderDetailContainer>
        );
    }

    // ---- Cálculos Seguros (cuando currentOrder existe) ----
    // !! CORRECCIÓN CLAVE: Convertir a número ANTES de calcular !!
    const numericSubtotal = parseFloat(currentOrder.total_price || 0);
    // Calcular envío basado en el subtotal NUMÉRICO
    const shippingCost = numericSubtotal > 20 ? 0 : 2.99; // Asumiendo lógica de envío fijo < 20€
    // Calcular total sumando números
    const numericTotal = numericSubtotal + shippingCost;


    return (
        <OrderDetailContainer>
            <BackButton onClick={handleBack} aria-label="Volver a mis pedidos">
                <FiChevronLeft/>
                Volver a mis pedidos
            </BackButton>

            <OrderHeader>
                <div>
                    <OrderTitle>Detalles del Pedido</OrderTitle>
                    {/* Mostrar número de pedido solo si existe */}
                    {currentOrder.order_number && <OrderNumber>{currentOrder.order_number}</OrderNumber>}
                </div>
                {/* Mostrar estado solo si existe */}
                {currentOrder.status && currentOrder.status_display && (
                    <OrderStatus status={currentOrder.status}>
                        {currentOrder.status_display}
                    </OrderStatus>
                )}
            </OrderHeader>

            <OrderContent>
                <OrderDetailsCard>
                    <SectionHeader>
                        <SectionTitle>Información del Pedido</SectionTitle>
                    </SectionHeader>

                    <SectionContent>
                        <OrderInfoGrid>
                            <InfoItem>
                                <h4><FiClock/> Fecha de Pedido</h4>
                                <p>{formatDate(currentOrder.created_at)}</p>
                            </InfoItem>

                            {currentOrder.is_scheduled && currentOrder.scheduled_datetime && ( // Verificar también la fecha
                                <InfoItem>
                                    <h4><FiClock/> Fecha Programada</h4>
                                    <p>{formatDate(currentOrder.scheduled_datetime)}</p>
                                </InfoItem>
                            )}

                            <InfoItem>
                                <h4><FiMapPin/> Dirección de Entrega</h4>
                                {/* Usar pre-line en styled component para respetar saltos */}
                                <p>{currentOrder.delivery_address || 'No especificada'}</p>
                            </InfoItem>

                            <InfoItem>
                                <h4><FiPhone/> Teléfono de Contacto</h4>
                                <p>{currentOrder.phone_number || 'No especificado'}</p>
                            </InfoItem>
                        </OrderInfoGrid>

                        {currentOrder.notes && (
                            <>
                                <Divider/>
                                <InfoItem>
                                    <h4><FiFileText/> Notas</h4>
                                    <p style={{whiteSpace: 'pre-line'}}>{currentOrder.notes}</p>
                                </InfoItem>
                            </>
                        )}

                        <Divider/>

                        <OrderItems>
                            <h3>Productos</h3>
                            {/* Usar || [] para evitar error si items es null/undefined */}
                            <ItemsList>
                                {(currentOrder.items || []).map((item, index) => (
                                    <OrderItem key={item.id || index}> {/* Usar item.id si está disponible */}
                                        <div className="item-details">
                                            <span className="item-name">
                                                <span className="quantity">{item.quantity || 1}x</span>
                                                {item.product_name || 'Producto desconocido'}
                                            </span>
                                            {/* Podrías añadir descripción corta o variantes si las tienes */}
                                        </div>
                                        <div className="item-price">
                                            {/* !! CORRECCIÓN AQUÍ: Formatear el precio total del item de forma segura !! */}
                                            {formatNumber(parseFloat(item.price || 0) * (item.quantity || 1))} €
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
                        {/* !! CORRECCIÓN AQUÍ: Usar formatNumber con el subtotal numérico !! */}
                        <span>{formatNumber(numericSubtotal)} €</span>
                    </SummaryRow>

                    <SummaryRow>
                        <span>Envío</span>
                        {/* !! CORRECCIÓN AQUÍ: Formatear el coste de envío numérico !! */}
                        <span>{shippingCost === 0 ? 'Gratis' : `${formatNumber(shippingCost)} €`}</span>
                    </SummaryRow>

                    {/* Podrías añadir descuentos aquí si aplicara */}

                    <SummaryRow large>
                        <span>Total</span>
                        {/* !! CORRECCIÓN AQUÍ: Usar formatNumber con el total numérico !! */}
                        <TotalValue>{formatNumber(numericTotal)} €</TotalValue>
                    </SummaryRow>

                    <Actions>
                        {/* Asegurarse de que can_cancel es booleano */}
                        {currentOrder.can_cancel === true && currentOrder.status !== 'CANCELLED' && (
                            <ActionButton
                                variant="outline" // O un color 'danger' si lo tienes
                                onClick={handleCancelOrder}
                            >
                                <FiX aria-hidden="true"/> Cancelar Pedido
                            </ActionButton>
                        )}

                        {/* Podría haber una condición para mostrar la factura (ej: solo si está pagado) */}
                        <ActionButton
                            cartoon
                            onClick={handleDownloadInvoice}
                            aria-label="Descargar Factura en formato PDF"
                        >
                            <FiFileText aria-hidden="true"/> Descargar Factura
                        </ActionButton>
                    </Actions>
                </OrderSummary>
            </OrderContent>

            {/* El Modal no necesita cambios directos para este error */}
            <CancelConfirmModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                title="Confirmar Cancelación"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setCancelModalOpen(false)}>
                            No, mantener pedido
                        </Button>
                        <Button variant="primary" onClick={confirmCancelOrder}
                                className="danger-button"> {/* Podrías darle estilo danger */}
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