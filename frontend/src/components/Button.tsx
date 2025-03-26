interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyle = 'px-4 py-2 rounded font-semibold transition-colors text-sm';
  const variants = {
    primary: 'bg-[#70b857] hover:bg-[#639e4c] text-white',
    secondary: 'bg-[#8b0000] hover:bg-[#7a0000] text-white',
    danger: 'bg-[#8b0000] hover:bg-[#7a0000] text-white',
    outline: 'border border-[#262637] text-[#262637] hover:bg-[#f7f7f7]'
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    />
  );
} 