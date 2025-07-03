import './ProductDetailStyle.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/loadingSlice';
import { toast } from 'react-toastify';
import { MdFavoriteBorder, MdFavorite, MdStar } from 'react-icons/md';

import { addToCart, removeFromCart } from '../../redux/cartSlice';
import { getProductById } from '../../services/productServices';
import { getCategoryNameById } from '../../services/categoryServices';
import { addOrUpdateCart, removeCartItem } from '../../services/cartService';

export default function ProductDetail() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [inCart, setInCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [categoryName, setCategoryName] = useState('-');

    const dispacth = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const items = useSelector((state) => state.cart.items);

    useEffect(() => {
        dispacth(showLoading());
        getProductById(productId, token)
            .then((response) => {
                if (response.success) {
                    setProduct(response.data);
                }
            })
            .catch(() => {
                // err
            })
            .finally(() => dispacth(hideLoading()));
    }, [dispacth, productId, token]);

    useEffect(() => {
        const fetchCategoryAndFavorites = async () => {
            if (!product) return;

            if (product.category) {
                try {
                    const response = await getCategoryNameById(
                        product.category
                    );
                    setCategoryName(response.success ? response.name : '-');
                } catch {
                    setCategoryName('-');
                }
            }
        };

        fetchCategoryAndFavorites();
    }, [product, token]);

    useEffect(() => {
        if (product === null) return;

        const isAdded = items.some((item) => item.productId === product._id);
        setInCart(isAdded);
    }, [items, product]);

    const handleOnFavoriteClick = () => {
        const newIsFavorite = !isFavorite;
        if (!token) {
            toast.warning(
                'Ürünü favorilere eklemek için önce giriş yapmanız gerekmektedir.'
            );
            return;
        }
        setIsFavorite(newIsFavorite);
    };

    const handleProductCartAction = async () => {
        if (!token) {
            toast.warning(
                'Ürünü sepete eklemek için önce giriş yapmanız gerekmektedir.'
            );
            return;
        }

        if (product.stock === 0) {
            return;
        }
        if (inCart) {
            const confirmRemove = window.confirm(
                'Ürünü sepetten çıkarmak istiyor musunuz?'
            );
            if (!confirmRemove) return;
        }
        const newCartState = !inCart;

        if (newCartState) {
            dispacth(addToCart({ productId: product._id }));
            await addOrUpdateCart(token, product._id);
            toast.success('Ürün sepete eklendi.');
        } else {
            dispacth(removeFromCart({ productId: product._id }));
            await removeCartItem(token, product._id);
            toast.warning('Ürün sepetten kaldırıldı.');
        }
    };

    if (!product) return <div>Ürün bulunamadı.</div>;

    return (
        <div className="product-detail-container">
            <div className="product-detail-card">
                <img
                    className="product-detail-image"
                    src={product.image}
                    alt={product.name}
                />
                <div className="product-detail-info">
                    <div>
                        <h1>{product.name}</h1>
                        <p className="product-detail-category-stock">
                            <strong>{categoryName} </strong>
                            <br />
                            {product.stock !== 0
                                ? `${product.stock} stokta.`
                                : 'Tükendi.'}
                            <br />
                        </p>
                        <div className="product-detail-rating">
                            <MdStar size={20} color="#f1c40f" />
                            <span className="rating-value">10</span>
                            <span className="review-count">(10 yorum)</span>
                        </div>
                        <p className="product-detail-description">
                            {product.description}
                        </p>
                    </div>
                    <div>
                        <p className="product-detail-price">
                            {product.price.toFixed(2)} TL
                        </p>
                        {!product.isOwner && (
                            <div className="product-detail-actions">
                                <button
                                    className={`cart-button ${
                                        inCart ? 'remove' : ''
                                    }`}
                                    onClick={handleProductCartAction}
                                >
                                    {product.stock === 0
                                        ? 'Tükendi'
                                        : inCart
                                        ? 'Sepetten Çıkar'
                                        : 'Sepete Ekle'}
                                </button>
                                <button
                                    className="favorite-button"
                                    onClick={handleOnFavoriteClick}
                                >
                                    {isFavorite ? (
                                        <MdFavorite size={32} color="red" />
                                    ) : (
                                        <MdFavoriteBorder size={32} />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
