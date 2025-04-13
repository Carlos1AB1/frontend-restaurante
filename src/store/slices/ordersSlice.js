// src/store/slices/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ordersApi from '../../api/orders';

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await ordersApi.getOrders();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al obtener los pedidos' });
        }
    }
);

export const fetchOrderDetail = createAsyncThunk(
    'orders/fetchOrderDetail',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await ordersApi.getOrderDetail(orderId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al obtener el detalle del pedido' });
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await ordersApi.createOrder(orderData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al crear el pedido' });
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancelOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await ordersApi.cancelOrder(orderId);
            return { ...response.data, orderId };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Error al cancelar el pedido' });
        }
    }
);

const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    orderCreated: false,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        },
        clearOrderCreated: (state) => {
            state.orderCreated = false;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch orders reducers
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                // Log the payload to understand its structure
                console.log('Fetch Orders Payload:', action.payload);

                // Ensure we're setting an array
                state.orders = Array.isArray(action.payload)
                    ? action.payload
                    : (action.payload.results || []);
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al cargar pedidos' };
                state.orders = []; // Ensure orders is an empty array on error
            })
            // Fetch order detail reducers
            .addCase(fetchOrderDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al cargar el detalle del pedido' };
            })
            // Create order reducers
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.orderCreated = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.orderCreated = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al crear el pedido' };
            })
            // Cancel order reducers
            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                // Update order status in list
                state.orders = state.orders.map(order =>
                    order.id === action.payload.orderId
                        ? { ...order, status: 'CANCELLED', status_display: 'Cancelado' }
                        : order
                );
                // Update current order if that's the one that was cancelled
                if (state.currentOrder && state.currentOrder.id === action.payload.orderId) {
                    state.currentOrder = {
                        ...state.currentOrder,
                        status: 'CANCELLED',
                        status_display: 'Cancelado'
                    };
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || { message: 'Error al cancelar el pedido' };
            });
    },
});

export const { clearCurrentOrder, clearOrderCreated, clearError } = ordersSlice.actions;

export default ordersSlice.reducer;