# API 接口总览

> 版本：v1.0.0  
> 更新日期：2026-03-12

---

## 📋 API 总览

### 接口分类

| 模块 | 接口数 | 说明 |
|-----|--------|------|
| **认证** | 3 | 登录/登出/刷新 Token |
| **CRM** | 20+ | 客户/线索/商机/订单 |
| **售后** | 44 | 工单/网点/合同/备件/投诉 |
| **ERP** | 15+ | 采购/库存/财务 |
| **审批** | 10+ | 审批流程 |
| **消息** | 5+ | 消息通知 |
| **总计** | **100+** | - |

---

## 🔐 认证接口

| 方法 | 路径 | 说明 |
|-----|------|------|
| POST | `/auth/login` | 用户登录 |
| POST | `/auth/logout` | 用户登出 |
| POST | `/auth/refresh` | 刷新 Token |

---

## 📊 CRM 接口

### 客户管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/crm/customers` | 客户列表 |
| POST | `/crm/customers` | 创建客户 |
| GET | `/crm/customers/:id` | 客户详情 |
| PUT | `/crm/customers/:id` | 更新客户 |
| DELETE | `/crm/customers/:id` | 删除客户 |

### 线索管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/crm/leads` | 线索列表 |
| POST | `/crm/leads` | 创建线索 |
| GET | `/crm/leads/:id` | 线索详情 |
| PUT | `/crm/leads/:id` | 更新线索 |
| POST | `/crm/leads/:id/convert` | 线索转化 |

### 商机管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/crm/opportunities` | 商机列表 |
| POST | `/crm/opportunities` | 创建商机 |
| GET | `/crm/opportunities/:id` | 商机详情 |
| PUT | `/crm/opportunities/:id` | 更新商机 |
| POST | `/crm/opportunities/:id/stage` | 阶段推进 |

### 订单管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/crm/orders` | 订单列表 |
| POST | `/crm/orders` | 创建订单 |
| GET | `/crm/orders/:id` | 订单详情 |
| PUT | `/crm/orders/:id` | 更新订单 |

---

## 🔧 售后接口

### 工单管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| POST | `/after-sales/tickets` | 创建工单 |
| GET | `/after-sales/tickets` | 工单列表 |
| GET | `/after-sales/tickets/:id` | 工单详情 |
| POST | `/after-sales/tickets/:id/accept` | 受理工单 |
| POST | `/after-sales/tickets/:id/assign` | 分配工单 |
| POST | `/after-sales/tickets/batch-assign` | 批量分配 |
| POST | `/after-sales/tickets/:id/start` | 开始处理 |
| POST | `/after-sales/tickets/:id/complete` | 完成工单 |
| POST | `/after-sales/tickets/:id/confirm` | 客户确认 |
| GET | `/after-sales/tickets/to-assign` | 待分配工单 |
| GET | `/after-sales/tickets/my` | 我的工单 |

### 服务网点

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/after-sales/centers` | 网点列表 |
| GET | `/after-sales/centers/:id` | 网点详情 |
| POST | `/after-sales/centers` | 创建网点 |
| PUT | `/after-sales/centers/:id` | 更新网点 |
| DELETE | `/after-sales/centers/:id` | 删除网点 |
| GET | `/after-sales/centers/nearby` | 附近网点 |

### 服务合同

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/after-sales/contracts` | 合同列表 |
| GET | `/after-sales/contracts/:id` | 合同详情 |
| POST | `/after-sales/contracts` | 创建合同 |
| PUT | `/after-sales/contracts/:id` | 更新合同 |
| GET | `/after-sales/contracts/expiring` | 到期提醒 |

### 备件管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/after-sales/parts` | 备件列表 |
| GET | `/after-sales/parts/:id` | 备件详情 |
| POST | `/after-sales/parts` | 创建备件 |
| PUT | `/after-sales/parts/:id` | 更新备件 |
| POST | `/after-sales/parts/:id/stock-in` | 入库 |
| POST | `/after-sales/parts/:id/stock-out` | 出库 |
| GET | `/after-sales/parts/low-stock` | 库存预警 |

### 投诉管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/after-sales/complaints` | 投诉列表 |
| GET | `/after-sales/complaints/:id` | 投诉详情 |
| POST | `/after-sales/complaints` | 创建投诉 |
| POST | `/after-sales/complaints/:id/process` | 处理投诉 |
| POST | `/after-sales/complaints/:id/resolve` | 解决投诉 |

### 统计报表

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/after-sales/stats/overview` | 总体统计 |
| GET | `/after-sales/stats/technician` | 人员绩效 |
| GET | `/after-sales/stats/daily` | 每日趋势 |
| GET | `/after-sales/stats/type-distribution` | 类型分布 |
| GET | `/after-sales/stats/satisfaction` | 满意度分布 |
| GET | `/after-sales/stats/response-time` | 响应时间 |
| GET | `/after-sales/stats/report` | 完整报表 |

---

## 📦 ERP 接口

### 采购管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/erp/purchase` | 采购列表 |
| POST | `/erp/purchase` | 创建采购 |
| GET | `/erp/purchase/:id` | 采购详情 |

### 库存管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/erp/inventory` | 库存列表 |
| POST | `/erp/inventory/in` | 入库 |
| POST | `/erp/inventory/out` | 出库 |

### 财务管理

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/erp/finance/overview` | 财务总览 |
| GET | `/erp/finance/receive` | 收款列表 |
| GET | `/erp/finance/pay` | 付款列表 |

---

## ✅ 审批接口

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/approval-flows` | 流程列表 |
| GET | `/approval-flows/:id` | 流程详情 |
| POST | `/approval-flows/:id/submit` | 提交审批 |
| POST | `/approval-flows/:recordId/approve` | 审批操作 |
| GET | `/approval-flows/records/pending` | 待我审批 |
| GET | `/approval-flows/records/my` | 我的审批 |

---

## 💬 消息接口

| 方法 | 路径 | 说明 |
|-----|------|------|
| GET | `/messages` | 消息列表 |
| GET | `/messages/:id` | 消息详情 |
| POST | `/messages/:id/read` | 标记已读 |
| POST | `/messages/read-all` | 全部已读 |

---

## 🔐 权限控制

### 权限检查

```typescript
// 权限装饰器
@CheckPermission('after_sales:ticket:assign')
async assignTicket() {}

// 权限检查函数
const hasPermission = await checkPermission(user, 'after_sales:ticket:view')
```

### 角色权限

| 角色 | 权限范围 |
|-----|---------|
| **admin** | 全部权限 |
| **service_manager** | 售后全部 + 工单分配 |
| **technician** | 我的工单 + 处理 |
| **customer_service** | 工单创建/受理 |
| **sales** | CRM 全部 |

---

## 📚 相关文档

- [API 参考](./API_REFERENCE.md)
- [API 示例](./API_EXAMPLES.md)
- [API 集成](../04-开发指南/API_INTEGRATION.md)

---

_道达智能 · 版权所有_
