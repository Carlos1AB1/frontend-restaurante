import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { cancelOrder, fetchOrders } from '../../store/slices/ordersSlice';
import { showNotification } from '../../store/slices/uiSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import { FiChevronRight, FiDownload, FiSearch, FiX } from 'react-icons/fi';

const OrderHistoryContainer = styled.div`
    max-width: 1000px;
    margin: 0 auto;
`;

const PageTitle = styled.h1`
    font-size: 2.5rem;
    color: ${({theme}) => theme.heading};
    margin-bottom: 30px;
    text-align: center;
`;

const SearchBar = styled.div`
    display: flex;
    margin-bottom: 30px;
    position: relative;
`;

const SearchInput = styled.input`
    flex: 1;
    padding: 12px 15px;
    padding-left: 40px;
    border-radius: 50px;
    border: 2px solid ${({theme}) => theme.border};
    background-color: ${({theme}) => theme.background};
    color: ${({theme}) => theme.text};
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: ${({theme}) => theme.primary};
    }

    /* Cartoon style */
    border: 2px solid ${({theme}) => theme.outlineColor};
    box-shadow: 3px 3px 0 ${({theme}) => theme.shadowStrong};
`;

const SearchIcon = styled.div`
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({theme}) => theme.text};
    opacity: 0.7;
`;

const Tabs = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 5px;

    &::-webkit-scrollbar {
        height: 5px;
    }

    &::-webkit-scrollbar-track {
        background: ${({theme}) => theme.border};
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({theme}) => theme.primary};
        border-radius: 10px;
    }
`;

const Tab = styled.button`
    padding: 10px 20px;
    background-color: ${({active, theme}) => active ? theme.primary : theme.cardBg};
    color: ${({active, theme}) => active ? 'white' : theme.text};
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: ${({active}) => active ? 'bold' : 'normal'};
    white-space: nowrap;

    &:hover {
        background-color: ${({active, theme}) => active ? theme.primaryDark : theme.shadow};
    }

    /* Cartoon style */
    border: 2px solid ${({theme}) => theme.outlineColor};
    box-shadow: 2px 2px 0 ${({theme}) => theme.shadowStrong};
`;

const OrdersList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const OrderCard = styled.div`
    background-color: ${({theme}) => theme.cardBg};
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
    }

    /* Cartoon style */
    border: 3px solid ${({theme}) => theme.outlineColor};
    box-shadow: 5px 5px 0 ${({theme}) => theme.shadowStrong};
`;

const OrderHeader = styled.div`
    padding: 15px 20px;
    background-color: ${({theme}) => theme.shadow};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
`;

const OrderNumber = styled.p`
    font-weight: bold;
    margin: 0;
    color: ${({theme}) => theme.heading};
`;

const OrderDate = styled.p`
    margin: 0;
    color: ${({theme}) => theme.text};
    font-size: 0.9rem;
`;

const OrderStatus = styled.div`
    padding: 5px 15px;
    border-radius: 50px;
    font-size: 0.9rem;
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
`;

const OrderContent = styled.div`
    padding: 20px;
`;

const OrderInfo = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
`;

const InfoItem = styled.div`
    h4 {
        margin: 0 0 5px 0;
        font-size: 0.9rem;
        color: ${({theme}) => theme.text};
        opacity: 0.8;
    }

    p {
        margin: 0;
        color: ${({theme}) => theme.heading};
        font-weight: bold;
    }
`;

const OrderItems = styled.div`
    margin-bottom: 20px;

    h4 {
        margin: 0 0 10px 0;
        color: ${({theme}) => theme.heading};
    }
`;

const ItemsList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

const Item = styled.div`
    background-color: ${({theme}) => theme.shadow};
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 0.9rem;

    .quantity {
        font-weight: bold;
        color: ${({theme}) => theme.primary};
    }
`;

const OrderActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    flex-wrap: wrap;
`;

const NoOrders = styled.div`
    text-align: center;
    padding: 50px 20px;
    background-color: ${({theme}) => theme.cardBg};
    border-radius: 12px;
    margin-bottom: 20px;

    /* Cartoon style */
    border: 3px solid ${({theme}) => theme.outlineColor};
    box-shadow: 5px 5px 0 ${({theme}) => theme.shadowStrong};

    h3 {
        margin-bottom: 15px;
        color: ${({theme}) => theme.heading};
    }

    p {
        margin-bottom: 20px;
        color: ${({theme}) => theme.text};
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

const OrderHistory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { orders, loading, error } = useSelector(state => state.orders);

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleViewOrder = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    const handleDownloadInvoice = async (orderId, e) => {
        e.stopPropagation(); // Prevent navigation to detail
        setIsDownloadingInvoice(true);

        try {
            const ordersApiModule = await import('../../api/orders');
            const response = await ordersApiModule.default.downloadInvoice(orderId);

            // Create a blob URL for the download
            const blob = new Blob([response.data], {type: 'application/pdf'});
            const url = window.URL.createObjectURL(blob);

            // Find the current order from the orders array
            const order = orders.find(o => o.id === orderId);

            // Create a temporary link element to trigger download
            const link = document.createElement('a');
            link.href = url;
            // Use order number if available, otherwise use ID
            const filename = `factura_${order?.order_number || orderId}.pdf`;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            dispatch(showNotification({
                message: 'Factura descargada correctamente',
                type: 'success'
            }));
        } catch (error) {
            console.error('Error downloading invoice:', error);

            // Show user-friendly notification
            dispatch(showNotification({
                message: 'No se pudo descargar la factura. Inténtalo de nuevo más tarde.',
                type: 'error'
            }));
        } finally {
            setIsDownloadingInvoice(false);
        }
    };

    const handleCancelOrder = (order, e) => {
        e.stopPropagation(); // Evitar la navegación al detalle
        setSelectedOrder(order);
        setCancelModalOpen(true);
    };

    const confirmCancelOrder = () => {
        if (selectedOrder) {
            dispatch(cancelOrder(selectedOrder.id));
            setCancelModalOpen(false);

            dispatch(showNotification({
                message: 'Pedido cancelado correctamente',
                type: 'success'
            }));
        }
    };

    const getFilteredOrders = () => {
        // Ensure orders is an array
        const safeOrders = Array.isArray(orders) ? orders : [];

        let filteredOrders = [...safeOrders];

        // Aplicar filtros por estado
        if (activeFilter !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === activeFilter);
        }

        // Aplicar búsqueda
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filteredOrders = filteredOrders.filter(order =>
                (order.order_number && order.order_number.toLowerCase().includes(query)) ||
                (order.delivery_address && order.delivery_address.toLowerCase().includes(query))
            );
        }

        // Ordenar por fecha (más reciente primero)
        filteredOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        return filteredOrders;
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
        return <Loader type="cartoon" text="Cargando tus pedidos..."/>;
    }

    if (error) {
        return (
            <OrderHistoryContainer>
                <PageTitle>Mis Pedidos</PageTitle>
                <NoOrders>
                    <h3>Error al cargar tus pedidos</h3>
                    <p>{error.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo.'}</p>
                    <Button onClick={() => dispatch(fetchOrders())} cartoon>
                        Intentar de nuevo
                    </Button>
                </NoOrders>
            </OrderHistoryContainer>
        );
    }

    const filteredOrders = getFilteredOrders();

    return (
        <OrderHistoryContainer>
            <PageTitle>Mis Pedidos</PageTitle>

            <SearchBar>
                <SearchIcon>
                    <FiSearch/>
                </SearchIcon>
                <SearchInput
                    type="text"
                    placeholder="Buscar por número de pedido o dirección..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </SearchBar>

            <Tabs>
                <Tab
                    active={activeFilter === 'all'}
                    onClick={() => setActiveFilter('all')}
                >
                    Todos
                </Tab>
                <Tab
                    active={activeFilter === 'PENDING'}
                    onClick={() => setActiveFilter('PENDING')}
                >
                    Pendientes
                </Tab>
                <Tab
                    active={activeFilter === 'PROCESSING'}
                    onClick={() => setActiveFilter('PROCESSING')}
                >
                    En Proceso
                </Tab>
                <Tab
                    active={activeFilter === 'SCHEDULED'}
                    onClick={() => setActiveFilter('SCHEDULED')}
                >
                    Programados
                </Tab>
                <Tab
                    active={activeFilter === 'OUT_FOR_DELIVERY'}
                    onClick={() => setActiveFilter('OUT_FOR_DELIVERY')}
                >
                    En Reparto
                </Tab>
                <Tab
                    active={activeFilter === 'DELIVERED'}
                    onClick={() => setActiveFilter('DELIVERED')}
                >
                    Entregados
                </Tab>
                <Tab
                    active={activeFilter === 'CANCELLED'}
                    onClick={() => setActiveFilter('CANCELLED')}
                >
                    Cancelados
                </Tab>
            </Tabs>

            {filteredOrders.length > 0 ? (
                <OrdersList>
                    {filteredOrders.map(order => (
                        <OrderCard
                            key={order.id}
                            onClick={() => handleViewOrder(order.id)}
                        >
                            <OrderHeader>
                                <div>
                                    <OrderNumber>{order.order_number}</OrderNumber>
                                    <OrderDate>{formatDate(order.created_at)}</OrderDate>
                                </div>
                                <OrderStatus status={order.status}>
                                    {order.status_display}
                                </OrderStatus>
                            </OrderHeader>

                            <OrderContent>
                                <OrderInfo>
                                    <InfoItem>
                                        <h4>Dirección</h4>
                                        <p>{order.delivery_address && order.delivery_address.split('\n')[0]}</p>
                                    </InfoItem>

                                    <InfoItem>
                                        <h4>Total</h4>
                                        <p>{parseFloat(order.total_price || 0).toFixed(2)} €</p>
                                    </InfoItem>

                                    {order.is_scheduled && (
                                        <InfoItem>
                                            <h4>Fecha programada</h4>
                                            <p>{order.scheduled_datetime ? formatDate(order.scheduled_datetime) : 'Programado'}</p>
                                        </InfoItem>
                                    )}
                                </OrderInfo>

                                <OrderItems>
                                    <h4>Productos</h4>
                                    <ItemsList>
                                        {order.items && order.items.map((item, index) => (
                                            <Item key={index}>
                                                <span className="quantity">{item.quantity}x</span> {item.product_name}
                                            </Item>
                                        ))}
                                    </ItemsList>
                                </OrderItems>

                                <OrderActions>
                                    {order.can_cancel && order.status !== 'CANCELLED' && (
                                        <Button
                                            variant="outline"
                                            small
                                            onClick={(e) => handleCancelOrder(order, e)}
                                        >
                                            <FiX/> Cancelar
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        small
                                        onClick={(e) => handleDownloadInvoice(order.id, e)}
                                    >
                                        <FiDownload/> Factura
                                    </Button>

                                    <Button
                                        cartoon
                                        small
                                        onClick={() => handleViewOrder(order.id)}
                                    >
                                        Detalles <FiChevronRight/>
                                    </Button>
                                </OrderActions>
                            </OrderContent>
                        </OrderCard>
                    ))}
                </OrdersList>
            ) : (
                <NoOrders>
                    {orders.length === 0 ? (
                        <>
                            <h3>Aún no tienes pedidos</h3>
                            <p>¡Realiza tu primer pedido y podrás verlo aquí!</p>
                            <Button to="/menu" cartoon animated>
                                Ver Menú
                            </Button>
                        </>
                    ) : (
                        <>
                            <h3>No se encontraron pedidos</h3>
                            <p>No hay pedidos que coincidan con los filtros seleccionados.</p>
                            <Button onClick={() => {
                                setSearchQuery('');
                                setActiveFilter('all');
                            }} cartoon>
                                Limpiar filtros
                            </Button>
                        </>
                    )}
                </NoOrders>
            )}

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
                <p>Una vez cancelado, no podrás revertir esta acción. Si tienes alguna duda, contacta con nuestro
                    servicio de atención al cliente.</p>
            </CancelConfirmModal>
        </OrderHistoryContainer>
    );
};

export default OrderHistory;