import './ResetPasswordStyle.css';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import PasswordInput from '../../../../components/input/PasswordInput';

import { hideLoading, showLoading } from '../../../../redux/loadingSlice';
import logo from '../../../../assets/app_logo.png';
import { passwordRules } from '../../../../data/rules';
import { resetPassword } from '../../../../services/authServices';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.auth.userId);

    useEffect(() => {
        if (!userId) navigate('/', { replace: true });
    }, []);

    const handlePasswordReset = () => {
        const isValidPassword = passwordRef.current?.validate();
        const isValidConfirmPassword = confirmPasswordRef.current?.validate();

        if (!isValidPassword && !isValidConfirmPassword) return;

        if (password !== confirmPassword) {
            toast.error('Yeni şifre ve onay şifresi eşleşmiyor');
            return;
        }

        dispatch(showLoading());
        resetPassword(userId, password)
            .then((response) => {
                if (response.success) {
                    toast.success('Şifre sıfırlandı.');
                    navigate('/auth', { replace: true });
                } else {
                    toast.error('Şifre sıfırlama sırasında bir hata oluştu.');
                }
            })
            .finally(() => dispatch(hideLoading()));
    };

    return (
        <div className="wrapper">
            <img src={logo} onClick={() => navigate('/', { replace: true })} />
            <div className="input-wrapper">
                <PasswordInput
                    placeholder="Yeni şifre"
                    ref={passwordRef}
                    value={password}
                    onChange={setPassword}
                    rules={passwordRules}
                />
                <PasswordInput
                    ref={confirmPasswordRef}
                    placeholder="Yeni şifre tekrar"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    rules={passwordRules}
                />
            </div>
            <button className="submit-button" onClick={handlePasswordReset}>
                Güncelle
            </button>
        </div>
    );
}
