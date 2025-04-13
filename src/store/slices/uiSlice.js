// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',
    notification: null,
    mobileMenuOpen: false,
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
        },
        showNotification: (state, action) => {
            state.notification = {
                message: action.payload.message,
                type: action.payload.type || 'info',
                duration: action.payload.duration || 3000,
            };
        },
        clearNotification: (state) => {
            state.notification = null;
        },
        toggleMobileMenu: (state) => {
            state.mobileMenuOpen = !state.mobileMenuOpen;
        },
        closeMobileMenu: (state) => {
            state.mobileMenuOpen = false;
        },
    },
});

export const {
    toggleTheme,
    setTheme,
    showNotification,
    clearNotification,
    toggleMobileMenu,
    closeMobileMenu,
} = uiSlice.actions;

export default uiSlice.reducer;