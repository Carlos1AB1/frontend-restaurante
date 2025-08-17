// src/utils/priceHelpers.js

/**
 * Convierte un precio a número y lo formatea con decimales
 * @param {string|number} price - El precio a formatear
 * @param {number} decimals - Número de decimales (por defecto 2)
 * @returns {string} - Precio formateado
 */
export const formatPrice = (price, decimals = 2) => {
    const numPrice = parseFloat(price || 0);
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(decimals);
};

/**
 * Convierte un rating a número y lo formatea con un decimal
 * @param {string|number} rating - El rating a formatear
 * @returns {string} - Rating formateado
 */
export const formatRating = (rating) => {
    const numRating = parseFloat(rating || 0);
    return isNaN(numRating) ? '0.0' : numRating.toFixed(1);
};

/**
 * Calcula el precio total de un item del carrito
 * @param {number} quantity - Cantidad del item
 * @param {string|number} price - Precio unitario
 * @returns {number} - Precio total calculado
 */
export const calculateItemTotal = (quantity, price) => {
    const numPrice = parseFloat(price || 0);
    const numQuantity = parseInt(quantity || 0);
    return numQuantity * numPrice;
};

/**
 * Formatea un precio con símbolo de moneda
 * @param {string|number} price - El precio a formatear
 * @param {string} currency - Símbolo de moneda (por defecto '$')
 * @param {number} decimals - Número de decimales (por defecto 2)
 * @returns {string} - Precio formateado con moneda
 */
export const formatCurrency = (price, currency = '$', decimals = 2) => {
    return `${currency}${formatPrice(price, decimals)}`;
};
