import './NarvarStyle.css';
import logo from '../../assets/app_logo.png';

import { useState } from 'react';
import {
    MdLocationPin,
    MdNotifications,
    MdPerson,
    MdShoppingCart,
} from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import LocationModal from '../location-modal/LocationModal';

export default function Navbar() {
    const [locationModalOpen, setLocationModalOpen] = useState(false);

    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const { fullname, location } = useSelector((state) => state.navbar);

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
                <li
                    className="item"
                    onClick={() =>
                        token ? setLocationModalOpen(true) : navigate('/auth')
                    }
                    style={{ cursor: 'pointer' }}
                >
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
                    </Link>
                </li>
                <div className="item">
                    <MdNotifications size={20} />
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

            <LocationModal
                isOpen={locationModalOpen}
                onClose={() => setLocationModalOpen(false)}
            />
        </nav>
    );
}
