// src/store/slices/menuSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import menuApi from '../../api/menu';

export const fetchCategories = createAsyncThunk(
    'menu/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await menuApi.getCategories();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al obtener las categorías' });
        }
    }
);

export const fetchProducts = createAsyncThunk(
    'menu/fetchProducts',
    async (params, { rejectWithValue }) => {
        try {
            const response = await menuApi.getProducts(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al obtener los productos' });
        }
    }
);

export const fetchProductDetail = createAsyncThunk(
    'menu/fetchProductDetail',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await menuApi.getProductDetail(slug);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al obtener el detalle del producto' });
        }
    }
);

const initialState = {
    categories: [],
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    pagination: {
        count: 0,
        next: null,
        previous: null,
    },
};

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Categories reducers
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload.results || action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al cargar categorías' };
            })
            // Products reducers
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.results || action.payload;
                if (action.payload.count !== undefined) {
                    state.pagination = {
                        count: action.payload.count,
                        next: action.payload.next,
                        previous: action.payload.previous,
                    };
                }
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al cargar productos' };
            })
            // Product detail reducers
            .addCase(fetchProductDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProduct = action.payload;
            })
            .addCase(fetchProductDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al cargar el detalle del producto' };
            });
    },
});

export const { clearCurrentProduct, clearError } = menuSlice.actions;

export default menuSlice.reducer;