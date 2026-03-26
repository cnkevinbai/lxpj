# 设计系统技能（强化版）

## 📋 技能说明

创建企业级设计系统，包含完整的组件库、设计规范和文档。

---

## 🎯 Figma 最佳实践

### 文件组织结构

```
📁 设计系统
├── 📄 00_Foundations      # 基础元素
│   ├── Colors            # 颜色
│   ├── Typography        # 字体
│   ├── Spacing           # 间距
│   ├── Grid              # 网格
│   └── Effects           # 效果（阴影、模糊）
│
├── 📄 01_Tokens           # 设计变量
│   ├── Color Tokens
│   ├── Typography Tokens
│   └── Spacing Tokens
│
├── 📄 02_Atoms            # 原子组件
│   ├── Buttons
│   ├── Inputs
│   ├── Icons
│   └── Typography
│
├── 📄 03_Molecules        # 分子组件
│   ├── Cards
│   ├── Forms
│   ├── Navigation
│   └── Lists
│
├── 📄 04_Organisms        # 有机组件
│   ├── Headers
│   ├── Sidebars
│   └── Data Tables
│
└── 📄 05_Templates        # 页面模板
    ├── Dashboard
    ├── List Page
    └── Detail Page
```

---

## 📝 颜色系统

### 语义化颜色变量

```css
:root {
  /* 品牌色 */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  
  /* 中性色 */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* 功能色 */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* 语义色 */
  --color-text-primary: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-600);
  --color-text-muted: var(--color-gray-400);
  --color-bg-primary: #ffffff;
  --color-bg-secondary: var(--color-gray-50);
  --color-border: var(--color-gray-200);
}
```

---

## 📝 字体系统

### 字体层级

```css
:root {
  /* 字体家族 */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  /* 字号 */
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  
  /* 行高 */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  
  /* 字重 */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}

/* 字体预设 */
.text-display {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

.text-heading-1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
}

.text-body {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}
```

---

## 📝 间距系统

### 8px 网格系统

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
}
```

---

## 📝 组件规范

### Button 组件

```yaml
Button:
  尺寸:
    - Small: height 32px, padding 8px 16px
    - Medium: height 40px, padding 12px 24px
    - Large: height 48px, padding 16px 32px
  
  变体:
    - Primary: 背景主色，文字白色
    - Secondary: 背景透明，边框主色
    - Ghost: 背景透明，无边框
    - Danger: 背景红色，文字白色
  
  状态:
    - Default: 默认
    - Hover: 背景加深 10%
    - Active: 背景加深 20%
    - Disabled: 透明度 50%
  
  动效:
    - 过渡时间: 150ms
    - 缓动函数: ease-in-out
```

---

## ✅ 设计系统检查清单

### 基础

- [ ] 颜色对比度符合 WCAG AA 标准
- [ ] 字体层级清晰（4-6 级）
- [ ] 间距遵循 4/8px 网格
- [ ] 圆角统一（small/medium/large）

### 组件

- [ ] 所有状态完整（hover/active/disabled）
- [ ] 响应式适配
- [ ] 暗色模式支持
- [ ] 可访问性标注

### 文档

- [ ] 使用指南
- [ ] API 文档
- [ ] 最佳实践
- [ ] 示例代码

---

## 📚 参考资源

- [Figma 最佳实践](https://www.figma.com/best-practices/)
- [Material Design](https://m3.material.io/)
- [Ant Design](https://ant.design/docs/spec/introduce)

---

## 📚 相关技能

- `user-experience` - 用户体验设计
- `visual-design` - 视觉设计