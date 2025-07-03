import './style.css';
import { useNavigate } from 'react-router-dom';
import {
    FaCheckCircle,
    FaClock,
    FaShippingFast,
    FaTruck,
} from 'react-icons/fa';

const statusIcons = {
    Hazırlanıyor: <FaClock className="status-icon" color="#555" />,
    'Kargoya Verildi': <FaTruck className="status-icon" color="#ffa41c" />,
    Yolda: <FaShippingFast className="status-icon" color="#ffa41c" />,
    'Teslim Edildi': <FaCheckCircle className="status-icon" color="#28a745" />,
};

export default function OrderProductCard({ product }) {
    const navigate = useNavigate();

    return (
        <div
            className="opd-wrapper"
            onClick={() => navigate(`/product/${product.productId}`)}
        >
            <img src={product.image} alt={product.name} />
            <div className="opd-info-container">
                <p className="opd-product-name">{product.name}</p>
                <div>
                    <p className="opd-price">
                        {product.price} TL ({product.quantity})
                    </p>
                    <p className="opd-total-price">
                        {product.price * product.quantity} TL
                    </p>
                </div>
            </div>
            <p className="opd-status">
                {statusIcons[product.deliveryStatus]} {product.deliveryStatus}
            </p>
            <p className="opd-seller-city">
                Gönderim Adresi: {product.sellerCity}
            </p>
        </div>
    );
}
