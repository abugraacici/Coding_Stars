import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const PRODUCT_URL = `${API_URL}/products`;

export const createProduct = async (productData, token) => {
    try {
        const response = await axios.post(PRODUCT_URL, productData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error || 'Ürün eklenirken bir hata oluştu';
        return { success: false, message };
    }
};

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

export const getProductsBySeller = async (token) => {
    try {
        const response = await axios.get(`${PRODUCT_URL}/seller-products`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Ürünler getirilirken bir hata oluştu';
        return { success: false, message };
    }
};

export const updateProduct = async (productId, updatedData, token) => {
    try {
        const response = await axios.put(
            `${PRODUCT_URL}/${productId}`,
            updatedData,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Ürün güncellenirken bir hata oluştu';
        return { success: false, message };
    }
};

export const deleteProduct = async (productId, token) => {
    try {
        await axios.delete(`${PRODUCT_URL}/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Ürün silinirken bir hata oluştu';
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
