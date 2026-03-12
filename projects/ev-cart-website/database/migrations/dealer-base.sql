-- =====================================================
-- 经销商基础表创建脚本
-- =====================================================
-- 创建时间：2026-03-12
-- =====================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 经销商基础表
-- =====================================================
CREATE TABLE IF NOT EXISTS dealers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_code VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    province VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    level VARCHAR(50) DEFAULT 'standard',
    authorized_area TEXT,
    authorized_products JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'active',
    contract_start DATE,
    contract_end DATE,
    sales_target DECIMAL(12,2),
    sales_actual DECIMAL(12,2) DEFAULT 0,
    owner_id UUID,
    -- 新增绩效字段
    performance_score DECIMAL(5,2) DEFAULT 0,
    last_assessment_date TIMESTAMP,
    last_assessment_grade VARCHAR(10),
    total_rebate DECIMAL(12,2) DEFAULT 0,
    next_review_date DATE,
    assessment_count INT DEFAULT 0,
    consecutive_qualified_quarters INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_dealers_dealer_code ON dealers(dealer_code);
CREATE INDEX IF NOT EXISTS idx_dealers_company_name ON dealers(company_name);
CREATE INDEX IF NOT EXISTS idx_dealers_province ON dealers(province);
CREATE INDEX IF NOT EXISTS idx_dealers_city ON dealers(city);
CREATE INDEX IF NOT EXISTS idx_dealers_level ON dealers(level);
CREATE INDEX IF NOT EXISTS idx_dealers_status ON dealers(status);
CREATE INDEX IF NOT EXISTS idx_dealers_performance_score ON dealers(performance_score);

-- =====================================================
