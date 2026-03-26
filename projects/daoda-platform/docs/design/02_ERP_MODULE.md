# ERP模块设计文档

> **版本**: v1.0  
> **设计日期**: 2026-03-17  
> **所属系统**: 道达智能数字化平台  
> **设计理念**: 模块化 · 热插拔 · 标准化 · 可扩展

---

## 📋 文档目录

1. [国内主流ERP对比](#一国内主流erp对比分析)
2. [功能模块设计](#二功能模块设计)
3. [栏目规划](#三栏目规划)
4. [热插拔架构](#四热插拔架构设计)
5. [接口规范](#五接口规范)
6. [数据模型](#六数据模型)

---

# 一、国内主流ERP对比分析

## 1.1 用友 U8/NC Cloud

### 核心优势

```
┌─────────────────────────────────────────────────────────────────┐
│                      用友 U8/NC Cloud                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ 本地化程度最高                                              │
│     • 专为中国企业设计                                          │
│     • 完全符合中国会计准则                                      │
│     • 税务对接完善（金税系统直连）                              │
│     • 发票管理全套（开票、收票、认证）                          │
│                                                                 │
│  ✅ 财务模块成熟                                                │
│     • 财务软件起家，30年积累                                    │
│     • 总账、报表、固定资产完善                                   │
│     • 多组织财务合并                                            │
│     • 预算管理全面                                              │
│     • 成本核算精细                                              │
│                                                                 │
│  ✅ 服务网络完善                                                │
│     • 全国200+ 分支机构                                         │
│     • 本地化服务响应快                                          │
│     • 实施团队庞大                                              │
│     • 培训资源丰富                                              │
│                                                                 │
│  ✅ 政企市场占有率高                                            │
│     • 国企、央企首选                                            │
│     • 政府项目经验丰富                                          │
│     • 信创适配完善                                              │
│                                                                 │
│  ✅ 行业解决方案多                                              │
│     • 制造业、零售、政务、金融                                  │
│     • 行业版本丰富                                              │
│                                                                 │
│  【采纳要点】                                                    │
│  • 本地化财务模块设计                                           │
│  • 税务集成方案                                                 │
│  • 多组织架构支持                                               │
│  • 预算管理体系                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 功能架构

```
用友NC Cloud 功能架构
├── 财务会计
│   ├── 总账管理
│   ├── 报表管理
│   ├── 固定资产
│   ├── 应收应付
│   ├── 现金管理
│   └── 费用管理
├── 供应链
│   ├── 采购管理
│   ├── 销售管理
│   ├── 库存管理
│   ├── 存货核算
│   └── 合同管理
├── 生产制造
│   ├── 物料清单(BOM)
│   ├── 生产计划
│   ├── 车间管理
│   └── 质量管理
├── 人力资源
│   ├── 薪资管理
│   ├── 考勤管理
│   ├── 绩效管理
│   └── 招聘管理
└── 集团财务
    ├── 合并报表
    ├── 预算管理
    ├── 资金管理
    └── 成本管理
```

---

## 1.2 金蝶 K/3 Cloud / 苍穹

### 核心优势

```
┌─────────────────────────────────────────────────────────────────┐
│                    金蝶 K/3 Cloud / 苍穹                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ 云原生架构领先                                              │
│     • 国内最早云原生ERP                                         │
│     • 微服务架构                                                │
│     • 容器化部署                                                │
│     • 弹性扩展                                                  │
│     • 自动运维                                                  │
│                                                                 │
│  ✅ 财务专业性                                                  │
│     • 财务软件起家                                              │
│     • 会计准则支持完善                                          │
│     • 合并报表强大                                              │
│     • 成本核算精细                                              │
│                                                                 │
│  ✅ 中小企业友好                                                │
│     • 价格适中                                                  │
│     • 模块化购买                                                │
│     • 实施周期短                                                │
│     • 快速上线                                                  │
│                                                                 │
│  ✅ 移动端优先                                                  │
│     • 移动APP功能完善                                           │
│     • 企业微信集成                                              │
│     • 钉钉集成                                                  │
│     • 移动审批                                                  │
│                                                                 │
│  ✅ 低代码平台                                                  │
│     • 苍穹PaaS平台                                              │
│     • 可视化开发                                                │
│     • 快速定制                                                  │
│                                                                 │
│  【采纳要点】                                                    │
│  • 云原生微服务架构                                             │
│  • 移动端优先设计                                               │
│  • 低代码扩展能力                                               │
│  • 模块化购买策略                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 技术架构

```
金蝶苍穹技术架构
├── 前端层
│   ├── 移动APP
│   ├── Web门户
│   ├── 企业微信
│   └── 钉钉应用
├── 服务层
│   ├── API Gateway
│   ├── 微服务集群
│   ├── 消息队列
│   └── 任务调度
├── 平台层
│   ├── 低代码平台
│   ├── 流程引擎
│   ├── 规则引擎
│   └── 报表引擎
├── 数据层
│   ├── 关系数据库
│   ├── 缓存
│   ├── 搜索引擎
│   └── 对象存储
└── 运维层
    ├── 容器编排(K8s)
    ├── 监控告警
    ├── 日志中心
    └── CI/CD
```

---

## 1.3 鼎捷 T100 / 易助

### 核心优势

```
┌─────────────────────────────────────────────────────────────────┐
│                    鼎捷 T100 / 易助                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ 制造业深耕                                                  │
│     • 专注制造业40年                                            │
│     • 制造业功能最深入                                          │
│     • 生产管理精细化                                            │
│     • 车间管理专业                                              │
│                                                                 │
│  ✅ 生产管理细化                                                │
│     • BOM管理完善                                               │
│     • 工艺路线详细                                              │
│     • 生产排程精细                                              │
│     • 物料需求计划(MRP)成熟                                     │
│     • 车间作业管理                                              │
│                                                                 │
│  ✅ 行业版本丰富                                                │
│     • 电子、机械、汽配、五金                                    │
│     • 塑胶、模具、家具                                          │
│     • 行业深度解决方案                                          │
│                                                                 │
│  ✅ 实施经验丰富                                                │
│     • 大量制造业案例                                            │
│     • 实施方法论成熟                                            │
│     • 行业顾问专业                                              │
│                                                                 │
│  【采纳要点】                                                    │
│  • BOM多版本管理                                                │
│  • MRP计算引擎                                                  │
│  • 工艺路线管理                                                 │
│  • 车间作业管理                                                 │
│  • 行业模板化                                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 制造模块架构

```
鼎捷制造模块架构
├── 基础数据
│   ├── 物料主档
│   ├── BOM管理
│   │   ├── 标准BOM
│   │   ├── 订单BOM
│   │   ├── 工程变更(ECN)
│   │   └── BOM版本管理
│   ├── 工艺路线
│   │   ├── 标准工艺
│   │   ├── 替代工艺
│   │   └── 工序定义
│   └── 工作中心
│       ├── 产能定义
│       └── 成本中心
├── 计划管理
│   ├── 主生产计划(MPS)
│   ├── 物料需求计划(MRP)
│   │   ├── MRP运算
│   │   ├── 供需分析
│   │   └── 计划订单
│   └── 产能需求计划(CRP)
├── 生产执行
│   ├── 生产工单
│   │   ├── 工单下达
│   │   ├── 领料管理
│   │   ├── 生产汇报
│   │   └── 完工入库
│   └── 车间管理
│       ├── 派工单
│       ├── 工序汇报
│       └── 进度跟踪
└── 质量管理
    ├── 来料检验(IQC)
    ├── 过程检验(IPQC)
    ├── 成品检验(FQC)
    └── 不良处理
```

---

## 1.4 最佳实践总结

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERP系统设计最佳实践                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【架构设计】                                                    │
│                                                                 │
│  从金蝶学习:                                                     │
│  ✅ 云原生微服务架构                                            │
│  ✅ 前后端分离                                                  │
│  ✅ 容器化部署                                                  │
│  ✅ 弹性扩展                                                    │
│                                                                 │
│  【财务模块】                                                    │
│                                                                 │
│  从用友学习:                                                     │
│  ✅ 本地化财务（中国会计准则）                                  │
│  ✅ 税务集成（金税对接）                                        │
│  ✅ 发票管理（开票/收票/认证）                                  │
│  ✅ 多组织财务合并                                              │
│  ✅ 预算管理                                                    │
│                                                                 │
│  【生产制造】                                                    │
│                                                                 │
│  从鼎捷学习:                                                     │
│  ✅ BOM多版本管理                                               │
│  ✅ MRP计算引擎                                                 │
│  ✅ 工艺路线管理                                                │
│  ✅ 车间作业管理                                                │
│  ✅ 工序级跟踪                                                  │
│                                                                 │
│  【用户体验】                                                    │
│                                                                 │
│  从金蝶学习:                                                     │
│  ✅ 移动端优先                                                  │
│  ✅ 企业微信/钉钉集成                                           │
│  ✅ 移动审批                                                    │
│                                                                 │
│  【扩展能力】                                                    │
│                                                                 │
│  从金蝶苍穹学习:                                                 │
│  ✅ 低代码平台                                                  │
│  ✅ 可视化开发                                                  │
│  ✅ 插件生态                                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# 二、功能模块设计

## 2.1 ERP模块总览

```
道达ERP模块架构
├── 核心模块（必需）
│   ├── 基础数据管理
│   ├── 采购管理
│   ├── 销售管理
│   ├── 库存管理
│   └── 财务管理
├── 扩展模块（可选）
│   ├── 生产管理
│   ├── 质量管理
│   ├── 设备管理
│   └── 供应商管理
└── 高级模块（增值）
    ├── 成本管理
    ├── 预算管理
    ├── 合并报表
    └── 智能分析
```

---

## 2.2 基础数据管理模块

### 功能清单

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 物料主数据 | 物料编码、名称、规格、单位、分类 | P0 |
| 物料分类管理 | 分类树、分类属性 | P0 |
| 计量单位管理 | 基本单位、换算单位 | P0 |
| 仓库管理 | 仓库、库位、库区 | P0 |
| 供应商主数据 | 供应商编码、名称、分类、资质 | P0 |
| 客户主数据 | 客户编码、名称、分类、信用 | P0 |
| 部门管理 | 组织架构、部门信息 | P0 |
| 人员管理 | 员工信息、岗位信息 | P1 |
| 币种汇率 | 币种、汇率管理 | P1 |
| 结算方式 | 结算方式、付款条件 | P1 |
| 价目表管理 | 采购价目表、销售价目表 | P1 |

### 物料主数据设计

```typescript
// 物料主数据实体
interface MaterialMaster {
  // 基本信息组
  id: string;                    // 主键
  code: string;                  // 物料编码（唯一）
  name: string;                  // 物料名称
  specification: string;         // 规格型号
  model: string;                 // 型号
  barcode: string;               // 条形码
  
  // 分类信息组
  categoryId: string;            // 分类ID
  categoryPath: string;          // 分类路径（如：原材料.钢材.钢板）
  
  // 计量信息组
  baseUnitId: string;            // 基本单位ID
  baseUnitName: string;          // 基本单位名称
  purchaseUnitId: string;        // 采购单位ID
  purchaseUnitRatio: number;     // 采购单位换算率
  salesUnitId: string;           // 销售单位ID
  salesUnitRatio: number;        // 销售单位换算率
  stockUnitId: string;           // 库存单位ID
  stockUnitRatio: number;        // 库存单位换算率
  
  // 管理属性组
  materialType: MaterialType;    // 物料类型（原材料/半成品/成品/耗材/服务）
  materialAttribute: MaterialAttribute; // 物料属性（自制/外购/委外/虚拟）
  batchManaged: boolean;         // 是否批次管理
  serialManaged: boolean;        // 是否序列号管理
  shelfLifeDays: number;         // 保质期（天）
  
  // 计划属性组
  planningMethod: PlanningMethod; // 计划方法（MRP/MPS/无）
  safetyStock: number;           // 安全库存
  minOrderQty: number;           // 最小订货量
  maxOrderQty: number;           // 最大订货量
  orderMultiple: number;         // 订货倍量
  leadTime: number;              // 提前期（天）
  
  // 成本属性组
  costMethod: CostMethod;        // 计价方法（移动平均/标准成本/先进先出）
  standardCost: number;          // 标准成本
  referenceCost: number;         // 参考成本
  
  // 采购属性组
  purchaseLeadTime: number;      // 采购提前期
  defaultSupplierId: string;     // 默认供应商
  purchasePrice: number;         // 参考采购价
  
  // 销售属性组
  saleable: boolean;             // 是否可销售
  salesPrice: number;            // 参考销售价
  minSalesPrice: number;         // 最低销售价
  
  // 库存属性组
  stockable: boolean;            // 是否库存管理
  defaultWarehouseId: string;    // 默认仓库
  defaultLocationId: string;     // 默认库位
  
  // 状态信息
  status: DataStatus;            // 状态（草稿/已审核/已禁用）
  createdAt: Date;               // 创建时间
  updatedAt: Date;               // 更新时间
  createdBy: string;             // 创建人
  updatedBy: string;             // 更新人
  approvedAt: Date;              // 审核时间
  approvedBy: string;            // 审核人
  
  // 扩展字段（JSON存储动态属性）
  extendedAttributes: Record<string, any>;
}

// 物料类型枚举
enum MaterialType {
  RAW_MATERIAL = 'RAW_MATERIAL',     // 原材料
  SEMI_FINISHED = 'SEMI_FINISHED',   // 半成品
  FINISHED_GOODS = 'FINISHED_GOODS', // 成品
  CONSUMABLE = 'CONSUMABLE',         // 耗材
  SERVICE = 'SERVICE',               // 服务
  PACKAGING = 'PACKAGING',           // 包装材料
}

// 物料属性枚举
enum MaterialAttribute {
  MAKE = 'MAKE',       // 自制
  BUY = 'BUY',         // 外购
  OUTSOURCE = 'OUTSOURCE', // 委外
  VIRTUAL = 'VIRTUAL', // 虚拟件
}

// 计划方法枚举
enum PlanningMethod {
  MRP = 'MRP',  // 物料需求计划
  MPS = 'MPS',  // 主生产计划
  NONE = 'NONE' // 不参与计划
}

// 计价方法枚举
enum CostMethod {
  MOVING_AVERAGE = 'MOVING_AVERAGE', // 移动平均
  STANDARD = 'STANDARD',             // 标准成本
  FIFO = 'FIFO',                     // 先进先出
  WEIGHTED_AVERAGE = 'WEIGHTED_AVERAGE', // 月末加权平均
}
```

---

## 2.3 采购管理模块

### 功能清单

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 采购申请 | 需求部门提出采购需求 | P0 |
| 采购订单 | 采购订单创建、审批、下达 | P0 |
| 采购收货 | 收货入库、质检 | P0 |
| 采购退货 | 退货给供应商 | P1 |
| 采购发票 | 发票登记、核销 | P0 |
| 付款管理 | 付款申请、付款执行 | P1 |
| 供应商管理 | 供应商档案、评估 | P0 |
| 采购价格管理 | 价格协议、价目表 | P1 |

### 采购流程设计

```
采购业务流程
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  采购申请   │───>│  采购订单   │───>│  采购收货   │
│  (PR)      │    │  (PO)       │    │  (GRN)     │
└─────────────┘    └─────────────┘    └─────────────┘
      │                  │                  │
      │                  │                  ▼
      │                  │           ┌─────────────┐
      │                  │           │  质量检验   │
      │                  │           │  (QC)      │
      │                  │           └─────────────┘
      │                  │                  │
      │                  │                  ▼
      │                  │           ┌─────────────┐
      │                  │           │  入库单     │
      │                  │           │  (STK-IN)  │
      │                  │           └─────────────┘
      │                  │                  │
      │                  ▼                  ▼
      │           ┌─────────────┐    ┌─────────────┐
      │           │  采购发票   │<───│  应付单     │
      │           │  (INV)      │    │  (AP)      │
      │           └─────────────┘    └─────────────┘
      │                  │                  │
      │                  ▼                  ▼
      │           ┌─────────────┐    ┌─────────────┐
      │           │  发票核销   │    │  付款单     │
      │           │  (MATCH)   │    │  (PAY)     │
      │           └─────────────┘    └─────────────┘
      │
      └──────────────────────────────────────────────┘
                    数据来源追溯
```

### 采购订单实体设计

```typescript
// 采购订单实体
interface PurchaseOrder {
  // 单据信息
  id: string;                    // 主键
  orderNo: string;               // 订单编号
  orderDate: Date;               // 订单日期
  orderType: PurchaseOrderType;  // 订单类型
  
  // 供应商信息
  supplierId: string;            // 供应商ID
  supplierCode: string;          // 供应商编码
  supplierName: string;          // 供应商名称
  
  // 组织信息
  companyId: string;             // 公司ID
  departmentId: string;          // 部门ID
  buyerId: string;               // 采购员ID
  buyerName: string;             // 采购员姓名
  
  // 交货信息
  deliveryAddress: string;       // 交货地址
  deliveryContact: string;       // 收货联系人
  deliveryPhone: string;         // 联系电话
  
  // 币种汇率
  currencyId: string;            // 币种ID
  exchangeRate: number;          // 汇率
  
  // 结算信息
  paymentTermId: string;         // 付款条件ID
  settlementTypeId: string;      // 结算方式ID
  
  // 金额汇总
  totalQty: number;              // 总数量
  totalAmount: number;           // 总金额（原币）
  totalAmountLocal: number;      // 总金额（本位币）
  taxAmount: number;             // 税额
  discountAmount: number;        // 折扣金额
  
  // 状态信息
  status: PurchaseOrderStatus;   // 订单状态
  approvalStatus: ApprovalStatus; // 审批状态
  
  // 审核信息
  approvedAt: Date;              // 审核时间
  approvedBy: string;            // 审核人
  
  // 关联信息
  prId: string;                  // 关联采购申请ID
  contractId: string;            // 关联合同ID
  
  // 明细行
  lines: PurchaseOrderLine[];
  
  // 系统字段
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  remarks: string;
  attachments: string[];
}

// 采购订单明细
interface PurchaseOrderLine {
  id: string;
  lineNo: number;                // 行号
  materialId: string;            // 物料ID
  materialCode: string;          // 物料编码
  materialName: string;          // 物料名称
  specification: string;         // 规格型号
  unitId: string;                // 单位ID
  unitName: string;              // 单位名称
  
  qty: number;                   // 订货数量
  receivedQty: number;           // 已收数量
  returnedQty: number;           // 退货数量
  pendingQty: number;            // 待收数量
  
  unitPrice: number;             // 单价（原币）
  taxRate: number;               // 税率
  taxAmount: number;             // 税额
  lineAmount: number;            // 行金额
  discountRate: number;          // 折扣率
  discountAmount: number;        // 折扣金额
  
  deliveryDate: Date;            // 交货日期
  warehouseId: string;           // 仓库ID
  locationId: string;            // 库位ID
  
  prLineId: string;              // 关联采购申请行ID
  
  status: LineStatus;            // 行状态
  remarks: string;
}

// 采购订单类型
enum PurchaseOrderType {
  STANDARD = 'STANDARD',         // 标准采购
  CONSIGNMENT = 'CONSIGNMENT',   // 寄售采购
  RETURN = 'RETURN',             // 退货采购
  SERVICE = 'SERVICE',           // 服务采购
}

// 采购订单状态
enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',               // 草稿
  CONFIRMED = 'CONFIRMED',       // 已确认
  PARTIAL_RECEIVED = 'PARTIAL_RECEIVED', // 部分收货
  FULLY_RECEIVED = 'FULLY_RECEIVED', // 全部收货
  CLOSED = 'CLOSED',             // 已关闭
  CANCELLED = 'CANCELLED',       // 已取消
}
```

---

## 2.4 库存管理模块

### 功能清单

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 入库管理 | 采购入库、生产入库、其他入库 | P0 |
| 出库管理 | 销售出库、生产领料、其他出库 | P0 |
| 库存查询 | 实时库存、批次库存、库位库存 | P0 |
| 库存调拨 | 仓库间调拨、库位间调拨 | P0 |
| 库存盘点 | 盘点计划、盘点作业、盘盈盘亏 | P1 |
| 库存预警 | 安全库存、保质期、呆滞库存 | P1 |
| 批次管理 | 批次追溯、批次属性 | P1 |
| 序列号管理 | 序列号入库、出库、查询 | P1 |

### 库存事务类型

```typescript
// 库存事务类型
enum StockTransactionType {
  // 入库类型
  PURCHASE_RECEIPT = 'PURCHASE_RECEIPT',     // 采购入库
  PRODUCTION_RECEIPT = 'PRODUCTION_RECEIPT', // 生产入库
  RETURN_FROM_CUSTOMER = 'RETURN_FROM_CUSTOMER', // 销售退货
  TRANSFER_RECEIPT = 'TRANSFER_RECEIPT',     // 调拨入库
  OTHER_RECEIPT = 'OTHER_RECEIPT',           // 其他入库
  
  // 出库类型
  SALES_ISSUE = 'SALES_ISSUE',               // 销售出库
  PRODUCTION_ISSUE = 'PRODUCTION_ISSUE',     // 生产领料
  RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER', // 采购退货
  TRANSFER_ISSUE = 'TRANSFER_ISSUE',         // 调拨出库
  OTHER_ISSUE = 'OTHER_ISSUE',               // 其他出库
  
  // 调整类型
  INVENTORY_ADJUSTMENT = 'INVENTORY_ADJUSTMENT', // 库存调整
  CYCLE_COUNT_ADJUST = 'CYCLE_COUNT_ADJUST', // 盘点调整
}

// 库存事务记录
interface StockTransaction {
  id: string;
  transactionNo: string;         // 事务编号
  transactionType: StockTransactionType; // 事务类型
  transactionDate: Date;         // 事务日期
  
  // 物料信息
  materialId: string;
  materialCode: string;
  materialName: string;
  
  // 批次/序列号
  batchNo: string;               // 批号
  serialNo: string;              // 序列号
  
  // 仓库信息
  warehouseId: string;
  warehouseCode: string;
  locationId: string;
  locationCode: string;
  
  // 数量信息
  qty: number;                   // 事务数量（正数入库，负数出库）
  unitId: string;
  unitName: string;
  
  // 成本信息
  unitCost: number;              // 单位成本
  totalCost: number;             // 总成本
  
  // 关联单据
  sourceType: string;            // 来源单据类型
  sourceId: string;              // 来源单据ID
  sourceLineId: string;          // 来源单据行ID
  sourceNo: string;              // 来源单据号
  
  // 库存状态
  stockStatus: StockStatus;      // 库存状态
  
  // 组织信息
  companyId: string;
  
  // 系统字段
  createdAt: Date;
  createdBy: string;
  remarks: string;
}

// 库存状态
enum StockStatus {
  AVAILABLE = 'AVAILABLE',       // 可用
  RESERVED = 'RESERVED',         // 预留
  INSPECTING = 'INSPECTING',     // 检验中
  FROZEN = 'FROZEN',             // 冻结
  DEFECTIVE = 'DEFECTIVE',       // 不良品
}
```

### 库存余额设计

```typescript
// 库存余额（实时库存）
interface StockBalance {
  id: string;
  
  // 维度信息
  materialId: string;            // 物料ID
  warehouseId: string;           // 仓库ID
  locationId: string;            // 库位ID
  batchNo: string;               // 批号
  stockStatus: StockStatus;      // 库存状态
  
  // 数量信息
  qty: number;                   // 库存数量
  availableQty: number;          // 可用数量
  reservedQty: number;           // 预留数量
  inspectingQty: number;         // 检验中数量
  frozenQty: number;             // 冻结数量
  
  // 成本信息
  unitCost: number;              // 单位成本
  totalCost: number;             // 总成本
  
  // 批次信息
  productionDate: Date;          // 生产日期
  expiryDate: Date;              // 有效期
  
  // 最后事务
  lastTransactionDate: Date;     // 最后事务日期
  lastTransactionNo: string;     // 最后事务编号
  
  // 系统字段
  companyId: string;
  updatedAt: Date;
}

// 库存查询视图
interface StockQueryView {
  // 物料信息
  materialId: string;
  materialCode: string;
  materialName: string;
  specification: string;
  baseUnitId: string;
  baseUnitName: string;
  
  // 分类信息
  categoryId: string;
  categoryName: string;
  
  // 仓库信息
  warehouseId: string;
  warehouseCode: string;
  warehouseName: string;
  
  // 汇总数量
  totalQty: number;              // 总数量
  availableQty: number;          // 可用数量
  reservedQty: number;           // 预留数量
  
  // 成本
  totalCost: number;             // 总成本
  
  // 预警
  safetyStock: number;           // 安全库存
  isLowStock: boolean;           // 是否低库存
}
```

---

## 2.5 销售管理模块

### 功能清单

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 销售报价 | 报价单管理、审批 | P1 |
| 销售订单 | 订单创建、审批、变更 | P0 |
| 销售发货 | 发货单、出库 | P0 |
| 销售退货 | 退货申请、退货入库 | P1 |
| 销售发票 | 开票申请、发票管理 | P0 |
| 收款管理 | 收款登记、核销 | P1 |
| 客户管理 | 客户档案、信用管理 | P0 |
| 销售价格管理 | 价格策略、价目表 | P1 |

### 销售订单实体设计

```typescript
// 销售订单实体
interface SalesOrder {
  // 单据信息
  id: string;
  orderNo: string;               // 订单编号
  orderDate: Date;               // 订单日期
  orderType: SalesOrderType;     // 订单类型
  
  // 客户信息
  customerId: string;            // 客户ID
  customerCode: string;          // 客户编码
  customerName: string;          // 客户名称
  
  // 收货信息
  shipToAddress: string;         // 收货地址
  shipToContact: string;         // 收货联系人
  shipToPhone: string;           // 联系电话
  
  // 开票信息
  billToAddress: string;         // 开票地址
  invoiceTitle: string;          // 发票抬头
  taxNo: string;                 // 税号
  
  // 组织信息
  companyId: string;
  departmentId: string;
  salesPersonId: string;         // 销售员ID
  salesPersonName: string;       // 销售员姓名
  
  // 币种汇率
  currencyId: string;
  exchangeRate: number;
  
  // 结算信息
  paymentTermId: string;         // 付款条件
  settlementTypeId: string;      // 结算方式
  
  // 金额汇总
  totalQty: number;
  totalAmount: number;           // 原币金额
  totalAmountLocal: number;      // 本位币金额
  taxAmount: number;
  discountAmount: number;
  
  // 状态信息
  status: SalesOrderStatus;
  approvalStatus: ApprovalStatus;
  
  // 明细行
  lines: SalesOrderLine[];
  
  // 系统字段
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  approvedAt: Date;
  approvedBy: string;
  remarks: string;
}

// 销售订单明细
interface SalesOrderLine {
  id: string;
  lineNo: number;
  materialId: string;
  materialCode: string;
  materialName: string;
  specification: string;
  unitId: string;
  unitName: string;
  
  qty: number;                   // 订货数量
  shippedQty: number;            // 已发货数量
  returnedQty: number;           // 退货数量
  pendingQty: number;            // 待发货数量
  
  unitPrice: number;             // 单价
  taxRate: number;               // 税率
  taxAmount: number;             // 税额
  lineAmount: number;            // 行金额
  discountRate: number;          // 折扣率
  discountAmount: number;        // 折扣金额
  
  plannedShipDate: Date;         // 计划发货日期
  actualShipDate: Date;          // 实际发货日期
  warehouseId: string;           // 仓库ID
  
  status: LineStatus;
  remarks: string;
}

// 销售订单状态
enum SalesOrderStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  PARTIAL_SHIPPED = 'PARTIAL_SHIPPED',
  FULLY_SHIPPED = 'FULLY_SHIPPED',
  INVOICED = 'INVOICED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}
```

---

## 2.6 财务管理模块

### 功能清单

| 功能 | 说明 | 优先级 |
|------|------|--------|
| 总账管理 | 科目、凭证、账簿、报表 | P0 |
| 应收管理 | 应收账款、收款核销 | P0 |
| 应付管理 | 应付账款、付款核销 | P0 |
| 固定资产 | 资产登记、折旧、处置 | P1 |
| 费用管理 | 费用申请、报销、分摊 | P1 |
| 成本管理 | 成本核算、成本分析 | P2 |
| 预算管理 | 预算编制、控制、分析 | P2 |
| 发票管理 | 发票开具、收取、认证 | P0 |

### 会计凭证设计

```typescript
// 会计凭证
interface AccountingVoucher {
  id: string;
  voucherNo: string;             // 凭证字号
  voucherDate: Date;             // 凭证日期
  accountingPeriod: string;      // 会计期间 (YYYY-MM)
  
  voucherType: string;           // 凭证字（记/收/付/转）
  voucherSeq: number;            // 凭证号
  
  companyId: string;             // 账套ID
  
  // 摘要
  description: string;           // 摘要
  
  // 金额
  totalDebit: number;            // 借方合计
  totalCredit: number;           // 贷方合计
  
  // 来源
  sourceType: string;            // 来源类型
  sourceId: string;              // 来源ID
  sourceNo: string;              // 来源单号
  
  // 状态
  status: VoucherStatus;
  
  // 审核
  approvedAt: Date;
  approvedBy: string;
  
  // 分录
  entries: VoucherEntry[];
  
  // 系统字段
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

// 凭证分录
interface VoucherEntry {
  id: string;
  lineNo: number;
  
  // 科目
  accountId: string;             // 科目ID
  accountCode: string;           // 科目编码
  accountName: string;           // 科目名称
  
  // 辅助核算
  auxiliaryItems: AuxiliaryItem[]; // 辅助核算项
  
  // 币种
  currencyId: string;
  exchangeRate: number;
  
  // 金额
  debit: number;                 // 借方金额
  credit: number;                // 贷方金额
  originalAmount: number;        // 原币金额
  
  // 数量
  qty: number;                   // 数量
  unitPrice: number;             // 单价
  
  // 摘要
  description: string;
  
  // 结算
  settlementNo: string;          // 结算号
  settlementDate: Date;          // 结算日期
}

// 辅助核算项
interface AuxiliaryItem {
  type: string;                  // 核算类型（客户/供应商/部门/项目/人员）
  typeId: string;                // 核算项ID
  typeCode: string;              // 核算项编码
  typeName: string;              // 核算项名称
}

// 凭证状态
enum VoucherStatus {
  DRAFT = 'DRAFT',               // 草稿
  APPROVED = 'APPROVED',         // 已审核
  POSTED = 'POSTED',             // 已过账
  REVERSED = 'REVERSED',         // 已冲销
}
```

---

# 三、栏目规划

## 3.1 门户菜单结构

```
运营中心 (ERP)
├── 基础数据
│   ├── 物料管理
│   │   ├── 物料主档
│   │   ├── 物料分类
│   │   ├── 计量单位
│   │   └── 条码管理
│   ├── 仓库管理
│   │   ├── 仓库设置
│   │   ├── 库位管理
│   │   └── 库存预警
│   ├── 供应商管理
│   │   ├── 供应商档案
│   │   ├── 供应商评估
│   │   └── 供应商分类
│   └── 价格管理
│       ├── 采购价目表
│       ├── 销售价目表
│       └── 价格协议
├── 采购管理
│   ├── 采购申请
│   │   ├── 申请单列表
│   │   └── 我的申请
│   ├── 采购订单
│   │   ├── 订单列表
│   │   ├── 订单审批
│   │   └── 订单跟踪
│   ├── 采购收货
│   │   ├── 收货通知
│   │   ├── 收货入库
│   │   └── 收货查询
│   ├── 采购发票
│   │   ├── 发票登记
│   │   ├── 发票核销
│   │   └── 发票查询
│   └── 采购分析
│       ├── 采购统计
│       ├── 供应商分析
│       └── 价格分析
├── 库存管理
│   ├── 入库管理
│   │   ├── 采购入库
│   │   ├── 生产入库
│   │   └── 其他入库
│   ├── 出库管理
│   │   ├── 销售出库
│   │   ├── 生产领料
│   │   └── 其他出库
│   ├── 库存查询
│   │   ├── 实时库存
│   │   ├── 批次库存
│   │   └── 库存明细账
│   ├── 库存作业
│   │   ├── 库存调拨
│   │   ├── 库存盘点
│   │   └── 库存调整
│   └── 库存分析
│       ├── 库存周转
│       ├── 呆滞库存
│       └── 库存成本
├── 销售管理
│   ├── 销售报价
│   │   ├── 报价单
│   │   └── 报价审批
│   ├── 销售订单
│   │   ├── 订单列表
│   │   ├── 订单审批
│   │   └── 订单跟踪
│   ├── 销售发货
│   │   ├── 发货通知
│   │   ├── 发货出库
│   │   └── 发货查询
│   ├── 销售发票
│   │   ├── 开票申请
│   │   ├── 发票管理
│   │   └── 发票查询
│   └── 销售分析
│       ├── 销售统计
│       ├── 客户分析
│       └── 销售排名
└── 财务管理
    ├── 总账管理
    │   ├── 会计科目
    │   ├── 凭证管理
    │   ├── 账簿查询
    │   └── 财务报表
    ├── 应收管理
    │   ├── 应收账款
    │   ├── 收款管理
    │   └── 账龄分析
    ├── 应付管理
    │   ├── 应付账款
    │   ├── 付款管理
    │   └── 账龄分析
    ├── 发票管理
    │   ├── 开票管理
    │   ├── 收票管理
    │   └── 发票认证
    └── 财务分析
        ├── 资金分析
        ├── 成本分析
        └── 利润分析
```

---

## 3.2 页面功能矩阵

### 物料主档页面

| 区域 | 功能 | 说明 |
|------|------|------|
| 搜索栏 | 快速搜索 | 物料编码/名称/规格模糊搜索 |
| 筛选区 | 高级筛选 | 分类、类型、状态等多条件筛选 |
| 工具栏 | 操作按钮 | 新增、导入、导出、批量操作 |
| 列表区 | 数据表格 | 支持排序、分页、列自定义 |
| 详情区 | 滑出面板 | 物料详细信息、编辑、审核 |

### 采购订单页面

| 区域 | 功能 | 说明 |
|------|------|------|
| 头部 | 单据信息 | 订单号、日期、供应商、状态 |
| 明细 | 物料列表 | 物料、数量、单价、金额、状态 |
| 底部 | 金额汇总 | 总数量、总金额、税额 |
| 审批 | 审批流程 | 审批历史、当前审批人 |
| 操作 | 功能按钮 | 保存、提交、审批、打印 |

---

# 四、热插拔架构设计

## 4.1 模块化架构原则

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERP模块化架构                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【设计原则】                                                    │
│                                                                 │
│  1. 高内聚低耦合                                                │
│     • 模块内部功能高度聚合                                      │
│     • 模块间通过标准接口通信                                    │
│     • 避免循环依赖                                              │
│                                                                 │
│  2. 独立部署                                                    │
│     • 每个模块可独立部署                                        │
│     • 支持灰度发布                                              │
│     • 故障隔离                                                  │
│                                                                 │
│  3. 配置驱动                                                    │
│     • 功能开关通过配置控制                                      │
│     • 业务规则可配置                                            │
│     • 界面布局可配置                                            │
│                                                                 │
│  4. 标准接口                                                    │
│     • 统一的API规范                                             │
│     • 标准的数据模型                                            │
│     • 规范的事件机制                                            │
│                                                                 │
│  5. 扩展优先                                                    │
│     • 预留扩展点                                                │
│     • 插件化扩展                                                │
│     • 低代码定制                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 4.2 模块依赖关系

```
模块依赖图

                    ┌──────────────┐
                    │   平台核心    │
                    │  (Platform)  │
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌──────────────┐┌──────────────┐┌──────────────┐
    │   基础数据    ││   工作流     ││   权限管理    │
    │  (Master)    ││  (Workflow)  ││  (Auth)      │
    └──────┬───────┘└──────┬───────┘└──────┬───────┘
           │               │               │
           └───────────────┼───────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   采购管理    │    │   库存管理    │    │   销售管理    │
│  (Purchase)  │◄──►│   (Stock)    │◄──►│   (Sales)    │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   财务管理    │
                    │  (Finance)   │
                    └──────────────┘
```

## 4.3 模块注册机制

```typescript
// 模块注册接口
interface ERPModule {
  // 模块元数据
  id: string;                    // 模块ID
  name: string;                  // 模块名称
  version: string;               // 版本号
  description: string;           // 描述
  
  // 依赖
  dependencies: ModuleDependency[]; // 依赖模块
  
  // 功能注册
  entities: EntityDefinition[];  // 数据实体
  services: ServiceDefinition[]; // 服务接口
  controllers: ControllerDefinition[]; // 控制器
  menus: MenuDefinition[];       // 菜单项
  routes: RouteDefinition[];     // 路由
  
  // 生命周期钩子
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  onUpgrade?: (from: string, to: string) => Promise<void>;
}

// 模块依赖
interface ModuleDependency {
  moduleId: string;              // 依赖模块ID
  version: string;               // 版本要求（semver格式）
  required: boolean;             // 是否必需
}

// 模块注册器
class ModuleRegistry {
  private modules: Map<string, ERPModule> = new Map();
  private enabledModules: Set<string> = new Set();
  
  // 注册模块
  register(module: ERPModule): void;
  
  // 注销模块
  unregister(moduleId: string): void;
  
  // 启用模块
  enable(moduleId: string): Promise<void>;
  
  // 禁用模块
  disable(moduleId: string): Promise<void>;
  
  // 获取模块
  getModule(moduleId: string): ERPModule | undefined;
  
  // 获取所有已启用模块
  getEnabledModules(): ERPModule[];
  
  // 检查依赖
  checkDependencies(moduleId: string): DependencyCheckResult;
}

// 模块配置
interface ModuleConfig {
  moduleId: string;
  enabled: boolean;
  settings: Record<string, any>;
  permissions: PermissionDefinition[];
}
```

## 4.4 插件化扩展

```typescript
// 扩展点定义
interface ExtensionPoint {
  id: string;                    // 扩展点ID
  name: string;                  // 扩展点名称
  type: ExtensionType;           // 扩展点类型
  description: string;           // 描述
}

// 扩展点类型
enum ExtensionType {
  ENTITY = 'ENTITY',             // 实体扩展
  SERVICE = 'SERVICE',           // 服务扩展
  CONTROLLER = 'CONTROLLER',     // 控制器扩展
  MENU = 'MENU',                 // 菜单扩展
  ROUTE = 'ROUTE',               // 路由扩展
  WORKFLOW = 'WORKFLOW',         // 工作流扩展
  REPORT = 'REPORT',             // 报表扩展
  UI = 'UI',                     // UI扩展
}

// 插件定义
interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  
  // 扩展点实现
  extensions: Extension[];
  
  // 生命周期
  onLoad?: () => Promise<void>;
  onUnload?: () => Promise<void>;
}

// 扩展定义
interface Extension {
  extensionPointId: string;      // 扩展点ID
  implementation: any;           // 实现
  priority: number;              // 优先级
  condition?: (context: any) => boolean; // 条件
}
```

### 实体扩展示例

```typescript
// 扩展物料主数据
const materialExtension: Extension = {
  extensionPointId: 'entity.material',
  implementation: {
    // 扩展字段
    fields: [
      { name: 'vehicleModel', type: 'string', label: '适用车型' },
      { name: 'vehicleBrand', type: 'string', label: '车辆品牌' },
      { name: 'partNumber', type: 'string', label: '零件号' },
    ],
    // 扩展校验
    validators: [
      {
        name: 'vehicleInfoValidator',
        validate: (material: MaterialMaster) => {
          if (material.materialType === 'FINISHED_GOODS') {
            return !!material.extendedAttributes.vehicleModel;
          }
          return true;
        }
      }
    ],
    // 扩展事件处理
    handlers: {
      beforeCreate: async (material: MaterialMaster) => {
        // 创建前处理
      },
      afterCreate: async (material: MaterialMaster) => {
        // 创建后处理
      }
    }
  },
  priority: 100
};
```

---

# 五、接口规范

## 5.1 RESTful API 规范

### URL规范

```
基础URL: /api/v1/erp

资源命名规则：
- 使用名词复数形式
- 使用小写字母和连字符
- 层级关系用路径表示

示例：
GET    /api/v1/erp/materials              # 物料列表
GET    /api/v1/erp/materials/:id          # 物料详情
POST   /api/v1/erp/materials              # 创建物料
PUT    /api/v1/erp/materials/:id          # 更新物料
DELETE /api/v1/erp/materials/:id          # 删除物料

GET    /api/v1/erp/purchase-orders        # 采购订单列表
GET    /api/v1/erp/purchase-orders/:id    # 采购订单详情
GET    /api/v1/erp/purchase-orders/:id/lines  # 订单明细
POST   /api/v1/erp/purchase-orders/:id/approve # 审批订单
```

### 请求格式

```typescript
// 查询参数
interface QueryParams {
  // 分页
  page?: number;                 // 页码（从1开始）
  pageSize?: number;             // 每页条数（默认20，最大100）
  
  // 排序
  sortField?: string;            // 排序字段
  sortOrder?: 'asc' | 'desc';    // 排序方向
  
  // 筛选
  filter?: string;               // 筛选条件（JSON格式）
  
  // 搜索
  keyword?: string;              // 关键词搜索
  
  // 字段
  fields?: string;               // 返回字段（逗号分隔）
}

// 筛选条件格式
interface FilterCondition {
  field: string;                 // 字段名
  operator: FilterOperator;      // 操作符
  value: any;                    // 值
}

// 筛选操作符
enum FilterOperator {
  EQ = 'eq',                     // 等于
  NE = 'ne',                     // 不等于
  GT = 'gt',                     // 大于
  GE = 'ge',                     // 大于等于
  LT = 'lt',                     // 小于
  LE = 'le',                     // 小于等于
  LIKE = 'like',                 // 模糊匹配
  IN = 'in',                     // 包含
  NOT_IN = 'not_in',             // 不包含
  BETWEEN = 'between',           // 区间
  IS_NULL = 'is_null',           // 为空
  IS_NOT_NULL = 'is_not_null',   // 不为空
}
```

### 响应格式

```typescript
// 成功响应
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

// 分页响应
interface PageResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}

// 错误响应
interface ErrorResponse {
  success: false;
  error: {
    code: string;                // 错误码
    message: string;             // 错误消息
    details?: ErrorDetail[];     // 详细错误
  };
  timestamp: string;
}

// 错误详情
interface ErrorDetail {
  field: string;                 // 字段
  message: string;               // 错误消息
  value?: any;                   // 当前值
}
```

## 5.2 业务API示例

### 物料管理API

```yaml
# 物料列表
GET /api/v1/erp/materials
参数:
  - page: 页码
  - pageSize: 每页条数
  - keyword: 关键词
  - categoryId: 分类ID
  - materialType: 物料类型
  - status: 状态
响应:
  - data: 物料列表
  - pagination: 分页信息

# 物料详情
GET /api/v1/erp/materials/:id
响应:
  - data: 物料完整信息

# 创建物料
POST /api/v1/erp/materials
请求体:
  - code: 物料编码
  - name: 物料名称
  - categoryId: 分类ID
  - materialType: 物料类型
  - baseUnitId: 基本单位
  - ...其他字段
响应:
  - data: 创建的物料

# 更新物料
PUT /api/v1/erp/materials/:id
请求体: 需要更新的字段
响应:
  - data: 更新后的物料

# 审核物料
POST /api/v1/erp/materials/:id/approve
响应:
  - data: 审核结果

# 批量导入
POST /api/v1/erp/materials/import
请求体: multipart/form-data
  - file: Excel文件
响应:
  - data: 导入结果

# 导出
GET /api/v1/erp/materials/export
参数:
  - ids: 物料ID列表（可选）
  - filter: 筛选条件
响应: Excel文件下载
```

### 采购订单API

```yaml
# 采购订单列表
GET /api/v1/erp/purchase-orders

# 采购订单详情
GET /api/v1/erp/purchase-orders/:id

# 创建采购订单
POST /api/v1/erp/purchase-orders
请求体:
  - supplierId: 供应商ID
  - orderDate: 订单日期
  - lines: 订单明细数组
    - materialId: 物料ID
    - qty: 数量
    - unitPrice: 单价
    - deliveryDate: 交货日期

# 提交审批
POST /api/v1/erp/purchase-orders/:id/submit

# 审批通过
POST /api/v1/erp/purchase-orders/:id/approve

# 审批拒绝
POST /api/v1/erp/purchase-orders/:id/reject
请求体:
  - reason: 拒绝原因

# 关闭订单
POST /api/v1/erp/purchase-orders/:id/close

# 取消订单
POST /api/v1/erp/purchase-orders/:id/cancel
```

## 5.3 事件规范

```typescript
// 事件定义
interface DomainEvent {
  eventId: string;               // 事件ID
  eventType: string;             // 事件类型
  eventTime: Date;               // 事件时间
  source: string;                // 事件源（模块）
  payload: any;                  // 事件数据
  metadata: {                    // 元数据
    correlationId: string;       // 关联ID
    causationId: string;         // 因果ID
    userId: string;              // 操作用户
    companyId: string;           // 公司ID
  };
}

// ERP事件类型
enum ERPEventType {
  // 物料事件
  MATERIAL_CREATED = 'material.created',
  MATERIAL_UPDATED = 'material.updated',
  MATERIAL_APPROVED = 'material.approved',
  MATERIAL_DELETED = 'material.deleted',
  
  // 采购事件
  PURCHASE_ORDER_CREATED = 'purchase_order.created',
  PURCHASE_ORDER_SUBMITTED = 'purchase_order.submitted',
  PURCHASE_ORDER_APPROVED = 'purchase_order.approved',
  PURCHASE_ORDER_REJECTED = 'purchase_order.rejected',
  PURCHASE_ORDER_RECEIVED = 'purchase_order.received',
  
  // 库存事件
  STOCK_TRANSACTION_CREATED = 'stock_transaction.created',
  STOCK_LOW_ALERT = 'stock.low_alert',
  STOCK_EXPIRY_ALERT = 'stock.expiry_alert',
  
  // 销售事件
  SALES_ORDER_CREATED = 'sales_order.created',
  SALES_ORDER_SHIPPED = 'sales_order.shipped',
  SALES_ORDER_INVOICED = 'sales_order.invoiced',
}

// 事件订阅
interface EventSubscription {
  eventType: string;             // 订阅的事件类型
  handler: (event: DomainEvent) => Promise<void>; // 处理函数
  filter?: (event: DomainEvent) => boolean; // 过滤条件
  retryPolicy?: RetryPolicy;     // 重试策略
}
```

---

# 六、数据模型

## 6.1 核心实体关系图

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    物料主档   │     │    供应商    │     │     客户     │
│   Material   │     │   Supplier   │     │   Customer   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   采购订单   │     │   采购发票   │     │   销售订单   │
│PurchaseOrder │◄───►│PurchaseInvoice│    │ SalesOrder   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   入库单     │     │   应付单     │     │   出库单     │
│  StockIn     │     │  Payable     │     │  StockOut    │
└──────┬───────┘     └──────────────┘     └──────────────┘
       │
       │
       ▼
┌──────────────┐
│   库存余额   │
│ StockBalance │
└──────────────┘
```

## 6.2 数据库表设计

### 物料主档表 (erp_material)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| code | VARCHAR(50) | 物料编码（唯一） |
| name | VARCHAR(200) | 物料名称 |
| specification | VARCHAR(200) | 规格型号 |
| category_id | UUID | 分类ID |
| material_type | VARCHAR(20) | 物料类型 |
| base_unit_id | UUID | 基本单位ID |
| status | VARCHAR(20) | 状态 |
| ... | ... | 其他字段 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |
| created_by | UUID | 创建人 |
| updated_by | UUID | 更新人 |

### 采购订单表 (erp_purchase_order)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| order_no | VARCHAR(50) | 订单编号（唯一） |
| order_date | DATE | 订单日期 |
| supplier_id | UUID | 供应商ID |
| company_id | UUID | 公司ID |
| department_id | UUID | 部门ID |
| currency_id | VARCHAR(10) | 币种 |
| exchange_rate | DECIMAL(18,6) | 汇率 |
| total_amount | DECIMAL(18,2) | 总金额 |
| status | VARCHAR(20) | 状态 |
| ... | ... | 其他字段 |

### 库存事务表 (erp_stock_transaction)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| transaction_no | VARCHAR(50) | 事务编号 |
| transaction_type | VARCHAR(30) | 事务类型 |
| transaction_date | DATE | 事务日期 |
| material_id | UUID | 物料ID |
| warehouse_id | UUID | 仓库ID |
| location_id | UUID | 库位ID |
| batch_no | VARCHAR(50) | 批号 |
| qty | DECIMAL(18,4) | 数量（正/负） |
| unit_cost | DECIMAL(18,6) | 单位成本 |
| source_type | VARCHAR(50) | 来源类型 |
| source_id | UUID | 来源ID |
| ... | ... | 其他字段 |

---

# 七、模块化实现

## 7.1 模块定义 (module.json)

```json
{
  "id": "@daoda/erp",
  "name": "ERP企业资源计划",
  "version": "1.0.0",
  "description": "企业资源计划模块，包含采购、库存、销售、财务、生产等核心功能",
  "author": "道达智能",
  "license": "MIT",
  
  "dependencies": {
    "core": ">=1.0.0 <2.0.0",
    "modules": {
      "@daoda/system": "^1.0.0"
    }
  },
  
  "optionalDependencies": {
    "@daoda/crm": "^1.0.0",
    "@daoda/mes": "^1.0.0"
  },
  
  "type": "business",
  "domain": "erp",
  "tags": ["ERP", "采购", "库存", "销售", "财务"],
  
  "main": "./dist/backend/index.js",
  "frontend": "./dist/frontend/index.js",
  "migrations": "./dist/migrations",
  
  "provides": {
    "routes": [
      { "path": "/erp/purchase", "module": "purchase" },
      { "path": "/erp/inventory", "module": "inventory" },
      { "path": "/erp/sales", "module": "sales" },
      { "path": "/erp/finance", "module": "finance" },
      { "path": "/erp/production", "module": "production" }
    ],
    "models": [
      "Material", "Supplier", "Customer", "Warehouse",
      "PurchaseOrder", "PurchaseInvoice", "SalesOrder", "SalesInvoice",
      "StockIn", "StockOut", "StockTransfer", "Inventory"
    ],
    "services": [
      "MaterialService", "SupplierService", "WarehouseService",
      "PurchaseService", "InventoryService", "SalesService", "FinanceService"
    ],
    "events": [
      "erp.material.created",
      "erp.purchase.order.created",
      "erp.purchase.order.approved",
      "erp.inventory.stock.in",
      "erp.inventory.stock.out",
      "erp.inventory.stock.warning",
      "erp.sales.order.created"
    ],
    "permissions": [
      { "id": "erp:material:view", "name": "查看物料" },
      { "id": "erp:material:create", "name": "创建物料" },
      { "id": "erp:material:edit", "name": "编辑物料" },
      { "id": "erp:material:delete", "name": "删除物料" },
      { "id": "erp:purchase:view", "name": "查看采购" },
      { "id": "erp:purchase:create", "name": "创建采购订单" },
      { "id": "erp:purchase:approve", "name": "审批采购订单" },
      { "id": "erp:inventory:view", "name": "查看库存" },
      { "id": "erp:inventory:adjust", "name": "库存调整" }
    ]
  },
  
  "consumes": {
    "services": ["UserService", "DeptService", "FileService"],
    "events": ["user.created", "customer.created"]
  },
  
  "hotUpdate": {
    "enabled": true,
    "strategy": "rolling",
    "requireRestart": false,
    "migrationStrategy": "auto"
  },
  
  "subModules": [
    {
      "id": "erp.purchase",
      "name": "采购管理",
      "required": false,
      "dependencies": ["erp.material", "erp.supplier"]
    },
    {
      "id": "erp.inventory",
      "name": "库存管理",
      "required": true,
      "dependencies": ["erp.material", "erp.warehouse"]
    },
    {
      "id": "erp.sales",
      "name": "销售管理",
      "required": false,
      "dependencies": ["erp.material", "erp.customer"]
    },
    {
      "id": "erp.finance",
      "name": "财务管理",
      "required": false,
      "dependencies": []
    },
    {
      "id": "erp.production",
      "name": "生产管理",
      "required": false,
      "dependencies": ["erp.material", "erp.inventory"]
    }
  ]
}
```

## 7.2 模块类实现

```typescript
/**
 * ERP模块主类
 * 实现 BaseModule 接口，支持热插拔
 */
import { BaseModule, ModuleContext, ModuleStatus } from '@daoda/core';
import { PurchaseModule } from './submodules/purchase';
import { InventoryModule } from './submodules/inventory';
import { SalesModule } from './submodules/sales';
import { FinanceModule } from './submodules/finance';
import { ProductionModule } from './submodules/production';

export class ERPModule extends BaseModule {
  readonly id = '@daoda/erp';
  readonly name = 'ERP企业资源计划';
  readonly version = '1.0.0';
  
  // 子模块
  private subModules: Map<string, BaseModule> = new Map();
  
  // 模块状态
  protected _status: ModuleStatus = 'installed';
  
  /**
   * 安装钩子
   */
  async onInstall(context: ModuleContext): Promise<void> {
    context.logger.info(`Installing ${this.name}...`);
    
    // 1. 运行数据库迁移
    await this.runMigrations('up');
    
    // 2. 初始化基础数据
    await this.initBaseData(context);
    
    // 3. 注册权限
    await this.registerPermissions(context);
    
    context.logger.info(`${this.name} installed successfully`);
  }
  
  /**
   * 卸载钩子
   */
  async onUninstall(context: ModuleContext): Promise<void> {
    context.logger.info(`Uninstalling ${this.name}...`);
    
    // 1. 检查是否有关联数据
    const hasData = await this.checkRelatedData(context);
    if (hasData) {
      throw new Error('模块存在关联数据，请先清理数据后再卸载');
    }
    
    // 2. 回滚数据库迁移
    await this.runMigrations('down');
    
    // 3. 移除权限
    await this.unregisterPermissions(context);
    
    context.logger.info(`${this.name} uninstalled successfully`);
  }
  
  /**
   * 加载钩子
   */
  async onLoad(context: ModuleContext): Promise<void> {
    context.logger.info(`Loading ${this.name}...`);
    
    this.context = context;
    this._status = 'loaded';
    
    // 1. 注册服务
    await this.registerServices(context);
    
    // 2. 加载配置
    await this.loadConfig(context);
    
    // 3. 初始化子模块
    await this.initSubModules(context);
    
    context.logger.info(`${this.name} loaded successfully`);
  }
  
  /**
   * 卸载钩子
   */
  async onUnload(context: ModuleContext): Promise<void> {
    context.logger.info(`Unloading ${this.name}...`);
    
    // 1. 卸载子模块
    await this.unloadSubModules(context);
    
    // 2. 清理服务注册
    context.serviceRegistry.unregisterAll(this.id);
    
    // 3. 清理缓存
    await context.cache.clear(`module:${this.id}:*`);
    
    this._status = 'installed';
    context.logger.info(`${this.name} unloaded successfully`);
  }
  
  /**
   * 启用钩子
   */
  async onEnable(context: ModuleContext): Promise<void> {
    context.logger.info(`Enabling ${this.name}...`);
    
    // 1. 注册API路由
    await this.registerRoutes(context);
    
    // 2. 注册菜单
    await this.registerMenus(context);
    
    // 3. 启动事件订阅
    await this.startEventSubscriptions(context);
    
    // 4. 启用子模块
    await this.enableSubModules(context);
    
    this._status = 'running';
    
    // 发布模块启用事件
    context.eventBus.emit('module.enabled', { moduleId: this.id });
    
    context.logger.info(`${this.name} enabled successfully`);
  }
  
  /**
   * 禁用钩子
   */
  async onDisable(context: ModuleContext): Promise<void> {
    context.logger.info(`Disabling ${this.name}...`);
    
    // 1. 禁用子模块
    await this.disableSubModules(context);
    
    // 2. 注销路由
    context.router.unregisterAll(this.id);
    
    // 3. 注销菜单
    context.menuRegistry.unregisterAll(this.id);
    
    // 4. 停止事件订阅
    context.eventBus.clearModuleSubscriptions(this.id);
    
    this._status = 'disabled';
    
    // 发布模块禁用事件
    context.eventBus.emit('module.disabled', { moduleId: this.id });
    
    context.logger.info(`${this.name} disabled successfully`);
  }
  
  /**
   * 更新前钩子
   */
  async onBeforeUpdate(context: ModuleContext, newVersion: string): Promise<void> {
    context.logger.info(`Preparing update ${this.name} to ${newVersion}...`);
    
    // 1. 保存模块状态
    await this.saveModuleState(context);
    
    // 2. 备份数据
    await this.backupModuleData(context);
    
    // 3. 禁用模块
    if (this._status === 'running') {
      await this.onDisable(context);
    }
    
    // 4. 卸载模块
    await this.onUnload(context);
  }
  
  /**
   * 更新后钩子
   */
  async onAfterUpdate(context: ModuleContext, oldVersion: string): Promise<void> {
    context.logger.info(`Completing update ${this.name} from ${oldVersion}...`);
    
    // 1. 运行数据库迁移
    await this.runMigrations('up');
    
    // 2. 恢复模块状态
    await this.restoreModuleState(context);
    
    // 3. 重新加载模块
    await this.onLoad(context);
    await this.onEnable(context);
  }
  
  // ============ 私有方法 ============
  
  /**
   * 初始化子模块
   */
  private async initSubModules(context: ModuleContext): Promise<void> {
    const manifest = await this.getManifest();
    
    for (const subModuleDef of manifest.subModules || []) {
      if (!subModuleDef.required) {
        // 检查配置是否启用
        const enabled = await context.config.get(
          `modules.${this.id}.subModules.${subModuleDef.id}.enabled`,
          false
        );
        if (!enabled) continue;
      }
      
      // 创建子模块实例
      let subModule: BaseModule;
      switch (subModuleDef.id) {
        case 'erp.purchase':
          subModule = new PurchaseModule();
          break;
        case 'erp.inventory':
          subModule = new InventoryModule();
          break;
        case 'erp.sales':
          subModule = new SalesModule();
          break;
        case 'erp.finance':
          subModule = new FinanceModule();
          break;
        case 'erp.production':
          subModule = new ProductionModule();
          break;
      }
      
      if (subModule) {
        await subModule.onLoad(context);
        this.subModules.set(subModuleDef.id, subModule);
      }
    }
  }
  
  /**
   * 启用子模块
   */
  private async enableSubModules(context: ModuleContext): Promise<void> {
    for (const [id, subModule] of this.subModules) {
      try {
        await subModule.onEnable(context);
        context.logger.info(`Sub-module ${id} enabled`);
      } catch (error) {
        context.logger.error(`Failed to enable sub-module ${id}`, error);
      }
    }
  }
  
  /**
   * 禁用子模块
   */
  private async disableSubModules(context: ModuleContext): Promise<void> {
    for (const [id, subModule] of this.subModules) {
      try {
        await subModule.onDisable(context);
        context.logger.info(`Sub-module ${id} disabled`);
      } catch (error) {
        context.logger.error(`Failed to disable sub-module ${id}`, error);
      }
    }
  }
  
  /**
   * 卸载子模块
   */
  private async unloadSubModules(context: ModuleContext): Promise<void> {
    for (const [id, subModule] of this.subModules) {
      try {
        await subModule.onUnload(context);
      } catch (error) {
        context.logger.error(`Failed to unload sub-module ${id}`, error);
      }
    }
    this.subModules.clear();
  }
  
  /**
   * 动态启用子模块
   */
  async enableSubModule(subModuleId: string, context: ModuleContext): Promise<void> {
    if (this.subModules.has(subModuleId)) {
      throw new Error(`Sub-module ${subModuleId} is already loaded`);
    }
    
    // 创建并加载子模块
    const subModule = await this.createSubModule(subModuleId);
    await subModule.onLoad(context);
    await subModule.onEnable(context);
    
    this.subModules.set(subModuleId, subModule);
    
    // 更新配置
    await context.config.set(
      `modules.${this.id}.subModules.${subModuleId}.enabled`,
      true
    );
    
    context.eventBus.emit('module.submodule.enabled', {
      moduleId: this.id,
      subModuleId
    });
  }
  
  /**
   * 动态禁用子模块
   */
  async disableSubModule(subModuleId: string, context: ModuleContext): Promise<void> {
    const subModule = this.subModules.get(subModuleId);
    if (!subModule) {
      throw new Error(`Sub-module ${subModuleId} is not loaded`);
    }
    
    // 检查是否为必需模块
    const manifest = await this.getManifest();
    const subModuleDef = manifest.subModules?.find(s => s.id === subModuleId);
    if (subModuleDef?.required) {
      throw new Error(`Cannot disable required sub-module ${subModuleId}`);
    }
    
    await subModule.onDisable(context);
    await subModule.onUnload(context);
    
    this.subModules.delete(subModuleId);
    
    // 更新配置
    await context.config.set(
      `modules.${this.id}.subModules.${subModuleId}.enabled`,
      false
    );
    
    context.eventBus.emit('module.submodule.disabled', {
      moduleId: this.id,
      subModuleId
    });
  }
  
  /**
   * 注册服务
   */
  private async registerServices(context: ModuleContext): Promise<void> {
    // 物料服务
    context.serviceRegistry.register('MaterialService', 
      new MaterialService(context), this.id);
    
    // 供应商服务
    context.serviceRegistry.register('SupplierService', 
      new SupplierService(context), this.id);
    
    // 仓库服务
    context.serviceRegistry.register('WarehouseService', 
      new WarehouseService(context), this.id);
    
    // 库存服务
    context.serviceRegistry.register('InventoryService', 
      new InventoryService(context), this.id);
    
    // 采购服务
    context.serviceRegistry.register('PurchaseService', 
      new PurchaseService(context), this.id);
    
    // 销售服务
    context.serviceRegistry.register('SalesService', 
      new SalesService(context), this.id);
  }
  
  /**
   * 注册路由
   */
  private async registerRoutes(context: ModuleContext): Promise<void> {
    const routes = [
      // 物料管理
      { method: 'GET', path: '/api/v1/erp/materials', handler: MaterialController.list },
      { method: 'GET', path: '/api/v1/erp/materials/:id', handler: MaterialController.detail },
      { method: 'POST', path: '/api/v1/erp/materials', handler: MaterialController.create },
      { method: 'PUT', path: '/api/v1/erp/materials/:id', handler: MaterialController.update },
      { method: 'DELETE', path: '/api/v1/erp/materials/:id', handler: MaterialController.delete },
      
      // 供应商管理
      { method: 'GET', path: '/api/v1/erp/suppliers', handler: SupplierController.list },
      { method: 'POST', path: '/api/v1/erp/suppliers', handler: SupplierController.create },
      
      // 采购管理
      { method: 'GET', path: '/api/v1/erp/purchase/orders', handler: PurchaseController.listOrders },
      { method: 'POST', path: '/api/v1/erp/purchase/orders', handler: PurchaseController.createOrder },
      { method: 'POST', path: '/api/v1/erp/purchase/orders/:id/approve', handler: PurchaseController.approveOrder },
      
      // 库存管理
      { method: 'GET', path: '/api/v1/erp/inventory', handler: InventoryController.list },
      { method: 'POST', path: '/api/v1/erp/inventory/adjust', handler: InventoryController.adjust },
      { method: 'GET', path: '/api/v1/erp/inventory/transactions', handler: InventoryController.transactions },
    ];
    
    for (const route of routes) {
      context.router.register(route.method, route.path, route.handler, this.id);
    }
  }
  
  /**
   * 注册菜单
   */
  private async registerMenus(context: ModuleContext): Promise<void> {
    const menus = [
      {
        id: 'erp',
        name: 'ERP管理',
        icon: 'shopping',
        path: '/erp',
        children: [
          {
            id: 'erp-material',
            name: '物料管理',
            icon: 'appstore',
            path: '/erp/material',
            children: [
              { id: 'erp-material-list', name: '物料列表', path: '/erp/material/list' },
              { id: 'erp-material-category', name: '物料分类', path: '/erp/material/category' },
            ]
          },
          {
            id: 'erp-purchase',
            name: '采购管理',
            icon: 'shopping-cart',
            path: '/erp/purchase',
            permission: 'erp:purchase:view'
          },
          {
            id: 'erp-inventory',
            name: '库存管理',
            icon: 'database',
            path: '/erp/inventory'
          },
          {
            id: 'erp-sales',
            name: '销售管理',
            icon: 'dollar',
            path: '/erp/sales',
            permission: 'erp:sales:view'
          },
          {
            id: 'erp-finance',
            name: '财务管理',
            icon: 'account-book',
            path: '/erp/finance',
            permission: 'erp:finance:view'
          }
        ]
      }
    ];
    
    for (const menu of menus) {
      context.menuRegistry.register(menu, this.id);
    }
  }
  
  /**
   * 启动事件订阅
   */
  private async startEventSubscriptions(context: ModuleContext): Promise<void> {
    // 订阅客户创建事件（同步客户到ERP）
    context.eventBus.on('customer.created', async (event) => {
      const customerService = context.serviceRegistry.get('CustomerERPService');
      await customerService.syncFromCRM(event.payload);
    }, this.id);
    
    // 订阅库存预警事件
    context.eventBus.on('erp.inventory.stock.warning', async (event) => {
      const notificationService = context.serviceRegistry.get('NotificationService');
      await notificationService.send({
        type: 'inventory_warning',
        title: '库存预警',
        content: `物料 ${event.payload.materialName} 库存不足`,
        recipients: event.payload.notifyUsers
      });
    }, this.id);
  }
}
```

## 7.3 子模块实现示例

```typescript
/**
 * 采购管理子模块
 */
export class PurchaseModule extends BaseModule {
  readonly id = '@daoda/erp.purchase';
  readonly name = '采购管理';
  readonly version = '1.0.0';
  
  async onLoad(context: ModuleContext): Promise<void> {
    this.context = context;
    
    // 注册采购相关服务
    context.serviceRegistry.register('PurchaseOrderService', 
      new PurchaseOrderService(context), this.id);
    context.serviceRegistry.register('PurchaseInvoiceService', 
      new PurchaseInvoiceService(context), this.id);
  }
  
  async onEnable(context: ModuleContext): Promise<void> {
    // 注册采购相关路由
    context.router.register('GET', '/api/v1/erp/purchase/orders', 
      PurchaseOrderController.list, this.id);
    context.router.register('POST', '/api/v1/erp/purchase/orders', 
      PurchaseOrderController.create, this.id);
    context.router.register('POST', '/api/v1/erp/purchase/orders/:id/approve', 
      PurchaseOrderController.approve, this.id);
    
    // 订阅采购审批相关事件
    context.eventBus.on('workflow.purchase.approved', 
      this.handlePurchaseApproved.bind(this), this.id);
  }
  
  async onDisable(context: ModuleContext): Promise<void> {
    context.router.unregisterAll(this.id);
    context.eventBus.clearModuleSubscriptions(this.id);
  }
  
  private async handlePurchaseApproved(event: any): Promise<void> {
    const orderService = this.context.serviceRegistry.get<PurchaseOrderService>('PurchaseOrderService');
    await orderService.processApprovedOrder(event.payload.orderId);
  }
}

/**
 * 库存管理子模块
 */
export class InventoryModule extends BaseModule {
  readonly id = '@daoda/erp.inventory';
  readonly name = '库存管理';
  readonly version = '1.0.0';
  
  // 库存预警检查定时器
  private warningTimer?: NodeJS.Timeout;
  
  async onEnable(context: ModuleContext): Promise<void> {
    // 启动库存预警检查
    this.startWarningCheck(context);
  }
  
  async onDisable(context: ModuleContext): Promise<void> {
    // 停止预警检查
    if (this.warningTimer) {
      clearInterval(this.warningTimer);
    }
  }
  
  private startWarningCheck(context: ModuleContext): void {
    // 每5分钟检查一次库存预警
    this.warningTimer = setInterval(async () => {
      const inventoryService = context.serviceRegistry.get<InventoryService>('InventoryService');
      const warnings = await inventoryService.checkLowStock();
      
      for (const warning of warnings) {
        context.eventBus.emit('erp.inventory.stock.warning', {
          materialId: warning.materialId,
          materialName: warning.materialName,
          currentStock: warning.currentStock,
          safetyStock: warning.safetyStock,
          notifyUsers: warning.notifyUsers
        });
      }
    }, 5 * 60 * 1000);
  }
}
```

## 7.4 独立部署配置

```yaml
# daoda.module.yaml - ERP模块独立部署配置

module:
  id: "@daoda/erp"
  version: "1.0.0"

deployment:
  backend:
    replicas: 3
    resources:
      cpu: "1000m"
      memory: "1Gi"
    env:
      - name: MODULE_ID
        value: "@daoda/erp"
      - name: DATABASE_URL
        valueFrom:
          secretKeyRef:
            name: erp-db-secret
            key: url
      - name: REDIS_URL
        valueFrom:
          secretKeyRef:
            name: erp-redis-secret
            key: url
    
  frontend:
    replicas: 2
    resources:
      cpu: "200m"
      memory: "256Mi"

# 子模块配置
subModules:
  purchase:
    enabled: true
    replicas: 2
  inventory:
    enabled: true
    replicas: 2
  sales:
    enabled: true
    replicas: 2
  finance:
    enabled: false  # 按需启用
  production:
    enabled: false  # 按需启用

database:
  migrations: true
  backup:
    enabled: true
    schedule: "0 2 * * *"
    retention: 7

dependencies:
  redis:
    required: true
  postgresql:
    required: true
  rabbitmq:
    required: false

healthCheck:
  enabled: true
  path: /health
  interval: 30s
  timeout: 5s

monitoring:
  enabled: true
  metrics:
    - name: purchase_order_count
      type: counter
      help: 采购订单数量
    - name: inventory_level
      type: gauge
      help: 库存水平
```

---

## 八、模块配置

### 8.1 模块定义

```typescript
// erp.module.ts

import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { IModule, IModuleMetadata, IModuleRoute, IModulePermission, ModuleStatus } from '../../core/plugin';

@Module({
  imports: [
    // 子模块
    PurchaseModule,     // 采购管理
    InventoryModule,    // 库存管理
    SalesModule,        // 销售管理
    ProductionModule,   // 生产管理
    QualityModule,      // 质量管理
    EquipmentModule,    // 设备管理
  ],
  providers: [ErpService],
  exports: [ErpService],
})
export class ErpModule implements IModule, OnModuleInit, OnModuleDestroy {
  
  // ========================================
  // 模块元数据
  // ========================================
  
  static metadata: IModuleMetadata = {
    id: 'erp',
    name: 'ERP企业资源计划模块',
    version: '1.0.0',
    description: '企业资源计划系统，包含采购、库存、销售、生产、质量、设备等功能',
    author: '道达智能',
    
    // 模块依赖
    dependencies: [
      { moduleId: 'auth', versionRange: '>=1.0.0', required: true },
      { moduleId: 'system', versionRange: '>=1.0.0', required: true },
      { moduleId: 'workflow', versionRange: '>=1.0.0', required: false },  // 可选，用于审批流程
    ],
    
    // 模块配置Schema
    configSchema: {
      type: 'object',
      properties: {
        enableMultiWarehouse: { type: 'boolean', default: true, description: '启用多仓库' },
        enableBatchManagement: { type: 'boolean', default: true, description: '启用批次管理' },
        enableSerialNumber: { type: 'boolean', default: false, description: '启用序列号管理' },
        enableQualityInspection: { type: 'boolean', default: true, description: '启用质检流程' },
        enableProductionPlan: { type: 'boolean', default: true, description: '启用生产计划' },
        defaultWarehouse: { type: 'string', default: 'WH001', description: '默认仓库' },
        inventoryWarningThreshold: { type: 'number', default: 10, description: '库存预警阈值' },
      },
    },
    
    tags: ['erp', 'core', 'business'],
    icon: 'erp',
    enabled: true,
    loadOrder: 20,
  };

  // ========================================
  // 模块路由
  // ========================================
  
  static routes: IModuleRoute[] = [
    // 采购管理路由
    { path: '/erp/purchase/orders', method: 'GET', description: '获取采购订单列表', permissions: ['erp:purchase:view'] },
    { path: '/erp/purchase/orders', method: 'POST', description: '创建采购订单', permissions: ['erp:purchase:create'] },
    { path: '/erp/purchase/orders/:id', method: 'PUT', description: '更新采购订单', permissions: ['erp:purchase:edit'] },
    { path: '/erp/purchase/orders/:id/approve', method: 'POST', description: '审批采购订单', permissions: ['erp:purchase:approve'] },
    { path: '/erp/purchase/suppliers', method: 'GET', description: '获取供应商列表', permissions: ['erp:supplier:view'] },
    { path: '/erp/purchase/suppliers', method: 'POST', description: '创建供应商', permissions: ['erp:supplier:create'] },
    { path: '/erp/purchase/receipts', method: 'GET', description: '获取采购入库单列表', permissions: ['erp:purchase:receipt'] },
    { path: '/erp/purchase/returns', method: 'GET', description: '获取采购退货单列表', permissions: ['erp:purchase:return'] },
    
    // 库存管理路由
    { path: '/erp/inventory/stocks', method: 'GET', description: '获取库存列表', permissions: ['erp:inventory:view'] },
    { path: '/erp/inventory/stocks/:id', method: 'GET', description: '获取库存详情', permissions: ['erp:inventory:view'] },
    { path: '/erp/inventory/warehouses', method: 'GET', description: '获取仓库列表', permissions: ['erp:warehouse:view'] },
    { path: '/erp/inventory/warehouses', method: 'POST', description: '创建仓库', permissions: ['erp:warehouse:create'] },
    { path: '/erp/inventory/transfers', method: 'GET', description: '获取调拨单列表', permissions: ['erp:inventory:transfer'] },
    { path: '/erp/inventory/transfers', method: 'POST', description: '创建调拨单', permissions: ['erp:inventory:transfer'] },
    { path: '/erp/inventory/checks', method: 'GET', description: '获取盘点单列表', permissions: ['erp:inventory:check'] },
    { path: '/erp/inventory/checks', method: 'POST', description: '创建盘点单', permissions: ['erp:inventory:check'] },
    { path: '/erp/inventory/warnings', method: 'GET', description: '获取库存预警列表', permissions: ['erp:inventory:warning'] },
    
    // 销售管理路由
    { path: '/erp/sales/orders', method: 'GET', description: '获取销售订单列表', permissions: ['erp:sales:view'] },
    { path: '/erp/sales/orders', method: 'POST', description: '创建销售订单', permissions: ['erp:sales:create'] },
    { path: '/erp/sales/orders/:id', method: 'PUT', description: '更新销售订单', permissions: ['erp:sales:edit'] },
    { path: '/erp/sales/orders/:id/approve', method: 'POST', description: '审批销售订单', permissions: ['erp:sales:approve'] },
    { path: '/erp/sales/deliveries', method: 'GET', description: '获取发货单列表', permissions: ['erp:sales:delivery'] },
    { path: '/erp/sales/returns', method: 'GET', description: '获取销售退货单列表', permissions: ['erp:sales:return'] },
    
    // 生产管理路由
    { path: '/erp/production/plans', method: 'GET', description: '获取生产计划列表', permissions: ['erp:production:view'] },
    { path: '/erp/production/plans', method: 'POST', description: '创建生产计划', permissions: ['erp:production:create'] },
    { path: '/erp/production/orders', method: 'GET', description: '获取生产工单列表', permissions: ['erp:production:view'] },
    { path: '/erp/production/orders', method: 'POST', description: '创建生产工单', permissions: ['erp:production:create'] },
    { path: '/erp/production/boms', method: 'GET', description: '获取BOM列表', permissions: ['erp:bom:view'] },
    { path: '/erp/production/boms', method: 'POST', description: '创建BOM', permissions: ['erp:bom:create'] },
    
    // 质量管理路由
    { path: '/erp/quality/inspections', method: 'GET', description: '获取质检单列表', permissions: ['erp:quality:view'] },
    { path: '/erp/quality/inspections', method: 'POST', description: '创建质检单', permissions: ['erp:quality:create'] },
    { path: '/erp/quality/standards', method: 'GET', description: '获取质检标准列表', permissions: ['erp:quality:standard'] },
    
    // 设备管理路由
    { path: '/erp/equipment/list', method: 'GET', description: '获取设备列表', permissions: ['erp:equipment:view'] },
    { path: '/erp/equipment/list', method: 'POST', description: '创建设备', permissions: ['erp:equipment:create'] },
    { path: '/erp/equipment/maintenances', method: 'GET', description: '获取保养记录列表', permissions: ['erp:equipment:maintain'] },
    { path: '/erp/equipment/repairs', method: 'GET', description: '获取维修记录列表', permissions: ['erp:equipment:repair'] },
  ];

  // ========================================
  // 模块权限
  // ========================================
  
  static permissions: IModulePermission[] = [
    // 采购权限
    { code: 'erp:purchase:view', name: '采购查看', group: '采购管理' },
    { code: 'erp:purchase:create', name: '采购创建', group: '采购管理' },
    { code: 'erp:purchase:edit', name: '采购编辑', group: '采购管理' },
    { code: 'erp:purchase:approve', name: '采购审批', group: '采购管理' },
    { code: 'erp:purchase:receipt', name: '采购入库', group: '采购管理' },
    { code: 'erp:purchase:return', name: '采购退货', group: '采购管理' },
    
    // 供应商权限
    { code: 'erp:supplier:view', name: '供应商查看', group: '供应商管理' },
    { code: 'erp:supplier:create', name: '供应商创建', group: '供应商管理' },
    { code: 'erp:supplier:edit', name: '供应商编辑', group: '供应商管理' },
    
    // 库存权限
    { code: 'erp:inventory:view', name: '库存查看', group: '库存管理' },
    { code: 'erp:inventory:adjust', name: '库存调整', group: '库存管理' },
    { code: 'erp:inventory:transfer', name: '库存调拨', group: '库存管理' },
    { code: 'erp:inventory:check', name: '库存盘点', group: '库存管理' },
    { code: 'erp:inventory:warning', name: '库存预警', group: '库存管理' },
    
    // 仓库权限
    { code: 'erp:warehouse:view', name: '仓库查看', group: '仓库管理' },
    { code: 'erp:warehouse:create', name: '仓库创建', group: '仓库管理' },
    { code: 'erp:warehouse:edit', name: '仓库编辑', group: '仓库管理' },
    
    // 销售权限
    { code: 'erp:sales:view', name: '销售查看', group: '销售管理' },
    { code: 'erp:sales:create', name: '销售创建', group: '销售管理' },
    { code: 'erp:sales:edit', name: '销售编辑', group: '销售管理' },
    { code: 'erp:sales:approve', name: '销售审批', group: '销售管理' },
    { code: 'erp:sales:delivery', name: '销售发货', group: '销售管理' },
    { code: 'erp:sales:return', name: '销售退货', group: '销售管理' },
    
    // 生产权限
    { code: 'erp:production:view', name: '生产查看', group: '生产管理' },
    { code: 'erp:production:create', name: '生产创建', group: '生产管理' },
    { code: 'erp:production:edit', name: '生产编辑', group: '生产管理' },
    { code: 'erp:production:execute', name: '生产执行', group: '生产管理' },
    
    // BOM权限
    { code: 'erp:bom:view', name: 'BOM查看', group: 'BOM管理' },
    { code: 'erp:bom:create', name: 'BOM创建', group: 'BOM管理' },
    { code: 'erp:bom:edit', name: 'BOM编辑', group: 'BOM管理' },
    
    // 质量权限
    { code: 'erp:quality:view', name: '质检查看', group: '质量管理' },
    { code: 'erp:quality:create', name: '质检创建', group: '质量管理' },
    { code: 'erp:quality:standard', name: '质检标准', group: '质量管理' },
    
    // 设备权限
    { code: 'erp:equipment:view', name: '设备查看', group: '设备管理' },
    { code: 'erp:equipment:create', name: '设备创建', group: '设备管理' },
    { code: 'erp:equipment:maintain', name: '设备保养', group: '设备管理' },
    { code: 'erp:equipment:repair', name: '设备维修', group: '设备管理' },
  ];

  // ========================================
  // 模块事件
  // ========================================
  
  static events: IModuleEvent[] = [
    // 采购事件
    { name: 'erp.purchase.order.created', description: '采购订单创建', payloadSchema: { orderId: 'string', supplierId: 'string', amount: 'number' } },
    { name: 'erp.purchase.order.approved', description: '采购订单审批通过' },
    { name: 'erp.purchase.order.rejected', description: '采购订单审批拒绝' },
    { name: 'erp.purchase.receipt.completed', description: '采购入库完成' },
    
    // 库存事件
    { name: 'erp.inventory.stock.changed', description: '库存变动', payloadSchema: { warehouseId: 'string', productId: 'string', quantity: 'number', type: 'string' } },
    { name: 'erp.inventory.warning.triggered', description: '库存预警触发' },
    { name: 'erp.inventory.transfer.completed', description: '调拨完成' },
    { name: 'erp.inventory.check.completed', description: '盘点完成' },
    
    // 销售事件
    { name: 'erp.sales.order.created', description: '销售订单创建' },
    { name: 'erp.sales.order.approved', description: '销售订单审批通过' },
    { name: 'erp.sales.delivery.completed', description: '发货完成' },
    
    // 生产事件
    { name: 'erp.production.plan.created', description: '生产计划创建' },
    { name: 'erp.production.order.started', description: '生产工单开工' },
    { name: 'erp.production.order.completed', description: '生产工单完工' },
    
    // 质量事件
    { name: 'erp.quality.inspection.passed', description: '质检通过' },
    { name: 'erp.quality.inspection.failed', description: '质检不合格' },
  ];

  // ========================================
  // 热插拔生命周期
  // ========================================
  
  private moduleStatus: ModuleStatus = ModuleStatus.INSTALLED;

  async onInstall(): Promise<void> {
    // 首次安装时执行
    // 创建数据库表结构
    // 初始化默认数据
    // 注册权限点
    console.log('ERP模块安装完成');
  }

  async onInit(): Promise<void> {
    // 每次启动时执行
    // 加载配置
    // 初始化连接
    console.log('ERP模块初始化完成');
  }

  async onStart(): Promise<void> {
    // 服务就绪后执行
    // 启动定时任务
    // 注册事件监听
    this.moduleStatus = ModuleStatus.ACTIVE;
    console.log('ERP模块启动完成');
  }

  async onStop(): Promise<void> {
    // 服务停止前执行
    // 停止定时任务
    // 清理资源
    this.moduleStatus = ModuleStatus.INACTIVE;
    console.log('ERP模块已停止');
  }

  async onUninstall(): Promise<void> {
    // 移除模块时执行
    // 清理数据
    // 移除权限点
    this.moduleStatus = ModuleStatus.UNINSTALLED;
    console.log('ERP模块已卸载');
  }

  async onUpdate(fromVersion: string, toVersion: string): Promise<void> {
    // 版本升级时执行
    // 执行数据库迁移
    // 更新配置
    console.log(`ERP模块升级: ${fromVersion} -> ${toVersion}`);
  }

  async onHealthCheck(): Promise<{ status: string; message?: string; details?: any }> {
    // 健康检查
    return {
      status: this.moduleStatus === ModuleStatus.ACTIVE ? 'healthy' : 'unhealthy',
      details: {
        module: 'erp',
        version: ErpModule.metadata.version,
        status: this.moduleStatus,
      },
    };
  }

  // ========================================
  // 模块API
  // ========================================
  
  getInfo() {
    return ErpModule.metadata;
  }

  getStatus() {
    return this.moduleStatus;
  }

  getRoutes() {
    return ErpModule.routes;
  }

  getPermissions() {
    return ErpModule.permissions;
  }

  getEvents() {
    return ErpModule.events;
  }
}
```

### 8.2 模块扩展点

```typescript
// ========================================
// ERP模块扩展点定义
// ========================================

/**
 * 采购订单处理器扩展点
 * 用于自定义采购订单处理逻辑
 */
export interface IPurchaseOrderHandler {
  // 订单创建前处理
  beforeCreate?(order: CreatePurchaseOrderDto): Promise<void>;
  
  // 订单创建后处理
  afterCreate?(order: PurchaseOrder): Promise<void>;
  
  // 订单审批处理
  onApprove?(order: PurchaseOrder): Promise<void>;
  
  // 订单完成处理
  onComplete?(order: PurchaseOrder): Promise<void>;
}

/**
 * 库存变更处理器扩展点
 * 用于自定义库存变更处理逻辑
 */
export interface IInventoryChangeHandler {
  // 库存变更前处理
  beforeChange?(data: InventoryChangeDto): Promise<void>;
  
  // 库存变更后处理
  afterChange?(data: InventoryChangeResult): Promise<void>;
  
  // 库存预警处理
  onWarning?(warning: InventoryWarning): Promise<void>;
}

/**
 * 生产工单处理器扩展点
 * 用于自定义生产工单处理逻辑
 */
export interface IProductionOrderHandler {
  // 工单创建前处理
  beforeCreate?(order: CreateProductionOrderDto): Promise<void>;
  
  // 工单开工处理
  onStart?(order: ProductionOrder): Promise<void>;
  
  // 工单完工处理
  onComplete?(order: ProductionOrder): Promise<void>;
  
  // 工单报工处理
  onReport?(order: ProductionOrder, report: WorkReport): Promise<void>;
}

/**
 * 质检处理器扩展点
 * 用于自定义质检处理逻辑
 */
export interface IQualityInspectionHandler {
  // 质检前处理
  beforeInspect?(inspection: QualityInspection): Promise<void>;
  
  // 质检通过处理
  onPass?(inspection: QualityInspection): Promise<void>;
  
  // 质检不合格处理
  onFail?(inspection: QualityInspection): Promise<void>;
}

/**
 * 价格计算器扩展点
 * 用于自定义价格计算逻辑
 */
export interface IPriceCalculator {
  // 计算采购价格
  calculatePurchasePrice?(productId: string, supplierId: string, quantity: number): Promise<number>;
  
  // 计算销售价格
  calculateSalesPrice?(productId: string, customerId: string, quantity: number): Promise<number>;
  
  // 计算成本价格
  calculateCostPrice?(productId: string): Promise<number>;
}

/**
 * 库存策略扩展点
 * 用于自定义库存策略
 */
export interface IInventoryStrategy {
  // 计算安全库存
  calculateSafetyStock?(productId: string, warehouseId: string): Promise<number>;
  
  // 计算补货点
  calculateReorderPoint?(productId: string, warehouseId: string): Promise<number>;
  
  // 计算补货数量
  calculateReorderQuantity?(productId: string, warehouseId: string): Promise<number>;
}
```

### 8.3 模块配置示例

```yaml
# erp.module.config.yaml

module:
  id: erp
  version: 1.0.0
  enabled: true

features:
  multiWarehouse:
    enabled: true
    defaultWarehouse: WH001
  batchManagement:
    enabled: true
    autoGenerateBatchNo: true
    batchNoPrefix: "BH"
  serialNumber:
    enabled: false
  qualityInspection:
    enabled: true
    autoInspectionOnReceipt: true
    strictMode: false
  productionPlan:
    enabled: true
    autoGenerateWorkOrder: true

integration:
  crm:
    enabled: true
    syncCustomer: true
    syncSalesOrder: true
  finance:
    enabled: true
    syncVoucher: true
    autoGenerateVoucher: true

notifications:
  stockWarning:
    enabled: true
    channels: ["email", "in-app"]
    recipients: ["warehouse-manager", "purchase-manager"]
  orderApproval:
    enabled: true
    channels: ["in-app"]
  qualityIssue:
    enabled: true
    channels: ["email", "sms"]
    recipients: ["quality-manager"]
```

---

> **相关文档**
> - [总纲文档](./MODULE_DESIGN_MASTER.md)
> - [CRM模块设计](./03_CRM_MODULE.md)
> - [售后服务模块设计](./04_SERVICE_MODULE.md)
> - [MES模块设计](./05_MES_MODULE.md)
> - [数据结构设计](./06_DATABASE_SCHEMA.md)
> - [API接口设计](./07_API_SPECIFICATION.md)
> - [组件库设计](./08_COMPONENT_LIBRARY.md)

---

> **文档维护**: 渔晓白  
> **最后更新**: 2026-03-19