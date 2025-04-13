// src/store/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartApi from '../../api/cart';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartApi.getCart();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al obtener el carrito' });
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (item, { rejectWithValue }) => {
        try {
            const response = await cartApi.addItem(item);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al añadir al carrito' });
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            const response = await cartApi.updateItem(itemId, quantity);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al actualizar el ítem' });
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async (itemId, { rejectWithValue }) => {
        try {
            const response = await cartApi.removeItem(itemId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al eliminar el ítem' });
        }
    }
);

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            await cartApi.clearCart();
            return {};
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al vaciar el carrito' });
        }
    }
);

const initialState = {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
};

const safelyConvertToNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        clearCartState: () => initialState,
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart reducers
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                // Ensure totalPrice is converted to a number
                state.totalPrice = safelyConvertToNumber(action.payload.total_price);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al cargar el carrito' };
            })
            // All other cart operations update the entire cart state
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.totalPrice = safelyConvertToNumber(action.payload.total_price);
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al añadir al carrito' };
            })
            // Update item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.totalPrice = safelyConvertToNumber(action.payload.total_price);
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al actualizar ítem' };
            })
            // Remove item
            .addCase(removeCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload.items || [];
                state.totalPrice = safelyConvertToNumber(action.payload.total_price);
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al eliminar ítem' };
            })
            // Clear cart
            .addCase(clearCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.loading = false;
                state.items = [];
                state.totalPrice = 0;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al vaciar el carrito' };
            });
    },
});

export const { clearCartState, clearError } = cartSlice.actions;

export default cartSlice.reducer;