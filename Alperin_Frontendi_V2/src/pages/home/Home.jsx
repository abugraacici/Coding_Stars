import './HomeStyle.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SearchBar from '../../components/search-bar/SearchBar';
import ProductList from '../../components/product/ProductList';

import { hideLoading, showLoading } from '../../redux/loadingSlice';

import { getAllProducts } from '../../services/productServices';
import { getFavorites } from '../../services/userServices';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState({
        isFiltered: false,
        data: [],
    });
    const [favorites, setFavorites] = useState([]);
    const [category, setCategory] = useState({
        name: 'Tüm Kategoriler',
        id: 0,
    });
    const [query, setQuery] = useState('');

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

        if (token) {
            dispacth(showLoading());
            getFavorites(token)
                .then((response) => {
                    if (response.success) {
                        setFavorites(response.data);
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispacth(hideLoading()));
        }
    }, [dispacth, token]);

    useEffect(() => {
        if (category.id === 0 && query.trim() === '') {
            setFilteredProducts({ isFiltered: false, data: [] });
            return;
        }

        const filtered = products.filter((product) => {
            const matchesCategory =
                category.id === 0 || product.category === category._id;

            const matchesQuery =
                query.trim() === '' ||
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase());

            return matchesCategory && matchesQuery;
        });

        setFilteredProducts({ isFiltered: true, data: filtered });
    }, [category, products, query]);

    const onCategoryChanged = (selectedCategory) => {
        setCategory(selectedCategory);
    };

    const onQueryChanged = (filterQuery) => {
        setQuery(filterQuery);
    };

    return (
        <div>
            <SearchBar
                onQueryChanged={onQueryChanged}
                onCategoryChanged={onCategoryChanged}
            />
            <ProductList
                products={
                    filteredProducts.isFiltered
                        ? filteredProducts.data
                        : products
                }
                favorites={favorites}
            />
        </div>
    );
}
