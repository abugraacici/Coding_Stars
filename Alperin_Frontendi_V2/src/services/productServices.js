import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const PRODUCT_URL = `${API_URL}/products`;

export const getAllProducts = async (token) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(PRODUCT_URL, { headers });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error || 'Ürünler alınırken bir hata oluştu';
        return { success: false, message };
    }
};

export const getProductById = async (id, token = null) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${PRODUCT_URL}/${id}`, { headers });
        return { success: true, data: response.data.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Ürün getirilirken hata oluştu';
        return { success: false, message };
    }
};
