// src/utils/axios.js
import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { showNotification } from '../store/slices/uiSlice';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Crear instancia de axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para añadir el token a las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Función para refrescar el token
const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await axios.post(`${API_BASE_URL}/users/login/refresh/`, {
            refresh: refreshToken,
        });

        localStorage.setItem('accessToken', response.data.access);
        return response.data.access;
    } catch (error) {
        // Si no se puede refrescar el token, logout
        store.dispatch(logout());
        throw error;
    }
};

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 (Unauthorized) y no hemos intentado refrescar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const token = await refreshToken();
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Si falla el refresh, mostramos notificación y hacemos logout
                store.dispatch(showNotification({
                    message: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
                    type: 'error',
                }));
                return Promise.reject(refreshError);
            }
        }

        // Para otros errores, simplemente los rechazamos
        return Promise.reject(error);
    }
);

export default axiosInstance;