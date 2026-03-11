-- =====================================================
-- 电动观光车官网 + CRM 系统 - 数据库结构设计
-- =====================================================
-- 创建时间：2026-03-11
-- 数据库：PostgreSQL 15
-- 开发者：渔晓白 ⚙️
-- =====================================================

-- 启用扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 全文搜索

-- =====================================================
-- 1. 用户与权限系统
-- =====================================================

-- 用户表
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    avatar_url      VARCHAR(500),
    role            VARCHAR(20) NOT NULL DEFAULT 'sales',  -- admin, manager, sales, support
    status          VARCHAR(20) NOT NULL DEFAULT 'active', -- active, inactive, locked
    last_login_at   TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- 角色权限表
CREATE TABLE roles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(50) UNIQUE NOT NULL,
    description     TEXT,
    permissions     JSONB NOT NULL DEFAULT '[]',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. 客户管理
-- =====================================================

-- 客户表
CREATE TABLE customers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(200) NOT NULL,
    type            VARCHAR(20) NOT NULL DEFAULT 'company',  -- company, individual, government
    industry        VARCHAR(100),  -- 行业：景区、酒店、地产、工厂等
    contact_person  VARCHAR(100),
    contact_phone   VARCHAR(20),
    contact_email   VARCHAR(255),
    address         TEXT,
    province        VARCHAR(50),
    city            VARCHAR(50),
    source          VARCHAR(50),  -- 来源：官网、展会、推荐、广告
    level           VARCHAR(20) DEFAULT 'C',  -- 客户等级：A, B, C
    status          VARCHAR(20) DEFAULT 'potential',  -- potential, following,成交，lost
    owner_id        UUID REFERENCES users(id),  -- 负责销售
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_name (name),
    INDEX idx_owner (owner_id),
    INDEX idx_status (status)
);

-- 客户跟进记录
CREATE TABLE customer_followups (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id     UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    type            VARCHAR(20) NOT NULL,  -- call, visit, wechat, email
    content         TEXT NOT NULL,
    next_followup   DATE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_customer (customer_id),
    INDEX idx_user (user_id)
);

-- =====================================================
-- 3. 线索管理
-- =====================================================

-- 线索表 (官网询价自动创建)
CREATE TABLE leads (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    phone           VARCHAR(20) NOT NULL,
    email           VARCHAR(255),
    company         VARCHAR(200),
    product_interest VARCHAR(100),  -- 感兴趣车型
    budget          VARCHAR(50),
    source          VARCHAR(50) NOT NULL DEFAULT 'website',  -- website, exhibition, referral
    status          VARCHAR(20) NOT NULL DEFAULT 'new',  -- new, contacted, qualified, converted, lost
    owner_id        UUID REFERENCES users(id),  -- 分配给的销售
    converted_customer_id UUID REFERENCES customers(id),  -- 转化后的客户
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_owner (owner_id),
    INDEX idx_phone (phone)
);

-- =====================================================
-- 4. 产品管理
-- =====================================================

-- 车型表
CREATE TABLE products (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(200) NOT NULL,
    model           VARCHAR(50) UNIQUE NOT NULL,  -- 型号
    category        VARCHAR(50) NOT NULL,  -- 观光车、货运车、巴士等
    passenger_capacity INT NOT NULL,  -- 载客量
    battery_type    VARCHAR(100),  -- 电池类型
    range_km        INT,  -- 续航里程 (km)
    max_speed       INT,  -- 最高时速 (km/h)
    charge_time     VARCHAR(50),  -- 充电时间
    motor_power     VARCHAR(50),  -- 电机功率
    dimensions      JSONB,  -- 尺寸 {length, width, height}
    weight          INT,  -- 整车重量 (kg)
    price_range     VARCHAR(50),  -- 价格区间
    status          VARCHAR(20) DEFAULT 'active',  -- active, discontinued
    images          JSONB DEFAULT '[]',  -- 图片 URL 数组
    features        JSONB DEFAULT '[]',  -- 特色功能
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_model (model),
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- 产品配置选项
CREATE TABLE product_options (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,  -- 配置名称
    type            VARCHAR(20) NOT NULL,  -- color, battery, seat, accessory
    value           VARCHAR(200) NOT NULL,
    price_adjust    DECIMAL(10,2) DEFAULT 0,  -- 价格调整
    is_default      BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_product (product_id)
);

-- =====================================================
-- 5. 商机管理
-- =====================================================

-- 商机表
CREATE TABLE opportunities (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id     UUID NOT NULL REFERENCES customers(id),
    name            VARCHAR(200) NOT NULL,
    stage           VARCHAR(20) NOT NULL DEFAULT 'discovery',  -- discovery, needs, proposal, negotiation, closed_won, closed_lost
    products        JSONB NOT NULL DEFAULT '[]',  -- 意向产品 [{product_id, quantity, config}]
    estimated_amount DECIMAL(12,2),  -- 预估金额
    actual_amount   DECIMAL(12,2),  -- 实际金额
    probability     INT DEFAULT 10,  -- 成交概率 (%)
    expected_close_date DATE,
    actual_close_date DATE,
    owner_id        UUID REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_customer (customer_id),
    INDEX idx_stage (stage),
    INDEX idx_owner (owner_id)
);

-- 报价单
CREATE TABLE quotations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id  UUID NOT NULL REFERENCES opportunities(id),
    quotation_no    VARCHAR(50) UNIQUE NOT NULL,  -- 报价单号
    products        JSONB NOT NULL,  -- 产品明细
    total_amount    DECIMAL(12,2) NOT NULL,
    discount        DECIMAL(5,2) DEFAULT 0,  -- 折扣 (%)
    final_amount    DECIMAL(12,2) NOT NULL,
    valid_until     DATE NOT NULL,  -- 报价有效期
    status          VARCHAR(20) DEFAULT 'pending',  -- pending, sent, accepted, rejected, expired
    notes           TEXT,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_opportunity (opportunity_id),
    INDEX idx_status (status)
);

-- =====================================================
-- 6. 订单管理
-- =====================================================

-- 订单表
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_no        VARCHAR(50) UNIQUE NOT NULL,  -- 订单号
    customer_id     UUID NOT NULL REFERENCES customers(id),
    opportunity_id  UUID REFERENCES opportunities(id),
    quotation_id    UUID REFERENCES quotations(id),
    products        JSONB NOT NULL,  -- 订单产品明细
    total_amount    DECIMAL(12,2) NOT NULL,
    paid_amount     DECIMAL(12,2) DEFAULT 0,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, confirmed, production, ready, shipped, completed
    payment_status  VARCHAR(20) DEFAULT 'unpaid',  -- unpaid, partial, paid
    delivery_address TEXT,
    expected_delivery_date DATE,
    actual_delivery_date DATE,
    notes           TEXT,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_order_no (order_no),
    INDEX idx_customer (customer_id),
    INDEX idx_status (status)
);

-- 订单生产进度
CREATE TABLE order_production (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    stage           VARCHAR(50) NOT NULL,  -- 生产阶段
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, in_progress, completed
    started_at      TIMESTAMP,
    completed_at    TIMESTAMP,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_order (order_id)
);

-- =====================================================
-- 7. 官网内容
-- =====================================================

-- 案例表
CREATE TABLE cases (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(200) NOT NULL,
    customer_name   VARCHAR(200),
    industry        VARCHAR(50),
    location        VARCHAR(100),
    products_used   JSONB DEFAULT '[]',  -- 使用的产品
    description     TEXT,
    images          JSONB DEFAULT '[]',
    status          VARCHAR(20) DEFAULT 'draft',  -- draft, published
    published_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_industry (industry)
);

-- 新闻表
CREATE TABLE news (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(200) NOT NULL,
    category        VARCHAR(50),  -- company, industry, exhibition
    content         TEXT NOT NULL,
    summary         VARCHAR(500),
    cover_image     VARCHAR(500),
    author          VARCHAR(100),
    status          VARCHAR(20) DEFAULT 'draft',
    published_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_category (category)
);

-- =====================================================
-- 8. 系统配置
-- =====================================================

-- 系统配置表
CREATE TABLE settings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key             VARCHAR(100) UNIQUE NOT NULL,
    value           TEXT NOT NULL,
    type            VARCHAR(20) DEFAULT 'string',  -- string, number, boolean, json
    description     TEXT,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_key (key)
);

-- 操作日志
CREATE TABLE operation_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,
    module          VARCHAR(50),
    target_id       UUID,
    target_type     VARCHAR(50),
    old_value       JSONB,
    new_value       JSONB,
    ip_address      VARCHAR(45),
    user_agent      TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

-- =====================================================
-- 初始数据
-- =====================================================

-- 默认管理员账号 (密码需要 bcrypt 加密后填入)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@evcart.com', '$2b$10$placeholder_need_to_hash', 'admin');

-- 默认角色
INSERT INTO roles (name, description, permissions) VALUES
('admin', '系统管理员', '["all"]'),
('manager', '销售经理', '["customer:*", "lead:*", "opportunity:*", "order:view"]'),
('sales', '销售员', '["customer:view", "lead:view", "opportunity:own", "order:view"]'),
('support', '客服', '["customer:view", "lead:view"]');

-- 系统配置
INSERT INTO settings (key, value, type, description) VALUES
('site.name', 'EV Cart', 'string', '网站名称'),
('site.title', '电动观光车官网', 'string', '网站标题'),
('contact.phone', '400-XXX-XXXX', 'string', '联系电话'),
('contact.email', 'info@evcart.com', 'string', '联系邮箱'),
('contact.address', '公司地址', 'string', '联系地址');

-- =====================================================
-- 视图和函数
-- =====================================================

-- 客户统计视图
CREATE VIEW customer_stats AS
SELECT 
    status,
    COUNT(*) as count,
    SUM(CASE WHEN owner_id IS NOT NULL THEN 1 ELSE 0 END) as assigned_count
FROM customers
GROUP BY status;

-- 销售漏斗视图
CREATE VIEW sales_funnel AS
SELECT 
    stage,
    COUNT(*) as count,
    SUM(estimated_amount) as total_amount,
    AVG(probability) as avg_probability
FROM opportunities
GROUP BY stage;

-- =====================================================
-- 结束
-- =====================================================
