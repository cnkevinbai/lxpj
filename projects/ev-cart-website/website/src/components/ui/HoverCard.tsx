'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function HoverCard({
  children,
  className = '',
  hoverScale = 1.02,
  hoverY = -8,
  shadow = 'lg',
}: HoverCardProps) {
  const shadowClasses = {
    sm: 'shadow-sm hover:shadow-md',
    md: 'shadow-md hover:shadow-lg',
    lg: 'shadow-lg hover:shadow-xl',
    xl: 'shadow-xl hover:shadow-2xl',
  };

  return (
    <motion.div
      className={`bg-white rounded-xl ${shadowClasses[shadow]} ${className}`}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {children}
    </motion.div>
  );
}
