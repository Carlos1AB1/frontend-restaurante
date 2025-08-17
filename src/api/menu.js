// src/api/menu.js
import axiosInstance from '../utils/axios';

const menuApi = {
    getCategories: () => {
        return axiosInstance.get('/menu/categories/');
    },

    getProducts: (params = {}) => {
        return axiosInstance.get('/menu/products/', { params });
    },

    getProductDetail: (slug) => {
        return axiosInstance.get(`/menu/products/${slug}/`);
    },

    searchProducts: (query) => {
        return axiosInstance.get('/menu/products/', {
            params: { search: query }
        });
    }
};

export default menuApi;