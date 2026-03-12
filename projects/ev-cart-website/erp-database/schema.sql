-- =====================================================
-- 电动观光车 ERP 系统 - 数据库结构
-- =====================================================
-- 创建时间：2026-03-12
-- 数据库：PostgreSQL 15
-- =====================================================

-- 启用扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 采购管理模块
-- =====================================================

-- 供应商表
CREATE TABLE supplier (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    address TEXT,
    credit_level VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 采购申请单
CREATE TABLE purchase_request (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_no VARCHAR(50) UNIQUE NOT NULL,
    department_id UUID NOT NULL,
    applicant_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    total_amount DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 采购申请明细
CREATE TABLE purchase_request_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL REFERENCES purchase_request(id),
    material_id UUID NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2),
    amount DECIMAL(12,2),
    delivery_date DATE,
    remark TEXT
);

-- 采购订单
CREATE TABLE purchase_order (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES supplier(id),
    request_id UUID REFERENCES purchase_request(id),
    status VARCHAR(20) DEFAULT 'draft',
    total_amount DECIMAL(12,2) DEFAULT 0,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 采购订单明细
CREATE TABLE purchase_order_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES purchase_order(id),
    material_id UUID NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    received_qty DECIMAL(10,2) DEFAULT 0,
    remark TEXT
);

-- =====================================================
-- 2. 库存管理模块
-- =====================================================

-- 仓库表
CREATE TABLE warehouse (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_code VARCHAR(50) UNIQUE NOT NULL,
    warehouse_name VARCHAR(200) NOT NULL,
    address TEXT,
    manager_id UUID,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 物料表
CREATE TABLE material (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_code VARCHAR(50) UNIQUE NOT NULL,
    material_name VARCHAR(200) NOT NULL,
    category_id UUID,
    specification VARCHAR(200),
    unit VARCHAR(20),
    safety_stock DECIMAL(10,2),
    max_stock DECIMAL(10,2),
    price DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 库存表
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID NOT NULL REFERENCES warehouse(id),
    material_id UUID NOT NULL REFERENCES material(id),
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    locked_qty DECIMAL(10,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(warehouse_id, material_id)
);

-- 入库单
CREATE TABLE inbound_order (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inbound_no VARCHAR(50) UNIQUE NOT NULL,
    warehouse_id UUID NOT NULL,
    source_type VARCHAR(20),
    source_id UUID,
    status VARCHAR(20) DEFAULT 'draft',
    total_amount DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 入库明细
CREATE TABLE inbound_order_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inbound_id UUID NOT NULL REFERENCES inbound_order(id),
    material_id UUID NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(12,2),
    amount DECIMAL(12,2),
    batch_no VARCHAR(50),
    remark TEXT
);

-- 出库单
CREATE TABLE outbound_order (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outbound_no VARCHAR(50) UNIQUE NOT NULL,
    warehouse_id UUID NOT NULL,
    target_type VARCHAR(20),
    target_id UUID,
    status VARCHAR(20) DEFAULT 'draft',
    total_amount DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. 生产管理模块
-- =====================================================

-- BOM 物料清单
CREATE TABLE bom (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bom_code VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID NOT NULL,
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOM 明细
CREATE TABLE bom_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bom_id UUID NOT NULL REFERENCES bom(id),
    material_id UUID NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    sequence INT DEFAULT 0
);

-- 生产工单
CREATE TABLE production_order (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID NOT NULL,
    bom_id UUID REFERENCES bom(id),
    quantity DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 工艺路线
CREATE TABLE routing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    routing_code VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID NOT NULL,
    sequence INT NOT NULL,
    work_center_id UUID,
    operation_name VARCHAR(200),
    std_hours DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 工作中心
CREATE TABLE work_center (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_center_code VARCHAR(50) UNIQUE NOT NULL,
    work_center_name VARCHAR(200) NOT NULL,
    capacity DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active'
);

-- =====================================================
-- 4. 财务管理模块
-- =====================================================

-- 会计科目
CREATE TABLE account_subject (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_code VARCHAR(50) UNIQUE NOT NULL,
    subject_name VARCHAR(200) NOT NULL,
    parent_id UUID REFERENCES account_subject(id),
    level INT NOT NULL,
    type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active'
);

-- 凭证表
CREATE TABLE voucher (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_no VARCHAR(50) UNIQUE NOT NULL,
    voucher_date DATE NOT NULL,
    type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'draft',
    total_amount DECIMAL(12,2) DEFAULT 0,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 凭证明细
CREATE TABLE voucher_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voucher_id UUID NOT NULL REFERENCES voucher(id),
    subject_id UUID NOT NULL REFERENCES account_subject(id),
    direction VARCHAR(10),
    amount DECIMAL(12,2) NOT NULL,
    remark TEXT
);

-- 应收账款
CREATE TABLE accounts_receivable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL,
    order_id UUID,
    amount DECIMAL(12,2) NOT NULL,
    received_amount DECIMAL(12,2) DEFAULT 0,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 应付账款
CREATE TABLE accounts_payable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id UUID NOT NULL,
    order_id UUID,
    amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    due_date DATE,
    status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 索引创建
-- =====================================================

-- 采购索引
CREATE INDEX idx_purchase_request_status ON purchase_request(status);
CREATE INDEX idx_purchase_order_supplier ON purchase_order(supplier_id);
CREATE INDEX idx_purchase_order_status ON purchase_order(status);

-- 库存索引
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_inventory_material ON inventory(material_id);
CREATE INDEX idx_inbound_warehouse ON inbound_order(warehouse_id);

-- 生产索引
CREATE INDEX idx_bom_product ON bom(product_id);
CREATE INDEX idx_production_order_status ON production_order(status);

-- 财务索引
CREATE INDEX idx_voucher_date ON voucher(voucher_date);
CREATE INDEX idx_ar_customer ON accounts_receivable(customer_id);
CREATE INDEX idx_ap_supplier ON accounts_payable(supplier_id);

-- =====================================================
-- 初始数据
-- =====================================================

-- 初始化仓库
INSERT INTO warehouse (warehouse_code, warehouse_name, address) VALUES
('WH-001', '原材料仓', '工厂 A 区'),
('WH-002', '成品仓', '工厂 B 区'),
('WH-003', '配件仓', '工厂 C 区');

-- 初始化会计科目
INSERT INTO account_subject (subject_code, subject_name, level, type) VALUES
('1001', '库存现金', 1, 'asset'),
('1002', '银行存款', 1, 'asset'),
('1122', '应收账款', 1, 'asset'),
('2202', '应付账款', 1, 'liability'),
('6001', '主营业务收入', 1, 'profit'),
('6401', '主营业务成本', 1, 'cost');

-- =====================================================
-- 视图创建
-- =====================================================

-- 库存视图
CREATE VIEW v_inventory_summary AS
SELECT 
    m.id as material_id,
    m.material_code,
    m.material_name,
    m.unit,
    SUM(i.quantity) as total_stock,
    SUM(i.locked_qty) as locked_stock,
    SUM(i.quantity - i.locked_qty) as available_stock
FROM material m
LEFT JOIN inventory i ON m.id = i.material_id
WHERE m.status = 'active'
GROUP BY m.id, m.material_code, m.material_name, m.unit;

-- =====================================================
-- 结束
-- =====================================================
