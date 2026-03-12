-- =====================================================
-- 售后服务模块 - 数据库表
-- =====================================================

-- 服务请求表
CREATE TABLE IF NOT EXISTS service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_code VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID,
    customer_name VARCHAR(200) NOT NULL,
    customer_phone VARCHAR(20),
    product_id UUID,
    product_name VARCHAR(200),
    request_type VARCHAR(50) NOT NULL,
    issue_description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'pending',
    assigned_to UUID,
    assigned_to_name VARCHAR(100),
    order_id UUID,
    order_code VARCHAR(50),
    warranty_status VARCHAR(20),
    expected_response_time TIMESTAMP,
    resolved_at TIMESTAMP,
    customer_rating INT,
    customer_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_requests_code ON service_requests(request_code);
CREATE INDEX IF NOT EXISTS idx_service_requests_customer ON service_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_created ON service_requests(created_at);

-- 服务工单表
CREATE TABLE IF NOT EXISTS service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code VARCHAR(50) UNIQUE NOT NULL,
    request_id UUID REFERENCES service_requests(id),
    technician_id UUID,
    technician_name VARCHAR(100),
    service_type VARCHAR(50) NOT NULL,
    service_date DATE,
    service_address TEXT,
    service_result TEXT,
    parts_used JSONB DEFAULT '[]',
    labor_hours DECIMAL(5,2),
    travel_cost DECIMAL(10,2),
    parts_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending',
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_orders_code ON service_orders(order_code);
CREATE INDEX IF NOT EXISTS idx_service_orders_request ON service_orders(request_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_technician ON service_orders(technician_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON service_orders(status);

-- 维修记录表
CREATE TABLE IF NOT EXISTS repair_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_code VARCHAR(50) UNIQUE NOT NULL,
    service_order_id UUID REFERENCES service_orders(id),
    product_serial_number VARCHAR(100),
    failure_description TEXT,
    diagnosis_result TEXT,
    repair_actions TEXT,
    parts_replaced JSONB DEFAULT '[]',
    test_result VARCHAR(20),
    warranty_period INT,
    technician_id UUID,
    technician_name VARCHAR(100),
    repair_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_repair_records_code ON repair_records(record_code);
CREATE INDEX IF NOT EXISTS idx_repair_records_order ON repair_records(service_order_id);

-- 备件使用表
CREATE TABLE IF NOT EXISTS service_parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_code VARCHAR(50) NOT NULL,
    part_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    unit_price DECIMAL(10,2),
    stock_quantity INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    warehouse_location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_service_parts_code ON service_parts(part_code);

-- 客户反馈表
CREATE TABLE IF NOT EXISTS customer_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    feedback_code VARCHAR(50) UNIQUE NOT NULL,
    service_request_id UUID REFERENCES service_requests(id),
    customer_id UUID,
    customer_name VARCHAR(200),
    rating INT NOT NULL,
    service_rating INT,
    technician_rating INT,
    response_rating INT,
    comments TEXT,
    is_resolved BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customer_feedbacks_code ON customer_feedbacks(feedback_code);
CREATE INDEX IF NOT EXISTS idx_customer_feedbacks_request ON customer_feedbacks(service_request_id);

-- 插入默认数据
INSERT INTO service_requests (request_code, customer_name, customer_phone, request_type, issue_description, priority, status) VALUES
    ('SR-20260312-001', '张三', '13800138001', '维修', '电动车无法充电', 'high', 'processing'),
    ('SR-20260312-002', '李四', '13800138002', '咨询', '如何使用快充功能', 'normal', 'resolved'),
    ('SR-20260312-003', '王五', '13800138003', '投诉', '配送延迟', 'high', 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO service_orders (order_code, request_id, technician_name, service_type, service_date, status) VALUES
    ('SO-20260312-001', (SELECT id FROM service_requests WHERE request_code = 'SR-20260312-001'), '技师 A', '上门维修', CURRENT_DATE, 'processing'),
    ('SO-20260312-002', (SELECT id FROM service_requests WHERE request_code = 'SR-20260312-002'), '客服 B', '电话咨询', CURRENT_DATE, 'completed')
ON CONFLICT DO NOTHING;

INSERT INTO customer_feedbacks (feedback_code, service_request_id, customer_name, rating, service_rating, technician_rating, comments) VALUES
    ('FB-20260312-001', (SELECT id FROM service_requests WHERE request_code = 'SR-20260312-002'), '李四', 5, 5, 5, '服务 very 好，响应及时')
ON CONFLICT DO NOTHING;
