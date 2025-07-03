import './RegisterStyle.css';
import { useState, useRef } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Input from '../../../components/input/Input';
import PasswordInput from '../../../components/input/PasswordInput';

import { showLoading, hideLoading } from '../../../redux/loadingSlice';
import { addUserId } from '../../../redux/authSlice';

import { register } from '../../../services/authServices';
import { emailRules, emptyFieldRules, phoneRules } from '../../../data/rules';

export default function Register() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        const isValidEmail = emailRef.current?.validate();
        const isValidPhoneNumber = phoneNumberRef.current?.validate();
        const isValidPassword = passwordRef.current?.validate();
        const isValidConfirmPassword = confirmPasswordRef.current?.validate();
        const isValidName = nameRef.current?.validate();
        const isValidSurname = surnameRef.current?.validate();

        if (password !== confirmPassword) {
            toast.error('Şifreler eşleşmiyor!');
            return;
        }

        if (
            isValidEmail &&
            isValidPhoneNumber &&
            isValidPassword &&
            isValidConfirmPassword &&
            isValidName &&
            isValidSurname
        ) {
            const user = {
                fullname: fullname.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber.trim(),
                password: password.trim(),
            };

            dispatch(showLoading());
            register(user)
                .then((result) => {
                    if (!result.success) {
                        toast.error(result.message || 'Kayıt başarısız');
                        return;
                    }
                    toast.success('Mail adresine doğrulama kodu gönderildi.');
                    dispatch(addUserId(result.data.userId));
                    navigate('/otp');
                })
                .catch((error) => {
                    toast.error(error.message || 'Kayıt sırasında hata oluştu');
                })
                .finally(() => dispatch(hideLoading()));
        }
    };

    const nameRef = useRef();
    const surnameRef = useRef();
    const emailRef = useRef();
    const phoneNumberRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    return (
        <form onSubmit={handleRegister} className="form">
            <div className="name-inputs">
                <Input
                    ref={nameRef}
                    rules={emptyFieldRules}
                    placeholder="Ad"
                    value={fullname.split(' ')[0] || ''}
                    onChange={(value) => {
                        const parts = fullname.split(' ');
                        setFullname(value + (parts[1] ? ' ' + parts[1] : ''));
                    }}
                />
                <Input
                    ref={surnameRef}
                    rules={emptyFieldRules}
                    placeholder="Soyad"
                    value={fullname.split(' ')[1] || ''}
                    onChange={(value) => {
                        const parts = fullname.split(' ');
                        setFullname((parts[0] || '') + ' ' + value);
                    }}
                />
            </div>
            <Input
                placeholder="E-posta adresi"
                value={email}
                onChange={setEmail}
                ref={emailRef}
                rules={emailRules}
            />
            <Input
                placeholder="Telefon numarası"
                value={phoneNumber}
                onChange={(val) => {
                    const onlyDigits = val.replace(/\D/g, '');
                    if (onlyDigits.length <= 10) setPhoneNumber(onlyDigits);
                }}
                ref={phoneNumberRef}
                rules={phoneRules}
            />
            <PasswordInput
                placeholder="Şifre"
                value={password}
                onChange={setPassword}
                ref={passwordRef}
            />
            <PasswordInput
                placeholder="Şifre"
                value={confirmPassword}
                onChange={setConfirmPassword}
                ref={confirmPasswordRef}
            />
            <button type="submit" className="submit-btn">
                Kayıt ol
            </button>
        </form>
    );
}
