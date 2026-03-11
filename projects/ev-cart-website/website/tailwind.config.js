/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // 大厂风格色彩系统 - 参考 Ant Design/TDesign
    extend: {
      colors: {
        // 品牌色 (参考阿里云/腾讯云)
        brand: {
          blue: '#0070FF',    // 科技蓝
          black: '#000000',   // 纯黑
          white: '#FFFFFF',   // 纯白
        },
        // 中性灰色系 (大厂标准)
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        // 功能色 (大厂标准)
        success: '#10B981',   // 成功绿
        warning: '#F59E0B',   // 警告黄
        error: '#EF4444',     // 错误红
        info: '#3B82F6',      // 信息蓝
      },
      // 字体系统 (大厂标准)
      fontFamily: {
        sans: [
          'PingFang SC',           // 苹果中文字体
          'Microsoft YaHei',       // 微软雅黑
          'Noto Sans SC',          // 思源黑体
          'Inter',                 // 现代无衬线
          'SF Pro Display',        // 苹果字体
          'sans-serif',
        ],
      },
      // 间距系统 (4px 基础单位)
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // 断点系统 (大厂标准)
      screens: {
        'xs': '320px',    // 小屏手机
        'sm': '414px',    // 大屏手机
        'md': '768px',    // 平板
        'lg': '1024px',   // 小屏笔记本
        'xl': '1280px',   // 桌面
        '2xl': '1536px',  // 大屏桌面
        '4k': '2560px',   // 4K 显示器
      },
      // 阴影系统 (大厂标准)
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      // 动画系统 (大厂标准)
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // 圆角系统 (大厂标准)
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
