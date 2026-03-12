'use client';

import { motion } from 'framer-motion';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  icon?: ReactNode;
  loading?: boolean;
}

export default function GradientButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}: GradientButtonProps) {
  const variants = {
    primary: 'from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900',
    secondary: 'from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900',
    accent: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    success: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden
        bg-gradient-to-r ${variants[variant]}
        text-white font-semibold rounded-xl
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        transition-all duration-300
        hover:shadow-lg hover:shadow-blue-500/30
        active:scale-95
        ${className}
      `}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.svg
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </motion.svg>
        )}
        {icon && !loading && icon}
        {children}
      </span>
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        whileHover={{ opacity: 0.1 }}
      />
    </motion.button>
  );
}
