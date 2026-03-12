# EV Cart 官网

> 基于 Next.js 14 的官方网站

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构

```
website/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页
│   │   ├── products/       # 产品中心
│   │   ├── about/          # 关于我们
│   │   └── contact/        # 联系我们
│   └── components/         # 组件
├── public/                 # 静态资源
└── package.json
```

## 🎯 功能特性

- ✅ 响应式设计
- ✅ SEO 优化
- ✅ 静态生成
- ✅ API 集成

## 📝 页面列表

1. **首页** (`/`) - 产品展示/公司新闻/客户案例
2. **产品中心** (`/products`) - EV Cart 产品系列
3. **关于我们** (`/about`) - 公司介绍/发展历程
4. **联系我们** (`/contact`) - 在线咨询/留言表单

## 🔗 API 集成

```typescript
// 获取产品列表
GET /api/v1/products

// 客户注册
POST /api/v1/auth/register

// 在线咨询
POST /api/v1/website/inquiry
```

## 🎨 技术栈

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Ant Design
- **Deployment**: Vercel

## 🚀 部署

```bash
# Vercel 部署
vercel deploy
```

## 📞 联系方式

- 官网：https://www.evcart.com
- 邮箱：info@evcart.com
- 电话：400-888-8888
