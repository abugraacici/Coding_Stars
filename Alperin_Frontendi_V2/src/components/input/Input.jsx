import './InputStyle.css';

import { forwardRef, useState, useImperativeHandle } from 'react';

const Input = forwardRef(
    (
        {
            type = 'text',
            placeholder,
            value,
            onChange,
            rules = [],
            disabled = false,
        },
        ref
    ) => {
        const [error, setError] = useState(null);

        const validate = () => {
            const failedRule = rules.find((rule) => !rule.test.test(value));
            const errorMessage = failedRule ? failedRule.message : null;
            setError(errorMessage);
            return errorMessage === null;
        };

        useImperativeHandle(ref, () => ({ validate }));

        return (
            <div>
                <input
                    disabled={disabled}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => {
                        if (error !== null) setError(null);
                        onChange(e.target.value);
                    }}
                    className={error ? 'input-field error' : 'input-field'}
                />
                {error && <p className="error-text">{error}</p>}
            </div>
        );
    }
);

export default Input;
