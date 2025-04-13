// src/api/auth.js
import axiosInstance from '../utils/axios';

const authApi = {
    login: (credentials) => {
        return axiosInstance.post('/users/login/', credentials);
    },

    register: (userData) => {
        return axiosInstance.post('/users/register/', userData);
    },

    getProfile: () => {
        return axiosInstance.get('/users/profile/');
    },

    updateProfile: (userData) => {
        return axiosInstance.patch('/users/profile/', userData);
    },

    requestPasswordReset: (email) => {
        return axiosInstance.post('/users/password-reset/', { email });
    },

    resetPassword: (token, password, password2) => {
        return axiosInstance.post('/users/password-reset/confirm/', {
            token,
            password,
            password2
        });
    },

    verifyEmail: (token) => {
        return axiosInstance.get(`/users/verify-email/${token}/`);
    }
};

export default authApi;