# 售后服务模块开发文档

> 版本：v1.0.0  
> 更新日期：2026-03-12  
> 作者：渔晓白 ⚙️

---

## 📋 目录

1. [模块概述](#模块概述)
2. [功能架构](#功能架构)
3. [页面设计](#页面设计)
4. [API 接口](#api 接口)
5. [数据模型](#数据模型)
6. [交互流程](#交互流程)

---

## 模块概述

### 功能定位

售后服务系统是道达智能 CRM+ERP系统的重要组成模块，提供完整的工单管理、服务网点、服务合同、备件管理和投诉处理功能。

### 核心价值

| 价值 | 说明 |
|-----|------|
| **提升客户满意度** | 快速响应客户服务请求 |
| **提高服务效率** | 智能工单分配和跟踪 |
| **降低服务成本** | 备件库存优化管理 |
| **数据驱动决策** | 完整的服务统计分析 |

---

## 功能架构

### 模块结构

```
售后服务系统
├── 工单管理
│   ├── 工单列表
│   ├── 工单详情
│   ├── 工单分配
│   └── 工单统计
├── 服务网点
│   ├── 网点列表
│   ├── 网点详情
│   └── 网点地图
├── 服务合同
│   ├── 合同列表
│   ├── 合同详情
│   └── 到期提醒
├── 备件管理
│   ├── 备件列表
│   ├── 出入库管理
│   └── 库存预警
├── 投诉管理
│   ├── 投诉列表
│   └── 投诉处理
└── 统计报表
    ├── 总体统计
    ├── 人员绩效
    └── 趋势分析
```

### 角色权限

| 角色 | 工单 | 网点 | 合同 | 备件 | 投诉 | 统计 |
|-----|------|------|------|------|------|------|
| **售后主管** | ✅ 全部 | ✅ 全部 | ✅ 全部 | ✅ 全部 | ✅ 全部 | ✅ 全部 |
| **服务人员** | ✅ 我的 | ❌ | ❌ | ⚠️ 查看 | ❌ | ❌ |
| **客服人员** | ✅ 创建/受理 | ❌ | ❌ | ❌ | ✅ 处理 | ⚠️ 查看 |

---

## 页面设计

### 工单列表页

```
┌─────────────────────────────────────────────────────────┐
│  工单管理                              [新建工单]       │
├─────────────────────────────────────────────────────────┤
│  🔍 搜索  [类型▼] [状态▼] [优先级▼]                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │ GD-20260312-001  [维修] [紧急]                  │   │
│  │ 张三  产品 A  李师傅  03-12 10:30               │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ GD-20260312-002  [安装] [普通]                  │   │
│  │ 李四  产品 B  王师傅  03-12 11:00               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 工单详情页

```
┌─────────────────────────────────────────────────────────┐
│  ← 工单详情                           [完成工单]        │
├─────────────────────────────────────────────────────────┤
│  GD-20260312-001  [维修] [处理中] [紧急]               │
├─────────────────────────────────────────────────────────┤
│  基本信息                                               │
│  客户：张三  138****1234                               │
│  产品：产品 A                                           │
│  问题：设备无法启动                                     │
│  地址：成都市高新区...                                  │
│  师傅：李师傅  138****5678                             │
├─────────────────────────────────────────────────────────┤
│  服务进度                                               │
│  ● 工单创建  03-12 10:30                               │
│  ● 客服受理  03-12 11:00                               │
│  ● 已分配    03-12 14:00  李师傅                       │
│  ○ 服务中                                               │
│  ○ 已完成                                               │
└─────────────────────────────────────────────────────────┘
```

### 工单分配页 (主管)

```
┌─────────────────────────────────────────────────────────┐
│  工单分配 (售后主管)          [批量分配 (2)]            │
├─────────────────────────────────────────────────────────┤
│  ☑ 工单号        类型   优先级  客户    地址     时间   │
├─────────────────────────────────────────────────────────┤
│  ☑ GD-20260312-001 维修  [紧急] 张三  成都    10:30   │
│  ☑ GD-20260312-002 安装  [普通] 李四  重庆    11:00   │
│  ☐ GD-20260312-003 保养  [普通] 王五  绵阳    11:30   │
└─────────────────────────────────────────────────────────┘
```

### 统计报表页

```
┌─────────────────────────────────────────────────────────┐
│  服务统计报表          [日期范围] [最近 30 天▼]           │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ 总工单数  │ │ 完成率   │ │ 平均响应 │ │ 满意度   │  │
│  │ 156      │ │ 85.5%    │ │ 2.5 小时  │ │ 4.6 分   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐ ┌─────────────────────┐      │
│  │  工单趋势 (折线图)   │ │  类型分布 (饼图)     │      │
│  └─────────────────────┘ └─────────────────────┘      │
├─────────────────────────────────────────────────────────┤
│  服务人员绩效                                           │
│  李师傅   50     45     4.8⭐   优秀                   │
│  王师傅   40     35     4.6⭐   良好                   │
└─────────────────────────────────────────────────────────┘
```

---

## API 接口

### 工单管理

| 方法 | 路径 | 说明 | 权限 |
|-----|------|------|------|
| POST | `/after-sales/tickets` | 创建工单 | 客服/主管 |
| GET | `/after-sales/tickets` | 工单列表 | 全部 |
| GET | `/after-sales/tickets/:id` | 工单详情 | 全部 |
| POST | `/after-sales/tickets/:id/accept` | 受理工单 | 客服 |
| POST | `/after-sales/tickets/:id/assign` | 分配工单 | 主管 |
| POST | `/after-sales/tickets/batch-assign` | 批量分配 | 主管 |
| POST | `/after-sales/tickets/:id/start` | 开始处理 | 技术人员 |
| POST | `/after-sales/tickets/:id/complete` | 完成工单 | 技术人员 |
| POST | `/after-sales/tickets/:id/confirm` | 客户确认 | 客户 |
| GET | `/after-sales/tickets/to-assign` | 待分配工单 | 主管 |
| GET | `/after-sales/tickets/my` | 我的工单 | 技术人员 |

### 服务网点

| 方法 | 路径 | 说明 | 权限 |
|-----|------|------|------|
| GET | `/after-sales/centers` | 网点列表 | 全部 |
| GET | `/after-sales/centers/:id` | 网点详情 | 全部 |
| POST | `/after-sales/centers` | 创建网点 | 主管 |
| PUT | `/after-sales/centers/:id` | 更新网点 | 主管 |
| DELETE | `/after-sales/centers/:id` | 删除网点 | 主管 |
| GET | `/after-sales/centers/nearby` | 附近网点 | 全部 |

### 服务合同

| 方法 | 路径 | 说明 | 权限 |
|-----|------|------|------|
| GET | `/after-sales/contracts` | 合同列表 | 全部 |
| GET | `/after-sales/contracts/:id` | 合同详情 | 全部 |
| POST | `/after-sales/contracts` | 创建合同 | 主管 |
| PUT | `/after-sales/contracts/:id` | 更新合同 | 主管 |
| GET | `/after-sales/contracts/expiring` | 到期提醒 | 全部 |

### 备件管理

| 方法 | 路径 | 说明 | 权限 |
|-----|------|------|------|
| GET | `/after-sales/parts` | 备件列表 | 全部 |
| GET | `/after-sales/parts/:id` | 备件详情 | 全部 |
| POST | `/after-sales/parts` | 创建备件 | 主管 |
| PUT | `/after-sales/parts/:id` | 更新备件 | 主管 |
| POST | `/after-sales/parts/:id/stock-in` | 入库 | 库管 |
| POST | `/after-sales/parts/:id/stock-out` | 出库 | 库管 |
| GET | `/after-sales/parts/low-stock` | 库存预警 | 全部 |

### 投诉管理

| 方法 | 路径 | 说明 | 权限 |
|-----|------|------|------|
| GET | `/after-sales/complaints` | 投诉列表 | 全部 |
| GET | `/after-sales/complaints/:id` | 投诉详情 | 全部 |
| POST | `/after-sales/complaints` | 创建投诉 | 客户/客服 |
| POST | `/after-sales/complaints/:id/process` | 处理投诉 | 客服/主管 |
| POST | `/after-sales/complaints/:id/resolve` | 解决投诉 | 客服/主管 |

### 统计报表

| 方法 | 路径 | 说明 | 权限 |
|-----|------|------|------|
| GET | `/after-sales/stats/overview` | 总体统计 | 主管 |
| GET | `/after-sales/stats/technician` | 人员绩效 | 主管 |
| GET | `/after-sales/stats/daily` | 每日趋势 | 主管 |
| GET | `/after-sales/stats/type-distribution` | 类型分布 | 主管 |
| GET | `/after-sales/stats/satisfaction` | 满意度分布 | 主管 |
| GET | `/after-sales/stats/response-time` | 响应时间 | 主管 |
| GET | `/after-sales/stats/report` | 完整报表 | 主管 |

---

## 数据模型

### 工单 (ServiceTicket)

```typescript
interface ServiceTicket {
  id: string
  ticketNo: string              // 工单号
  type: TicketType              // 类型
  status: TicketStatus          // 状态
  priority: Priority            // 优先级
  customerId: string            // 客户 ID
  customerName: string          // 客户名称
  customerPhone: string         // 客户电话
  productId?: string            // 产品 ID
  productName: string           // 产品名称
  problemDescription: string    // 问题描述
  serviceAddress: string        // 服务地址
  technicianId?: string         // 技术人员 ID
  technicianName?: string       // 技术人员名称
  solution?: string             // 解决方案
  satisfaction?: number         // 满意度 (1-5)
  createdAt: string             // 创建时间
  acceptedAt?: string           // 受理时间
  assignedAt?: string           // 分配时间
  completedAt?: string          // 完成时间
}
```

### 服务网点 (ServiceCenter)

```typescript
interface ServiceCenter {
  id: string
  name: string                  // 网点名称
  type: CenterType              // 类型 (自营/授权)
  province: string              // 省份
  city: string                  // 城市
  address: string               // 详细地址
  phone: string                 // 联系电话
  manager: string               // 负责人
  longitude: number             // 经度
  latitude: number              // 纬度
  technicianCount: number       // 技术人员数量
}
```

### 服务合同 (ServiceContract)

```typescript
interface ServiceContract {
  id: string
  contractNo: string            // 合同编号
  type: ContractType            // 类型
  status: ContractStatus        // 状态
  customerId: string            // 客户 ID
  customerName: string          // 客户名称
  productId?: string            // 产品 ID
  productName: string           // 产品名称
  startDate: string             // 开始日期
  endDate: string               // 结束日期
  contractAmount: number        // 合同金额
}
```

### 备件 (ServicePart)

```typescript
interface ServicePart {
  id: string
  partNo: string                // 备件编号
  name: string                  // 备件名称
  stockQuantity: number         // 库存数量
  safetyStock: number           // 安全库存
  unit: string                  // 单位
  unitPrice: number             // 单价
  warehouseLocation: string     // 库位
}
```

---

## 交互流程

### 工单处理流程

```
客户申请服务
    ↓
创建工单 (pending)
    ↓
客服受理 (accepted)
    ↓
主管分配 (assigned)
    ↓
技术人员处理 (processing)
    ↓
完成服务 (waiting_confirm)
    ↓
客户确认 (closed)
    ↓
服务评价
```

### 工单状态流转

```typescript
// 状态定义
type TicketStatus =
  | 'pending'         // 待受理
  | 'accepted'        // 已受理
  | 'assigned'        // 已分配
  | 'processing'      // 处理中
  | 'waiting_confirm' // 待确认
  | 'completed'       // 已完成
  | 'closed'          // 已关闭
  | 'cancelled'       // 已取消

// 状态流转
pending → accepted → assigned → processing → waiting_confirm → completed → closed
```

### 权限控制

```typescript
// 工单权限检查
const permissions = {
  view: ['admin', 'service_manager', 'technician', 'customer_service'],
  create: ['admin', 'service_manager', 'customer_service'],
  assign: ['admin', 'service_manager'],
  process: ['admin', 'technician'],
  complete: ['admin', 'technician'],
  close: ['admin', 'service_manager', 'customer_service'],
}
```

---

## 🦞 开发者

**渔晓白** ⚙️ - AI 系统构建者

**文档版本**: v1.0.0  
**最后更新**: 2026-03-12  

---

_道达智能 · 版权所有_
