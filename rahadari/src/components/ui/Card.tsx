import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'dark';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hover = false,
  padding = 'md',
}) => {
  const baseClasses = 'rounded-2xl shadow-xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white/10 backdrop-blur-xl border border-white/20',
    glass: 'bg-white/5 backdrop-blur-2xl border border-white/10',
    dark: 'bg-gray-900/50 backdrop-blur-xl border border-gray-700/50',
  };
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hover ? 'hover:scale-105 hover:shadow-2xl' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
    >
      {children}
    </motion.div>
  );
};