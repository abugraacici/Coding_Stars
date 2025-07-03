import './ProductStyle.css';
import ProductCard from './ProductCard';

export default function ProductList({ products, favorites = [] }) {
    return (
        <div className="product-list">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    favorite={favorites.some((fav) => fav._id === product._id)}
                />
            ))}
            {products.length === 0 && (
                <div className="empty">Ürün Bulunamadı</div>
            )}
        </div>
    );
}
