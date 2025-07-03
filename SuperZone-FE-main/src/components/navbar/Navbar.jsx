import './NarvarStyle.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    MdLocationPin,
    MdNotifications,
    MdPerson,
    MdShoppingCart,
} from 'react-icons/md';
import { Link } from 'react-router-dom';

import NotificationModal from '../notification-modal/NotificationModal';

import logo from '../../assets/app_logo.png';

export default function Navbar() {
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    const token = useSelector((state) => state.auth.token);
    const { fullname, notificationCount } = useSelector(
        (state) => state.navbar
    );
    const items = useSelector((state) => state.cart.items);

    return (
        <nav className="navbar">
            <Link to={'/'}>
                <img className="navbar-icon" src={logo} alt="SuperZone" />
            </Link>
            <ul className="navbar-menu">
                <li>
                    <Link to={'/account/favorites'} className="item-link">
                        Favoriler
                    </Link>
                </li>
                <li>
                    <Link to={'/account/orders'} className="item-link">
                        Sipariş Takibi
                    </Link>
                </li>
                <li className="item" style={{ cursor: 'pointer' }}>
                    <MdLocationPin size={20} className="item-icon" />
                    <span className={`${location ? 'location' : ''}`}>
                        {location ? location.label : 'Konum Seçiniz'}
                    </span>
                </li>
                <li className="item">
                    <Link
                        to={token ? '/account/cart' : '/auth'}
                        className="item-link"
                    >
                        <MdShoppingCart size={20} className="item-icon" />
                        Sepetim
                        {items.length !== 0 && (
                            <p className="badge text-black">{items.length}</p>
                        )}
                    </Link>
                </li>
                <div
                    className="item"
                    onClick={() => setShowNotificationModal((prev) => !prev)}
                >
                    <MdNotifications size={20} />
                    {notificationCount === 1 && (
                        <p className="badge text-black">1</p>
                    )}
                </div>
                <li className="item">
                    <Link
                        to={token ? '/account/profile' : '/auth'}
                        className="item-link"
                    >
                        <MdPerson size={20} className="item-icon" />
                        {fullname ? fullname : 'Hesabım'}
                    </Link>
                </li>
            </ul>
            {showNotificationModal && (
                <NotificationModal
                    onClose={() => setShowNotificationModal(false)}
                />
            )}
        </nav>
    );
}
