import './UpdatePasswordStyle.css';
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import PasswordInput from '../../../../components/input/PasswordInput';

import { showLoading, hideLoading } from '../../../../redux/loadingSlice';
import { passwordRules } from '../../../../data/rules';
import { updatePassword } from '../../../../services/userServices';

export default function UpdatePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);

    const passwordRef = useRef();
    const newPasswordRef = useRef();
    const confirmPasswordRef = useRef();

    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        const isValidCurrentPassword = passwordRef.current.validate();
        const isValidNewPassword = newPasswordRef.current.validate();
        const isValidConfirmPassword = confirmPasswordRef.current.validate();

        if (currentPassword === newPassword) {
            toast.error('Yeni şifre mevcut şifre ile aynı olamaz');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Yeni şifre ve onay şifresi eşleşmiyor');
            return;
        }

        if (
            isValidCurrentPassword &&
            isValidNewPassword &&
            isValidConfirmPassword
        ) {
            dispatch(showLoading());
            updatePassword(token, currentPassword, newPassword)
                .then((response) => {
                    if (response.success) {
                        navigate('/account/profile');
                        toast.success('Şifre başarıyla güncellendi');
                    } else {
                        toast.error(
                            response.message ||
                                'Şifre güncellenirken hata oluştu'
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
        <div className="update-password">
            <form onSubmit={handlePasswordSubmit}>
                <div className="password-wrapper">
                    <PasswordInput
                        ref={passwordRef}
                        rules={passwordRules}
                        type="password"
                        placeholder="Mevcut Şifre"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        isHaveErrorPadding={true}
                    />
                </div>
                <div className="password-wrapper">
                    <PasswordInput
                        ref={newPasswordRef}
                        rules={passwordRules}
                        type="password"
                        placeholder="Yeni Şifre"
                        value={newPassword}
                        onChange={setNewPassword}
                        isHaveErrorPadding={true}
                    />
                </div>
                <div className="password-wrapper">
                    <PasswordInput
                        ref={confirmPasswordRef}
                        rules={passwordRules}
                        type="password"
                        placeholder="Şifreyi Onayla"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        isHaveErrorPadding={true}
                    />
                </div>
                <button type="submit" className="submit-btn">
                    Şifre Güncelle
                </button>
            </form>
        </div>
    );
}
