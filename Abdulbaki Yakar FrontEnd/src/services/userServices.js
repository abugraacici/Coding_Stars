import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const USER_URL = `${API_URL}/user`;

export const getMe = async (token) => {
    try {
        const response = await axios.get(`${USER_URL}/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Kullanıcı bilgisi alınırken hata oluştu';
        return { success: false, message };
    }
};

export const getAccountDetails = async (token) => {
    try {
        const response = await axios.get(`${USER_URL}/account`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Kullanıcı bilgisi alınırken hata oluştu';
        return { success: false, message };
    }
};

export const updateFullname = async (token, fullname) => {
    try {
        const response = await axios.put(
            `${USER_URL}/update-fullname`,
            { fullname },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Ad soyad güncellenirken hata oluştu';
        return { success: false, message };
    }
};

export const updateEmail = async (token, newEmail, currentPassword) => {
    try {
        const response = await axios.put(
            `${USER_URL}/update-email`,
            { newEmail, currentPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Email güncellenirken bir hata oluştu';
        return { success: false, message };
    }
};

export const updatePhoneNumber = async (
    token,
    newPhoneNumber,
    currentPassword
) => {
    try {
        const response = await axios.put(
            `${USER_URL}/update-phone-number`,
            { newPhoneNumber, currentPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Telefon numarası güncellenirken bir hata oluştu';
        return { success: false, message };
    }
};

export const updatePassword = async (token, currentPassword, newPassword) => {
    try {
        const response = await axios.put(
            `${USER_URL}/update-password`,
            { currentPassword, newPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Şifre güncellenirken bir hata oluştu';
        return { success: false, message };
    }
};

export const deleteAccount = async (token) => {
    try {
        const response = await axios.delete(`${USER_URL}/delete-account`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { success: true, message: response.data.message };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Hesap silinirken bir hata oluştu';
        return { success: false, message };
    }
};

export const getFullnameAndPhoneNumber = async (token, id) => {
    try {
        const response = await axios.get(
            `${USER_URL}/fullname-and-phone-number?searchedUserId=${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Kullanıcı bilgisi alınırken hata oluştu';
        return { success: false, message };
    }
};
