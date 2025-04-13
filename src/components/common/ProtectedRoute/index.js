// src/components/common/ProtectedRoute/index.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useSelector(state => state.auth);
    const location = useLocation();

    // Mostrar indicador de carga mientras se verifica la autenticación
    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        // Redirigir a login y guardar la ubicación actual para volver después
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;