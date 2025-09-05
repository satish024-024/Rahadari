import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-white/10 rounded';
  
  const variantClasses = {
    text: 'h-4',
    rectangular: 'h-4',
    circular: 'rounded-full',
  };

  const style = {
    width: width || '100%',
    height: height || undefined,
  };

  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseClasses,
              variantClasses[variant],
              className
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
    />
  );
};