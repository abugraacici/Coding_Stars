import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    userId: null,
    role: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addToken(state, action) {
            state.token = action.payload.token;
        },
        removeToken(state) {
            state.token = null;
        },
        addUserId(state, action) {
            state.userId = action.payload;
        },
        clearUserId(state) {
            state.userId = null;
        },
        setRole(state, action) {
            state.role = action.payload;
        },
        clearRole(state) {
            state.role = null;
        },
    },
});

export const {
    addToken,
    removeToken,
    addUserId,
    clearUserId,
    setRole,
    clearRole,
} = authSlice.actions;
export default authSlice.reducer;
