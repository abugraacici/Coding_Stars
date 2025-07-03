import './UpdatePhoneNumberStyle.css';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Input from '../../../../components/input/Input';
import PasswordInput from '../../../../components/input/PasswordInput';

import { showLoading, hideLoading } from '../../../../redux/loadingSlice';
import {
    getAccountDetails,
    updatePhoneNumber,
} from '../../../../services/userServices';
import { passwordRules, phoneRules } from '../../../../data/rules';

export default function UpdatePhoneNumber() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const phoneNumberRef = useRef();
    const passwordRef = useRef();

    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        if (token) {
            dispatch(showLoading());
            getAccountDetails(token)
                .then((response) => {
                    if (response.success) {
                        setPhoneNumber(response.data.phoneNumber);
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

        const isValidPhoneNumber = phoneNumberRef.current.validate();
        const isValidPassword = passwordRef.current.validate();

        if (isValidPhoneNumber && isValidPassword) {
            dispatch(showLoading());
            updatePhoneNumber(token, phoneNumber, currentPassword)
                .then((response) => {
                    if (response.success) {
                        navigate('/account/profile');
                        toast.success('Telefon numarası başarıyla güncellendi');
                    } else {
                        toast.error(
                            response.message ||
                                'Telefon numarası güncellenirken hata oluştu'
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
        <div className="update-phone-number">
            <form onSubmit={handleEmailSubmit}>
                <Input
                    ref={phoneNumberRef}
                    rules={phoneRules}
                    type="number"
                    placeholder="Yeni telefon numarası"
                    value={phoneNumber}
                    onChange={(val) => {
                        const onlyDigits = val.replace(/\D/g, '');
                        if (onlyDigits.length <= 10) setPhoneNumber(onlyDigits);
                    }}
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
                    Telefon Numarasını Güncelle
                </button>
            </form>
        </div>
    );
}
