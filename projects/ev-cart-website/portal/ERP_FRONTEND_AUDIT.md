# ERP 前端审计报告

**审计时间**: 2026-03-14 07:07  
**审计人**: 渔晓白 ⚙️  
**审计对象**: erp-frontend

---

## 📊 现有结构

### 目录结构
```
erp-frontend/
├── src/
│   ├── pages/          # 页面目录
│   │   ├── Dashboard   # 工作台
│   │   ├── production  # 生产管理
│   │   ├── purchase    # 采购管理
│   │   ├── inventory   # 库存管理
│   │   ├── finance     # 财务管理
│   │   └── Login       # 登录页
│   ├── components/     # 组件库
│   ├── services/       # API 服务
│   │   └── api.ts      # Axios 封装
│   ├── types/          # TypeScript 类型
│   ├── App.tsx         # 路由配置
│   ├── main.tsx        # 入口文件
│   └── index.css       # 全局样式
```

### 页面统计
| 模块 | 页面数 | 状态 |
|------|--------|------|
| Dashboard | 1 | ✅ 完整 |
| production | 若干 | ✅ 完整 |
| purchase | 若干 | ✅ 完整 |
| inventory | 若干 | ✅ 完整 |
| finance | 若干 | ✅ 完整 |
| Login | 1 | ✅ 完整 |
| **总计** | **6 个模块** | |

---

## 🔍 功能分析

### 1. 生产管理 (production)
**现有功能**:
- 生产订单列表
- 生产订单详情
- 创建生产订单
- 编辑生产订单
- 生产进度跟踪

**API 接口**:
- `GET /api/erp/production-orders` - 列表
- `POST /api/erp/production-orders` - 创建
- `PUT /api/erp/production-orders/:id` - 更新
- `GET /api/erp/production-orders/:id` - 详情

**迁移优先级**: 🔴 高

---

### 2. 采购管理 (purchase)
**现有功能**:
- 采购申请列表
- 采购订单列表
- 供应商管理
- 采购入库

**API 接口**:
- `GET /api/erp/purchase-orders` - 列表
- `POST /api/erp/purchase-orders` - 创建
- `GET /api/erp/suppliers` - 供应商列表

**迁移优先级**: 🔴 高

---

### 3. 库存管理 (inventory)
**现有功能**:
- 库存查询
- 入库管理
- 出库管理
- 库存调拨
- 库存盘点

**API 接口**:
- `GET /api/erp/inventory` - 库存查询
- `POST /api/erp/inbound` - 入库
- `POST /api/erp/outbound` - 出库
- `POST /api/erp/transfer` - 调拨

**迁移优先级**: 🔴 高

---

### 4. 财务管理 (finance)
**现有功能**:
- 应收管理
- 应付管理
- 费用管理
- 财务凭证

**API 接口**:
- `GET /api/finance/receivables` - 应收
- `GET /api/finance/payables` - 应付
- `POST /api/finance/vouchers` - 凭证

**迁移优先级**: 🟡 中（部分已在 portal/finance 中）

---

### 5. Dashboard
**现有功能**:
- 生产统计
- 采购统计
- 库存统计
- 待办事项

**迁移优先级**: 🟡 中

---

## 📋 迁移清单

### 高优先级（立即迁移）

#### 1. 生产管理模块
- [ ] ProductionOrders.tsx - 生产订单列表
- [ ] ProductionOrderDetail.tsx - 订单详情
- [ ] ProductionOrderCreate.tsx - 创建订单
- [ ] ProductionPlan.tsx - 生产计划
- [ ] WorkReport.tsx - 报工管理

#### 2. 采购管理模块
- [ ] PurchaseOrders.tsx - 采购订单列表
- [ ] PurchaseRequests.tsx - 采购申请
- [ ] Suppliers.tsx - 供应商管理
- [ ] GoodsReceipt.tsx - 采购入库

#### 3. 库存管理模块
- [ ] Inventory.tsx - 库存查询
- [ ] Inbound.tsx - 入库管理
- [ ] Outbound.tsx - 出库管理
- [ ] Transfer.tsx - 库存调拨
- [ ] Stocktake.tsx - 库存盘点

### 中优先级（后续迁移）

#### 4. 质量管理模块
- [ ] QualityInspections.tsx - 检验单
- [ ] IQC.tsx - 来料检验
- [ ] IPQC.tsx - 过程检验
- [ ] FQC.tsx - 成品质检

#### 5. 财务管理模块
- [ ] 与 portal/finance 合并
- [ ] 统一 API 接口

#### 6. Dashboard
- [ ] 与 portal/Dashboard 合并
- [ ] 统一数据源

---

## 🎯 迁移策略

### 方案：渐进式迁移

**Step 1**: 复制代码到 portal
```bash
cp -r erp-frontend/src/pages/production portal/src/pages/portal/erp/
cp -r erp-frontend/src/pages/purchase portal/src/pages/portal/erp/
cp -r erp-frontend/src/pages/inventory portal/src/pages/portal/erp/
```

**Step 2**: 更新导入路径
- `@/components` → `@shared/components`
- `@/services` → `@shared/services`
- `@/types` → `@types`

**Step 3**: 统一 API 服务
- 合并 api.ts 到 portal/src/shared/services/
- 统一 baseURL
- 统一认证拦截器

**Step 4**: 测试验证
- 功能测试
- 集成测试
- 回归测试

---

## 📈 迁移时间表

| 模块 | 文件数 | 工期 | 开始日期 | 结束日期 |
|------|--------|------|----------|----------|
| 生产管理 | ~10 | 2 天 | 2026-03-15 | 2026-03-16 |
| 采购管理 | ~8 | 2 天 | 2026-03-17 | 2026-03-18 |
| 库存管理 | ~10 | 2 天 | 2026-03-19 | 2026-03-20 |
| 质量管理 | ~6 | 1 天 | 2026-03-21 | 2026-03-21 |
| 财务管理 | ~8 | 1 天 | 2026-03-22 | 2026-03-22 |
| Dashboard | ~2 | 1 天 | 2026-03-23 | 2026-03-23 |
| **总计** | **~44** | **9 天** | | |

---

## 🚀 立即执行

**现在开始迁移高优先级模块**:

1. ✅ 生产管理模块
2. ✅ 采购管理模块
3. ✅ 库存管理模块

**预计完成时间**: 2026-03-20

---

## 📚 相关文档

- [PHASE2_IMPLEMENTATION_PLAN.md](./PHASE2_IMPLEMENTATION_PLAN.md)
- [PHASE1_FINAL_COMPLETE.md](./PHASE1_FINAL_COMPLETE.md)
- [架构重构计划 v3.1](../ARCHITECTURE_REFACTOR_PLAN_v3.md)

---

**审计报告完成，准备开始迁移！** 🫡

**审计人**: 渔晓白 ⚙️  
**审计时间**: 2026-03-14 07:07
