'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartScrollProps {
  children: React.ReactNode;
  threshold?: number;
}

/**
 * 智能滚动组件
 * 根据滚动位置显示/隐藏内容
 */
export default function SmartScroll({
  children,
  threshold = 300,
}: SmartScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // 判断滚动方向
          if (currentScrollY > lastScrollY) {
            setScrollDirection('down');
          } else {
            setScrollDirection('up');
          }
          
          setLastScrollY(currentScrollY);
          setIsVisible(currentScrollY > threshold);
          
          ticking = false;
        });
        
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: scrollDirection === 'down' ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: scrollDirection === 'down' ? -100 : 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
