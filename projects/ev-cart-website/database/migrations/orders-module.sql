-- =====================================================
-- 订单管理模块 - 数据库表
-- =====================================================

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID,
    customer_name VARCHAR(200) NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    shipping_address TEXT,
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    sales_rep_id UUID,
    sales_rep_name VARCHAR(100),
    dealer_id UUID,
    dealer_name VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);

-- 订单明细表
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    product_id UUID,
    product_code VARCHAR(50),
    product_name VARCHAR(200),
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    final_amount DECIMAL(12,2) NOT NULL,
    delivery_status VARCHAR(20) DEFAULT 'pending',
    delivered_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- 采购订单表
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_code VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID,
    supplier_name VARCHAR(200) NOT NULL,
    order_date DATE NOT NULL,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    shipping_address TEXT,
    purchaser_id UUID,
    purchaser_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_code ON purchase_orders(po_code);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);

-- 采购订单明细表
CREATE TABLE IF NOT EXISTS purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_order_id UUID REFERENCES purchase_orders(id),
    product_id UUID,
    product_code VARCHAR(50),
    product_name VARCHAR(200),
    quantity INT NOT NULL,
    received_quantity INT DEFAULT 0,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    delivery_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_po_items_po ON purchase_order_items(purchase_order_id);

-- 生产工单表
CREATE TABLE IF NOT EXISTS production_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mo_code VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID,
    product_code VARCHAR(50),
    product_name VARCHAR(200),
    planned_quantity INT NOT NULL,
    completed_quantity INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'normal',
    sales_order_id UUID,
    sales_order_code VARCHAR(50),
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    production_line VARCHAR(100),
    supervisor VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_production_orders_code ON production_orders(mo_code);
CREATE INDEX IF NOT EXISTS idx_production_orders_product ON production_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);

-- 外贸订单表
CREATE TABLE IF NOT EXISTS export_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    export_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID,
    customer_name VARCHAR(200) NOT NULL,
    country VARCHAR(100) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    order_date DATE NOT NULL,
    shipment_date DATE,
    port_of_loading VARCHAR(200),
    port_of_discharge VARCHAR(200),
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(12,2) NOT NULL,
    exchange_rate DECIMAL(10,4),
    payment_terms VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'unpaid',
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    customs_status VARCHAR(20) DEFAULT 'pending',
    documents JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_export_orders_code ON export_orders(export_code);
CREATE INDEX IF NOT EXISTS idx_export_orders_customer ON export_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_export_orders_country ON export_orders(country);
CREATE INDEX IF NOT EXISTS idx_export_orders_status ON export_orders(status);

-- 插入默认数据
INSERT INTO orders (order_code, customer_name, order_date, status, total_amount, sales_rep_name) VALUES
    ('ORD-20260312-001', '张三', CURRENT_DATE, 'pending', 25800.00, '销售 A'),
    ('ORD-20260312-002', '李四', CURRENT_DATE, 'processing', 39600.00, '销售 B'),
    ('ORD-20260312-003', '王五', CURRENT_DATE, 'completed', 51600.00, '销售 A')
ON CONFLICT DO NOTHING;

INSERT INTO purchase_orders (po_code, supplier_name, order_date, status, total_amount, purchaser_name) VALUES
    ('PO-20260312-001', '供应商 A', CURRENT_DATE, 'pending', 150000.00, '采购 A'),
    ('PO-20260312-002', '供应商 B', CURRENT_DATE, 'approved', 280000.00, '采购 B')
ON CONFLICT DO NOTHING;

INSERT INTO production_orders (mo_code, product_code, product_name, planned_quantity, status, priority, supervisor) VALUES
    ('MO-20260312-001', 'PRD-EV-001', 'EV Cart Pro', 100, 'pending', 'high', '生产主管 A'),
    ('MO-20260312-002', 'PRD-EV-002', 'EV Cart Standard', 150, 'processing', 'normal', '生产主管 B')
ON CONFLICT DO NOTHING;

INSERT INTO export_orders (export_code, customer_name, country, currency, order_date, status, total_amount) VALUES
    ('EXP-20260312-001', 'US Customer A', '美国', 'USD', CURRENT_DATE, 'pending', 50000.00),
    ('EXP-20260312-002', 'EU Customer B', '德国', 'EUR', CURRENT_DATE, 'approved', 80000.00)
ON CONFLICT DO NOTHING;
