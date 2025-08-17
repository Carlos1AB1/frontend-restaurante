// src/utils/imageHelpers.js

/**
 * Construye la URL completa para una imagen desde Django
 * @param {string} imagePath - Ruta de la imagen desde Django
 * @param {string} fallback - Imagen de respaldo por defecto
 * @returns {string} - URL completa de la imagen
 */
export const getImageUrl = (imagePath, fallback = '/assets/images/food-icons/burger.png') => {
  if (!imagePath) {
    return fallback;
  }

  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Si empieza con /, es una ruta absoluta desde el servidor
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Si es una ruta relativa, construir URL completa
  // Aquí puedes ajustar según tu configuración de Django
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  return `${API_BASE_URL.replace('/api', '')}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`;
};

/**
 * Obtiene la imagen de categoría con fallback
 * @param {object} category - Objeto de categoría
 * @returns {string} - URL de la imagen
 */
export const getCategoryImage = (category) => {
  return getImageUrl(category?.image, '/assets/images/food-icons/burger.png');
};

/**
 * Obtiene la imagen de producto con fallback
 * @param {object} product - Objeto de producto
 * @returns {string} - URL de la imagen
 */
export const getProductImage = (product) => {
  return getImageUrl(product?.image, '/assets/images/food-items/imgmainARCHU.png');
};

/**
 * Maneja errores de carga de imagen
 * @param {Event} e - Evento de error
 * @param {string} fallback - Imagen de respaldo
 */
export const handleImageError = (e, fallback = '/assets/images/food-icons/burger.png') => {
  console.warn(`Failed to load image: ${e.target.src}`);
  e.target.src = fallback;
};
