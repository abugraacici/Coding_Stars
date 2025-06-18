import './CategoriesStyle.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdDelete } from 'react-icons/md';

import { showLoading, hideLoading } from '../../redux/loadingSlice';

import Input from '../../components/input/Input';

import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from '../../services/categoryServices';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { role } = useSelector((state) => state.auth);

    useEffect(() => {
        if (role === null) return;
        if (role !== 'admin') {
            navigate('/', { replace: true });
            return;
        }

        dispatch(showLoading());
        getCategories()
            .then((response) => {
                if (response.success) {
                    setCategories(response.data);
                }
            })
            .finally(() => dispatch(hideLoading()));
    }, [role]);

    const handleAction = () => {
        dispatch(showLoading());
        if (category?._id) {
            updateCategory({ id: category._id, name: category.name })
                .then((reponse) => {
                    if (reponse.success) {
                        setCategories((prev) =>
                            prev.map((p) =>
                                p._id === category._id ? category : p
                            )
                        );
                    }
                    setCategory(null);
                })
                .finally(() => dispatch(hideLoading()));
        } else {
            createCategory(category.name)
                .then((reponse) => {
                    if (reponse.success) {
                        const newCategory = {
                            _id: reponse.data._id,
                            name: reponse.data.name,
                        };
                        setCategories((prev) => [...prev, newCategory]);
                        toast.success('Yeni kategori eklendi.');
                    } else {
                        toast.error(reponse.message);
                    }
                    setCategory(null);
                })
                .finally(() => dispatch(hideLoading()));
        }
    };

    const handleDelete = (id) => {
        const confirmed = confirm(
            'Kategoriyi silmek istediğinize emin misiniz?'
        );
        if (confirmed) {
            dispatch(showLoading());
            deleteCategory(id)
                .then((response) => {
                    if (response.success) {
                        toast.success('Kategori silindi.');
                        setCategories((prev) =>
                            prev.filter((category) => category._id !== id)
                        );
                    } else {
                        toast.error(response.message);
                    }
                })
                .finally(() => {
                    dispatch(hideLoading());
                });
        }
    };

    return (
        <div className="page">
            <h2>Kategoriler</h2>
            <div className="category-wrapper">
                <div className="category-left-side">
                    {categories.map((category) => (
                        <p
                            onClick={() => setCategory(category)}
                            key={category._id}
                        >
                            {category.name}

                            <MdDelete
                                size={18}
                                color="red"
                                onClick={() => handleDelete(category._id)}
                            />
                        </p>
                    ))}
                </div>
                <div className="category-right-side">
                    <Input
                        value={category ? category.name : ''}
                        onChange={(val) =>
                            setCategory((prev) => ({
                                _id: prev?._id,
                                name: val,
                            }))
                        }
                    />
                    <button onClick={handleAction}>
                        {category?._id ? 'Güncelle' : 'Ekle'}
                    </button>
                    <button onClick={() => setCategory(null)}>Temizle</button>
                </div>
            </div>
        </div>
    );
}
