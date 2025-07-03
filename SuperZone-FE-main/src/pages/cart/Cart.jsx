import './CartStyle.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import CartItem from '../../components/cart-item/CartItem';

import {
    addOrUpdateCart,
    getCart,
    removeCartItem,
} from '../../services/cartService';

import { removeFromCart, updateQuantity } from '../../redux/cartSlice';
import { showLoading, hideLoading } from '../../redux/loadingSlice';

export default function Cart() {
    const [cartItems, setCartItems] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        if (!token) return;

        getCart(token).then((response) => {
            if (response.success) {
                setCartItems(response.data);
            }
        });
    }, [token]);

    const onDecrement = (product) => {
        let quantity;
        const productId = product._id;
        const updatedItems = cartItems.map((item) => {
            if (item.product._id === productId && item.quantity > 1) {
                quantity = item.quantity - 1;
                return { ...item, quantity };
            }
            return item;
        });

        dispatch(showLoading());
        addOrUpdateCart(token, productId, quantity)
            .then((response) => {
                if (response.success) {
                    setCartItems(updatedItems);
                    dispatch(
                        updateQuantity({
                            productId,
                            quantity,
                        })
                    );
                }
            })
            .finally(() => dispatch(hideLoading()));
    };

    const onIncrement = (product) => {
        let quantity;
        const productId = product._id;
        const updatedItems = cartItems.map((item) => {
            if (
                item.product._id === productId &&
                item.quantity < item.product.stock
            ) {
                quantity = item.quantity + 1;
                return { ...item, quantity };
            }
            return item;
        });

        dispatch(showLoading());
        addOrUpdateCart(token, productId, quantity)
            .then((response) => {
                if (response.success) {
                    setCartItems(updatedItems);
                    dispatch(
                        updateQuantity({
                            productId,
                            quantity,
                        })
                    );
                }
            })
            .finally(() => dispatch(hideLoading()));
    };

    const onDelete = (product) => {
        const updatedItems = cartItems.filter(
            (item) => item.product._id !== product._id
        );

        dispatch(showLoading());
        removeCartItem(token, product._id)
            .then((response) => {
                if (response.success) {
                    dispatch(removeFromCart({ productId: product._id }));
                    setCartItems(updatedItems);
                }
            })
            .finally(() => dispatch(hideLoading()));
    };

    const calculatePrice = () => {
        let sum = 0;
        cartItems.forEach((item) => {
            const price = item.product.price * item.quantity;
            sum += price;
        });

        return sum.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const handleSubmit = () => {
        navigate('/payment');
    };

    return (
        <div>
            <h1>Sepetim</h1>
            <div className="cart-container">
                <div className="left-side">
                    {cartItems.length === 0 ? (
                        <p>Sepetiniz boş.</p>
                    ) : (
                        cartItems.map((item) => (
                            <CartItem
                                key={item.product._id}
                                item={item.product}
                                quantity={item.quantity}
                                onDecrement={onDecrement}
                                onIncrement={onIncrement}
                                onDelete={onDelete}
                            />
                        ))
                    )}
                </div>
                <div className="right-side">
                    <h1>Seçilen Ürünler ({cartItems.length})</h1>
                    <p>{calculatePrice()} TL</p>
                    <button
                        onClick={handleSubmit}
                        disabled={cartItems.length === 0}
                    >
                        Sepeti Onayla
                    </button>
                </div>
            </div>
        </div>
    );
}
