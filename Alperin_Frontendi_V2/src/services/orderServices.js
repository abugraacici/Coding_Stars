import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const ORDER_URL = `${API_URL}/orders`;

export const createOrder = async (token, orderData) => {
    try {
        const response = await axios.post(ORDER_URL, orderData, {
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
                'Sipariş oluşturulurken bir hata oluştu.',
        };
    }
};
