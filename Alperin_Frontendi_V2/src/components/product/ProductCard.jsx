import './ProductStyle.css';
import { useEffect, useState } from 'react';
import { MdFavorite, MdFavoriteBorder, MdStar } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
    addToFavorites,
    removeFromFavorites,
} from '../../services/userServices';
import {
    addOrUpdateCart,
    removeCartItem,
} from '../../services/cartServices.js';

import { addToCart, removeFromCart } from '../../redux/cartSlice';
import { hideLoading, showLoading } from '../../redux/loadingSlice.js';

export default function ProductCard({ product, favorite = false }) {
    const [isFavorite, setIsFavorite] = useState(favorite);
    const [isAddedToCart, setIsAddedToCart] = useState(false);

    const dispacth = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const items = useSelector((state) => state.cart.items);

    useEffect(() => {
        const isAdded = items.some((item) => item.productId === product._id);
        setIsAddedToCart(isAdded);
    }, [items, product]);

    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            toast.warning(
                'Ürünü favorilere eklemek için önce giriş yapmanız gerekmektedir.'
            );
            return;
        }

        const _isFavorite = !isFavorite;
        setIsFavorite(_isFavorite);
        dispacth(showLoading());
        if (_isFavorite) {
            addToFavorites(token, product._id)
                .then((response) => {
                    if (response.success) {
                        toast.success(response.message);
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispacth(hideLoading()));
        } else {
            removeFromFavorites(token, product._id)
                .then((response) => {
                    if (response.success) {
                        toast.success(response.message);
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispacth(hideLoading()));
        }
    };

    const handleProductCartAction = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            toast.warning(
                'Ürünü sepete eklemek için önce giriş yapmanız gerekmektedir.'
            );
            return;
        }

        if (product.stock === 0) return;

        if (isAddedToCart) {
            const confirmRemove = window.confirm(
                'Ürünü sepetten çıkarmak istiyor musunuz?'
            );
            if (!confirmRemove) return;
        }

        const newState = !isAddedToCart;
        setIsAddedToCart(newState);
        if (newState) {
            dispacth(addToCart({ productId: product._id }));
            await addOrUpdateCart(token, product._id);
            toast.success('Ürün sepete eklendi.');
        } else {
            dispacth(removeFromCart({ productId: product._id }));
            await removeCartItem(token, product._id);
            toast.warning('Ürün sepetten kaldırıldı.');
        }
    };

    return (
        <Link className="product-card" to={`/product/${product._id}`}>
            <div className="favorite-icon" onClick={handleFavoriteClick}>
                {isFavorite ? (
                    <MdFavorite size={24} color="#e63946" />
                ) : (
                    <MdFavoriteBorder size={24} color="#555" />
                )}
            </div>
            <img
                src={product.image}
                alt={product.name}
                className="product-image"
            />
            <h3 className="product-title">{product.name}</h3>
            <p className="product-card-description">{product.description}</p>
            <div className="product-price">
                {product.price.toLocaleString('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}{' '}
                TL
            </div>
            <button
                className={`add-to-cart-button ${
                    product.stock === 0
                        ? 'no-stock'
                        : isAddedToCart
                        ? 'added'
                        : ''
                }`}
                onClick={handleProductCartAction}
            >
                {product.stock === 0
                    ? 'Tükendi'
                    : isAddedToCart
                    ? 'Sepete Eklendi'
                    : 'Sepete Ekle'}
            </button>
        </Link>
    );
}
