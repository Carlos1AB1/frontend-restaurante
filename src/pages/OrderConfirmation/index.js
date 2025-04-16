// src/pages/OrderConfirmation/index.js
import React, {useEffect, useState} from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { fetchOrderDetail } from '../../store/slices/ordersSlice';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { FiCheck, FiDownload, FiFileText, FiChevronRight, FiHome } from 'react-icons/fi';
import axiosInstance from '../../utils/axios';
import {showNotification} from "../../store/slices/uiSlice";

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ConfirmationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${({ theme }) => theme.success};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 30px;
  color: white;
  font-size: 2rem;
  animation: ${pulse} 2s infinite;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const ConfirmationTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 15px;
`;

const ConfirmationMessage = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 40px;
`;

const OrderInfoCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 40px;
  
  /* Cartoon style */
  border: 3px solid ${({ theme }) => theme.outlineColor};
  box-shadow: 5px 5px 0 ${({ theme }) => theme.shadowStrong};
`;

const OrderInfoTitle = styled.h2`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.heading};
  margin-bottom: 20px;
  text-align: left;
`;

const OrderInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  text-align: left;
  
  &:last-child {
    border-bottom: none;
  }
`;

const OrderInfoLabel = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: bold;
`;

const OrderInfoValue = styled.span`
  color: ${({ theme }) => theme.primary};
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 400px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const InvoiceButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const TrackingNotice = styled.div`
  background-color: ${({ theme }) => theme.accent + '30'};
  border-radius: 8px;
  padding: 15px;
  margin-top: 30px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
  
  a {
    color: ${({ theme }) => theme.primary};
    font-weight: bold;
  }
`;

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();
    const { currentOrder, loading, error } = useSelector(state => state.orders);

    // Helper function to safely convert to number
    const safeNumber = (value) => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrderDetail(orderId));
        }
    }, [dispatch, orderId]);

    // Debug logging
    useEffect(() => {
        if (currentOrder) {
            console.log('Current Order Debug:', {
                ...currentOrder,
                total_price: currentOrder.total_price,
                total_price_type: typeof currentOrder.total_price
            });
        }
    }, [currentOrder]);


    const [downloading, setDownloading] = useState(false);
    const handleDownloadInvoice = async () => {
        if (!orderId) {
            dispatch(showNotification({
                message: 'ID de pedido no encontrado.',
                type: 'error'
            }));
            return;
        }

        setDownloading(true);
        dispatch(showNotification({
            message: 'Preparando la descarga de la factura...',
            type: 'info'
        }));

        try {
            // Obtener la URL base de la API desde la configuración
            const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

            // Usar la URL completa del backend para evitar problemas con React Router
            const downloadUrl = `${API_BASE_URL}/invoices/download/${orderId}/`;

            // Realizar la petición usando axiosInstance para incluir token de autenticación
            const response = await axiosInstance.get(downloadUrl, {
                responseType: 'blob'
            });

            // Verificar que la respuesta contiene datos
            if (response.data.size === 0) {
                throw new Error('El servidor devolvió un archivo vacío');
            }

            // Crear un blob URL para el archivo descargado
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            // Crear un elemento <a> para descargar el archivo
            const link = document.createElement('a');
            link.href = url;
            // Usar un nombre de archivo descriptivo
            const filename = `factura_${currentOrder?.order_number || orderId}.pdf`;
            link.setAttribute('download', filename);

            // Añadir temporalmente al DOM, hacer clic y luego remover
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Liberar el URL del objeto
            window.URL.revokeObjectURL(url);

            dispatch(showNotification({
                message: '¡Factura descargada correctamente!',
                type: 'success'
            }));
        } catch (error) {
            console.error('Error al descargar la factura:', error);

            // Mensaje de error detallado para ayudar en la depuración
            let errorMessage = 'Error al descargar la factura.';

            if (error.response) {
                // Error de respuesta del servidor (ej. 404, 500)
                errorMessage = `Error del servidor (${error.response.status}): No se pudo descargar la factura.`;
            } else if (error.request) {
                // Error de red - no se recibió respuesta
                errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión.';
            } else {
                // Error en la configuración de la petición
                errorMessage = `Error en la petición: ${error.message}`;
            }

            dispatch(showNotification({
                message: errorMessage,
                type: 'error'
            }));
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return <Loader type="cartoon" text="Cargando información del pedido..." />;
    }

    if (error || !currentOrder) {
        return (
            <ConfirmationContainer>
                <ConfirmationTitle>¡Ups! Algo salió mal</ConfirmationTitle>
                <ConfirmationMessage>
                    No pudimos cargar la información de tu pedido. Por favor, verifica en tu historial de pedidos.
                </ConfirmationMessage>
                <ButtonsContainer>
                    <Button to="/orders" cartoon>Ver mis pedidos</Button>
                    <Button to="/" variant="outline">Volver al inicio</Button>
                </ButtonsContainer>
            </ConfirmationContainer>
        );
    }

    return (
        <ConfirmationContainer>
            <SuccessIcon>
                <FiCheck />
            </SuccessIcon>

            <ConfirmationTitle>¡Pedido Confirmado!</ConfirmationTitle>
            <ConfirmationMessage>
                Gracias por tu pedido. Hemos recibido tu solicitud y estamos procesándola.
            </ConfirmationMessage>

            <OrderInfoCard>
                <OrderInfoTitle>Detalles del Pedido</OrderInfoTitle>

                <OrderInfoRow>
                    <OrderInfoLabel>Número de Pedido</OrderInfoLabel>
                    <OrderInfoValue>{currentOrder.order_number}</OrderInfoValue>
                </OrderInfoRow>

                <OrderInfoRow>
                    <OrderInfoLabel>Estado</OrderInfoLabel>
                    <OrderInfoValue>{currentOrder.status_display}</OrderInfoValue>
                </OrderInfoRow>

                <OrderInfoRow>
                    <OrderInfoLabel>Fecha</OrderInfoLabel>
                    <OrderInfoValue>
                        {new Date(currentOrder.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </OrderInfoValue>
                </OrderInfoRow>

                <OrderInfoRow>
                    <OrderInfoLabel>Dirección de Entrega</OrderInfoLabel>
                    <OrderInfoValue>{currentOrder.delivery_address}</OrderInfoValue>
                </OrderInfoRow>

                <OrderInfoRow>
                    <OrderInfoLabel>Total</OrderInfoLabel>
                    <OrderInfoValue>
                        {safeNumber(currentOrder.total_price).toFixed(2)} €
                    </OrderInfoValue>
                </OrderInfoRow>
            </OrderInfoCard>

            <ButtonsContainer>
                <InvoiceButton
                    onClick={handleDownloadInvoice}
                    cartoon
                    disabled={downloading}
                >
                    {downloading ? 'Descargando...' : (
                        <>
                            <FiDownload /> Descargar Factura
                        </>
                    )}
                </InvoiceButton>

                <InvoiceButton to="/orders" variant="outline">
                    <FiFileText /> Ver mis pedidos
                </InvoiceButton>
            </ButtonsContainer>

            <TrackingNotice>
                Puedes seguir el estado de tu pedido en la sección <Link to="/orders">Mis Pedidos</Link>.
                Te enviaremos actualizaciones por correo electrónico cuando el pedido esté en camino y cuando sea entregado.
            </TrackingNotice>

            <Button to="/" variant="text" style={{ marginTop: '30px' }}>
                Volver a la página principal <FiChevronRight />
            </Button>
        </ConfirmationContainer>
    );
};

export default OrderConfirmation;