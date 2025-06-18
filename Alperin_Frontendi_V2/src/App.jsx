import './App.css';
import { useCallback, useEffect, useState } from 'react';
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';

import Home from './pages/home/Home';
import Auth from './pages/auth/Auth';
import ForgotPassword from './pages/auth/forgot-password/ForgotPassword';
import ResetPassword from './pages/auth/forgot-password/reset-password/ResetPassword';
import OTP from './pages/auth/otp/OTP';
import AccountDetails from './pages/account/Account';
import Profile from './pages/account/profile/Profile';
import Categories from './pages/categories/Categories';
import Addresses from './pages/account/addresses/Addresses';
import ProductDetail from './pages/product-detail/ProductDetail';
import Cart from './pages/cart/Cart';
import Favorites from './pages/account/favorites/Favorites';
import Payment from './pages/payment/Payment';

import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import Loading from './components/loading/Loading';

import { addToken, setRole } from './redux/authSlice';
import { showLoading, hideLoading } from './redux/loadingSlice';
import { setData } from './redux/navbarSlice';
import { initCart } from './redux/cartSlice';

import { getCart } from './services/cartServices';
import { getMe } from './services/userServices';

const restrictedPaths = [
    '/account',
    '/account/profile',
    '/account/categories',
    '/account/addresses',
    '/account/cart',
    '/account/favorites',
    '/payment',
];

function AppContent() {
    const [showWhiteScreen, setShowWhiteScreen] = useState(true);

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(showLoading());

            getMe(token)
                .then((response) => {
                    if (response.success) {
                        const { fullname, selectedLocation, role } =
                            response.data;
                        dispatch(
                            setData({ location: selectedLocation, fullname })
                        );
                        dispatch(addToken({ token }));
                        dispatch(setRole(role));

                        return getCart(token);
                    }
                })
                .then((response) => {
                    if (response.success) {
                        const mappedData = response.data.map((item) => ({
                            productId: item.product._id,
                            quantity: item.quantity,
                        }));
                        dispatch(initCart(mappedData));
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    dispatch(hideLoading());
                    setShowWhiteScreen(false);
                });

            handlePath(token);
        } else {
            handlePath(null);
            setShowWhiteScreen(false);
        }
    }, [location.pathname]);

    const handlePath = useCallback(
        (token) => {
            const isRestricted = restrictedPaths.some((path) =>
                location.pathname.startsWith(path)
            );

            if (token) {
                if (location.pathname === '/account') {
                    navigate('/account/profile');
                }
            } else if (isRestricted) {
                toast.error(
                    'Bu işlemi gerçekleştirmek için giriş yapmanız gerekmektedir.'
                );
                navigate('/');
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [location.pathname]
    );

    if (showWhiteScreen) {
        return <div className="white-screen" />;
    }

    const handleHeaderVisibility = () => {
        const paths = [
            '/auth',
            '/otp',
            '/forgot-password',
            '/forgot-password-otp',
            '/reset-password',
            '/payment',
        ];
        return !paths.includes(location.pathname);
    };

    return (
        <>
            <Loading />
            {handleHeaderVisibility() && (
                <>
                    <div className="top-banner">
                        📦 30 Gün İade ve Değişim İmkanı 📦
                    </div>
                    <Navbar />
                </>
            )}

            <div className="rooter-wrapper">
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/otp" element={<OTP />} />
                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="/forgot-password-otp" element={<OTP />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route
                        commentMore
                        actions
                        path="/product/:productId"
                        element={<ProductDetail />}
                    />
                    <Route path="/account" element={<AccountDetails />}>
                        <Route path="profile" element={<Profile />} />
                        <Route path="categories" element={<Categories />} />
                        <Route path="addresses" element={<Addresses />} />
                        <Route path="cart" element={<Cart />} />
                        <Route path="favorites" element={<Favorites />} />
                    </Route>
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>

            {location.pathname === '/' && <Footer />}
            <ToastContainer autoClose={2000} />
        </>
    );
}

export default function App() {
    return (
        <div className="app-wrapper">
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </div>
    );
}
