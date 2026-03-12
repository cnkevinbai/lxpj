'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  animation?: 'pulse' | 'wave';
}

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'string' ? width : `${width}px`;
  if (height) style.height = typeof height === 'string' ? height : `${height}px`;

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      animate={
        animation === 'pulse'
          ? { opacity: [1, 0.5, 1] }
          : {
              backgroundPosition: ['200% 0', '-200% 0'],
            }
      }
      transition={
        animation === 'pulse'
          ? { duration: 1.5, repeat: Infinity }
          : { duration: 1.5, repeat: Infinity, ease: 'linear' }
      }
    />
  );
}
