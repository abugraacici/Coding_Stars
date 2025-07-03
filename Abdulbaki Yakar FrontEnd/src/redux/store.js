import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import navbarReducer from './navbarSlice';
import loadingReducer from './loadingSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        navbar: navbarReducer,
        loading: loadingReducer,
        cart: cartReducer,
    },
});
