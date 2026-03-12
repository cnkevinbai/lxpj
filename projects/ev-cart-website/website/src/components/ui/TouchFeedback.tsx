'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface TouchFeedbackProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  onTap?: () => void;
}

/**
 * 移动端触控反馈组件
 * 点击时产生缩放和涟漪效果
 */
export default function TouchFeedback({
  children,
  className = '',
  scale = 0.95,
  onTap,
}: TouchFeedbackProps) {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
    };
    
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
    
    onTap?.();
  };

  return (
    <motion.div
      className={`relative overflow-hidden cursor-pointer ${className}`}
      whileTap={{ scale }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onTap?.();
        }
      }}
    >
      {children}
      
      {/* 涟漪效果 */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute rounded-full bg-blue-500"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 100,
            height: 100,
            marginLeft: -50,
            marginTop: -50,
          }}
        />
      ))}
    </motion.div>
  );
}
