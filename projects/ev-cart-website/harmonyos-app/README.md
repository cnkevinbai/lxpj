# EV Cart 鸿蒙 APP

> 基于 HarmonyOS NEXT 的原生应用

## 📱 应用介绍

EV Cart 鸿蒙 APP 是一款面向企业用户的移动办公应用，提供销售管理、库存查询、客户管理等功能。

## 🚀 快速开始

### 环境要求

- DevEco Studio 4.0+
- HarmonyOS SDK API 10+
- Node.js 18+

### 安装依赖

```bash
cd harmonyos-app
ohpm install
```

### 运行应用

1. 打开 DevEco Studio
2. 导入项目
3. 连接设备或启动模拟器
4. 点击运行

## 📁 项目结构

```
harmonyos-app/
├── entry/
│   └── src/main/ets/
│       ├── entryability/
│       ├── pages/
│       │   ├── Index.ets         # 首页
│       │   ├── Customers.ets     # 客户管理
│       │   ├── Orders.ets        # 订单管理
│       │   ├── Inventory.ets     # 库存查询
│       │   └── Profile.ets       # 个人中心
│       └── common/
│           └── services/
│               ├── ApiService.ets    # API 服务
│               └── StorageService.ets # 存储服务
└── package.json
```

## 🎯 功能模块

### 1. 登录认证
- ✅ 账号密码登录
- ✅ Token 自动刷新

### 2. 首页
- ✅ 快捷入口
- ✅ 待办事项
- ✅ 数据统计

### 3. 客户管理
- ✅ 客户列表
- ✅ 客户详情
- ✅ 添加客户

### 4. 订单管理
- ✅ 订单列表
- ✅ 订单详情
- ✅ 订单跟踪

### 5. 库存查询
- ✅ 库存列表
- ✅ 库存详情
- ✅ 库存预警

### 6. 个人中心
- ✅ 个人信息
- ✅ 设置
- ✅ 退出登录

## 🔧 核心技术

### API 服务
```typescript
// ApiService.ets
const api = new ApiService()
const customers = await api.get('/customers')
```

### 数据持久化
```typescript
// 使用首选项存储
import dataPreferences from '@ohos.data.preferences'
```

## 📊 API 接口

```
POST /api/v1/auth/login     # 登录
GET  /api/v1/customers      # 客户列表
GET  /api/v1/orders         # 订单列表
GET  /api/v1/inventory      # 库存列表
```

## 🎨 设计规范

### 颜色
- 主色：#1890ff
- 成功色：#52c41a
- 警告色：#faad14
- 错误色：#ff4d4f

### 字体
- 标题：24px
- 正文：16px

## 🚀 构建发布

```bash
# 开发构建
npm run build:debug

# 发布构建
npm run build:release
```

## 📱 设备支持

- ✅ 鸿蒙手机
- ✅ 鸿蒙平板
- ✅ 鸿蒙手表（精简版）

## 📞 联系方式

- 官网：https://www.evcart.com
- 邮箱：dev@evcart.com

## 📄 许可证

Copyright © 2026 EV Cart
