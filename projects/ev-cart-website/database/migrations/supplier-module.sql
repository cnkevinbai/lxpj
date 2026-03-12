-- =====================================================
-- 供应商管理模块 - 数据库表
-- =====================================================

-- 供应商表
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    address TEXT,
    province VARCHAR(50),
    city VARCHAR(50),
    category VARCHAR(100),
    level VARCHAR(20) DEFAULT 'normal',
    credit_rating VARCHAR(10),
    payment_terms VARCHAR(255),
    bank_name VARCHAR(200),
    bank_account VARCHAR(100),
    tax_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    total_orders INT DEFAULT 0,
    total_amount DECIMAL(12,2) DEFAULT 0,
    last_order_date DATE,
    rating DECIMAL(3,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_suppliers_code ON suppliers(supplier_code);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(supplier_name);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_suppliers_level ON suppliers(level);

-- 供应商评估表
CREATE TABLE IF NOT EXISTS supplier_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    evaluation_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    evaluation_date DATE NOT NULL,
    evaluation_type VARCHAR(50),
    quality_score DECIMAL(5,2),
    delivery_score DECIMAL(5,2),
    service_score DECIMAL(5,2),
    price_score DECIMAL(5,2),
    total_score DECIMAL(5,2),
    evaluation_result VARCHAR(20),
    evaluator VARCHAR(100),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_supplier_evaluations_supplier ON supplier_evaluations(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_evaluations_date ON supplier_evaluations(evaluation_date);

-- 插入默认供应商
INSERT INTO suppliers (supplier_code, supplier_name, contact_person, contact_phone, category, level, status) VALUES
    ('SUP-001', '深圳电子供应商 A', '张三', '13800138001', '电子元器件', 'gold', 'active'),
    ('SUP-002', '广州材料供应商 B', '李四', '13800138002', '原材料', 'silver', 'active'),
    ('SUP-003', '上海配件供应商 C', '王五', '13800138003', '配件', 'normal', 'active'),
    ('SUP-004', '北京设备供应商 D', '赵六', '13800138004', '设备', 'gold', 'active')
ON CONFLICT DO NOTHING;
