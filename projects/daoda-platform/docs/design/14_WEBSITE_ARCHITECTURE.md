# 道达智能数字化平台 - 门户网站技术架构设计文档

> **版本**: v1.0  
> **设计日期**: 2026-03-19  
> **项目名称**: 道达智能对外门户网站  
> **技术栈**: React 18 + TypeScript + Vite + Ant Design 5

---

## 一、项目概述

### 1.1 项目定位

门户网站是道达智能对外展示的官方平台，承担品牌宣传、产品展示、解决方案介绍、新闻动态发布、客户服务等核心功能，是企业数字化转型的对外窗口。

### 1.2 设计目标

```
┌─────────────────────────────────────────────────────────────────┐
│                    门户网站设计目标                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎨 品牌形象展示                                                │
│     • 现代化视觉设计                                            │
│     • 响应式多端适配                                            │
│     • 统一的品牌调性                                            │
│                                                                 │
│  ⚡ 高性能体验                                                  │
│     • 首屏加载 < 3秒                                            │
│     • 页面切换 < 500ms                                          │
│     • SEO优化                                                   │
│                                                                 │
│  🔒 安全可靠                                                    │
│     • HTTPS全站加密                                             │
│     • XSS/CSRF防护                                              │
│     • 内容安全审核                                              │
│                                                                 │
│  📱 多端适配                                                    │
│     • PC端完整体验                                              │
│     • 移动端优化体验                                            │
│     • 平板端适配                                                │
│                                                                 │
│  🔄 内容管理                                                    │
│     • 可视化内容编辑                                            │
│     • 多语言支持                                                │
│     • 版本管理                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 技术选型对比

| 技术选型 | 方案 | 备选方案 | 选型理由 |
|----------|------|----------|----------|
| **框架** | React 18 | Vue 3, Next.js | 生态成熟，团队熟悉 |
| **语言** | TypeScript | JavaScript | 类型安全，开发效率高 |
| **构建** | Vite 5 | Webpack, Turbopack | 开发体验好，构建快 |
| **UI库** | Ant Design 5 | Material UI, Chakra UI | 企业级组件丰富 |
| **样式** | Less + CSS Modules | Tailwind CSS, Styled-components | 与Ant Design一致 |
| **路由** | React Router 6 | TanStack Router | 成熟稳定 |
| **状态** | Zustand + React Query | Redux, MobX | 轻量高效 |
| **表单** | React Hook Form + Zod | Formik | 性能好，验证强 |
| **HTTP** | Axios | Fetch, SWR | 功能完整 |
| **图表** | ECharts 5 | Chart.js, Recharts | 功能强大 |
| **动画** | Framer Motion | GSAP, React Spring | 声明式，易用 |
| **SEO** | React Helmet | Next.js SSR | SPA SEO方案 |

---

## 二、系统架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          道达智能门户网站架构                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        用户层 (User Layer)                       │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │   │ PC浏览器 │  │手机浏览器│  │ 平板    │  │ 微信内置 │          │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      CDN层 (CDN Layer)                          │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │  阿里云CDN / 腾讯云CDN                                    │  │   │
│  │   │  • 静态资源加速                                          │  │   │
│  │   │  • 图片/视频加速                                         │  │   │
│  │   │  • 全站HTTPS                                             │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     前端应用层 (Frontend)                        │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │              React SPA (Vite构建)                        │  │   │
│  │   │                                                         │  │   │
│  │   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │  │   │
│  │   │  │ 首页    │ │ 产品中心│ │解决方案│ │ 新闻中心│      │  │   │
│  │   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │  │   │
│  │   │                                                         │  │   │
│  │   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐      │  │   │
│  │   │  │ 关于我们│ │ 联系我们│ │ 客户服务│ │ 下载中心│      │  │   │
│  │   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘      │  │   │
│  │   │                                                         │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      API网关层 (Gateway)                        │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │                    Nginx                                 │  │   │
│  │   │  • 反向代理                                              │  │   │
│  │   │  • 负载均衡                                              │  │   │
│  │   │  • SSL终结                                               │  │   │
│  │   │  • 静态资源服务                                          │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      后端服务层 (Backend)                       │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │ CMS服务   │  │ 用户服务  │  │ 搜索服务  │                 │   │
│  │   │ (内容管理)│  │ (用户交互)│  │ (全文搜索)│                 │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │ 表单服务  │  │ 文件服务  │  │ 分析服务  │                 │   │
│  │   │ (表单提交)│  │ (文件管理)│  │ (访问统计)│                 │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  │                                                                 │   │
│  │   技术栈: NestJS 10 + TypeScript + Prisma ORM                 │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      数据存储层 (Data)                          │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐  ┌───────────┐                 │   │
│  │   │ PostgreSQL│  │   Redis   │  │   MinIO   │                 │   │
│  │   │  主数据库  │  │  缓存/会话 │  │  文件存储  │                 │   │
│  │   └───────────┘  └───────────┘  └───────────┘                 │   │
│  │                                                                 │   │
│  │   ┌───────────┐  ┌───────────┐                                │   │
│  │   │ ElasticSearch│ │ ClickHouse│                                │   │
│  │   │   搜索引擎  │  │  分析数据库│                                │   │
│  │   └───────────┘  └───────────┘                                │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 前端架构设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        前端应用架构                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       应用入口 (Entry)                          │   │
│  │                                                                 │   │
│  │   main.tsx                                                      │   │
│  │     └── App.tsx                                                 │   │
│  │           ├── Router (路由配置)                                 │   │
│  │           ├── Providers (全局Provider)                         │   │
│  │           └── Layouts (布局组件)                               │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       核心层 (Core)                             │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │   Router    │  │   Store     │  │   API       │           │   │
│  │   │   路由管理   │  │   状态管理   │  │   接口封装   │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │   Hooks     │  │   Utils     │  │   Constants │           │   │
│  │   │   自定义Hook │  │   工具函数   │  │   常量定义   │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       页面层 (Pages)                            │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │   Home      │  │   Products  │  │  Solutions  │           │   │
│  │   │   首页      │  │   产品中心   │  │   解决方案   │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │   News      │  │   About     │  │   Contact   │           │   │
│  │   │   新闻中心   │  │   关于我们   │  │   联系我们   │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │   Service   │  │   Download  │  │   Search    │           │   │
│  │   │   客户服务   │  │   下载中心   │  │   搜索结果   │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       组件层 (Components)                       │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │                    通用组件 (Common)                     │  │   │
│  │   │                                                         │  │   │
│  │   │  Header    Footer    Navigation    Breadcrumb           │  │   │
│  │   │  Loading   Error     Empty        Modal                 │  │   │
│  │   │  Button    Icon      Image        Link                  │  │   │
│  │   │                                                         │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │                    业务组件 (Business)                   │  │   │
│  │   │                                                         │  │   │
│  │   │  ProductCard      SolutionCard      NewsCard            │  │   │
│  │   │  HeroBanner       FeatureList       CaseStudy           │  │   │
│  │   │  ContactForm      FeedbackModal     ChatWidget          │  │   │
│  │   │  ProductFilter    CategoryNav       Pagination          │  │   │
│  │   │                                                         │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  │   ┌─────────────────────────────────────────────────────────┐  │   │
│  │   │                    布局组件 (Layouts)                    │  │   │
│  │   │                                                         │  │   │
│  │   │  MainLayout      FullscreenLayout    BlankLayout        │  │   │
│  │   │  SidebarLayout   FooterLayout        HeaderLayout       │  │   │
│  │   │                                                         │  │   │
│  │   └─────────────────────────────────────────────────────────┘  │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                       服务层 (Services)                         │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │ ProductService│ │ NewsService │  │ FormService │           │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  │   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐           │   │
│  │   │ SearchService│ │ UploadService│  │ AnalyticService│         │   │
│  │   └─────────────┘  └─────────────┘  └─────────────┘           │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 三、目录结构设计

### 3.1 项目目录结构

```
website/
├── public/                          # 静态资源目录
│   ├── favicon.ico                  # 网站图标
│   ├── logo.svg                     # Logo
│   ├── robots.txt                   # 爬虫配置
│   ├── sitemap.xml                  # 站点地图
│   └── manifest.json                # PWA配置
│
├── src/
│   ├── main.tsx                     # 应用入口
│   ├── App.tsx                      # 根组件
│   ├── vite-env.d.ts                # Vite类型声明
│   │
│   ├── api/                         # API接口
│   │   ├── index.ts                 # API入口
│   │   ├── request.ts               # Axios封装
│   │   ├── products.ts              # 产品接口
│   │   ├── news.ts                  # 新闻接口
│   │   ├── solutions.ts             # 解决方案接口
│   │   ├── forms.ts                 # 表单接口
│   │   └── search.ts                # 搜索接口
│   │
│   ├── assets/                      # 静态资源
│   │   ├── images/                  # 图片
│   │   │   ├── logo/                # Logo
│   │   │   ├── products/            # 产品图片
│   │   │   ├── news/                # 新闻图片
│   │   │   └── common/              # 通用图片
│   │   ├── videos/                  # 视频
│   │   ├── fonts/                   # 字体
│   │   └── icons/                   # 图标
│   │
│   ├── components/                  # 组件目录
│   │   ├── common/                  # 通用组件
│   │   │   ├── Header/              # 头部
│   │   │   │   ├── index.tsx
│   │   │   │   ├── HeaderNav.tsx
│   │   │   │   ├── HeaderSearch.tsx
│   │   │   │   └── index.module.less
│   │   │   ├── Footer/              # 底部
│   │   │   │   ├── index.tsx
│   │   │   │   ├── FooterNav.tsx
│   │   │   │   └── index.module.less
│   │   │   ├── Navigation/          # 导航
│   │   │   ├── Breadcrumb/          # 面包屑
│   │   │   ├── Loading/             # 加载
│   │   │   ├── Error/               # 错误
│   │   │   ├── Empty/               # 空状态
│   │   │   ├── Button/              # 按钮
│   │   │   ├── Icon/                # 图标
│   │   │   ├── Image/               # 图片
│   │   │   └── Link/                # 链接
│   │   │
│   │   ├── business/                # 业务组件
│   │   │   ├── HeroBanner/          # 首页Banner
│   │   │   ├── ProductCard/         # 产品卡片
│   │   │   ├── ProductFilter/       # 产品筛选
│   │   │   ├── SolutionCard/        # 解决方案卡片
│   │   │   ├── NewsCard/            # 新闻卡片
│   │   │   ├── FeatureList/         # 特性列表
│   │   │   ├── CaseStudy/           # 案例展示
│   │   │   ├── ContactForm/         # 联系表单
│   │   │   ├── FeedbackModal/       # 反馈弹窗
│   │   │   ├── ChatWidget/          # 在线客服
│   │   │   ├── CategoryNav/         # 分类导航
│   │   │   └── Pagination/          # 分页
│   │   │
│   │   └── layout/                  # 布局组件
│   │       ├── MainLayout/          # 主布局
│   │       ├── FullscreenLayout/    # 全屏布局
│   │       └── BlankLayout/         # 空白布局
│   │
│   ├── config/                      # 配置文件
│   │   ├── index.ts                 # 主配置
│   │   ├── routes.ts                # 路由配置
│   │   ├── menu.ts                  # 菜单配置
│   │   └── seo.ts                   # SEO配置
│   │
│   ├── constants/                   # 常量定义
│   │   ├── index.ts                 # 主常量
│   │   ├── api.ts                   # API常量
│   │   ├── status.ts                # 状态常量
│   │   └── storage.ts               # 存储常量
│   │
│   ├── hooks/                       # 自定义Hooks
│   │   ├── useRequest.ts            # 请求Hook
│   │   ├── useScroll.ts             # 滚动Hook
│   │   ├── useMediaQuery.ts         # 媒体查询Hook
│   │   ├── useIntersection.ts       # 交叉观察Hook
│   │   ├── useLocalStorage.ts       # 本地存储Hook
│   │   └── useAnalytics.ts          # 分析Hook
│   │
│   ├── models/                      # 数据模型
│   │   ├── Product.ts               # 产品模型
│   │   ├── News.ts                  # 新闻模型
│   │   ├── Solution.ts              # 解决方案模型
│   │   ├── Category.ts              # 分类模型
│   │   └── Form.ts                  # 表单模型
│   │
│   ├── pages/                       # 页面组件
│   │   ├── Home/                    # 首页
│   │   │   ├── index.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProductsSection.tsx
│   │   │   ├── SolutionsSection.tsx
│   │   │   ├── NewsSection.tsx
│   │   │   └── index.module.less
│   │   │
│   │   ├── Products/                # 产品中心
│   │   │   ├── index.tsx            # 产品列表
│   │   │   ├── Detail.tsx           # 产品详情
│   │   │   ├── Category.tsx         # 产品分类
│   │   │   └── index.module.less
│   │   │
│   │   ├── Solutions/               # 解决方案
│   │   │   ├── index.tsx            # 方案列表
│   │   │   ├── Detail.tsx           # 方案详情
│   │   │   └── index.module.less
│   │   │
│   │   ├── News/                    # 新闻中心
│   │   │   ├── index.tsx            # 新闻列表
│   │   │   ├── Detail.tsx           # 新闻详情
│   │   │   └── index.module.less
│   │   │
│   │   ├── About/                   # 关于我们
│   │   │   ├── index.tsx
│   │   │   ├── Company.tsx          # 公司介绍
│   │   │   ├── History.tsx          # 发展历程
│   │   │   ├── Team.tsx             # 团队介绍
│   │   │   ├── Culture.tsx          # 企业文化
│   │   │   └── index.module.less
│   │   │
│   │   ├── Contact/                 # 联系我们
│   │   │   ├── index.tsx
│   │   │   ├── ContactForm.tsx
│   │   │   ├── Map.tsx              # 地图
│   │   │   └── index.module.less
│   │   │
│   │   ├── Service/                 # 客户服务
│   │   │   ├── index.tsx
│   │   │   ├── FAQ.tsx              # 常见问题
│   │   │   ├── Support.tsx          # 技术支持
│   │   │   └── index.module.less
│   │   │
│   │   ├── Download/                # 下载中心
│   │   │   ├── index.tsx
│   │   │   ├── Drivers.tsx          # 驱动下载
│   │   │   ├── Manuals.tsx          # 手册下载
│   │   │   └── index.module.less
│   │   │
│   │   ├── Search/                  # 搜索结果
│   │   │   ├── index.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── ResultList.tsx
│   │   │   └── index.module.less
│   │   │
│   │   └── Error/                   # 错误页面
│   │       ├── 404.tsx              # 404页面
│   │       ├── 500.tsx              # 500页面
│   │       └── index.module.less
│   │
│   ├── router/                      # 路由配置
│   │   ├── index.tsx                # 路由入口
│   │   ├── routes.tsx               # 路由定义
│   │   └── guards.tsx               # 路由守卫
│   │
│   ├── services/                    # 服务层
│   │   ├── ProductService.ts
│   │   ├── NewsService.ts
│   │   ├── SolutionService.ts
│   │   ├── FormService.ts
│   │   ├── SearchService.ts
│   │   └── AnalyticsService.ts
│   │
│   ├── store/                       # 状态管理
│   │   ├── index.ts                 # Store入口
│   │   ├── useAppStore.ts           # 应用状态
│   │   ├── useUserStore.ts          # 用户状态
│   │   └── useSearchStore.ts        # 搜索状态
│   │
│   ├── styles/                      # 全局样式
│   │   ├── index.less               # 主样式入口
│   │   ├── variables.less           # 变量定义
│   │   ├── mixins.less              # 混入
│   │   ├── reset.less               # 重置样式
│   │   ├── global.less              # 全局样式
│   │   └── animations.less          # 动画
│   │
│   ├── types/                       # 类型定义
│   │   ├── index.d.ts               # 类型入口
│   │   ├── api.d.ts                 # API类型
│   │   ├── models.d.ts              # 模型类型
│   │   └── components.d.ts          # 组件类型
│   │
│   └── utils/                       # 工具函数
│       ├── index.ts                 # 工具入口
│       ├── format.ts                # 格式化工具
│       ├── storage.ts               # 存储工具
│       ├── validator.ts             # 验证工具
│       ├── clipboard.ts             # 剪贴板工具
│       ├── url.ts                   # URL工具
│       └── dom.ts                   # DOM工具
│
├── .env                             # 环境变量
├── .env.development                 # 开发环境变量
├── .env.production                  # 生产环境变量
├── .gitignore                       # Git忽略
├── index.html                       # HTML模板
├── package.json                     # 依赖配置
├── tsconfig.json                    # TS配置
├── tsconfig.node.json               # Node TS配置
└── vite.config.ts                   # Vite配置
```

### 3.2 核心配置文件

#### vite.config.ts

```typescript
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isProduction = mode === 'production';

  return {
    // 基础配置
    base: env.VITE_BASE_URL || '/',
    
    // 插件配置
    plugins: [
      react(),
      
      // HTML模板注入
      createHtmlPlugin({
        minify: isProduction,
        inject: {
          data: {
            title: '道达智能',
            description: '道达智能数字化平台',
            keywords: '道达智能,数字化,智能制造',
          },
        },
      }),
      
      // 构建分析（生产环境）
      isProduction && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: 'stats.html',
      }),
      
      // Gzip压缩
      isProduction && viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
    ].filter(Boolean),
    
    // 路径别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@config': path.resolve(__dirname, 'src/config'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@types': path.resolve(__dirname, 'src/types'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
    
    // CSS配置
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {
            // Ant Design主题变量
            'primary-color': '#1890ff',
            'link-color': '#1890ff',
            'border-radius-base': '4px',
          },
        },
      },
      modules: {
        localsConvention: 'camelCase',
      },
    },
    
    // 开发服务器配置
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    
    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: !isProduction,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      
      // 分包策略
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks: {
            // React核心
            react: ['react', 'react-dom', 'react-router-dom'],
            // UI库
            antd: ['antd', '@ant-design/icons'],
            // 状态管理
            state: ['zustand', '@tanstack/react-query'],
            // 图表
            charts: ['echarts', 'echarts-for-react'],
            // 工具库
            utils: ['axios', 'dayjs', 'lodash-es'],
          },
        },
      },
      
      // 资源大小警告阈值
      chunkSizeWarningLimit: 1000,
    },
    
    // 优化配置
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'antd',
        'axios',
      ],
    },
  };
});
```

---

## 四、核心模块设计

### 4.1 路由设计

#### 路由配置

```typescript
// src/router/routes.tsx

import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Loading from '@/components/common/Loading';

// 懒加载组件
const Home = lazy(() => import('@/pages/Home'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetail = lazy(() => import('@/pages/Products/Detail'));
const Solutions = lazy(() => import('@/pages/Solutions'));
const SolutionDetail = lazy(() => import('@/pages/Solutions/Detail'));
const News = lazy(() => import('@/pages/News'));
const NewsDetail = lazy(() => import('@/pages/News/Detail'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Service = lazy(() => import('@/pages/Service'));
const Download = lazy(() => import('@/pages/Download'));
const Search = lazy(() => import('@/pages/Search'));
const NotFound = lazy(() => import('@/pages/Error/404'));
const ServerError = lazy(() => import('@/pages/Error/500'));

// 懒加载包装器
const LazyWrapper = (Component: React.LazyExoticComponent<React.FC>) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // 首页
      {
        index: true,
        element: LazyWrapper(Home),
      },
      
      // 产品中心
      {
        path: 'products',
        children: [
          {
            index: true,
            element: LazyWrapper(Products),
          },
          {
            path: ':id',
            element: LazyWrapper(ProductDetail),
          },
          {
            path: 'category/:categoryId',
            element: LazyWrapper(Products),
          },
        ],
      },
      
      // 解决方案
      {
        path: 'solutions',
        children: [
          {
            index: true,
            element: LazyWrapper(Solutions),
          },
          {
            path: ':id',
            element: LazyWrapper(SolutionDetail),
          },
        ],
      },
      
      // 新闻中心
      {
        path: 'news',
        children: [
          {
            index: true,
            element: LazyWrapper(News),
          },
          {
            path: ':id',
            element: LazyWrapper(NewsDetail),
          },
        ],
      },
      
      // 关于我们
      {
        path: 'about',
        element: LazyWrapper(About),
      },
      
      // 联系我们
      {
        path: 'contact',
        element: LazyWrapper(Contact),
      },
      
      // 客户服务
      {
        path: 'service',
        element: LazyWrapper(Service),
      },
      
      // 下载中心
      {
        path: 'download',
        element: LazyWrapper(Download),
      },
      
      // 搜索
      {
        path: 'search',
        element: LazyWrapper(Search),
      },
    ],
  },
  
  // 错误页面
  {
    path: '404',
    element: LazyWrapper(NotFound),
  },
  {
    path: '500',
    element: LazyWrapper(ServerError),
  },
  {
    path: '*',
    element: LazyWrapper(NotFound),
  },
];
```

### 4.2 状态管理设计

#### Zustand Store设计

```typescript
// src/store/useAppStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppState {
  // 语言
  language: 'zh-CN' | 'en-US';
  setLanguage: (language: 'zh-CN' | 'en-US') => void;
  
  // 主题
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // 移动端菜单
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // 搜索
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  
  // 返回顶部
  showBackTop: boolean;
  setShowBackTop: (show: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'zh-CN',
      setLanguage: (language) => set({ language }),
      
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      
      searchKeyword: '',
      setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
      
      showBackTop: false,
      setShowBackTop: (show) => set({ showBackTop: show }),
    }),
    {
      name: 'daoda-website-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);
```

### 4.3 API请求封装

```typescript
// src/api/request.ts

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { message } from 'antd';

// 响应数据结构
interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
  timestamp: string;
}

// 分页响应
interface PageResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 创建axios实例
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 可添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加语言参数
    config.headers['Accept-Language'] = localStorage.getItem('language') || 'zh-CN';
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    
    // 业务成功
    if (data.code === 200) {
      return response;
    }
    
    // 业务失败
    message.error(data.message || '请求失败');
    return Promise.reject(new Error(data.message));
  },
  (error: AxiosError<ApiResponse>) => {
    // HTTP错误处理
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          message.error(data?.message || '请求参数错误');
          break;
        case 401:
          message.error('未授权，请重新登录');
          // 跳转登录
          break;
        case 403:
          message.error('拒绝访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(data?.message || '网络错误');
      }
    } else if (error.request) {
      message.error('网络异常，请检查网络连接');
    } else {
      message.error('请求失败');
    }
    
    return Promise.reject(error);
  }
);

// 封装请求方法
class Request {
  // GET请求
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return instance.get(url, config).then((res) => res.data);
  }
  
  // POST请求
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return instance.post(url, data, config).then((res) => res.data);
  }
  
  // PUT请求
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return instance.put(url, data, config).then((res) => res.data);
  }
  
  // DELETE请求
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return instance.delete(url, config).then((res) => res.data);
  }
  
  // 分页请求
  getPage<T = any>(
    url: string,
    params: { page: number; pageSize: number; [key: string]: any }
  ): Promise<ApiResponse<PageResponse<T>>> {
    return instance.get(url, { params }).then((res) => res.data);
  }
  
  // 文件上传
  upload<T = any>(url: string, file: File, onProgress?: (percent: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return instance
      .post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      })
      .then((res) => res.data);
  }
}

export const request = new Request();
export type { ApiResponse, PageResponse };
```

### 4.4 核心组件设计

#### Header组件

```typescript
// src/components/common/Header/index.tsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Drawer, Input, Button } from 'antd';
import { MenuOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppStore } from '@/store/useAppStore';
import { menuItems } from '@/config/menu';
import styles from './index.module.less';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mobileMenuOpen, setMobileMenuOpen, setSearchKeyword } = useAppStore();
  
  // 滚动状态
  const [scrolled, setScrolled] = useState(false);
  
  // 搜索状态
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 搜索处理
  const handleSearch = () => {
    if (searchValue.trim()) {
      setSearchKeyword(searchValue.trim());
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue('');
    }
  };
  
  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img src="/logo.svg" alt="道达智能" />
          <span>道达智能</span>
        </Link>
        
        {/* PC导航 */}
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${
                location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path))
                  ? styles.active
                  : ''
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        
        {/* 右侧操作 */}
        <div className={styles.actions}>
          <Button
            type="text"
            icon={<SearchOutlined />}
            onClick={() => setSearchOpen(true)}
          />
          
          <Button
            type="text"
            icon={<MenuOutlined />}
            className={styles.menuBtn}
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>
      </div>
      
      {/* 移动端菜单 */}
      <Drawer
        placement="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        className={styles.mobileDrawer}
        closeIcon={<CloseOutlined />}
      >
        <nav className={styles.mobileNav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={styles.mobileNavItem}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </Drawer>
      
      {/* 搜索弹窗 */}
      <Drawer
        placement="top"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        className={styles.searchDrawer}
        closeIcon={null}
      >
        <div className={styles.searchContent}>
          <Input
            size="large"
            placeholder="搜索产品、解决方案、新闻..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearch}
            autoFocus
          />
          <Button type="primary" size="large" onClick={handleSearch}>
            搜索
          </Button>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
```

---

## 五、页面设计

### 5.1 页面清单

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 品牌展示、核心功能、最新动态 |
| 产品中心 | `/products` | 产品列表、分类筛选 |
| 产品详情 | `/products/:id` | 产品详细介绍、参数、案例 |
| 解决方案 | `/solutions` | 方案列表、行业分类 |
| 方案详情 | `/solutions/:id` | 方案介绍、应用场景、案例 |
| 新闻中心 | `/news` | 新闻列表、分类 |
| 新闻详情 | `/news/:id` | 新闻内容、相关推荐 |
| 关于我们 | `/about` | 公司介绍、发展历程、团队 |
| 联系我们 | `/contact` | 联系方式、在线留言 |
| 客户服务 | `/service` | 常见问题、技术支持 |
| 下载中心 | `/download` | 驱动、手册下载 |
| 搜索结果 | `/search` | 全站搜索结果 |
| 404页面 | `/404` | 页面不存在 |
| 500页面 | `/500` | 服务器错误 |

### 5.2 首页设计

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [Logo] 道达智能        产品中心 解决方案 新闻中心 关于我们   [搜索] [菜单] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                 │   │
│  │                     Hero Banner (轮播图)                        │   │
│  │                                                                 │   │
│  │              智能制造 · 数字化转型引领者                         │   │
│  │                                                                 │   │
│  │              [了解更多] [联系我们]                              │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        核心产品                                  │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │   │
│  │   │ 产品图片 │  │ 产品图片 │  │ 产品图片 │  │ 产品图片 │         │   │
│  │   │         │  │         │  │         │  │         │         │   │
│  │   │ 产品名称 │  │ 产品名称 │  │ 产品名称 │  │ 产品名称 │         │   │
│  │   │ 简短描述 │  │ 简短描述 │  │ 简短描述 │  │ 简短描述 │         │   │
│  │   └─────────┘  └─────────┘  └─────────┘  └─────────┘         │   │
│  │                                                                 │   │
│  │                          [查看更多产品]                          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        解决方案                                  │   │
│  │                                                                 │   │
│  │   ┌───────────────────┐  ┌───────────────────┐                 │   │
│  │   │   智能制造方案    │  │   数字化工厂方案  │                 │   │
│  │   │                   │  │                   │                 │   │
│  │   │   方案描述...     │  │   方案描述...     │                 │   │
│  │   │                   │  │                   │                 │   │
│  │   │   [了解更多]      │  │   [了解更多]      │                 │   │
│  │   └───────────────────┘  └───────────────────┘                 │   │
│  │                                                                 │   │
│  │                          [查看全部方案]                          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        新闻动态                                  │   │
│  │                                                                 │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐                       │   │
│  │   │ 新闻图片 │  │ 新闻图片 │  │ 新闻图片 │                       │   │
│  │   │         │  │         │  │         │                       │   │
│  │   │ 标题    │  │ 标题    │  │ 标题    │                       │   │
│  │   │ 日期    │  │ 日期    │  │ 日期    │                       │   │
│  │   └─────────┘  └─────────┘  └─────────┘                       │   │
│  │                                                                 │   │
│  │                          [查看更多新闻]                          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                        合作伙伴                                  │   │
│  │                                                                 │   │
│  │     [logo] [logo] [logo] [logo] [logo] [logo] [logo]          │   │
│  │                                                                 │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  [Logo] 关于我们 | 联系我们 | 法律声明 | 隐私政策                        │
│  电话: 400-xxx-xxxx  邮箱: contact@daoda.com  地址: 四川省眉山市         │
│  Copyright © 2026 道达智能 All Rights Reserved                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 六、性能优化方案

### 6.1 加载性能优化

```typescript
// ========================================
// 性能优化配置
// ========================================

// 1. 路由懒加载
const Home = lazy(() => import('@/pages/Home'));

// 2. 组件预加载
const prefetchComponent = (componentImporter: () => Promise<any>) => {
  return componentImporter;
};

// 3. 图片懒加载 Hook
const useLazyLoad = (ref: React.RefObject<HTMLImageElement>, src: string) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && ref.current) {
          ref.current.src = src;
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(ref.current);
    
    return () => observer.disconnect();
  }, [ref, src]);
};

// 4. 虚拟列表（长列表优化）
import { FixedSizeList } from 'react-window';

const VirtualList = ({ items }: { items: any[] }) => (
  <FixedSizeList
    height={600}
    itemCount={items.length}
    itemSize={100}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        <Item data={items[index]} />
      </div>
    )}
  </FixedSizeList>
);

// 5. 请求缓存
import { useQuery } from '@tanstack/react-query';

const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => request.get('/products'),
    staleTime: 5 * 60 * 1000,  // 5分钟缓存
    cacheTime: 30 * 60 * 1000, // 30分钟过期
  });
};
```

### 6.2 SEO优化

```typescript
// src/config/seo.ts

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

// 默认SEO配置
export const defaultSEO: SEOConfig = {
  title: '道达智能 - 智能制造数字化解决方案',
  description: '道达智能提供智能制造、数字化工厂、企业数字化转型解决方案，助力企业实现智能化升级。',
  keywords: ['道达智能', '智能制造', '数字化转型', '数字化工厂', 'ERP', 'CRM', 'MES'],
  ogImage: '/images/og-image.jpg',
};

// 页面SEO配置
export const pageSEO: Record<string, SEOConfig> = {
  '/': {
    title: '道达智能 - 智能制造数字化解决方案',
    description: '道达智能专注于智能制造领域，提供ERP、CRM、MES等数字化解决方案，助力企业数字化转型。',
    keywords: ['道达智能', '智能制造', '数字化转型'],
  },
  '/products': {
    title: '产品中心 - 道达智能',
    description: '道达智能产品中心，提供智能制造全系列产品解决方案。',
    keywords: ['智能制造产品', '数字化产品', 'ERP系统', 'CRM系统'],
  },
  '/solutions': {
    title: '解决方案 - 道达智能',
    description: '道达智能提供行业领先的智能制造解决方案，覆盖汽车、电子、机械等多个行业。',
    keywords: ['智能制造方案', '数字化方案', '行业解决方案'],
  },
  '/news': {
    title: '新闻中心 - 道达智能',
    description: '道达智能新闻中心，了解公司最新动态、行业资讯。',
    keywords: ['道达新闻', '行业资讯', '公司动态'],
  },
  '/about': {
    title: '关于我们 - 道达智能',
    description: '了解道达智能，专注智能制造，引领数字化转型。',
    keywords: ['道达智能', '公司介绍', '团队介绍'],
  },
};

// 动态SEO组件
import { Helmet } from 'react-helmet-async';

interface SEOProps extends Partial<SEOConfig> {
  path?: string;
}

export const SEO: React.FC<SEOProps> = ({ path, ...custom }) => {
  const config = path ? pageSEO[path] || defaultSEO : defaultSEO;
  const seo = { ...config, ...custom };
  
  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(',')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      
      {/* Canonical */}
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
    </Helmet>
  );
};
```

---

## 七、部署方案

### 7.1 Docker部署

```dockerfile
# Dockerfile

# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

### 7.2 Nginx配置

```nginx
# nginx.conf

worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript 
               application/xml application/xml+rss text/javascript image/svg+xml;
    gzip_min_length 1000;
    
    # 缓存配置
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    server {
        listen 80;
        server_name www.daoda.com daoda.com;
        root /usr/share/nginx/html;
        index index.html;
        
        # 安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        
        # SPA路由支持
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # API代理
        location /api/ {
            proxy_pass http://backend:8080/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_cache_bypass $http_upgrade;
        }
        
        # 健康检查
        location /health {
            return 200 'OK';
            add_header Content-Type text/plain;
        }
        
        # 404处理
        error_page 404 /index.html;
    }
}
```

---

## 八、开发计划

### 8.1 开发阶段

```
┌─────────────────────────────────────────────────────────────────┐
│                    门户网站开发计划                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Phase 1: 基础搭建 (2周)                                        │
│  ├─ Week 1: 项目初始化、配置、基础组件                         │
│  └─ Week 2: 布局组件、通用组件、API封装                        │
│                                                                 │
│  Phase 2: 页面开发 (4周)                                        │
│  ├─ Week 3: 首页、产品中心                                     │
│  ├─ Week 4: 解决方案、新闻中心                                 │
│  ├─ Week 5: 关于我们、联系我们、客户服务                       │
│  └─ Week 6: 下载中心、搜索、错误页面                           │
│                                                                 │
│  Phase 3: 优化完善 (2周)                                        │
│  ├─ Week 7: 性能优化、SEO优化                                  │
│  └─ Week 8: 测试、修复、部署                                   │
│                                                                 │
│  总计: 8周 (约2个月)                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

> **下一份文档**: `15_PORTAL_ARCHITECTURE.md` - 企业内部管理系统技术架构
>
> **文档维护**: 渔晓白
> **最后更新**: 2026-03-19