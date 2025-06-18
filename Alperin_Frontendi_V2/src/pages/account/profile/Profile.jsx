import './ProfileStyle.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getAccountDetails } from '../../../services/userServices';

import { showLoading, hideLoading } from '../../../redux/loadingSlice';
import { clearData } from '../../../redux/navbarSlice';
import { clearRole, removeToken } from '../../../redux/authSlice';
import { clearCart } from '../../../redux/cartSlice';

const ProfilePage = () => {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { token } = useSelector((state) => state.auth);
    useEffect(() => {
        if (token) {
            dispatch(showLoading());
            getAccountDetails(token)
                .then((response) => {
                    if (response.success) {
                        setUser(response.data);
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispatch(hideLoading()));
        }
    }, [token, dispatch]);

    const formatDate = (isoDate) => {
        return new Date(isoDate).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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

    const handleLogout = () => {
        openAlert('Çıkış yapmak istediğinize emin misiniz?', () => {
            clearRedux();
        });
    };

    const clearRedux = () => {
        localStorage.removeItem('token');
        dispatch(clearData());
        dispatch(removeToken());
        dispatch(clearCart());
        dispatch(clearRole());
        navigate('/', { replace: true });
    };
    return (
        user && (
            <div className="page">
                <h2>Hesap Detayları</h2>
                <div className="user-info">
                    <p>
                        <strong>Ad Soyad</strong> {user.fullname}
                    </p>
                    <p>
                        <strong>Email</strong> {user.email}
                    </p>
                    <p>
                        <strong>Telefon Numarası</strong> {user.phoneNumber}
                    </p>
                    <p>
                        <strong>Hesap Oluşturma </strong>{' '}
                        {formatDate(user.createdAt)}
                    </p>
                </div>
                <div className="actions">
                    <button onClick={handleLogout}>Çıkış Yap</button>
                </div>
            </div>
        )
    );
};

export default ProfilePage;
