import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading, className = '', disabled, ...props }) => {
  return (
    <button
      disabled={isLoading || disabled}
      className={`relative px-6 py-3 font-semibold text-white transition-all duration-300 ease-out rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
