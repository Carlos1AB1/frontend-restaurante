// src/pages/Home/index.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchCategories, fetchProducts } from '../../store/slices/menuSlice';
import HeroBanner from './HeroBanner';
import CategorySection from './CategorySection';
import PopularDishes from './PopularDishes';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import PromoBanner from './PromoBanner';
import Loader from '../../components/common/Loader';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionSpacing = styled.div`
  margin-top: 80px;
`;

const Home = () => {
    const dispatch = useDispatch();
    const { categories, products, loading } = useSelector(state => state.menu);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchProducts({ is_available: true, limit: 8 }));
    }, [dispatch]);

    if (loading && !categories.length && !products.length) {
        return <Loader type="cartoon" text="Cargando deliciosas opciones..." />;
    }

    return (
        <HomeContainer>
            <HeroBanner />

            <SectionSpacing>
                <CategorySection categories={categories} />
            </SectionSpacing>

            <SectionSpacing>
                <PopularDishes products={products} />
            </SectionSpacing>

            <SectionSpacing>
                <PromoBanner />
            </SectionSpacing>

            <SectionSpacing>
                <HowItWorks />
            </SectionSpacing>

            <SectionSpacing>
                <Testimonials />
            </SectionSpacing>
        </HomeContainer>
    );
};

export default Home;
