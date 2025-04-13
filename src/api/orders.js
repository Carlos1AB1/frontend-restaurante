import axiosInstance from '../utils/axios';

const ordersApi = {
    getOrders: () => {
        return axiosInstance.get('/orders/orders/');
    },

    getOrderDetail: (orderId) => {
        return axiosInstance.get(`/orders/orders/${orderId}/`);
    },

    createOrder: (orderData) => {
        return axiosInstance.post('/orders/orders/', orderData);
    },

    cancelOrder: (orderId) => {
        return axiosInstance.post(`/orders/orders/${orderId}/cancel/`);
    },

    downloadInvoice: (orderId) => {
        return axiosInstance.get(`/invoices/download/${orderId}/`, {
            responseType: 'blob'
        });
    }
};

export default ordersApi;
