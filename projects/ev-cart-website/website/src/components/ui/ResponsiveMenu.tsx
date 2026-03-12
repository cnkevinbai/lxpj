'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

interface ResponsiveMenuProps {
  items: MenuItem[];
  logo?: React.ReactNode;
  ctaText?: string;
  ctaHref?: string;
}

export default function ResponsiveMenu({
  items,
  logo,
  ctaText,
  ctaHref,
}: ResponsiveMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 防止滚动时 body 滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isScrolled = scrollY > 50;

  return (
    <>
      {/* 桌面导航 */}
      <nav
        className={`hidden lg:flex items-center justify-between px-6 py-4 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg'
            : 'bg-transparent'
        }`}
      >
        {logo && <div className="flex-shrink-0">{logo}</div>}

        <div className="flex items-center space-x-8">
          {items.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className={`text-gray-700 hover:text-blue-600 font-medium transition-colors ${
                  isScrolled ? '' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
              
              {/* 下拉菜单 */}
              {item.children && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}

          {ctaText && ctaHref && (
            <Link
              href={ctaHref}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/30"
            >
              {ctaText}
            </Link>
          )}
        </div>
      </nav>

      {/* 移动端汉堡按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white shadow-lg"
        aria-label="菜单"
      >
        <motion.div
          animate={isOpen ? 'open' : 'closed'}
          className="w-6 h-6 relative"
        >
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: 45, y: 6 },
            }}
            className="absolute w-6 h-0.5 bg-gray-800"
          />
          <motion.span
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
            className="absolute w-6 h-0.5 bg-gray-800 top-3"
          />
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: -45, y: -6 },
            }}
            className="absolute w-6 h-0.5 bg-gray-800 top-6"
          />
        </motion.div>
      </button>

      {/* 移动端全屏菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 z-40 bg-white"
          >
            <div className="flex flex-col h-full pt-20 pb-8 px-6">
              {/* Logo */}
              {logo && (
                <div className="mb-8">{logo}</div>
              )}

              {/* 菜单项 */}
              <nav className="flex-1 overflow-y-auto">
                {items.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-4"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-4 text-2xl font-semibold text-gray-900 border-b border-gray-100"
                    >
                      {item.label}
                    </Link>
                    
                    {/* 子菜单 */}
                    {item.children && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: activeSubmenu === item.label ? 'auto' : 0,
                          opacity: activeSubmenu === item.label ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-2 space-y-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              className="block py-2 text-lg text-gray-600 hover:text-blue-600"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </nav>

              {/* CTA 按钮 */}
              {ctaText && ctaHref && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8"
                >
                  <Link
                    href={ctaHref}
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
                  >
                    {ctaText}
                  </Link>
                </motion.div>
              )}

              {/* 社交媒体 */}
              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center justify-center space-x-6">
                  {/* 社交图标 */}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
