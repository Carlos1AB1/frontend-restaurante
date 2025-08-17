import axiosInstance from '../utils/axios';

const cartApi = {
    getCart: () => {
        return axiosInstance.get('/orders/cart/my-cart/');
    },

    addItem: (item) => {
        return axiosInstance.post('/orders/cart/add-item/', item);
    },

    updateItem: (itemId, quantity) => {
        return axiosInstance.patch(`/orders/cart/update-item/${itemId}/`, { quantity });
    },

    removeItem: (itemId) => {
        return axiosInstance.delete(`/orders/cart/remove-item/${itemId}/`);
    },

    clearCart: () => {
        return axiosInstance.delete('/orders/cart/clear-cart/');
    }
};

export default cartApi;
