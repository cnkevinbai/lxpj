# 部门权限与移动端支持说明

> 四川道达智能官网 + CRM 系统  
> 完成日期：2026-03-11  
> 版本：v1.0.0

---

## 📊 部门自动判定功能

### 登录判定逻辑

```
用户登录
  ↓
验证账号密码
  ↓
获取用户信息 (包含 department 字段)
  ↓
根据 department 自动判定业务类型
  ↓
department = 'domestic' → 内贸业务界面
department = 'foreign' → 外贸业务界面
  ↓
返回对应的业务界面
```

### 用户实体字段

| 字段 | 类型 | 说明 |
|-----|------|------|
| department | string | 'domestic' (内贸) 或 'foreign' (外贸) |
| role | string | admin, manager, sales, support |
| businessType | string | 自动判定 (domestic/foreign) |

### 登录响应

```json
{
  "accessToken": "xxx",
  "refreshToken": "xxx",
  "user": {
    "id": "uuid",
    "username": "销售员 A",
    "email": "sales@example.com",
    "role": "sales",
    "department": "foreign",
    "businessType": "foreign" // 自动判定
  }
}
```

---

## 📱 移动端支持

### 内贸移动端

| 页面 | 路由 | 状态 |
|-----|------|------|
| 内贸仪表盘 | /crm/mobile | ✅ |
| 线索录入 | /crm/leads/create | ✅ |
| 客户录入 | /crm/customers/create | ✅ |
| 跟进记录 | /crm/follow-up/:type/:id | ✅ |

### 外贸移动端

| 页面 | 路由 | 状态 |
|-----|------|------|
| 外贸仪表盘 | /crm/foreign-mobile | ✅ |
| 外贸线索录入 | /crm/foreign-leads/create | ✅ |
| 外贸询盘录入 | /crm/foreign-inquiries/create | ✅ |
| WhatsApp 联系 | https://wa.me/ | ✅ |

---

## 🔐 权限管理面板

### 权限实体

| 字段 | 说明 |
|-----|------|
| name | 权限名称 (如：customer.create) |
| description | 权限描述 |
| module | 所属模块 |
| action | 操作类型 (create/read/update/delete) |
| businessType | 业务类型 (domestic/foreign/both) |

### 权限控制逻辑

```
用户请求
  ↓
获取用户角色和部门
  ↓
查询用户权限列表
  ↓
检查是否有对应权限
  ↓
有权限 → 允许操作
无权限 → 拒绝操作
```

### 权限分配规则

| 角色 | 权限范围 |
|-----|---------|
| admin | 所有权限 |
| manager | 创建/查看/编辑 |
| sales | 查看/编辑自己的 |
| support | 查看 |

### 业务类型权限

| 业务类型 | 说明 |
|---------|------|
| domestic | 只能访问内贸模块 |
| foreign | 只能访问外贸模块 |
| both | 可以访问所有模块 |

---

## 🔌 API 接口

### 认证相关

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/auth/login` | POST | 用户登录 (自动判定部门) |
| `/auth/register` | POST | 用户注册 |
| `/auth/refresh` | POST | 刷新 Token |

### 权限相关

| 接口 | 方法 | 说明 |
|-----|------|------|
| `/permissions` | GET | 获取所有权限 |
| `/permissions/user/:userId` | GET | 获取用户权限 |
| `/permissions/check` | GET | 检查权限 |
| `/permissions` | POST | 创建权限 |

---

## ✅ 功能检查清单

### 部门自动判定
- [x] 用户实体 department 字段
- [x] 登录时自动判定业务类型
- [x] 返回 businessType 字段
- [x] 前端根据 businessType 路由

### 移动端支持
- [x] 内贸移动端仪表盘
- [x] 外贸移动端仪表盘
- [x] 移动端线索录入
- [x] 移动端客户录入
- [x] WhatsApp 集成

### 权限管理
- [x] 权限实体
- [x] 权限服务
- [x] 权限控制器
- [x] 权限管理面板
- [x] 权限检查接口

### 路由控制
- [x] 根据部门自动重定向
- [x] 内贸路由
- [x] 外贸路由
- [x] 通用路由

---

## 📈 使用场景

### 场景 1：内贸业务员登录

1. 内贸业务员输入账号密码
2. 系统验证通过
3. 检测到 department = 'domestic'
4. 自动设置 businessType = 'domestic'
5. 重定向到内贸仪表盘
6. 显示内贸相关功能

### 场景 2：外贸业务员登录

1. 外贸业务员输入账号密码
2. 系统验证通过
3. 检测到 department = 'foreign'
4. 自动设置 businessType = 'foreign'
5. 重定向到外贸仪表盘
6. 显示外贸相关功能

### 场景 3：管理员登录

1. 管理员输入账号密码
2. 系统验证通过
3. role = 'admin'
4. 拥有所有权限
5. 可以查看内贸和外贸所有数据

---

## 🎯 总结

**部门权限功能完善度**: **100%** ✅

- ✅ 登录自动判定部门
- ✅ 移动端内外贸支持
- ✅ 权限管理面板
- ✅ 权限检查接口
- ✅ 路由自动控制

**可以立即投入使用！**

---

_四川道达智能车辆制造有限公司 · 版权所有_
