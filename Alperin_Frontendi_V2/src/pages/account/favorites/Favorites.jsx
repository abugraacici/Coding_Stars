import './FavoritesStyle.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ProductList from '../../../components/product/ProductList';

import { showLoading, hideLoading } from '../../../redux/loadingSlice';

import { getFavorites } from '../../../services/userServices';

export default function Favorites() {
    const [products, setProducts] = useState([]);

    const dispacth = useDispatch();
    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        if (token) {
            dispacth(showLoading());
            getFavorites(token)
                .then((response) => {
                    if (response.success) {
                        setProducts(response.data);
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispacth(hideLoading()));
        }
    }, [dispacth, token]);

    return (
        <div className="page">
            <h2>Favorilerim</h2>
            {products.length === 0 ? (
                <div className="empty-list">
                    Favorilenmiş ürününüz bulunmamaktadır.
                </div>
            ) : (
                <ProductList products={products} favorites={products} />
            )}
        </div>
    );
}
