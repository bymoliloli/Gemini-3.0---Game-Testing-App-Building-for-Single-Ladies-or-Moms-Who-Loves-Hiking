import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', disabled = false, variant = 'primary' }) => {
  const baseStyles = "px-8 py-3 font-display uppercase tracking-widest text-sm transition-all duration-300 relative overflow-hidden group";
  
  const variants = {
    primary: "bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600",
    outline: "border border-white/30 text-white hover:border-white hover:bg-white/10 disabled:border-zinc-800 disabled:text-zinc-800"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && !disabled && (
         <div className="absolute inset-0 bg-lime-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0 mix-blend-difference" />
      )}
    </button>
  );
};
