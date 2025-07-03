import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.items.find(
                (item) => item.productId === action.payload.productId
            );
            if (!existingItem) {
                state.items.push({
                    productId: action.payload.productId,
                    quantity: 1,
                });
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.productId !== action.payload.productId
            );
        },
        updateQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item.productId === action.payload.productId
            );
            if (item) {
                item.quantity = action.payload.quantity;
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
        initCart: (state, action) => {
            state.items = action.payload;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    initCart,
} = cartSlice.actions;

export default cartSlice.reducer;
