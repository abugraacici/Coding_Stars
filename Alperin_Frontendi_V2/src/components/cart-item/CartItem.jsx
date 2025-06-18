import './CartItemStyle.css';
import { MdDelete } from 'react-icons/md';

export default function CartItem({
    item,
    quantity,
    onIncrement,
    onDecrement,
    onDelete,
}) {
    return (
        <div className="provider">
            <img src={item.image} className="item-image" />
            <div className="info-provider">
                <p className="item-name">{item.name}</p>
                <p className="item-description">{item.description}</p>
                <p className="item-price">
                    {item.price.toLocaleString('tr-TR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}{' '}
                    TL
                </p>
                <div className="quantity-provider">
                    <button
                        className="quantity-button"
                        onClick={() => onDecrement(item)}
                    >
                        -
                    </button>
                    <p className="quantity-count">{quantity}</p>
                    <button
                        className="quantity-button"
                        onClick={() => onIncrement(item)}
                    >
                        +
                    </button>
                    <MdDelete
                        className="quantity-delete"
                        size={24}
                        color="red"
                        onClick={() => onDelete(item)}
                    />
                </div>
            </div>
        </div>
    );
}
