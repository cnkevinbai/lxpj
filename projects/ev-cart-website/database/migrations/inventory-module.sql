-- =====================================================
-- 库存管理模块 - 数据库表
-- =====================================================

-- 产品库存表
CREATE TABLE IF NOT EXISTS inventory_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    specification VARCHAR(255),
    unit VARCHAR(20) DEFAULT '件',
    quantity INT DEFAULT 0,
    safe_stock INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    max_stock INT DEFAULT 0,
    unit_cost DECIMAL(12,2),
    unit_price DECIMAL(12,2),
    warehouse_id UUID,
    warehouse_name VARCHAR(100),
    location VARCHAR(100),
    supplier_id UUID,
    supplier_name VARCHAR(200),
    last_stock_check DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_products_code ON inventory_products(product_code);
CREATE INDEX IF NOT EXISTS idx_inventory_products_category ON inventory_products(category);
CREATE INDEX IF NOT EXISTS idx_inventory_products_warehouse ON inventory_products(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_products_status ON inventory_products(status);

-- 库存流水表
CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_code VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID REFERENCES inventory_products(id),
    product_code VARCHAR(50),
    product_name VARCHAR(200),
    transaction_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    before_quantity INT,
    after_quantity INT,
    reference_type VARCHAR(50),
    reference_id UUID,
    reference_code VARCHAR(50),
    warehouse_id UUID,
    warehouse_name VARCHAR(100),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created ON inventory_transactions(created_at);

-- 仓库表
CREATE TABLE IF NOT EXISTS inventory_warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_code VARCHAR(50) UNIQUE NOT NULL,
    warehouse_name VARCHAR(200) NOT NULL,
    address TEXT,
    manager VARCHAR(100),
    phone VARCHAR(20),
    capacity INT,
    used_capacity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_warehouses_code ON inventory_warehouses(warehouse_code);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouses_active ON inventory_warehouses(is_active);

-- 库存盘点表
CREATE TABLE IF NOT EXISTS inventory_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    check_code VARCHAR(50) UNIQUE NOT NULL,
    warehouse_id UUID,
    warehouse_name VARCHAR(100),
    check_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total_items INT,
    checked_items INT DEFAULT 0,
    discrepancy_items INT DEFAULT 0,
    notes TEXT,
    checked_by UUID,
    checked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_checks_warehouse ON inventory_checks(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_checks_status ON inventory_checks(status);

-- 库存调拨表
CREATE TABLE IF NOT EXISTS inventory_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transfer_code VARCHAR(50) UNIQUE NOT NULL,
    from_warehouse_id UUID,
    from_warehouse_name VARCHAR(100),
    to_warehouse_id UUID,
    to_warehouse_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    total_items INT,
    notes TEXT,
    created_by UUID,
    approved_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inventory_transfers_from ON inventory_transfers(from_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transfers_to ON inventory_transfers(to_warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transfers_status ON inventory_transfers(status);

-- 插入默认仓库
INSERT INTO inventory_warehouses (warehouse_code, warehouse_name, address, manager, phone, capacity) VALUES
    ('WH-SZ-001', '深圳总仓', '深圳市南山区科技园', '张三', '13800138001', 10000),
    ('WH-SZ-002', '深圳分仓', '深圳市宝安区', '李四', '13800138002', 5000),
    ('WH-GZ-001', '广州分仓', '广州市天河区', '王五', '13800138003', 5000),
    ('WH-SH-001', '上海分仓', '上海市浦东新区', '赵六', '13800138004', 8000)
ON CONFLICT DO NOTHING;

-- 插入默认产品库存
INSERT INTO inventory_products (product_code, product_name, category, specification, unit, quantity, safe_stock, min_stock, max_stock, unit_cost, unit_price, warehouse_name, location) VALUES
    ('PRD-EV-001', 'EV Cart Pro', '电动车', '旗舰版', '件', 150, 50, 30, 300, 15000.00, 25800.00, '深圳总仓', 'A-01-01'),
    ('PRD-EV-002', 'EV Cart Standard', '电动车', '标准版', '件', 280, 80, 50, 400, 12000.00, 19800.00, '深圳总仓', 'A-01-02'),
    ('PRD-EV-003', 'EV Cart Lite', '电动车', ' Lite 版', '件', 320, 100, 60, 500, 8000.00, 13800.00, '深圳总仓', 'A-01-03'),
    ('PRD-ACC-001', '配件包 A', '配件', '基础配件包', '件', 580, 200, 100, 800, 200.00, 380.00, '深圳总仓', 'B-02-01'),
    ('PRD-ACC-002', '配件包 B', '配件', '高级配件包', '件', 420, 150, 80, 600, 350.00, 580.00, '深圳总仓', 'B-02-02')
ON CONFLICT DO NOTHING;
