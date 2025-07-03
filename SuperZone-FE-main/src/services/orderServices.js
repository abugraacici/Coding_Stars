import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const ORDER_URL = `${API_URL}/orders`;

export const getOrders = async (token) => {
    try {
        const response = await axios.get(ORDER_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.error ||
                'Siparişler getirilirken bir hata oluştu.',
        };
    }
};

export const getOrderById = async (token, orderId) => {
    try {
        const response = await axios.get(`${ORDER_URL}/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.error ||
                'Sipariş detayı alınırken bir hata oluştu.',
        };
    }
};
