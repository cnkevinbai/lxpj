# EV Cart 官网 + CRM 系统

> 电动观光车行业一体化解决方案  
> 版本：v1.0.0  
> 创建时间：2026-03-11

---

## 📋 项目简介

EV Cart 是一个集官网展示 + CRM 客户管理于一体的企业级应用，专为电动观光车行业设计。

**核心功能**:
- 🌐 官网展示 (产品/案例/询价)
- 💼 CRM 客户管理
- 📊 销售线索管理
- 💰 商机与订单管理
- 🔐 JWT 认证系统

---

## 🛠️ 技术栈

### 前端
- **官网**: Next.js 14 + Tailwind CSS + TypeScript
- **CRM**: React 18 + Ant Design Pro + Vite
- **状态管理**: Zustand
- **数据可视化**: @ant-design/plots

### 后端
- **框架**: NestJS + TypeScript
- **数据库**: PostgreSQL 15 + TypeORM
- **缓存**: Redis 7
- **认证**: JWT + Passport
- **文档**: Swagger

### 部署
- **容器**: Docker + Docker Compose
- **部署**: 阿里云/腾讯云

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL >= 15
- Redis >= 7
- Docker (可选)

### 方式一：Docker 部署 (推荐)

```bash
# 克隆项目
git clone https://gitee.com/bj754946/pj.git
cd pj

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

**访问地址**:
- 官网：http://localhost:3000
- CRM: http://localhost:3002
- API 文档：http://localhost:3001/api/docs

### 方式二：本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 配置数据库等信息

# 启动数据库和 Redis
docker-compose up -d postgres redis

# 启动后端
cd backend && npm run start:dev

# 启动官网
cd website && npm run dev

# 启动 CRM
cd crm && npm run dev
```

---

## 📁 项目结构

```
ev-cart-website/
├── website/              # Next.js 官网
│   ├── src/
│   │   ├── app/         # 页面路由
│   │   ├── components/  # 组件
│   │   └── lib/         # 工具库
│   └── package.json
│
├── backend/             # NestJS 后端
│   ├── src/
│   │   ├── modules/    # 业务模块
│   │   ├── common/     # 公共模块
│   │   └── lib/        # 工具库
│   └── package.json
│
├── crm/                 # React CRM
│   ├── src/
│   │   ├── pages/      # 页面
│   │   ├── components/ # 组件
│   │   └── services/   # API 服务
│   └── package.json
│
├── database/            # 数据库脚本
├── docker/              # Docker 配置
└── docs/                # 项目文档
```

---

## 📊 功能模块

### 官网模块

| 页面 | 路由 | 功能 |
|-----|------|------|
| 首页 | `/` | Hero/优势/产品/CTA |
| 产品列表 | `/products` | 分类筛选/车型展示 |
| 产品详情 | `/products/[id]` | 参数/图片/询价 |
| 询价表单 | `/inquiry` | 在线询价 |
| 联系我们 | `/contact` | 联系方式/地图/留言 |
| 关于我们 | `/about` | 公司简介/历程/荣誉 |

### CRM 模块

| 页面 | 路由 | 功能 |
|-----|------|------|
| 登录 | `/login` | 邮箱密码登录 |
| 仪表盘 | `/dashboard` | 数据统计/图表 |
| 客户管理 | `/customers` | CRUD/搜索/分页 |
| 线索管理 | `/leads` | CRUD/转化/分配 |
| 商机管理 | `/opportunities` | 销售漏斗/阶段管理 |
| 订单管理 | `/orders` | 订单流程/统计 |

### 后端 API

| 模块 | 接口 | 说明 |
|-----|------|------|
| 认证 | `/api/v1/auth/*` | 登录/注册/刷新 Token |
| 客户 | `/api/v1/customers/*` | 客户 CRUD |
| 线索 | `/api/v1/leads/*` | 线索 CRUD/转化 |
| 商机 | `/api/v1/opportunities/*` | 商机 CRUD/漏斗 |
| 订单 | `/api/v1/orders/*` | 订单 CRUD/统计 |
| 产品 | `/api/v1/products/*` | 产品 CRUD |

---

## 🔐 默认账号

**管理员账号**:
- 邮箱：admin@evcart.com
- 密码：admin123

**测试数据**:
- 客户：10+ 条
- 线索：20+ 条
- 商机：5+ 条
- 订单：8+ 条

---

## 📝 开发规范

### 代码风格

- TypeScript 严格模式
- ESLint + Prettier 格式化
- 组件函数式编程
- 注释完整

### Git 提交

```bash
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

### 分支管理

```
main          # 主分支
develop       # 开发分支
feature/xxx   # 功能分支
bugfix/xxx    # 修复分支
```

---

## 📖 API 文档

启动后端后访问：http://localhost:3001/api/docs

**认证流程**:
1. POST `/api/v1/auth/login` 获取 Token
2. 请求头携带 `Authorization: Bearer <token>`
3. Token 过期使用 Refresh Token 刷新

---

## 🐛 常见问题

### 数据库连接失败

```bash
# 检查 PostgreSQL 是否运行
docker-compose ps

# 查看数据库日志
docker-compose logs postgres
```

### 端口被占用

```bash
# 修改 .env 中的端口配置
WEBSITE_PORT=3000
BACKEND_PORT=3001
CRM_PORT=3002
```

### 依赖安装失败

```bash
# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 许可证

UNLICENSED - 商业机密

---

## 👥 开发团队

- **开发者**: 渔晓白
- **邮箱**: yuxiaobai@openclaw.local
- **版本**: v1.0.0

---

## 📞 联系方式

- **官网**: https://www.evcart.com
- **邮箱**: info@evcart.com
- **电话**: 400-XXX-XXXX

---

_专业铸就信任，创新引领未来_
