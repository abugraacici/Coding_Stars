import './AddressesStyle.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

import { showLoading, hideLoading } from '../../../redux/loadingSlice';
import { updateSelectedLocation } from '../../../redux/navbarSlice';

import {
    addAddress,
    deleteAddress,
    getAddresses,
    updateAddress,
} from '../../../services/addressServices';

const initialState = {
    label: '',
    city: '',
    district: '',
    description: '',
};

export default function Addresses() {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState(initialState);
    const [selectedAddress, setSelectedAddress] = useState();

    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const location = useSelector((state) => state.navbar.location);

    useEffect(() => {
        if (token) {
            dispatch(showLoading());
            getAddresses(token)
                .then((response) => {
                    if (response.success) {
                        setAddresses(response.data);
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispatch(hideLoading()));
        }
    }, [dispatch, token]);

    const openAlert = (message, callback) => {
        return new Promise((resolve) => {
            const confirmed = window.confirm(message);
            if (confirmed) {
                callback();
                resolve(true);
            } else {
                resolve(false);
            }
        });
    };

    const handleDeleteAddress = (id) => {
        dispatch(showLoading());
        openAlert('Adresi silmek istediğinize emin misiniz?', () => {
            deleteAddress(id, token)
                .then((response) => {
                    if (response.success) {
                        setAddresses((prev) =>
                            prev.filter((loc) => loc._id !== id)
                        );
                        toast.success('Adres başarıyla silindi.');
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispatch(hideLoading()));
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectedChange = (e) => {
        const { name, value } = e.target;
        setSelectedAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddAddress = () => {
        if (
            !newAddress.label ||
            !newAddress.city ||
            !newAddress.district ||
            !newAddress.description
        ) {
            toast.error('Lütfen tüm alaları doldurun.');
            return;
        }

        dispatch(showLoading());
        addAddress(newAddress, token)
            .then((response) => {
                if (response.success) {
                    setAddresses((prev) => [...prev, newAddress]);
                    setNewAddress({
                        label: '',
                        city: '',
                        district: '',
                        description: '',
                    });
                    toast.success('Adres başarıyla eklendi.');
                }
            })
            .finally(() => dispatch(hideLoading()));
    };

    const handleUpdateAddress = () => {
        if (
            !selectedAddress.label ||
            !selectedAddress.city ||
            !selectedAddress.district ||
            !selectedAddress.description
        ) {
            toast.error('Lütfen tüm alaları doldurun.');
            return;
        }
        dispatch(showLoading());
        const { _id, label, city, district, description } = selectedAddress;
        updateAddress(_id, { label, city, district, description }, token)
            .then((response) => {
                if (response.success) {
                    if (location._id === _id) {
                        dispatch(updateSelectedLocation(selectedAddress));
                    }

                    setAddresses((prev) =>
                        prev.map((addr) =>
                            addr._id === _id
                                ? {
                                      _id,
                                      label,
                                      city,
                                      district,
                                      description,
                                  }
                                : addr
                        )
                    );
                    setSelectedAddress(null);
                    toast.success('Adres başarıyla güncellendi.');
                }
            })
            .finally(() => dispatch(hideLoading()));
    };

    return (
        <div className="page">
            <h2>Adreslerim</h2>
            <div className="inner-cotainer">
                <div className="section">
                    {addresses.length !== 0 ? (
                        addresses.map((add) => (
                            <li
                                key={add._id}
                                className="saved-address-item"
                                onClick={() => setSelectedAddress(add)}
                            >
                                <div style={{ flex: 1 }}>
                                    <div className="address-name">
                                        {add.label}
                                    </div>
                                    <div className="address-location">
                                        {add.city}, {add.district}
                                    </div>
                                    <div className="address-description">
                                        {add.description}
                                    </div>
                                </div>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteAddress(add._id)}
                                    aria-label="Adres sil"
                                >
                                    <MdDelete size={20} />
                                </button>
                            </li>
                        ))
                    ) : (
                        <div className="empty-list">
                            Kayıtlı adresiniz bulunmamaktadır.
                        </div>
                    )}
                </div>
                <div className="section">
                    <form
                        className="address-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            selectedAddress
                                ? handleUpdateAddress()
                                : handleAddAddress();
                        }}
                        onReset={() => {
                            selectedAddress
                                ? setSelectedAddress(null)
                                : setNewAddress(initialState);
                        }}
                    >
                        <div className="form-group address-name">
                            <label htmlFor="name">Adres Adı</label>
                            <input
                                style={{ width: '93%' }}
                                id="label"
                                name="label"
                                placeholder="Örn: Ev, İş"
                                value={
                                    selectedAddress
                                        ? selectedAddress.label
                                        : newAddress.label
                                }
                                onChange={
                                    selectedAddress
                                        ? handleSelectedChange
                                        : handleChange
                                }
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">Şehir</label>
                                <input
                                    id="city"
                                    name="city"
                                    placeholder="Şehir"
                                    value={
                                        selectedAddress
                                            ? selectedAddress.city
                                            : newAddress.city
                                    }
                                    onChange={
                                        selectedAddress
                                            ? handleSelectedChange
                                            : handleChange
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="district">İlçe</label>
                                <input
                                    id="district"
                                    name="district"
                                    placeholder="İlçe"
                                    value={
                                        selectedAddress
                                            ? selectedAddress.district
                                            : newAddress.district
                                    }
                                    onChange={
                                        selectedAddress
                                            ? handleSelectedChange
                                            : handleChange
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Açık Adres</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Mahalle, sokak, bina no..."
                                value={
                                    selectedAddress
                                        ? selectedAddress.description
                                        : newAddress.description
                                }
                                onChange={
                                    selectedAddress
                                        ? handleSelectedChange
                                        : handleChange
                                }
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="add-button">
                            {selectedAddress ? 'Güncelle' : 'Adres Ekle'}
                        </button>
                        <button type="reset" className="add-button">
                            Temizle
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
