// src/api/auth.js
import axiosInstance from '../utils/axios'; // Tu instancia configurada de Axios

const authApi = {
    login: (credentials) => {
        // POST a /users/login/ con { username, password } (o email)
        return axiosInstance.post('/users/login/', credentials);
    },

    register: (userData) => {
        // POST a /users/register/ con los datos del usuario
        return axiosInstance.post('/users/register/', userData);
    },

    getProfile: () => {
        // GET a /users/profile/ (requiere token válido en las cabeceras de axiosInstance)
        return axiosInstance.get('/users/profile/');
    },

    updateProfile: (userData) => {
        // PATCH o PUT a /users/profile/ con los datos a actualizar
        return axiosInstance.patch('/users/profile/', userData);
    },

    requestPasswordReset: (email) => {
        // POST a /users/password-reset/ enviando { email: "user@example.com" }
        return axiosInstance.post('/users/password-reset/', { email });
    },

    resetPassword: (token, password, password2) => {
        // POST a /users/password-reset/confirm/ enviando { token, password, password2 }
        return axiosInstance.post('/users/password-reset/confirm/', {
            token,
            password,
            password2
        });
    },

    verifyEmail: (token) => {
        // GET a /users/verify-email/{token}/ (El token va en la URL)
        return axiosInstance.get(`/users/verify-email/${token}/`);
    },

    // --- NUEVA FUNCIÓN AÑADIDA ---
    /**
     * Verifica la validez de un token de acceso JWT.
     * @param {string} accessToken - El token de acceso JWT a verificar.
     * @returns {Promise} Una promesa de Axios para la petición POST.
     *          Una respuesta exitosa (200 OK) indica que el token es válido.
     *          Una respuesta de error (400/401) indica que el token es inválido o expirado.
     */
    verifyToken: (accessToken) => {
        // Validar que se pasó un token
        if (!accessToken) {
            console.error("authApi.verifyToken: No se proporcionó ningún token para verificar.");
            // Devolver una promesa rechazada inmediatamente es consistente
            return Promise.reject(new Error("No access token provided for verification."));
        }

        // **IMPORTANTE**: Asegúrate de que esta es la URL correcta de tu backend
        // para la verificación de tokens (común en djangorestframework-simplejwt)
        const VERIFY_URL = '/users/token/verify/'; // O podría ser '/auth/token/verify/', '/api/token/verify/' etc.

        // El backend de simplejwt espera un objeto JSON con la clave "token"
        const requestBody = {
            token: accessToken
        };

        console.log(`[authApi] Verificando token en ${VERIFY_URL}`);
        return axiosInstance.post(VERIFY_URL, requestBody);
    }
    // --- FIN NUEVA FUNCIÓN ---
};

export default authApi;