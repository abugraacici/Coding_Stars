import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    location: null,
    fullname: null,
    notificationCount: null,
};

const navbarSlice = createSlice({
    name: 'navbar',
    initialState,
    reducers: {
        setData(state, action) {
            state.location = action.payload.location;
            state.fullname = action.payload.fullname;
        },
        clearData(state) {
            state.location = null;
            state.fullname = null;
            state.notificationCount = null;
        },
        setSelectedLocation(state, action) {
            state.location = action.payload;
        },
        updateSelectedLocation(state, action) {
            state.location = action.payload;
        },
        setNotificationCount(state) {
            state.notificationCount = 1;
        },
        clearNotificationCount(state) {
            state.notificationCount = 0;
        },
    },
});

export const {
    setData,
    clearData,
    setSelectedLocation,
    updateSelectedLocation,
    setNotificationCount,
    clearNotificationCount,
} = navbarSlice.actions;
export default navbarSlice.reducer;
