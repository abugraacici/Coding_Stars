import './LocationModalStyle.css';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';

import { setSelectedLocation } from '../../redux/navbarSlice';

import {
    addAddress,
    deleteAddress,
    getAddresses,
    selectAddress,
} from '../../services/addressServices';

export default function Modal({ isOpen, onClose }) {
    const dispatch = useDispatch();

    const [locations, setLocations] = useState([]);

    const [newLocation, setNewLocation] = useState({
        label: '',
        city: '',
        district: '',
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewLocation((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddLocation = () => {
        if (
            !newLocation.label ||
            !newLocation.city ||
            !newLocation.district ||
            !newLocation.description
        ) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        addAddress(newLocation, token).then((response) => {
            if (response.success) {
                setLocations((prev) => [...prev, newLocation]);
                setNewLocation({
                    label: '',
                    city: '',
                    district: '',
                    description: '',
                });
                toast.success('Adres başarıyla eklendi.');
            }
        });
    };

    const handleSelectLocation = (loc) => {
        selectAddress(loc._id, token);
        dispatch(setSelectedLocation(loc));
        onClose();
    };

    const handleDeleteLocation = (id) => {
        openAlert('Adresi silmek istediğinize emin misiniz?', () =>
            deleteAddress(id, token)
                .then((response) => {
                    if (response.success) {
                        setLocations((prev) =>
                            prev.filter((loc) => loc._id !== id)
                        );
                        dispatch(setSelectedLocation(null));
                        toast.success('Adres başarıyla silindi.');
                    }
                })
                .catch(() => {
                    // err
                })
        );
    };

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

    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        if (token) {
            getAddresses(token)
                .then((response) => {
                    if (response.success) {
                        setLocations(response.data);
                    }
                })
                .catch(() => {
                    // err
                });
        }
    }, [token, isOpen]);

    useEffect(() => {
        function onKeyDown(e) {
            if (e.key === 'Escape') onClose();
        }
        if (isOpen) {
            window.addEventListener('keydown', onKeyDown);
        }
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <h2>Yeni Adres Ekle</h2>
                <form
                    className="address-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAddLocation();
                    }}
                >
                    <div className="form-group address-name">
                        <label htmlFor="name">Adres Adı</label>
                        <input
                            style={{ width: '93%' }}
                            id="label"
                            name="label"
                            placeholder="Örn: Ev, İş"
                            value={newLocation.label}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">Şehir</label>
                            <input
                                id="city"
                                name="city"
                                placeholder="Şehir"
                                value={newLocation.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="district">İlçe</label>
                            <input
                                id="district"
                                name="district"
                                placeholder="İlçe"
                                value={newLocation.district}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Açık Adres</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Mahalle, sokak, bina no..."
                            value={newLocation.description}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>
                    <button type="submit" className="add-button">
                        Adres Ekle
                    </button>
                </form>

                <h3>Kaydedilen Adresler</h3>
                <ul className="saved-address-list">
                    {locations.map((loc) => (
                        <li key={loc._id} className="saved-address-item">
                            <div
                                onClick={() => handleSelectLocation(loc)}
                                style={{ flex: 1 }}
                            >
                                <div className="address-name">{loc.label}</div>
                                <div className="address-location">
                                    {loc.city}, {loc.district}
                                </div>
                                <div className="address-description">
                                    {loc.description}
                                </div>
                            </div>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteLocation(loc._id)}
                                aria-label="Adres sil"
                            >
                                <MdDelete size={20} />
                            </button>
                        </li>
                    ))}
                    {locations.length === 0 && (
                        <li className="saved-address-empty">
                            Henüz kayıtlı adres yok.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
