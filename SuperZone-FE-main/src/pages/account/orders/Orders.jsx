import './OrdersStyle.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import OrderCard from '../../../components/order-card/OrderCard';

import { getOrders } from '../../../services/orderServices';
import { showLoading, hideLoading } from '../../../redux/loadingSlice';

export default function Orders() {
    const [orders, setOrders] = useState([]);

    const dispacth = useDispatch();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) return;

        dispacth(showLoading());
        getOrders(token)
            .then((response) => {
                if (response.success) {
                    setOrders(response.data);
                }
            })
            .finally(() => dispacth(hideLoading()));
    }, [token]);

    return (
        <div className="page">
            <h2>Siparişlerim</h2>
            {orders.length === 0 && (
                <p className="empty-list">
                    Geçmiş siparişiniz bulunmamaktadır.
                </p>
            )}
            {orders.map((order) => (
                <OrderCard order={order} key={order._id} />
            ))}
        </div>
    );
}
