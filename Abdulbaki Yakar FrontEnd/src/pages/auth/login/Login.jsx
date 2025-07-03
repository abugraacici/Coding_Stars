import './LoginStyle.css';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Input from '../../../components/input/Input';
import PasswordInput from '../../../components/input/PasswordInput';

import { addToken } from '../../../redux/authSlice';
import { showLoading, hideLoading } from '../../../redux/loadingSlice';

import { emailRules } from '../../../data/rules';
import { login } from '../../../services/authServices';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();
        const isValidEmail = emailRef.current?.validate();
        const isValidPassword = passwordRef.current?.validate();

        if (isValidEmail && isValidPassword) {
            const credentials = {
                email: email.trim(),
                password: password.trim(),
            };

            dispatch(showLoading());
            login(credentials)
                .then((result) => {
                    if (result.success === false) {
                        toast.error(result.message || 'Giriş başarısız');
                        return;
                    }
                    localStorage.setItem('token', result.data.token);
                    dispatch(addToken(result.data));
                    navigate('/');
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispatch(hideLoading()));
        }
    };

    return (
        <form onSubmit={handleLogin} className="form">
            <Input
                placeholder="E-posta adresi"
                value={email}
                onChange={setEmail}
                ref={emailRef}
                rules={emailRules}
            />
            <PasswordInput
                placeholder="Şifre"
                value={password}
                onChange={setPassword}
                ref={passwordRef}
            />
            <div
                onClick={() => navigate('/forgot-password')}
                className="forgot-password"
            >
                Şifremi unuttum
            </div>
            <button type="submit" className="submit-btn">
                Giriş yap
            </button>
        </form>
    );
}
