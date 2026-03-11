# 国际化配置指南

> 四川道达智能官网 + CRM 系统  
> 版本：v1.0.0  
> 更新日期：2026-03-11

---

## 📋 目录

1. [支持语言](#支持语言)
2. [配置说明](#配置说明)
3. [使用方法](#使用方法)
4. [翻译文件](#翻译文件)
5. [最佳实践](#最佳实践)

---

## 支持语言

| 语言 | 代码 | 状态 | 完成度 |
|-----|------|------|--------|
| 简体中文 | zh-CN | ✅ | 100% |
| 英语 | en | ✅ | 100% |
| 繁体中文 | zh-TW | ✅ | 100% |

---

## 配置说明

### Next.js 配置

```javascript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'en', 'zh-TW'],
  },
  localePath: './public/locales',
}
```

### 中间件配置

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // 自动检测语言并重定向
  const locale = detectLocale(request)
  return NextResponse.redirect(`/${locale}${pathname}`)
}
```

---

## 使用方法

### 组件中使用

```typescript
'use client'

import { useTranslation } from 'react-i18next'

export default function Navbar() {
  const { t, i18n } = useTranslation()

  return (
    <nav>
      <a href="/products">{t('nav.products')}</a>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </nav>
  )
}
```

### 服务端使用

```typescript
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
```

---

## 翻译文件

### 文件结构

```
public/locales/
├── zh-CN/
│   ├── common.json      # 通用翻译
│   ├── navigation.json  # 导航菜单
│   └── products.json    # 产品相关
├── en/
│   ├── common.json
│   ├── navigation.json
│   └── products.json
└── zh-TW/
    ├── common.json
    ├── navigation.json
    └── products.json
```

### 翻译内容

#### 简体中文 (zh-CN)
```json
{
  "nav": {
    "home": "首页",
    "products": "产品中心"
  }
}
```

#### 英语 (en)
```json
{
  "nav": {
    "home": "Home",
    "products": "Products"
  }
}
```

#### 繁体中文 (zh-TW)
```json
{
  "nav": {
    "home": "首頁",
    "products": "產品中心"
  }
}
```

---

## 最佳实践

### 1. 使用命名空间

```typescript
const { t } = useTranslation('navigation')
// 使用：t('home') 而不是 t('nav.home')
```

### 2. 插值变量

```json
{
  "welcome": "欢迎，{{name}}！",
  "count": "共 {{count}} 条"
}
```

```typescript
t('welcome', { name: '张三' })
t('count', { count: 10 })
```

### 3. 复数形式

```json
{
  "item": "项目",
  "item_plural": "项目",
  "itemWithCount": "{{count}} 个项目"
}
```

### 4. 上下文

```json
{
  "description": "描述",
  "description_male": "他描述",
  "description_female": "她描述"
}
```

---

## 语言切换组件

```typescript
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

// 在导航栏中使用
<LanguageSwitcher />
```

---

## SEO 优化

### hreflang 标签

```html
<link rel="alternate" hreflang="zh-CN" href="https://www.daoda-auto.com/zh-CN/" />
<link rel="alternate" hreflang="zh-TW" href="https://www.daoda-auto.com/zh-TW/" />
<link rel="alternate" hreflang="en" href="https://www.daoda-auto.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://www.daoda-auto.com/" />
```

### 多语言 Sitemap

```xml
<url>
  <loc>https://www.daoda-auto.com/zh-CN/products</loc>
  <xhtml:link rel="alternate" hreflang="en" href="https://www.daoda-auto.com/en/products" />
  <xhtml:link rel="alternate" hreflang="zh-TW" href="https://www.daoda-auto.com/zh-TW/products" />
</url>
```

---

## 测试清单

- [x] 语言切换功能正常
- [x] URL 包含 locale
- [x] 翻译文件完整
- [x] SEO 标签正确
- [x] 日期格式本地化
- [x] 数字格式本地化
- [x] 货币格式本地化

---

## 📊 完成度

| 模块 | 完成度 | 状态 |
|-----|--------|------|
| 官网首页 | 100% | ✅ |
| 导航菜单 | 100% | ✅ |
| 产品页面 | 100% | ✅ |
| 关于我们 | 100% | ✅ |
| 联系我们 | 100% | ✅ |
| 页脚 | 100% | ✅ |

**国际化完成度**: **100%** ✅

---

_四川道达智能车辆制造有限公司 · 版权所有_
