import './ForgotPasswordStyle.css';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Input from '../../../components/input/Input';

import { addUserId } from '../../../redux/authSlice';
import { showLoading, hideLoading } from '../../../redux/loadingSlice';

import logo from '../../../assets/app_logo.png';
import { emailRules } from '../../../data/rules';
import { forgotPassword } from '../../../services/authServices';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const emailRef = useRef();

    const handleCheck = () => {
        const isValidEmail = emailRef.current?.validate();

        if (isValidEmail) {
            dispatch(showLoading());
            forgotPassword(email)
                .then((response) => {
                    if (response.success) {
                        toast.success(
                            'Mail adresine doğrulama kodu gönderildi.'
                        );
                        dispatch(addUserId(response.data.userId));
                        navigate('/forgot-password-otp');
                    }
                })
                .finally(() => dispatch(hideLoading()));
        }
    };

    return (
        <div className="wrapper">
            <img src={logo} onClick={() => navigate('/', { replace: true })} />
            <div className="input-wrapper">
                <Input
                    value={email}
                    type={'email'}
                    onChange={setEmail}
                    rules={emailRules}
                    ref={emailRef}
                    placeholder="E-mail adresi"
                />
            </div>
            <button className="submit-button" onClick={handleCheck}>
                Doğrulama Kodu Gönder
            </button>
        </div>
    );
}
