import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'secondary';
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
    const baseStyles = "px-4 py-2 rounded-lg font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
    const variants = {
        primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/50",
        danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/50",
        secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
