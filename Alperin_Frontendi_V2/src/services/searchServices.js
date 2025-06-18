import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const SEARCH_HISTORY_URL = `${API_URL}/search-history`;

export const getSearchHistory = async (token) => {
    try {
        const response = await axios.get(SEARCH_HISTORY_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: response.data.searchHistory };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Arama geçmişi getirilirken bir hata oluştu';
        return { success: false, message };
    }
};

export const addSearchQuery = async (query, token) => {
    try {
        const response = await axios.post(
            SEARCH_HISTORY_URL,
            { query },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return { success: true, data: response.data.searchHistory };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Arama sorgusu eklenirken hata oluştu';
        return { success: false, message };
    }
};

export const removeSearchQuery = async (query, token) => {
    try {
        const response = await axios.delete(SEARCH_HISTORY_URL, {
            data: { query },
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: response.data.searchHistory };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Arama sorgusu silinirken hata oluştu';
        return { success: false, message };
    }
};
