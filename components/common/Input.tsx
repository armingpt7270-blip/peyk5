
import React, { useState } from 'react';
import { Icons } from '../../constants';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, type = 'text', className = '', ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';
    const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="w-full relative">
            {label && <label htmlFor={id} className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 mr-1">{label}</label>}
            <div className="relative">
                <input
                    id={id}
                    type={inputType}
                    className={`w-full px-4 py-3 bg-white/70 dark:bg-black/40 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 ${className}`}
                    {...props}
                />
                {isPasswordType && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? <Icons.EyeSlash className="h-5 w-5" /> : <Icons.Eye className="h-5 w-5" />}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Input;
