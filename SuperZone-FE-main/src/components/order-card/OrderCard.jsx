import './OrderCardStyle.css';
import { useNavigate } from 'react-router-dom';
import {
    FaCheckCircle,
    FaClock,
    FaTruck,
    FaShippingFast,
} from 'react-icons/fa';

const getOverallStatus = (items) => {
    const statusPriority = {
        Hazırlanıyor: 1,
        'Kargoya Verildi': 2,
        Yolda: 3,
        'Teslim Edildi': 4,
    };

    let lowestStatus = 'Teslim Edildi';

    for (const item of items) {
        if (
            statusPriority[item.deliveryStatus] < statusPriority[lowestStatus]
        ) {
            lowestStatus = item.deliveryStatus;
        }
    }

    return lowestStatus;
};

const statusIcons = {
    Hazırlanıyor: <FaClock className="status-icon" color="#555" />,
    'Kargoya Verildi': <FaTruck className="status-icon" color="#ffa41c" />,
    Yolda: <FaShippingFast className="status-icon" color="#ffa41c" />,
    'Teslim Edildi': <FaCheckCircle className="status-icon" color="#28a745" />,
};

export default function OrderCard({ order }) {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const displayedItems = order.items.slice(0, 2);
    const extraItemCount = order.items.length - 2;
    const emptyCount = 3 - order.items.length;

    return (
        <div
            className="order-card"
            onClick={() => navigate(`/account/orders/${order._id}`)}
        >
            <div className="order-images">
                {displayedItems.map((item, index) => (
                    <img
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="order-image"
                    />
                ))}
                {extraItemCount > 0 ? (
                    <div className="order-image extra">+{extraItemCount}</div>
                ) : (
                    <div className="order-image empty-extra" />
                )}
                {emptyCount == 2 && <div className="order-image empty-extra" />}
            </div>

            <div className="order-info">
                <p className="order-number">
                    Sipariş no: <strong>{order.orderNumber}</strong>
                </p>
                <div className="order-status">
                    {statusIcons[getOverallStatus(order.items)]}
                    <span>{getOverallStatus(order.items)}</span>
                </div>
            </div>

            <div className="order-meta">
                <p>{formatDate(order.createdAt)}</p>
                <p className="order-price">{order.totalPrice} TL</p>
            </div>
        </div>
    );
}
