import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const COMMENT_URL = `${API_URL}/comments`;

export const addComment = async (token, comment) => {
    try {
        const response = await axios.post(COMMENT_URL, comment, {
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
                'Yorum eklenirken bir hata oluştu.',
        };
    }
};

export const getCommentsByProductId = async (productId) => {
    try {
        const response = await axios.get(`${COMMENT_URL}/${productId}`);
        return { success: true, data: response.data.data };
    } catch (error) {
        return {
            success: false,
            message:
                error.response?.data?.error ||
                'Yorumlar getirilirken bir hata oluştu.',
        };
    }
};
