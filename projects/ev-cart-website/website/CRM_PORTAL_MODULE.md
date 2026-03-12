# CRM-官网联动模块开发文档

> 版本：v2.0  
> 公司：四川道达智能车辆制造有限公司  
> 更新时间：2026-03-13  
> 开发者：渔晓白 ⚙️

---

## 📋 模块清单

### 已完成 ✅

| 页面 | 路径 | 说明 | 状态 |
|-----|------|------|------|
| 客户登录 | `/login` | 统一登录入口 | ✅ |
| 客户门户 | `/portal` | 客户Dashboard | ✅ |
| CRM 入口 | `/portal/crm` | CRM 系统入口 | ✅ |
| ERP 入口 | `/portal/erp` | ERP 系统入口 | ✅ |
| 售后入口 | `/portal/service` | 售后管理入口 | ✅ |

### 开发中 📝

| 页面 | 路径 | 说明 | 状态 |
|-----|------|------|------|
| 订单列表 | `/portal/orders` | 我的订单 | 📝 |
| 工单列表 | `/portal/tickets` | 我的工单 | 📝 |
| 个人信息 | `/portal/profile` | 个人信息管理 | 📝 |

---

## 🎨 设计特点

### 登录页面
- ✅ 大疆风格黑色渐变背景
- ✅ 白色卡片悬浮效果
- ✅ 系统入口侧边展示
- ✅ 流畅入场动画

### 客户门户
- ✅ 顶部固定导航
- ✅ 系统入口卡片（3 个）
- ✅ 数据统计卡片（4 个）
- ✅ 最近订单表格
- ✅ 最近工单表格

### 系统入口页面
- ✅ CRM 系统（蓝色主题）
- ✅ ERP 系统（紫色主题）
- ✅ 售后管理（绿色主题）
- ✅ 大图标 + 简洁文字

---

## 🔗 CRM 联动 API

### 认证相关
```typescript
POST /api/v1/auth/login      // 登录
POST /api/v1/auth/logout     // 登出
GET  /api/v1/auth/me         // 获取当前用户
```

### 门户数据
```typescript
GET  /api/v1/portal/stats      // 统计数据
GET  /api/v1/portal/orders     // 订单列表
GET  /api/v1/portal/tickets    // 工单列表
GET  /api/v1/portal/notifications // 通知列表
```

### 客户相关
```typescript
GET  /api/v1/portal/profile    // 个人信息
PUT  /api/v1/portal/profile    // 更新信息
POST /api/v1/portal/password   // 修改密码
```

---

## 🔒 安全策略

### 认证流程
```
官网登录 → CRM 验证 → 返回 Token → 保存本地 → 跳转门户
```

### Token 管理
```typescript
// 保存
localStorage.setItem('access_token', token)
localStorage.setItem('user', JSON.stringify(user))

// 读取
const token = localStorage.getItem('access_token')
const user = JSON.parse(localStorage.getItem('user'))

// 清除（退出登录）
localStorage.removeItem('access_token')
localStorage.removeItem('user')
```

### API 请求拦截
```typescript
// Axios 拦截器
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 📊 页面结构

### 登录页面
```
┌─────────────────────────────────┐
│  ← 返回首页                    │
├─────────────────────────────────┤
│                                 │
│    ┌─────────────┐  ┌────────┐ │
│    │  登录表单   │  │ 系统   │ │
│    │  用户名     │  │ 入口   │ │
│    │  密码       │  │        │ │
│    │  [登录]     │  │ CRM    │ │
│    │             │  │ ERP    │ │
│    │  扫码登录   │  │ 售后   │ │
│    └─────────────┘  └────────┘ │
│                                 │
└─────────────────────────────────┘
```

### 客户门户
```
┌─────────────────────────────────┐
│ Logo  门户 CRM ERP 售后   🔔 👤│
├─────────────────────────────────┤
│                                 │
│ ┌────┐ ┌────┐ ┌────┐          │
│ │CRM │ │ERP │ │售后│          │
│ └────┘ └────┘ └────┘          │
│                                 │
│ 订单  待办  工单  消费          │
│                                 │
│ 最近订单                       │
│ ┌─────────────────────────┐   │
│ │ 订单列表表格            │   │
│ └─────────────────────────┘   │
│                                 │
│ 最近工单                       │
│ ┌─────────────────────────┐   │
│ │ 工单列表表格            │   │
│ └─────────────────────────┘   │
└─────────────────────────────────┘
```

---

## 🚀 开发计划

### Phase 1：入口页面（已完成）✅
- [x] 登录页面
- [x] 客户门户
- [x] CRM 入口
- [x] ERP 入口
- [x] 售后入口

### Phase 2：订单管理（进行中）📝
- [ ] 订单列表
- [ ] 订单详情
- [ ] 订单状态跟踪

### Phase 3：工单管理（进行中）📝
- [ ] 工单列表
- [ ] 工单详情
- [ ] 服务进度

### Phase 4：个人中心（规划中）📝
- [ ] 个人信息
- [ ] 修改密码
- [ ] 消息通知

---

## 📞 联系方式

- **公司**: 四川道达智能车辆制造有限公司
- **官网**: https://www.ddzn.com
- **邮箱**: info@ddzn.com
- **电话**: 400-888-8888

---

Copyright © 2026 四川道达智能车辆制造有限公司。All rights reserved.
