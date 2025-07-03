import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const ADDRESS_URL = `${API_URL}/addresses`;

export const getAddresses = async (token) => {
    try {
        const response = await axios.get(ADDRESS_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: response.data.addresses };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Adresler alınırken hata oluştu';
        return { success: false, message };
    }
};
