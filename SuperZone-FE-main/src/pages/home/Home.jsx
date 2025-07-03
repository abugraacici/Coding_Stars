import './HomeStyle.css';
import { useEffect, useState } from 'react';

import ProductList from '../../components/product/ProductList';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../../redux/loadingSlice';
import { getAllProducts } from '../../services/productServices';

export default function Home() {
    const [products, setProducts] = useState([]);
    const token = useSelector((state) => state.auth.token);
    const dispacth = useDispatch();

    useEffect(() => {
        dispacth(showLoading());
        getAllProducts(token)
            .then((response) => {
                if (response.success) {
                    setProducts(response.data);
                }
            })
            .catch(() => {
                // err
            })
            .finally(() => dispacth(hideLoading()));
    }, [dispacth, token]);

    return (
        <div>
            <ProductList products={products} />
        </div>
    );
}
