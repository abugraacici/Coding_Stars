import './OrderDetailStyle.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import OrderProductCard from '../../components/order-product-card/OrderProductCard';

import { getOrderById } from '../../services/orderServices';
import { getFullnameAndPhoneNumber } from '../../services/userServices';

import { showLoading, hideLoading } from '../../redux/loadingSlice';

export default function OrderDetail() {
    const [order, setOrder] = useState(null);
    const [user, setUser] = useState('');

    const { orderId } = useParams();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) return;

        dispatch(showLoading());
        getOrderById(token, orderId)
            .then((response) => {
                if (response.success) {
                    setOrder(response.data);

                    getFullnameAndPhoneNumber(token, response.data.userId).then(
                        (response) => {
                            if (response.success) {
                                setUser(response.data);
                            }
                        }
                    );
                }
            })
            .finally(() => dispatch(hideLoading()));
    }, [token]);

    return (
        <div className="page">
            <h2>Sipariş Detay</h2>
            {order && (
                <>
                    {order.items.map((product) => (
                        <OrderProductCard key={product._id} product={product} />
                    ))}
                    <div className="bottom-slice">
                        <div className="bottom-card">
                            <h3>Teslimat Adresi</h3>
                            <p className="bottom-card-title">
                                {order.address.city} / {order.address.district}
                            </p>
                            <p className="bottom-card-description">
                                {order.address.description}
                            </p>
                            <p className="bottom-card-fullname">
                                {user.fullname} - {user.phoneNumber}
                            </p>
                        </div>
                        <div className="bottom-card">
                            <h3>Ödeme Bilgileri</h3>
                            <p className="bottom-card-title">
                                Kredi / Banka Kartı
                            </p>
                            <p className="bottom-card-description">
                                **** **** **** {order.cardInfo.last4}
                            </p>
                            <p className="bottom-card-fullname">
                                {order.cardInfo.cardHolder}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
