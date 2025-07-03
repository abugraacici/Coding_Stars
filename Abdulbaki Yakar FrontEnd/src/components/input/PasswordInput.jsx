import './InputStyle.css';
import { useState, forwardRef, useImperativeHandle } from 'react';

import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { passwordRules } from '../../data/rules';

const PasswordInput = forwardRef(
    ({ value, onChange, placeholder, isHaveErrorPadding = false }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const [error, setError] = useState(null);

        const validate = () => {
            const failedRule = passwordRules.find(
                (rule) => !rule.test.test(value)
            );
            const errorMessage = failedRule ? failedRule.message : null;
            setError(errorMessage);
            return errorMessage === null;
        };

        useImperativeHandle(ref, () => ({ validate }));

        return (
            <div className="password-input">
                <div className="inner-container">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => {
                            if (error !== null) setError(null);
                            onChange(e.target.value);
                        }}
                        className={error ? 'input-field error' : 'input-field'}
                    />
                    <span
                        className="eye-icon"
                        onClick={() => setShowPassword(!showPassword)}
                        title={
                            showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'
                        }
                        style={{
                            ...(isHaveErrorPadding ? { marginRight: 8 } : {}),
                        }}
                    >
                        {showPassword ? (
                            <IoMdEye size={24} />
                        ) : (
                            <IoMdEyeOff size={24} />
                        )}
                    </span>
                </div>
                {error && (
                    <p
                        className="error-text"
                        style={{
                            ...(isHaveErrorPadding ? { paddingLeft: 32 } : {}),
                        }}
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

export default PasswordInput;
