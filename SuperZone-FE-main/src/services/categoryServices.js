import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORY_URL = `${API_URL}/categories`;

export const getCategories = async () => {
    try {
        const response = await axios.get(CATEGORY_URL);
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Kategoriler alınırken bir hata oluştu';
        return { success: false, message };
    }
};

export const getCategoryNameById = async (categoryId) => {
    try {
        const response = await axios.get(`${CATEGORY_URL}/${categoryId}/name`);
        return { success: true, name: response.data.name };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Kategori adı alınamadı';
        return { success: false, message };
    }
};
