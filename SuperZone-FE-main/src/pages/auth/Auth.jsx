import './AuthStyle.css';
import { useState } from 'react';

import logo from '../../assets/app_logo.png';
import { NavLink } from 'react-router-dom';

import Login from './login/Login';
import Register from './register/Register';

export default function Auth() {
    const [activeTab, setActiveTab] = useState('login');

    return (
        <div className="container">
            <NavLink to={'/'}>
                <img src={logo} alt="Logo" className="logo" />
            </NavLink>
            <div className="form-box">
                <div className="tabs">
                    <button
                        className={activeTab === 'login' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('login')}
                    >
                        Giriş yap
                    </button>
                    <button
                        className={
                            activeTab === 'register' ? 'tab active' : 'tab'
                        }
                        onClick={() => setActiveTab('register')}
                    >
                        Üye ol
                    </button>
                </div>
                {activeTab === 'login' && <Login />}
                {activeTab === 'register' && <Register />}
            </div>
        </div>
    );
}
