import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const AUTH_URL = `${API_URL}/auth`;

export const register = async (userData) => {
    try {
        const response = await axios.post(`${AUTH_URL}/register`, userData);
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Kayıt sırasında bir hata oluştu';
        return { success: false, message };
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${AUTH_URL}/login`, credentials);
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Giriş sırasında hata oluştu';
        return { success: false, message };
    }
};

export const verifyOtp = async (userId, otp) => {
    try {
        const response = await axios.post(`${AUTH_URL}/verify-otp`, {
            userId,
            otp,
        });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'OTP doğrulama sırasında bir hata oluştu';
        return { success: false, message };
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${AUTH_URL}/forgot-password`, {
            email,
        });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Doğrulama sırasında bir hata oluştu';
        return { success: false, message };
    }
};

export const resetPassword = async (userId, password) => {
    try {
        const response = await axios.post(`${AUTH_URL}/reset-password`, {
            userId,
            password,
        });
        return { success: true, data: response.data };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Şifre sıfırlama sırasında bir hata oluştu';
        return { success: false, message };
    }
};
