import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const USER_URL = `${API_URL}/user`;

export const getMe = async (token) => {
    try {
        const response = await axios.get(`${USER_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Kullanıcı bilgisi alınırken hata oluştu';
        return { success: false, message };
    }
};

export const getAccountDetails = async (token) => {
    try {
        const response = await axios.get(`${USER_URL}/account`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Kullanıcı bilgisi alınırken hata oluştu';
        return { success: false, message };
    }
};

export const getFavorites = async (token) => {
    try {
        const response = await axios.get(`${USER_URL}/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data.favorites };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Ürünler getirilirken bir hata oluştu.';
        return { success: false, message };
    }
};

export const addToFavorites = async (token, productId) => {
    try {
        const response = await axios.post(
            `${USER_URL}/favorites/${productId}`,
            null,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { success: true, message: response.data.message };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Ürün favorilere eklenirken bir hata oluştu.';
        return { success: false, message };
    }
};

export const removeFromFavorites = async (token, productId) => {
    try {
        const response = await axios.delete(
            `${USER_URL}/favorites/${productId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { success: true, message: response.data.message };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Ürün favorilerden silinirken bir hata oluştu.';
        return { success: false, message };
    }
};
