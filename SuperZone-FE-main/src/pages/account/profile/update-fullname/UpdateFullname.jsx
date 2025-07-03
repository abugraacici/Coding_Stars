import './UpdateFullnameStyle.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import Input from '../../../../components/input/Input';

import { updateFullname } from '../../../../services/userServices';
import { showLoading, hideLoading } from '../../../../redux/loadingSlice';
import { emptyFieldRules } from '../../../../data/rules';

export default function UpdateFullname() {
    const [fullname, setFullname] = useState('');

    const localFullname = useSelector((state) => state.navbar.fullname);
    const token = useSelector((state) => state.auth.token);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setFullname(localFullname || '');
    }, [localFullname]);

    const nameRef = useRef();
    const surnameRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValidName = nameRef.current.validate();
        const isValidSurname = surnameRef.current.validate();
        if (isValidName && isValidSurname) {
            dispatch(showLoading());
            updateFullname(token, fullname)
                .then((response) => {
                    if (response.success) {
                        navigate(-1);
                        toast.success('Ad ve soyad başarıyla güncellendi.');
                    }
                })
                .catch(() => {
                    // err
                })
                .finally(() => dispatch(hideLoading()));
        }
    };

    return (
        <div className="update-fullname">
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
            <button className="submit-btn" onClick={handleSubmit}>
                Güncelle
            </button>
        </div>
    );
}
