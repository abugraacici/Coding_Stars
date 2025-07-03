import './ProductsStyle.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';

import ImageSelector from '../../../components/image-selector/ImageSelector';
import { showLoading, hideLoading } from '../../../redux/loadingSlice';

import { getCategories } from '../../../services/categoryServices.js';
import { uploadImageToImgbb } from '../../../services/imageService';
import {
    createProduct,
    deleteProduct,
    getProductsBySeller,
    updateProduct,
} from '../../../services/productServices';
import { getAddresses } from '../../../services/addressServices';

const initialState = {
    name: '',
    description: '',
    image: '',
    price: '',
    category: '',
    stock: '',
    sellerCity: '',
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState(initialState);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (token) {
            dispatch(showLoading());
            getCategories()
                .then((response) => {
                    if (response.success) {
                        setCategories([
                            { _id: -1, name: 'Bir kategori seçiniz' },
                            ...response.data,
                        ]);
                    }
                })
                .finally(() => dispatch(hideLoading()));
            getProductsBySeller(token)
                .then((response) => {
                    if (response.success) {
                        setProducts(response.data);
                    }
                })
                .finally(() => dispatch(hideLoading()));
            getAddresses(token).then((response) => {
                if (response.success) {
                    setAddresses([
                        { _id: -1, label: 'Bir adres seçiniz' },
                        ...response.data,
                    ]);
                }
            });
        }
    }, [dispatch, token]);

    const openAlert = (message, callback) => {
        return new Promise((resolve) => {
            const confirmed = window.confirm(message);
            if (confirmed) {
                callback();
                resolve(true);
            } else {
                resolve(false);
            }
        });
    };

    const handleDeleteProduct = (id) => {
        openAlert('Ürünü silmek istediğinize emin misiniz?', () => {
            dispatch(showLoading());
            deleteProduct(id, token)
                .then((response) => {
                    if (response.success) {
                        toast.success('Ürün başarıyla silindi.');
                        setProducts((prev) => prev.filter((p) => p._id !== id));
                        setSelectedProduct(null);
                        setNewProduct(initialState);
                        setSelectedImageFile('');
                        setSelectedCategory('');
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => {
                    dispatch(hideLoading());
                });
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'price') {
            if (!/^\d*\.?\d*$/.test(value)) return;
            setNewProduct((prev) => ({ ...prev, [name]: value }));
        } else if (name === 'stock') {
            if (!/^\d*$/.test(value)) return;
            setNewProduct((prev) => ({ ...prev, [name]: value }));
        } else {
            setNewProduct((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectedChange = (e) => {
        const { name, value } = e.target;
        setSelectedProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = () => {
        const parsedPrice = parseFloat(newProduct.price).toFixed(2);
        const parsedStock = parseInt(newProduct.stock);

        if (
            !newProduct.name ||
            !newProduct.category ||
            newProduct.category === '-1' ||
            !newProduct.description ||
            !newProduct.price ||
            !newProduct.stock ||
            !newProduct.sellerCity
        ) {
            toast.error('Lütfen tüm alanları doldurun.');
            return;
        }

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            toast.error('Fiyat geçerli değil.');
            return;
        }

        if (isNaN(parsedStock) || parsedStock <= 0) {
            toast.error('Stok geçerli değil.');
            return;
        }

        const productToAdd = {
            ...newProduct,
            price: parsedPrice,
            stock: parsedStock,
        };

        dispatch(showLoading());
        uploadImageToImgbb(selectedImageFile)
            .then((imageUrl) => {
                const product = { ...productToAdd, image: imageUrl };
                return createProduct(product, token);
            })
            .then((response) => {
                if (response.success) {
                    toast.success('Ürün başarıyla eklendi.');
                    setProducts((prev) => [...prev, response.data]);
                    setSelectedCategory('');
                    setNewProduct(initialState);
                    setSelectedProduct(initialState);
                    setSelectedImageFile('');
                    setSelectedAddress(null);
                }
            })
            .catch(() => {
                // err
            })
            .finally(() => {
                dispatch(hideLoading());
            });
    };

    const handleUpdateProduct = () => {
        if (
            !selectedProduct.name ||
            !selectedProduct.category ||
            selectedCategory === '-1' ||
            !selectedProduct.description ||
            !selectedProduct.price ||
            !selectedProduct.stock ||
            !selectedAddress ||
            selectedAddress === '-1'
        ) {
            toast.error('Lütfen tüm alanları doldurun.');
            return;
        }

        const parsedPrice = parseFloat(selectedProduct.price).toFixed(2);
        const parsedStock = parseInt(selectedProduct.stock);

        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            toast.error('Fiyat geçerli değil.');
            return;
        }

        if (isNaN(parsedStock) || parsedStock < 0) {
            toast.error('Stok geçerli değil.');
            return;
        }

        const productToUpdate = {
            ...selectedProduct,
            price: parsedPrice,
            stock: parsedStock,
        };

        dispatch(showLoading());
        const uploadPromise =
            selectedImageFile && selectedImageFile !== selectedProduct.image
                ? uploadImageToImgbb(selectedImageFile)
                : Promise.resolve(selectedProduct.image);

        uploadPromise
            .then((imageUrl) => {
                productToUpdate.image = imageUrl;
                return updateProduct(
                    selectedProduct._id,
                    productToUpdate,
                    token
                );
            })
            .then((response) => {
                if (response.success) {
                    toast.success('Ürün başarıyla güncellendi.');
                    setProducts((prev) =>
                        prev.map((p) =>
                            p._id === selectedProduct._id ? response.data : p
                        )
                    );
                    setSelectedProduct(null);
                    setNewProduct(initialState);
                    setSelectedImageFile('');
                    setSelectedCategory('');
                    setSelectedAddress(null);
                }
            })
            .catch(() => {
                // err
            })
            .finally(() => {
                dispatch(hideLoading());
            });
    };

    const handleCategoryChange = (event) => {
        const id = event.target.value;
        setSelectedCategory(id);

        selectedProduct
            ? setSelectedProduct((prev) => ({
                  ...prev,
                  category: id,
              }))
            : setNewProduct((prev) => ({
                  ...prev,
                  category: id,
              }));
    };

    const handleAddressChange = (event) => {
        const id = event.target.value;
        setSelectedAddress(id);

        const sellerCity = addresses.find((addr) => addr._id === id).city;

        selectedProduct
            ? setSelectedProduct((prev) => ({
                  ...prev,
                  category: id,
                  sellerCity,
              }))
            : setNewProduct((prev) => ({
                  ...prev,
                  category: id,
                  sellerCity,
              }));
    };

    const handleCategoryKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCategoryChange(event);
        }
    };

    const handleAddressKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleAddressChange(event);
        }
    };

    return (
        <div className="page">
            <h2>Ürünlerim</h2>
            <div className="inner-cotainer">
                <div className="section">
                    {products.length !== 0 ? (
                        products.map((pro) => (
                            <li
                                key={pro._id}
                                className="products-item"
                                onClick={() => {
                                    setSelectedProduct(pro);
                                    setSelectedImageFile(pro.image);
                                    setSelectedCategory(pro.category);
                                    setSelectedAddress(pro.sellerCity);
                                }}
                            >
                                <img src={pro.image} className="image" />
                                <div className="prodct-detail">
                                    <div>
                                        <div className="product-name">
                                            {pro.name}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="product-category">
                                            {
                                                categories.find(
                                                    (category) =>
                                                        category._id ===
                                                        pro.category
                                                )?.name
                                            }
                                        </div>
                                    </div>
                                    <div className="product-description">
                                        {pro.description}
                                    </div>
                                    <div>
                                        <div className="product-price">
                                            {pro.price} TL
                                        </div>
                                    </div>
                                    <div>
                                        <div className="product-stock">
                                            {pro.stock} adet stok mevcut.
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteProduct(pro._id)}
                                    aria-label="Adres sil"
                                >
                                    <MdDelete size={20} />
                                </button>
                            </li>
                        ))
                    ) : (
                        <div className="empty-list">
                            Ürününüz bulunmamaktadır.
                        </div>
                    )}
                </div>
                <div className="section">
                    <form
                        className="address-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                            selectedProduct
                                ? handleUpdateProduct()
                                : handleAddProduct();
                        }}
                        onReset={() => {
                            setSelectedProduct(null);
                            setNewProduct(initialState);
                            setSelectedImageFile('');
                            setSelectedCategory('');
                            setSelectedAddress('');
                        }}
                    >
                        <ImageSelector
                            onImageSelect={setSelectedImageFile}
                            imageUrl={selectedImageFile}
                        />
                        <div className="form-group product-name">
                            <label htmlFor="name">Ürün Adı</label>
                            <input
                                style={{ width: '93%' }}
                                id="name"
                                name="name"
                                value={
                                    selectedProduct
                                        ? selectedProduct.name
                                        : newProduct.name
                                }
                                onChange={
                                    selectedProduct
                                        ? handleSelectedChange
                                        : handleChange
                                }
                            />
                        </div>
                        <div className="form-group product-name">
                            <label htmlFor="name">Ürün Fiyatı</label>
                            <input
                                style={{ width: '93%' }}
                                id="price"
                                name="price"
                                value={
                                    selectedProduct
                                        ? selectedProduct.price
                                        : newProduct.price
                                }
                                onChange={
                                    selectedProduct
                                        ? handleSelectedChange
                                        : handleChange
                                }
                                step="0.01"
                                type="number"
                            />
                        </div>
                        <div className="form-group product-name">
                            <label htmlFor="name">Stok Miktarı</label>
                            <input
                                style={{ width: '93%' }}
                                id="stock"
                                name="stock"
                                value={
                                    selectedProduct
                                        ? selectedProduct.stock
                                        : newProduct.stock
                                }
                                onChange={
                                    selectedProduct
                                        ? handleSelectedChange
                                        : handleChange
                                }
                                type="number"
                            />
                        </div>
                        <div className="form-group product-name">
                            <div className="filter-wrapper">
                                <label htmlFor="name">Adres</label>
                                <select
                                    className="filter-select"
                                    value={
                                        addresses.find(
                                            (addr) =>
                                                addr.city === selectedAddress
                                        )?._id ||
                                        selectedAddress ||
                                        ''
                                    }
                                    onChange={handleAddressChange}
                                    onKeyDown={handleAddressKeyDown}
                                >
                                    {addresses.map((address, index) => (
                                        <option key={index} value={address._id}>
                                            {address.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group product-name">
                            <div className="filter-wrapper">
                                <label htmlFor="name">Kategori</label>
                                <select
                                    className="filter-select"
                                    value={selectedCategory || ''}
                                    onChange={handleCategoryChange}
                                    onKeyDown={handleCategoryKeyDown}
                                >
                                    {categories.map((category, index) => (
                                        <option
                                            key={index}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Açıklama</label>
                            <textarea
                                id="description"
                                name="description"
                                value={
                                    selectedProduct
                                        ? selectedProduct.description
                                        : newProduct.description
                                }
                                onChange={
                                    selectedProduct
                                        ? handleSelectedChange
                                        : handleChange
                                }
                                rows={3}
                            />
                        </div>
                        <div className="button-wrapper">
                            <button type="submit" className="add-button">
                                {selectedProduct ? 'Güncelle' : 'Ürün Ekle'}
                            </button>
                            <button type="reset" className="add-button">
                                Temizle
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
