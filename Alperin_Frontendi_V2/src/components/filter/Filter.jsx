import './FilterStyle.css';
import { useEffect, useState } from 'react';
import { getCategories } from '../../services/categoryServices';

export default function Filter({ onCategoryChanged }) {
    const [selectedCategory, setSelectedCategory] = useState();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const defaultCategory = {
            name: 'Tüm Kategoriler',
            id: 0,
        };
        getCategories()
            .then((response) => {
                if (response.success) {
                    setCategories([defaultCategory, ...response.data]);
                }
            })
            .catch(() => {
                // err
            });
    }, []);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
        const selectedCategory = categories.find(
            (categorie) => categorie.name === event.target.value
        );
        onCategoryChanged(selectedCategory);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCategoryChange(event);
        }
    };

    return (
        <div className="filter-wrapper">
            <select
                className="filter-select"
                value={selectedCategory || 'Tüm Kategoriler'}
                onChange={handleCategoryChange}
                onKeyDown={handleKeyDown}
            >
                {categories.map((category, index) => (
                    <option key={index} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
