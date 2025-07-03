import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const CART_URL = `${API_URL}/user/cart`;

export const getCart = async (token) => {
    try {
        const res = await axios.get(CART_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: res.data.cart };
    } catch {
        return { success: false, message: 'Sepet alınamadı' };
    }
};

export const addOrUpdateCart = async (token, productId, quantity) => {
    try {
        const res = await axios.post(
            CART_URL,
            { productId, quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return { success: true, data: res.data.cart };
    } catch {
        return {
            success: false,
            message: 'Sepete ekleme/güncelleme başarısız',
        };
    }
};

export const removeCartItem = async (token, productId) => {
    try {
        await axios.delete(`${CART_URL}/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true };
    } catch {
        return { success: false, message: 'Ürün sepetten silinemedi' };
    }
};
