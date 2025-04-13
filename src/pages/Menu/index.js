// src/pages/Menu/index.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCategories, fetchProducts } from '../../store/slices/menuSlice';
import MenuHeader from './MenuHeader';
import MenuFilter from './MenuFilter';
import ProductGrid from './ProductGrid';
import Loader from '../../components/common/Loader';

const MenuContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 30px;
  }
`;

const SidebarContainer = styled.div`
  margin-bottom: 30px;
  
  @media (min-width: 768px) {
    width: 250px;
    flex-shrink: 0;
  }
`;

const MainContentContainer = styled.div`
  flex: 1;
`;

const NoProductsMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  margin-top: 20px;
  
  h3 {
    color: ${({ theme }) => theme.heading};
    margin-bottom: 10px;
  }
  
  p {
    color: ${({ theme }) => theme.text};
  }
`;

const Menu = () => {
    const dispatch = useDispatch();
    const { categorySlug } = useParams();
    const location = useLocation();
    const { categories, products, loading, pagination } = useSelector(state => state.menu);

    // Obtener parámetros de búsqueda/filtro de la URL
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');

    // Estados para filtros locales
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [selectedAvailability, setSelectedAvailability] = useState(true);
    const [selectedRating, setSelectedRating] = useState(0);
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        // Construir objeto de filtros para la API
        const filters = {
            is_available: selectedAvailability
        };

        // Añadir filtro de categoría si existe
        if (categorySlug) {
            filters.category__slug = categorySlug;
        }

        // Añadir filtro de búsqueda si existe
        if (searchQuery) {
            filters.search = searchQuery;
        }

        // Añadir filtros de precio si se han modificado
        if (priceRange[0] > 0) {
            filters.price__gte = priceRange[0];
        }
        if (priceRange[1] < 100) {
            filters.price__lte = priceRange[1];
        }

        // Añadir filtro de calificación si se ha seleccionado
        if (selectedRating > 0) {
            filters.average_rating__gte = selectedRating;
        }

        // Añadir ordenamiento
        filters.ordering = sortBy === 'price_asc' ? 'price' :
            sortBy === 'price_desc' ? '-price' :
                sortBy === 'rating' ? '-average_rating' : 'name';

        dispatch(fetchProducts(filters));
    }, [dispatch, categorySlug, searchQuery, priceRange, selectedAvailability, selectedRating, sortBy]);

    // Obtener la categoría actual basada en el slug
    const currentCategory = categories.find(cat => cat.slug === categorySlug);

    // Título dinámico basado en la navegación
    const getPageTitle = () => {
        if (searchQuery) {
            return `Resultados para "${searchQuery}"`;
        }
        if (currentCategory) {
            return currentCategory.name;
        }
        return 'Nuestro Menú';
    };

    return (
        <MenuContainer>
            <MenuHeader
                title={getPageTitle()}
                totalProducts={pagination.count || products.length}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            <ContentContainer>
                <SidebarContainer>
                    <MenuFilter
                        categories={categories}
                        currentCategory={currentCategory}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        selectedAvailability={selectedAvailability}
                        setSelectedAvailability={setSelectedAvailability}
                        selectedRating={selectedRating}
                        setSelectedRating={setSelectedRating}
                    />
                </SidebarContainer>

                <MainContentContainer>
                    {loading ? (
                        <Loader type="cartoon" text="Cargando productos..." />
                    ) : products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <NoProductsMessage>
                            <h3>No se encontraron productos</h3>
                            <p>Intenta cambiar los filtros o la búsqueda para encontrar lo que buscas.</p>
                        </NoProductsMessage>
                    )}
                </MainContentContainer>
            </ContentContainer>
        </MenuContainer>
    );
};

export default Menu;