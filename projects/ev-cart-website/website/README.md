# 四川道达智能官网

> 四川道达智能车辆制造有限公司官方网站 - 大疆风格设计

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 访问
http://localhost:3000
```

## 📁 项目结构

```
website/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页
│   │   ├── globals.css     # 全局样式
│   │   ├── products/       # 产品中心 📝
│   │   ├── solutions/      # 解决方案 📝
│   │   ├── news/           # 新闻中心 📝
│   │   ├── cases/          # 案例展示 📝
│   │   ├── about/          # 关于我们 📝
│   │   ├── contact/        # 联系我们 📝
│   │   ├── login/          # 客户登录 📝
│   │   └── portal/         # 客户门户 📝
│   └── components/         # 公共组件 📝
├── public/                 # 静态资源
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🎨 设计特点

### 大疆风格
- ✅ 极简主义设计
- ✅ 全屏 Hero 区域
- ✅ 黑白灰配色
- ✅ 大留白布局
- ✅ 流畅动画效果

### 技术栈
- **框架**: Next.js 14
- **语言**: TypeScript 5
- **UI 库**: Ant Design 5
- **动画**: Framer Motion
- **样式**: Tailwind CSS

## 📋 页面规划

### 已完成 ✅
- [x] 首页（大疆风格）

### 开发中 📝
- [ ] 产品中心
- [ ] 解决方案
- [ ] 新闻中心
- [ ] 案例展示
- [ ] 关于我们
- [ ] 联系我们
- [ ] 客户登录
- [ ] 客户门户

## 🔗 API 对接

### 官网→CRM
- `POST /api/v1/website/customers` - 客户注册
- `POST /api/v1/website/leads` - 线索创建
- `POST /api/v1/website/opportunities` - 商机创建
- `POST /api/v1/website/tickets` - 工单创建

### CRM→官网
- `GET /api/v1/website/products` - 产品列表
- `GET /api/v1/website/news` - 新闻列表
- `GET /api/v1/website/cases` - 案例列表
- `GET /api/v1/website/statistics` - 统计数据

## 🚀 部署

### Vercel 部署
```bash
vercel deploy
```

### Nginx 部署
```bash
npm run build
# 将 .next 目录部署到 Nginx
```

## 📞 联系方式

- **公司**: 四川道达智能车辆制造有限公司
- **官网**: https://www.ddzn.com
- **邮箱**: info@ddzn.com
- **电话**: 400-888-8888
- **地址**: 四川省眉山市

## 📄 许可证

Copyright © 2026 四川道达智能车辆制造有限公司。All rights reserved.
