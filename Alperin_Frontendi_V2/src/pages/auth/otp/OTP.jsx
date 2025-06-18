import './OTPStyle.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Input from '../../../components/input/Input';

import { showLoading, hideLoading } from '../../../redux/loadingSlice';
import { clearUserId } from '../../../redux/authSlice';

import { verifyOtp } from '../../../services/authServices';
import logo from '../../../assets/app_logo.png';

export default function OTP() {
    const [otp, setOTP] = useState('');
    const [remainingTime, setRemainingTime] = useState(180);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId);
    const location = useLocation();

    useEffect(() => {
        if (!userId) navigate('/', { replace: true });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    toast.error('OTP süresi doldu. Lütfen tekrar deneyin.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleVerify = () => {
        dispatch(showLoading());
        verifyOtp(userId, otp)
            .then((response) => {
                if (response.success) {
                    toast.success('Hesabınız oluşturulmuştur.');
                    if (location.pathname === '/otp') {
                        dispatch(clearUserId());
                        navigate('/auth');
                    } else navigate('/reset-password');
                }
            })
            .finally(() => dispatch(hideLoading()));
    };

    const formatTime = (seconds) => {
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className="wrapper">
            <img src={logo} onClick={() => navigate('/', { replace: true })} />
            <div className="input-wrapper">
                <Input
                    value={otp}
                    type="number"
                    onChange={(value) => {
                        if (value.length < 7) setOTP(value);
                    }}
                    disabled={remainingTime === 0}
                />
                <div className="countdown">{formatTime(remainingTime)}</div>
            </div>
            <button
                className="submit-button"
                disabled={otp.length !== 6 || remainingTime === 0}
                onClick={handleVerify}
            >
                Doğrula
            </button>
        </div>
    );
}
