import './UpdateEmailStyle.css';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Input from '../../../../components/input/Input';
import PasswordInput from '../../../../components/input/PasswordInput';

import { showLoading, hideLoading } from '../../../../redux/loadingSlice';
import {
    getAccountDetails,
    updateEmail,
} from '../../../../services/userServices';
import { emailRules, passwordRules } from '../../../../data/rules';

export default function UpdateEmail() {
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const emailRef = useRef();
    const passwordRef = useRef();

    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        if (token) {
            dispatch(showLoading());
            getAccountDetails(token)
                .then((response) => {
                    if (response.success) {
                        setEmail(response.data.email);
                    }
                })
                .catch(() => {
                    //err
                })
                .finally(() => dispatch(hideLoading()));
        }
    }, [token, navigate, dispatch]);

    const handleEmailSubmit = (e) => {
        e.preventDefault();

        const isValidEmail = emailRef.current.validate();
        const isValidPassword = passwordRef.current.validate();

        if (isValidEmail && isValidPassword) {
            dispatch(showLoading());
            updateEmail(token, email, currentPassword)
                .then((response) => {
                    if (response.success) {
                        navigate('/account/profile');
                        toast.success('E-posta başarıyla güncellendi');
                    } else {
                        toast.error(
                            response.message ||
                                'E-posta güncellenirken hata oluştu'
                        );
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispatch(hideLoading()));
        }
    };

    return (
        <div className="update-email">
            <form onSubmit={handleEmailSubmit}>
                <Input
                    ref={emailRef}
                    rules={emailRules}
                    type="email"
                    placeholder="Yeni E-posta"
                    value={email}
                    onChange={setEmail}
                />
                <div className="password-wrapper">
                    <PasswordInput
                        ref={passwordRef}
                        rules={passwordRules}
                        type="password"
                        placeholder="Şifre"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        isHaveErrorPadding={true}
                    />
                </div>
                <button type="submit" className="submit-btn">
                    E-postayı Güncelle
                </button>
            </form>
        </div>
    );
}
