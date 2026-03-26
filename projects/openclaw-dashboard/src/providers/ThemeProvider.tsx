/**
 * 主题提供者 - 全局主题管理
 * 
 * 支持：
 * - 深色/浅色模式切换
 * - 系统主题跟随
 * - 主题持久化
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'openclaw-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  // 获取系统主题
  const getSystemTheme = (): 'dark' | 'light' => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(storageKey, newTheme);
  };

  // 应用主题到 DOM
  useEffect(() => {
    const root = document.documentElement;
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    
    setResolvedTheme(resolved);
    
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    
    // 更新 CSS 变量
    if (resolved === 'dark') {
      root.style.setProperty('--bg-primary', '#0F172A');
      root.style.setProperty('--bg-secondary', '#1E293B');
      root.style.setProperty('--text-primary', '#F8FAFC');
      root.style.setProperty('--text-secondary', '#94A3B8');
      root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.1)');
    } else {
      root.style.setProperty('--bg-primary', '#FFFFFF');
      root.style.setProperty('--bg-secondary', '#F1F5F9');
      root.style.setProperty('--text-primary', '#0F172A');
      root.style.setProperty('--text-secondary', '#64748B');
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.1)');
    }
  }, [theme]);

  // 监听系统主题变化
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      setResolvedTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;