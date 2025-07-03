import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const NOTIFICATION_URL = `${API_URL}/notifications`;

export async function checkAndSendNotification(token) {
    try {
        const response = await axios.get(`${NOTIFICATION_URL}/check`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.error ||
                'Bildirimler getirilirken bir hata oluştu.',
        };
    }
}

export async function getUserNotifications(token) {
    try {
        const response = await axios.get(`${NOTIFICATION_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.error ||
                'Bildirimler getirilirken bir hata oluştu.',
        };
    }
}
