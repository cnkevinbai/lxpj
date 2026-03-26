# 数据结构设计文档

> **版本**: v1.0  
> **设计日期**: 2026-03-18  
> **所属系统**: 道达智能数字化平台  
> **数据库**: PostgreSQL 15 + Prisma ORM

---

## 📋 文档目录

1. [数据库设计原则](#一数据库设计原则)
2. [ER图总览](#二er图总览)
3. [核心表结构](#三核心表结构)
4. [索引设计](#四索引设计)
5. [数据字典](#五数据字典)
6. [Prisma Schema](#六prisma-schema)

---

# 一、数据库设计原则

## 1.1 设计理念

```
┌─────────────────────────────────────────────────────────────────┐
│                     数据库设计原则                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 规范化设计                                                  │
│     • 遵循第三范式(3NF)，减少数据冗余                           │
│     • 合理反范式化，提升查询性能                                 │
│     • 统一命名规范：snake_case                                   │
│                                                                 │
│  2. 主键设计                                                    │
│     • 使用UUID v4作为主键                                       │
│     • 便于分布式系统数据同步                                     │
│     • 避免自增ID暴露业务量                                       │
│                                                                 │
│  3. 软删除                                                      │
│     • 核心业务表使用deleted_at字段                               │
│     • 保留历史数据，支持数据恢复                                 │
│     • 定期清理已删除数据                                         │
│                                                                 │
│  4. 审计字段                                                    │
│     • created_by: 创建人                                        │
│     • created_at: 创建时间                                      │
│     • updated_by: 更新人                                        │
│     • updated_at: 更新时间                                      │
│                                                                 │
│  5. 扩展字段                                                    │
│     • 预留扩展字段ext_data (JSONB)                              │
│     • 支持业务扩展，避免频繁改表                                 │
│                                                                 │
│  6. 索引策略                                                    │
│     • 主键索引、外键索引                                         │
│     • 业务查询常用字段索引                                       │
│     • 组合索引覆盖常用查询                                       │
│     • 合理使用部分索引、表达式索引                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 命名规范

```
表名规范:
├── 模块前缀: sys_, crm_, erp_, mes_, service_, cms_
├── 业务实体: 小写复数形式
├── 关联表: {实体1}_{实体2}_relations
└── 示例: sys_users, crm_customers, erp_products

字段规范:
├── 主键: id (UUID)
├── 外键: {关联表}_id
├── 状态: status
├── 类型: type
├── 名称: name
├── 编码: code
├── 描述: description
├── 备注: remark
├── 排序: sort_order
├── 时间: {动作}_at (created_at, updated_at)
├── 人员: {动作}_by (created_by, updated_by)
└── 布尔: is_{含义} (is_active, is_deleted)

索引规范:
├── 主键索引: PRIMARY KEY
├── 唯一索引: uk_{表名}_{字段}
├── 普通索引: idx_{表名}_{字段}
└── 组合索引: idx_{表名}_{字段1}_{字段2}
```

---

# 二、ER图总览

## 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          道达智能数字化平台 数据模型总览                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         系统基础模块 (SYS)                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │sys_users │ │sys_roles │ │sys_depts │ │sys_menus │ │sys_logs  │  │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────────┘  │   │
│  │       │            │            │            │                      │   │
│  └───────┼────────────┼────────────┼────────────┼──────────────────────┘   │
│          │            │            │            │                          │
│          ▼            ▼            ▼            ▼                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         客户管理模块 (CRM)                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │customers │ │ contacts │ │  leads   │ │opportuni-│ │ orders   │  │   │
│  │  │          │ │          │ │          │ │  ties    │ │          │  │   │
│  │  └────┬─────┘ └──────────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │   │
│  │       │                          │            │            │        │   │
│  └───────┼──────────────────────────┼────────────┼────────────┼────────┘   │
│          │                          │            │            │            │
│          ▼                          ▼            ▼            ▼            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         ERP核心模块 (ERP)                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │ products │ │ inventory│ │ purchases│ │suppliers │ │warehouses│  │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └──────────┘ └──────────┘  │   │
│  │       │            │            │                                   │   │
│  └───────┼────────────┼────────────┼───────────────────────────────────┘   │
│          │            │                                                    │
│          ▼            ▼                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         生产执行模块 (MES)                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │work_order│ │operations│ │ equipment│ │mat_batch │ │traceabil-│  │   │
│  │  │   s      │ │          │ │          │ │          │ │  ity     │  │   │
│  │  └────┬─────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │       │                                                              │   │
│  └───────┼──────────────────────────────────────────────────────────────┘   │
│          │                                                                   │
│          ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         售后服务模块 (SERVICE)                       │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │work_order│ │ contracts│ │  parts   │ │knowledge │ │satisfac- │  │   │
│  │  │  _svc    │ │          │ │          │ │  _base   │ │  tion    │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2.2 核心实体关系

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           核心实体关系图                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                          ┌─────────────┐                                   │
│                          │  sys_user   │                                   │
│                          │  (用户)     │                                   │
│                          └──────┬──────┘                                   │
│                                 │                                           │
│                                 │ 1:N                                       │
│                                 ▼                                           │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐          │
│  │  supplier   │────────▶│  product    │◀────────│ warehouse   │          │
│  │  (供应商)   │  N:1    │  (产品)     │   N:N   │  (仓库)     │          │
│  └─────────────┘         └──────┬──────┘         └─────────────┘          │
│                                 │                                           │
│                          ┌──────┴──────┐                                   │
│                          │             │                                   │
│                          ▼             ▼                                   │
│                   ┌─────────────┐ ┌─────────────┐                          │
│                   │  inventory  │ │  price      │                          │
│                   │  (库存)     │ │  (价格)     │                          │
│                   └─────────────┘ └─────────────┘                          │
│                                                                             │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐          │
│  │  customer   │────────▶│    lead     │────────▶│ opportunity │          │
│  │  (客户)     │   1:N   │  (线索)     │   1:N   │  (商机)     │          │
│  └──────┬──────┘         └─────────────┘         └──────┬──────┘          │
│         │                                                │                  │
│         │ 1:N                                            │ 1:N              │
│         ▼                                                ▼                  │
│  ┌─────────────┐                                  ┌─────────────┐          │
│  │   order     │◀─────────────────────────────────│ quotation   │          │
│  │  (订单)     │                                  │ (报价单)    │          │
│  └──────┬──────┘                                  └─────────────┘          │
│         │                                                                   │
│         │ 1:N                                                               │
│         ▼                                                                   │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐          │
│  │  contract   │────────▶│work_order   │────────▶│ equipment   │          │
│  │  (合同)     │   1:N   │  (工单)     │   N:1   │  (设备)     │          │
│  └─────────────┘         └─────────────┘         └─────────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 三、核心表结构

## 3.1 系统管理模块

### 3.1.1 用户表 (sys_users)

```sql
CREATE TABLE sys_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 登录信息
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL COMMENT '加密密码',
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  
  -- 基本信息
  real_name VARCHAR(50) NOT NULL,
  nickname VARCHAR(50),
  avatar VARCHAR(500),
  gender VARCHAR(10) DEFAULT 'unknown',
  birthday DATE,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'active' COMMENT 'active/inactive/locked',
  is_super BOOLEAN DEFAULT FALSE,
  
  -- 部门
  dept_id UUID,
  
  -- 登录信息
  last_login_at TIMESTAMP,
  last_login_ip VARCHAR(50),
  login_count INT DEFAULT 0,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_user_dept FOREIGN KEY (dept_id) 
    REFERENCES sys_depts(id) ON DELETE SET NULL
);

COMMENT ON TABLE sys_users IS '用户表';
```

### 3.1.2 角色表 (sys_roles)

```sql
CREATE TABLE sys_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  name VARCHAR(50) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(500),
  
  -- 类型
  type VARCHAR(20) DEFAULT 'custom' COMMENT 'system/custom',
  
  -- 排序
  sort_order INT DEFAULT 0,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'active',
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);

COMMENT ON TABLE sys_roles IS '角色表';
```

### 3.1.3 用户角色关联表 (sys_user_roles)

```sql
CREATE TABLE sys_user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT uk_user_role UNIQUE (user_id, role_id),
  CONSTRAINT fk_ur_user FOREIGN KEY (user_id) 
    REFERENCES sys_users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ur_role FOREIGN KEY (role_id) 
    REFERENCES sys_roles(id) ON DELETE CASCADE
);

COMMENT ON TABLE sys_user_roles IS '用户角色关联表';
```

### 3.1.4 部门表 (sys_depts)

```sql
CREATE TABLE sys_depts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE,
  
  -- 层级
  parent_id UUID,
  level INT DEFAULT 1,
  path VARCHAR(500) COMMENT '层级路径: /1/2/3',
  
  -- 负责人
  leader_id UUID,
  
  -- 排序
  sort_order INT DEFAULT 0,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'active',
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_dept_parent FOREIGN KEY (parent_id) 
    REFERENCES sys_depts(id) ON DELETE SET NULL
);

COMMENT ON TABLE sys_depts IS '部门表';
```

### 3.1.5 菜单表 (sys_menus)

```sql
CREATE TABLE sys_menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  name VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  
  -- 类型
  type VARCHAR(20) NOT NULL COMMENT 'directory/menu/button',
  
  -- 路由
  path VARCHAR(200),
  component VARCHAR(200),
  permission VARCHAR(100) COMMENT '权限标识',
  
  -- 层级
  parent_id UUID,
  level INT DEFAULT 1,
  
  -- 外链
  is_external BOOLEAN DEFAULT FALSE,
  external_url VARCHAR(500),
  
  -- 显示
  is_visible BOOLEAN DEFAULT TRUE,
  is_cached BOOLEAN DEFAULT FALSE,
  
  -- 排序
  sort_order INT DEFAULT 0,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'active',
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_menu_parent FOREIGN KEY (parent_id) 
    REFERENCES sys_menus(id) ON DELETE CASCADE
);

COMMENT ON TABLE sys_menus IS '菜单表';
```

---

## 3.2 CRM客户管理模块

### 3.2.1 客户表 (crm_customers)

```sql
CREATE TABLE crm_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  code VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  short_name VARCHAR(100),
  
  -- 类型
  type VARCHAR(20) DEFAULT 'enterprise' COMMENT 'enterprise/personal',
  
  -- 等级
  level VARCHAR(10) DEFAULT 'C' COMMENT 'VIP/A/B/C/D',
  
  -- 阶段
  stage VARCHAR(20) DEFAULT 'potential' 
    COMMENT 'potential/new/active/loyal/churned',
  
  -- 行业
  industry VARCHAR(50),
  sub_industry VARCHAR(50),
  
  -- 来源
  source VARCHAR(50),
  source_detail VARCHAR(200),
  
  -- 归属
  owner_id UUID,
  dept_id UUID,
  region_id UUID,
  
  -- 公海
  in_pool BOOLEAN DEFAULT FALSE,
  pool_date DATE,
  pool_reason VARCHAR(200),
  
  -- 统计
  total_amount DECIMAL(15,2) DEFAULT 0,
  total_orders INT DEFAULT 0,
  last_order_date DATE,
  
  -- 备注
  remark TEXT,
  
  -- 扩展
  ext_data JSONB,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_customer_owner FOREIGN KEY (owner_id) 
    REFERENCES sys_users(id) ON DELETE SET NULL,
  CONSTRAINT fk_customer_dept FOREIGN KEY (dept_id) 
    REFERENCES sys_depts(id) ON DELETE SET NULL
);

COMMENT ON TABLE crm_customers IS '客户表';
```

### 3.2.2 联系人表 (crm_contacts)

```sql
CREATE TABLE crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 客户
  customer_id UUID NOT NULL,
  
  -- 基本信息
  name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) DEFAULT 'unknown',
  position VARCHAR(100),
  department VARCHAR(100),
  
  -- 联系方式
  phone VARCHAR(50),
  mobile VARCHAR(50),
  email VARCHAR(100),
  wechat VARCHAR(100),
  qq VARCHAR(50),
  
  -- 角色
  role VARCHAR(20) DEFAULT 'unknown' 
    COMMENT 'decision_maker/influencer/user/gatekeeper/unknown',
  is_primary BOOLEAN DEFAULT FALSE,
  
  -- 生日
  birthday DATE,
  
  -- 备注
  remark TEXT,
  
  -- 审计
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_contact_customer FOREIGN KEY (customer_id) 
    REFERENCES crm_customers(id) ON DELETE CASCADE
);

COMMENT ON TABLE crm_contacts IS '联系人表';
```

### 3.2.3 线索表 (crm_leads)

```sql
CREATE TABLE crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 编号
  code VARCHAR(32) NOT NULL UNIQUE,
  
  -- 基本信息
  name VARCHAR(100) NOT NULL,
  company VARCHAR(200),
  phone VARCHAR(50),
  email VARCHAR(100),
  wechat VARCHAR(100),
  
  -- 来源
  source VARCHAR(50),
  source_detail VARCHAR(200),
  campaign_id UUID,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'new' 
    COMMENT 'new/contacted/qualified/converted/discarded',
  
  -- 评分
  score INT DEFAULT 0,
  score_level VARCHAR(10),
  
  -- 归属
  owner_id UUID,
  dept_id UUID,
  
  -- 转化
  customer_id UUID,
  opportunity_id UUID,
  converted_at TIMESTAMP,
  
  -- 跟进
  last_follow_up TIMESTAMP,
  follow_up_count INT DEFAULT 0,
  next_follow_up TIMESTAMP,
  
  -- 备注
  remark TEXT,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_lead_owner FOREIGN KEY (owner_id) 
    REFERENCES sys_users(id) ON DELETE SET NULL,
  CONSTRAINT fk_lead_customer FOREIGN KEY (customer_id) 
    REFERENCES crm_customers(id) ON DELETE SET NULL
);

COMMENT ON TABLE crm_leads IS '线索表';
```

### 3.2.4 商机表 (crm_opportunities)

```sql
CREATE TABLE crm_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 编号
  code VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  
  -- 关联
  customer_id UUID NOT NULL,
  contact_id UUID,
  lead_id UUID,
  
  -- 金额
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'CNY',
  
  -- 阶段
  stage VARCHAR(50) NOT NULL,
  stage_updated_at TIMESTAMP,
  probability INT DEFAULT 0,
  
  -- 预计成交
  expected_close_date DATE,
  
  -- 结果
  result VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/won/lost',
  result_reason VARCHAR(200),
  actual_amount DECIMAL(15,2),
  actual_close_date DATE,
  
  -- 归属
  owner_id UUID NOT NULL,
  team_id UUID,
  
  -- 竞争
  competitors JSONB,
  
  -- 描述
  description TEXT,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_opp_customer FOREIGN KEY (customer_id) 
    REFERENCES crm_customers(id) ON DELETE RESTRICT,
  CONSTRAINT fk_opp_owner FOREIGN KEY (owner_id) 
    REFERENCES sys_users(id) ON DELETE RESTRICT
);

COMMENT ON TABLE crm_opportunities IS '商机表';
```

---

## 3.3 ERP核心模块

### 3.3.1 产品表 (erp_products)

```sql
CREATE TABLE erp_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  short_name VARCHAR(100),
  spec VARCHAR(200) COMMENT '规格',
  model VARCHAR(100) COMMENT '型号',
  
  -- 分类
  category_id UUID,
  brand VARCHAR(100),
  
  -- 单位
  unit VARCHAR(20),
  weight DECIMAL(10,3),
  volume DECIMAL(10,3),
  
  -- 类型
  type VARCHAR(20) DEFAULT 'finished' 
    COMMENT 'finished/semi_finished/material/service',
  
  -- 生产
  is_producible BOOLEAN DEFAULT FALSE,
  is_purchasable BOOLEAN DEFAULT TRUE,
  is_sellable BOOLEAN DEFAULT TRUE,
  
  -- BOM
  has_bom BOOLEAN DEFAULT FALSE,
  bom_id UUID,
  
  -- 价格
  cost_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  min_price DECIMAL(10,2),
  
  -- 状态
  status VARCHAR(20) DEFAULT 'active' COMMENT 'active/inactive/discontinued',
  
  -- 图片
  main_image VARCHAR(500),
  images JSONB,
  
  -- 备注
  description TEXT,
  remark TEXT,
  
  -- 扩展
  ext_data JSONB,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);

COMMENT ON TABLE erp_products IS '产品表';
```

### 3.3.2 库存表 (erp_inventory)

```sql
CREATE TABLE erp_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 产品仓库
  product_id UUID NOT NULL,
  warehouse_id UUID NOT NULL,
  location VARCHAR(100) COMMENT '库位',
  
  -- 数量
  quantity DECIMAL(10,2) DEFAULT 0 COMMENT '库存数量',
  locked_quantity DECIMAL(10,2) DEFAULT 0 COMMENT '锁定数量',
  available_quantity DECIMAL(10,2) GENERATED ALWAYS AS 
    (quantity - locked_quantity) STORED COMMENT '可用数量',
  
  -- 成本
  cost_price DECIMAL(10,2) COMMENT '成本价',
  cost_amount DECIMAL(15,2) GENERATED ALWAYS AS 
    (quantity * cost_price) STORED COMMENT '成本金额',
  
  -- 预警
  safety_stock DECIMAL(10,2) COMMENT '安全库存',
  max_stock DECIMAL(10,2) COMMENT '最大库存',
  min_stock DECIMAL(10,2) COMMENT '最小库存',
  
  -- 审计
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT uk_product_warehouse UNIQUE (product_id, warehouse_id),
  CONSTRAINT fk_inv_product FOREIGN KEY (product_id) 
    REFERENCES erp_products(id) ON DELETE RESTRICT,
  CONSTRAINT fk_inv_warehouse FOREIGN KEY (warehouse_id) 
    REFERENCES erp_warehouses(id) ON DELETE RESTRICT
);

COMMENT ON TABLE erp_inventory IS '库存表';
```

### 3.3.3 库存流水表 (erp_inventory_transactions)

```sql
CREATE TABLE erp_inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 单据
  trans_no VARCHAR(32) NOT NULL UNIQUE,
  trans_type VARCHAR(20) NOT NULL 
    COMMENT 'in/out/transfer/adjust/lock/unlock',
  
  -- 产品
  product_id UUID NOT NULL,
  warehouse_id UUID NOT NULL,
  location VARCHAR(100),
  batch_no VARCHAR(50),
  
  -- 数量变化
  before_quantity DECIMAL(10,2),
  change_quantity DECIMAL(10,2) COMMENT '正数入库负数出库',
  after_quantity DECIMAL(10,2),
  
  -- 成本
  cost_price DECIMAL(10,2),
  cost_amount DECIMAL(15,2),
  
  -- 关联单据
  related_type VARCHAR(50),
  related_id UUID,
  
  -- 备注
  remark TEXT,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_trans_product FOREIGN KEY (product_id) 
    REFERENCES erp_products(id) ON DELETE RESTRICT,
  CONSTRAINT fk_trans_warehouse FOREIGN KEY (warehouse_id) 
    REFERENCES erp_warehouses(id) ON DELETE RESTRICT
);

COMMENT ON TABLE erp_inventory_transactions IS '库存流水表';
```

### 3.3.4 供应商表 (erp_suppliers)

```sql
CREATE TABLE erp_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  code VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  short_name VARCHAR(100),
  
  -- 类型
  type VARCHAR(20) DEFAULT 'manufacturer' 
    COMMENT 'manufacturer/distributor/service',
  
  -- 等级
  level VARCHAR(10) DEFAULT 'B' COMMENT 'A/B/C/D',
  
  -- 联系信息
  contact_name VARCHAR(50),
  phone VARCHAR(50),
  email VARCHAR(100),
  address VARCHAR(500),
  
  -- 财务
  bank_name VARCHAR(100),
  bank_account VARCHAR(50),
  tax_no VARCHAR(50),
  
  -- 付款
  payment_days INT DEFAULT 30,
  credit_limit DECIMAL(15,2),
  
  -- 状态
  status VARCHAR(20) DEFAULT 'active',
  
  -- 备注
  remark TEXT,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);

COMMENT ON TABLE erp_suppliers IS '供应商表';
```

---

## 3.4 MES生产模块

### 3.4.1 工单表 (mes_work_orders)

```sql
CREATE TABLE mes_work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 编号
  code VARCHAR(32) NOT NULL UNIQUE,
  
  -- 产品
  product_id UUID NOT NULL,
  product_code VARCHAR(50),
  product_name VARCHAR(200),
  
  -- 数量
  plan_quantity DECIMAL(10,2) NOT NULL,
  completed_quantity DECIMAL(10,2) DEFAULT 0,
  good_quantity DECIMAL(10,2) DEFAULT 0,
  reject_quantity DECIMAL(10,2) DEFAULT 0,
  
  -- 优先级
  priority VARCHAR(20) DEFAULT 'normal',
  
  -- 状态
  status VARCHAR(20) DEFAULT 'draft',
  
  -- 关联
  order_id UUID,
  line_id UUID,
  route_id UUID,
  
  -- 计划
  plan_start_date DATE,
  plan_end_date DATE,
  actual_start_time TIMESTAMP,
  actual_end_time TIMESTAMP,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_wo_product FOREIGN KEY (product_id) 
    REFERENCES erp_products(id) ON DELETE RESTRICT
);

COMMENT ON TABLE mes_work_orders IS '生产工单表';
```

### 3.4.2 设备表 (mes_equipment)

```sql
CREATE TABLE mes_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 基本信息
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  
  -- 分类
  type_id UUID,
  type_name VARCHAR(100),
  
  -- 位置
  area_id UUID,
  line_id UUID,
  location VARCHAR(200),
  
  -- 状态
  status VARCHAR(20) DEFAULT 'standby' 
    COMMENT 'running/standby/maintenance/fault/offline',
  
  -- 参数
  parameters JSONB,
  
  -- 维护
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  maintenance_cycle INT,
  
  -- 供应商
  manufacturer VARCHAR(200),
  supplier_id UUID,
  purchase_date DATE,
  warranty_end_date DATE,
  
  -- 审计
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL
);

COMMENT ON TABLE mes_equipment IS '设备表';
```

### 3.4.3 追溯记录表 (mes_traceability)

```sql
CREATE TABLE mes_traceability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 类型
  trace_type VARCHAR(20) NOT NULL COMMENT 'material/operation/product',
  
  -- 产品
  product_serial_no VARCHAR(100),
  work_order_id UUID,
  
  -- 物料
  material_batch_id UUID,
  material_batch_no VARCHAR(50),
  
  -- 工序
  operation_id UUID,
  operation_name VARCHAR(100),
  
  -- 执行
  operator_id UUID,
  equipment_id UUID,
  execution_time TIMESTAMP,
  
  -- 数据
  trace_data JSONB,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_trace_work_order FOREIGN KEY (work_order_id) 
    REFERENCES mes_work_orders(id) ON DELETE CASCADE
);

COMMENT ON TABLE mes_traceability IS '追溯记录表';
```

---

## 3.5 售后服务模块

### 3.5.1 服务工单表 (service_work_orders)

```sql
CREATE TABLE service_work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 编号
  code VARCHAR(32) NOT NULL UNIQUE,
  
  -- 基本信息
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- 类型优先级
  type VARCHAR(20) NOT NULL COMMENT 'repair/maintenance/install/consult/complaint',
  priority VARCHAR(20) DEFAULT 'normal',
  source VARCHAR(20) DEFAULT 'phone',
  
  -- 状态
  status VARCHAR(20) DEFAULT 'pending',
  
  -- 关联
  customer_id UUID NOT NULL,
  contact_id UUID,
  equipment_id UUID,
  contract_id UUID,
  
  -- 处理
  assignee_id UUID,
  dept_id UUID,
  team_id UUID,
  
  -- SLA
  sla_id UUID,
  response_deadline TIMESTAMP,
  arrival_deadline TIMESTAMP,
  resolution_deadline TIMESTAMP,
  response_time INT,
  arrival_time INT,
  resolution_time INT,
  
  -- 解决
  solution TEXT,
  resolution_date TIMESTAMP,
  completion_date TIMESTAMP,
  
  -- 满意度
  satisfaction_score INT,
  satisfaction_comment TEXT,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_swo_customer FOREIGN KEY (customer_id) 
    REFERENCES crm_customers(id) ON DELETE RESTRICT
);

COMMENT ON TABLE service_work_orders IS '服务工单表';
```

### 3.5.2 服务合同表 (service_contracts)

```sql
CREATE TABLE service_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 编号
  contract_no VARCHAR(32) NOT NULL UNIQUE,
  
  -- 基本信息
  name VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL COMMENT 'warranty/maintenance/support/mixed',
  
  -- 客户
  customer_id UUID NOT NULL,
  
  -- 期限
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- 状态
  status VARCHAR(20) DEFAULT 'draft',
  
  -- 产品
  products JSONB,
  
  -- 服务
  service_items JSONB,
  sla_rules JSONB,
  
  -- 计费
  billing_type VARCHAR(20) DEFAULT 'fixed',
  total_amount DECIMAL(15,2),
  billing_cycle VARCHAR(20),
  
  -- 联系人
  contact_id UUID,
  
  -- 备注
  remark TEXT,
  
  -- 附件
  attachments JSONB,
  
  -- 审计
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by UUID,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP DEFAULT NULL,
  
  CONSTRAINT fk_contract_customer FOREIGN KEY (customer_id) 
    REFERENCES crm_customers(id) ON DELETE RESTRICT
);

COMMENT ON TABLE service_contracts IS '服务合同表';
```

---

# 四、索引设计

## 4.1 核心索引

```sql
-- 用户表索引
CREATE INDEX idx_sys_users_username ON sys_users(username);
CREATE INDEX idx_sys_users_email ON sys_users(email);
CREATE INDEX idx_sys_users_phone ON sys_users(phone);
CREATE INDEX idx_sys_users_status ON sys_users(status);
CREATE INDEX idx_sys_users_dept ON sys_users(dept_id);

-- 客户表索引
CREATE INDEX idx_crm_customers_code ON crm_customers(code);
CREATE INDEX idx_crm_customers_name ON crm_customers(name);
CREATE INDEX idx_crm_customers_owner ON crm_customers(owner_id);
CREATE INDEX idx_crm_customers_stage ON crm_customers(stage);
CREATE INDEX idx_crm_customers_in_pool ON crm_customers(in_pool);
CREATE INDEX idx_crm_customers_created ON crm_customers(created_at);

-- 商机表索引
CREATE INDEX idx_crm_opps_code ON crm_opportunities(code);
CREATE INDEX idx_crm_opps_customer ON crm_opportunities(customer_id);
CREATE INDEX idx_crm_opps_stage ON crm_opportunities(stage);
CREATE INDEX idx_crm_opps_owner ON crm_opportunities(owner_id);
CREATE INDEX idx_crm_opps_expected_close ON crm_opportunities(expected_close_date);
CREATE INDEX idx_crm_opps_result ON crm_opportunities(result);

-- 产品表索引
CREATE INDEX idx_erp_products_code ON erp_products(code);
CREATE INDEX idx_erp_products_name ON erp_products(name);
CREATE INDEX idx_erp_products_category ON erp_products(category_id);
CREATE INDEX idx_erp_products_status ON erp_products(status);
CREATE INDEX idx_erp_products_type ON erp_products(type);

-- 库存表索引
CREATE INDEX idx_erp_inv_product ON erp_inventory(product_id);
CREATE INDEX idx_erp_inv_warehouse ON erp_inventory(warehouse_id);
CREATE INDEX idx_erp_inv_quantity ON erp_inventory(quantity);

-- 生产工单索引
CREATE INDEX idx_mes_wo_code ON mes_work_orders(code);
CREATE INDEX idx_mes_wo_product ON mes_work_orders(product_id);
CREATE INDEX idx_mes_wo_status ON mes_work_orders(status);
CREATE INDEX idx_mes_wo_line ON mes_work_orders(line_id);
CREATE INDEX idx_mes_wo_plan_date ON mes_work_orders(plan_start_date, plan_end_date);

-- 追溯记录索引
CREATE INDEX idx_mes_trace_serial ON mes_traceability(product_serial_no);
CREATE INDEX idx_mes_trace_batch ON mes_traceability(material_batch_id);
CREATE INDEX idx_mes_trace_work_order ON mes_traceability(work_order_id);
CREATE INDEX idx_mes_trace_type ON mes_traceability(trace_type);

-- 服务工单索引
CREATE INDEX idx_svc_wo_code ON service_work_orders(code);
CREATE INDEX idx_svc_wo_customer ON service_work_orders(customer_id);
CREATE INDEX idx_svc_wo_status ON service_work_orders(status);
CREATE INDEX idx_svc_wo_assignee ON service_work_orders(assignee_id);
CREATE INDEX idx_svc_wo_created ON service_work_orders(created_at);

-- 追溯记录组合索引
CREATE INDEX idx_mes_trace_search ON mes_traceability(trace_type, product_serial_no, created_at);
```

## 4.2 部分索引

```sql
-- 未删除用户
CREATE INDEX idx_sys_users_active ON sys_users(username, email) 
  WHERE deleted_at IS NULL;

-- 公海客户
CREATE INDEX idx_crm_customers_pool ON crm_customers(pool_date) 
  WHERE in_pool = TRUE;

-- 进行中的工单
CREATE INDEX idx_mes_wo_in_progress ON mes_work_orders(code, plan_end_date) 
  WHERE status = 'in_progress';

-- 待处理服务工单
CREATE INDEX idx_svc_wo_pending ON service_work_orders(code, priority) 
  WHERE status IN ('pending', 'assigned', 'in_progress');
```

---

# 五、数据字典

## 5.1 通用状态

### 5.1.1 记录状态

| 值 | 名称 | 说明 |
|---|------|------|
| active | 正常 | 正常状态 |
| inactive | 停用 | 已停用 |
| locked | 锁定 | 已锁定 |

### 5.1.2 是否标识

| 值 | 名称 |
|---|------|
| TRUE | 是 |
| FALSE | 否 |

## 5.2 CRM模块字典

### 5.2.1 客户类型

| 值 | 名称 |
|---|------|
| enterprise | 企业客户 |
| personal | 个人客户 |

### 5.2.2 客户等级

| 值 | 名称 | 说明 |
|---|------|------|
| VIP | VIP客户 | 最高等级 |
| A | A类客户 | 高价值 |
| B | B类客户 | 中等价值 |
| C | C类客户 | 普通客户 |
| D | D类客户 | 低价值 |

### 5.2.3 客户阶段

| 值 | 名称 | 判断规则 |
|---|------|---------|
| potential | 潜客 | 有联系方式未成交 |
| new | 新客 | 首次成交后30天 |
| active | 活跃 | 近90天有交易 |
| loyal | 忠诚 | 累计>5次且近180天有交易 |
| churned | 流失 | 超过180天无交易 |

### 5.2.4 商机阶段

| 值 | 名称 | 概率 |
|---|------|------|
| qualification | 线索确认 | 20% |
| needs_analysis | 需求确认 | 40% |
| proposal | 方案报价 | 60% |
| negotiation | 商务谈判 | 80% |
| closing | 签约成交 | 100% |

## 5.3 ERP模块字典

### 5.3.1 产品类型

| 值 | 名称 |
|---|------|
| finished | 成品 |
| semi_finished | 半成品 |
| material | 原材料 |
| service | 服务 |

### 5.3.2 库存事务类型

| 值 | 名称 |
|---|------|
| in | 入库 |
| out | 出库 |
| transfer | 调拨 |
| adjust | 调整 |
| lock | 锁定 |
| unlock | 解锁 |

## 5.4 MES模块字典

### 5.4.1 工单状态

| 值 | 名称 |
|---|------|
| draft | 草稿 |
| pending | 待审批 |
| released | 已下达 |
| preparing | 备料中 |
| in_progress | 生产中 |
| paused | 已暂停 |
| completed | 已完成 |
| closed | 已关闭 |
| cancelled | 已取消 |

### 5.4.2 设备状态

| 值 | 名称 |
|---|------|
| running | 运行 |
| standby | 待机 |
| maintenance | 维护 |
| fault | 故障 |
| offline | 离线 |

## 5.5 服务模块字典

### 5.5.1 服务工单类型

| 值 | 名称 |
|---|------|
| repair | 故障维修 |
| maintenance | 定期保养 |
| install | 安装调试 |
| consult | 技术咨询 |
| complaint | 投诉处理 |

### 5.5.2 服务工单状态

| 值 | 名称 |
|---|------|
| pending | 待分配 |
| assigned | 已分配 |
| accepted | 已接单 |
| in_progress | 处理中 |
| pending_review | 待审核 |
| completed | 已完成 |
| closed | 已关闭 |
| cancelled | 已取消 |

---

# 六、Prisma Schema

## 6.1 用户模块

```prisma
// 用户
model User {
  id          String    @id @default(uuid())
  username    String    @unique @db.VarChar(50)
  password    String    @db.VarChar(255)
  email       String?   @unique @db.VarChar(100)
  phone       String?   @unique @db.VarChar(20)
  realName    String    @db.VarChar(50)
  nickname    String?   @db.VarChar(50)
  avatar      String?   @db.VarChar(500)
  gender      String    @default("unknown") @db.VarChar(10)
  birthday    DateTime? @db.Date
  status      String    @default("active") @db.VarChar(20)
  isSuper     Boolean   @default(false)
  deptId      String?
  
  // 关联
  dept        Department? @relation(fields: [deptId], references: [id])
  roles       UserRole[]
  createdBy   String?
  createdAt   DateTime  @default(now())
  updatedBy   String?
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
  
  @@index([username])
  @@index([status])
  @@index([deptId])
  @@map("sys_users")
}

// 角色
model Role {
  id          String    @id @default(uuid())
  name        String    @db.VarChar(50)
  code        String    @unique @db.VarChar(50)
  description String?   @db.VarChar(500)
  type        String    @default("custom") @db.VarChar(20)
  sortOrder   Int       @default(0)
  status      String    @default("active") @db.VarChar(20)
  
  // 关联
  users       UserRole[]
  menus       RoleMenu[]
  createdBy   String?
  createdAt   DateTime  @default(now())
  updatedBy   String?
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
  
  @@index([code])
  @@map("sys_roles")
}

// 用户角色关联
model UserRole {
  id        String   @id @default(uuid())
  userId    String
  roleId    String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  role      Role     @relation(fields: [roleId], references: [id], onDelete: Cascade)
  
  @@unique([userId, roleId])
  @@map("sys_user_roles")
}

// 部门
model Department {
  id        String    @id @default(uuid())
  name      String    @db.VarChar(100)
  code      String?   @unique @db.VarChar(50)
  parentId  String?
  level     Int       @default(1)
  path      String?   @db.VarChar(500)
  leaderId  String?
  sortOrder Int       @default(0)
  status    String    @default("active") @db.VarChar(20)
  
  // 关联
  parent    Department?  @relation("DeptTree", fields: [parentId], references: [id])
  children  Department[] @relation("DeptTree")
  users     User[]
  createdBy String?
  createdAt DateTime  @default(now())
  updatedBy String?
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
  
  @@index([parentId])
  @@map("sys_depts")
}
```

## 6.2 CRM模块

```prisma
// 客户
model Customer {
  id            String    @id @default(uuid())
  code          String    @unique @db.VarChar(32)
  name          String    @db.VarChar(200)
  shortName     String?   @db.VarChar(100)
  type          String    @default("enterprise") @db.VarChar(20)
  level         String    @default("C") @db.VarChar(10)
  stage         String    @default("potential") @db.VarChar(20)
  industry      String?   @db.VarChar(50)
  subIndustry   String?   @db.VarChar(50)
  source        String?   @db.VarChar(50)
  sourceDetail  String?   @db.VarChar(200)
  ownerId       String?
  deptId        String?
  inPool        Boolean   @default(false)
  poolDate      DateTime? @db.Date
  poolReason    String?   @db.VarChar(200)
  totalAmount   Decimal   @default(0) @db.Decimal(15, 2)
  totalOrders   Int       @default(0)
  lastOrderDate DateTime? @db.Date
  remark        String?
  extData       Json?
  
  // 关联
  owner         User?       @relation(fields: [ownerId], references: [id])
  contacts      Contact[]
  leads         Lead[]
  opportunities Opportunity[]
  orders        Order[]
  serviceOrders ServiceWorkOrder[]
  contracts     ServiceContract[]
  createdBy     String?
  createdAt     DateTime    @default(now())
  updatedBy     String?
  updatedAt     DateTime    @updatedAt
  deletedAt     DateTime?
  
  @@index([code])
  @@index([name])
  @@index([ownerId])
  @@index([stage])
  @@index([inPool])
  @@map("crm_customers")
}

// 联系人
model Contact {
  id         String    @id @default(uuid())
  customerId String
  name       String    @db.VarChar(100)
  gender     String    @default("unknown") @db.VarChar(10)
  position   String?   @db.VarChar(100)
  department String?   @db.VarChar(100)
  phone      String?   @db.VarChar(50)
  mobile     String?   @db.VarChar(50)
  email      String?   @db.VarChar(100)
  wechat     String?   @db.VarChar(100)
  qq         String?   @db.VarChar(50)
  role       String    @default("unknown") @db.VarChar(20)
  isPrimary  Boolean   @default(false)
  birthday   DateTime? @db.Date
  remark     String?
  
  customer   Customer  @relation(fields: [customerId], references: [id], onDelete: Cascade)
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  deletedAt  DateTime?
  
  @@index([customerId])
  @@map("crm_contacts")
}

// 线索
model Lead {
  id             String    @id @default(uuid())
  code           String    @unique @db.VarChar(32)
  name           String    @db.VarChar(100)
  company        String?   @db.VarChar(200)
  phone          String?   @db.VarChar(50)
  email          String?   @db.VarChar(100)
  wechat         String?   @db.VarChar(100)
  source         String?   @db.VarChar(50)
  sourceDetail   String?   @db.VarChar(200)
  status         String    @default("new") @db.VarChar(20)
  score          Int       @default(0)
  scoreLevel     String?   @db.VarChar(10)
  ownerId        String?
  deptId         String?
  customerId     String?
  opportunityId  String?
  convertedAt    DateTime?
  lastFollowUp   DateTime?
  followUpCount  Int       @default(0)
  nextFollowUp   DateTime?
  remark         String?
  
  owner          User?         @relation(fields: [ownerId], references: [id])
  customer       Customer?     @relation(fields: [customerId], references: [id])
  opportunity    Opportunity?  @relation(fields: [opportunityId], references: [id])
  createdBy      String?
  createdAt      DateTime      @default(now())
  updatedBy      String?
  updatedAt      DateTime      @updatedAt
  deletedAt      DateTime?
  
  @@index([code])
  @@index([status])
  @@index([ownerId])
  @@map("crm_leads")
}

// 商机
model Opportunity {
  id                String    @id @default(uuid())
  code              String    @unique @db.VarChar(32)
  name              String    @db.VarChar(200)
  customerId        String
  contactId         String?
  leadId            String?
  amount            Decimal   @default(0) @db.Decimal(15, 2)
  currency          String    @default("CNY") @db.VarChar(10)
  stage             String    @db.VarChar(50)
  stageUpdatedAt    DateTime?
  probability       Int       @default(0)
  expectedCloseDate DateTime? @db.Date
  result            String    @default("pending") @db.VarChar(20)
  resultReason      String?   @db.VarChar(200)
  actualAmount      Decimal?  @db.Decimal(15, 2)
  actualCloseDate   DateTime? @db.Date
  ownerId           String
  teamId            String?
  competitors       Json?
  description       String?
  
  customer          Customer  @relation(fields: [customerId], references: [id])
  lead              Lead?     @relation(fields: [leadId], references: [id])
  owner             User      @relation(fields: [ownerId], references: [id])
  createdBy         String?
  createdAt         DateTime  @default(now())
  updatedBy         String?
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?
  
  @@index([code])
  @@index([customerId])
  @@index([stage])
  @@index([ownerId])
  @@index([expectedCloseDate])
  @@map("crm_opportunities")
}
```

---

*文档版本: v1.0*  
*最后更新: 2026-03-18*  
*作者: 渔晓白*