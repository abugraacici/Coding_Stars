import './NotificationModalStyle.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md';

import { getUserNotifications } from '../../services/notificationService';

import { clearNotificationCount } from '../../redux/navbarSlice';

const NotificationModal = ({ onClose }) => {
    const [notifications, setNotifications] = useState([]);

    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        getUserNotifications(token)
            .then((response) => {
                if (response.success) {
                    setNotifications(response.data);
                }
            })
            .finally(() => dispatch(clearNotificationCount()));
    }, [token]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <div className="backdrop" onClick={onClose} />
            <div className="notification-modal">
                <div className="notification-header">
                    <h3>Bildirimler</h3>
                    <button className="notification-closeBtn" onClick={onClose}>
                        <MdClose size={20} />
                    </button>
                </div>
                {notifications.length === 0 && <p>Bildirim bulunmamaktadır.</p>}
                <ul className="notification-list">
                    {notifications.map((notif) => (
                        <li key={notif.id} className="notification-item">
                            <strong>{notif.title}</strong>
                            <p>{notif.message}</p>
                            <small>{formatDate(notif.sentAt)}</small>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default NotificationModal;
