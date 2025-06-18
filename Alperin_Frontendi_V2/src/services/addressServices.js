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

export const addAddress = async (addressData, token) => {
    try {
        const response = await axios.post(ADDRESS_URL, addressData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: response.data.addresses };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Adres eklenirken hata oluştu';
        return { success: false, message };
    }
};

export const deleteAddress = async (addressId, token) => {
    try {
        const response = await axios.delete(`${ADDRESS_URL}/${addressId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return { success: true, data: response.data.addresses };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Adres silinirken hata oluştu';
        return { success: false, message };
    }
};

export const selectAddress = async (addressId, token) => {
    try {
        const response = await axios.put(
            `${ADDRESS_URL}/select/${addressId}`,
            null,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return { success: true, data: response.data.addresses };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Seçili adres güncellenirken hata oluştu';
        return { success: false, message };
    }
};

export const updateAddress = async (addressId, addressData, token) => {
    try {
        const response = await axios.put(
            `${ADDRESS_URL}/update`,
            { addressId, addressData },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return { success: true, data: response.data.addresses };
    } catch (error) {
        const message =
            error.response?.data?.error ||
            error.response?.data?.message ||
            'Adres güncellenirken bir hata oluştu';
        return { success: false, message };
    }
};
