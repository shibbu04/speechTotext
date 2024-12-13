'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger';
  children: ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseClasses = 'w-16 h-16 rounded-full flex items-center justify-center transition-all';
  const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};