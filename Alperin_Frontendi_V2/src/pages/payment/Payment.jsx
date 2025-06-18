import './PaymentStyle.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Input from '../../components/input/Input';

import { getAddresses, selectAddress } from '../../services/addressServices';
import { createOrder } from '../../services/orderServices';
import { getCart } from '../../services/cartServices';

import { showLoading, hideLoading } from '../../redux/loadingSlice';
import { setSelectedLocation } from '../../redux/navbarSlice';
import { clearCart } from '../../redux/cartSlice';

import logo from '../../assets/app_logo.png';

export default function Payment() {
    const [price, setPrice] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpireDate, setCardExpireDate] = useState('');
    const [cvv, setCVV] = useState('');
    const [cardOwnerName, setCardOwnerName] = useState('');
    const [items, setItems] = useState([]);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const cartItems = useSelector((state) => state.cart.items);

    useEffect(() => {
        if (!token) return;
        if (token && cartItems?.length === 0) {
            navigate('/', { replace: true });
            return;
        }

        dispatch(showLoading());
        getAddresses(token)
            .then((response) => {
                if (response.success) {
                    setAddresses(response.data);
                    setSelectedAddress(
                        response.data.find((add) => add.isSelected)
                    );
                }
            })
            .finally(() => dispatch(hideLoading()));

        getCart(token).then((response) => {
            if (response.success) {
                let sum = 0;
                response.data.forEach((item) => {
                    const price = item.product.price * item.quantity;
                    sum += price;
                });

                sum = sum.toLocaleString('tr-TR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                });

                setPrice(sum);
                setItems(response.data);
            }
        });
    }, [token, cartItems]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelectAddress = (address) => {
        dispatch(showLoading());
        selectAddress(address._id, token)
            .then((response) => {
                if (response.success) {
                    setSelectedAddress(address);
                    setShowDropdown(false);
                    dispatch(setSelectedLocation(address));
                }
            })
            .finally(() => dispatch(hideLoading()));
    };

    const handleCardChange = (input) => {
        const digitsOnly = input.replace(/\D/g, '');

        const limitedDigits = digitsOnly.slice(0, 16);

        const formatted =
            limitedDigits
                .match(/.{1,4}/g)
                ?.join(' ')
                .trim() || '';

        setCardNumber(formatted);
    };

    const handleCardExpireDateChange = (input) => {
        const digitsOnly = input.replace(/\D/g, '').slice(0, 4);

        let formatted = digitsOnly;
        if (digitsOnly.length >= 3) {
            formatted = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
        }

        setCardExpireDate(formatted);
    };

    const handleCVVChange = (input) => {
        const digitsOnly = input.replace(/\D/g, '');
        const limitedDigits = digitsOnly.slice(0, 3);
        setCVV(limitedDigits);
    };

    const isDisable = () => {
        const isAddressSelected = selectAddress !== null;
        const isCardNumberCompleted = cardNumber.length === 19;
        const isCVVCompleted = cvv.length === 3;
        const isExpiredDateCompleted = cardExpireDate.length === 5;
        const isCardOwnerNameCompleted = cardOwnerName.length !== 0;

        return (
            !isAddressSelected ||
            !isCardNumberCompleted ||
            !isCVVCompleted ||
            !isExpiredDateCompleted ||
            !isCardOwnerNameCompleted
        );
    };

    const handleSubmit = () => {
        const last4 = cardNumber.replace(/\s/g, '').slice(-4);

        const products = items.map((item) => ({
            productId: item.product._id,
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            quantity: item.quantity,
            sellerCity: item.product.sellerCity,
        }));

        const order = {
            address: {
                city: selectedAddress.city,
                district: selectedAddress.district,
                description: selectedAddress.description,
            },
            cardInfo: {
                cardHolder: cardOwnerName,
                last4,
            },
            totalPrice: parseFloat(price),
            items: products,
        };

        dispatch(showLoading());
        createOrder(token, order)
            .then((response) => {
                if (response.success) {
                    toast.success('Siparişiniz oluşturulmuştur.');
                    dispatch(clearCart());
                    navigate('/', { replace: true });
                }
            })
            .finally(() => dispatch(hideLoading()));
    };

    return (
        <div className="payment-provider" ref={dropdownRef}>
            <div className="payment-left-side">
                <Link to={'/'}>
                    <img className="navbar-icon" src={logo} alt="SuperZone" />
                </Link>
                <h1>Teslimat Adresi</h1>
                <div
                    className="payment-selected-address"
                    onClick={() => setShowDropdown((prev) => !prev)}
                >
                    {selectedAddress ? (
                        <>
                            <p className="payment-selected-address-label">
                                {selectedAddress.label}
                            </p>
                            <p className="payment-selected-address-info">
                                {selectedAddress.district} /{' '}
                                {selectedAddress.city}
                            </p>
                            <p className="payment-selected-address-description">
                                {selectedAddress.description}
                            </p>
                        </>
                    ) : (
                        'Adres Seçiniz'
                    )}
                </div>
                {showDropdown && (
                    <div className="address-dropdown">
                        {addresses.map((addr) => (
                            <div
                                key={addr._id}
                                className="address-option"
                                onClick={() => handleSelectAddress(addr)}
                            >
                                {addr.label} - {addr.district} / {addr.city}
                            </div>
                        ))}
                    </div>
                )}
                <h1>Kart Bilgileri</h1>
                <Input
                    placeholder="Kart numarası"
                    value={cardNumber}
                    onChange={handleCardChange}
                />
                <div className="cvv-date">
                    <Input
                        placeholder="Son kullanma tarihi"
                        value={cardExpireDate}
                        onChange={handleCardExpireDateChange}
                    />
                    <Input
                        placeholder="CVV"
                        value={cvv}
                        onChange={handleCVVChange}
                    />
                </div>
                <Input
                    placeholder="Kart sahibi adı"
                    value={cardOwnerName}
                    onChange={setCardOwnerName}
                />
            </div>
            <div className="payment-right-side">
                <h1>Toplam tutar</h1>
                <p>{price} TL</p>
                <p className="description">
                    Tahmini teslimat süresi 4 iş günü.
                </p>
                <button onClick={handleSubmit} disabled={isDisable()}>
                    Siparişi Tamamla
                </button>
            </div>
        </div>
    );
}
