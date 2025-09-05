import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-blue-500',
    secondary: 'bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 focus:ring-white/50',
    ghost: 'text-white/80 hover:text-white hover:bg-white/10 focus:ring-white/50',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};