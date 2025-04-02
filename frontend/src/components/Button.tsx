import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyle = 'px-4 py-2 rounded font-semibold transition-colors text-sm';
  const variants = {
    primary: 'bg-[#00deb6] hover:bg-[#00c5a0] text-white',
    secondary: 'bg-[#262637] hover:bg-[#1a1a2b] text-white',
    danger: 'bg-[#e60000] hover:bg-[#cc0000] text-white',
    outline: 'border border-[#00deb6] text-[#00deb6] hover:bg-[#f7f7f7]'
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    />
  );
} 