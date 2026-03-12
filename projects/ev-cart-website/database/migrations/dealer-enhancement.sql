-- =====================================================
-- 经销商管理模块增强 - 数据库表创建脚本
-- =====================================================
-- 创建时间：2026-03-12
-- 模块：经销商考核 + 返利管理 + 等级管理
-- =====================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 经销商考核表
-- =====================================================
CREATE TABLE IF NOT EXISTS dealer_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    period VARCHAR(20) NOT NULL,
    period_type VARCHAR(20) NOT NULL,
    scores JSONB DEFAULT '{}',
    total_score DECIMAL(5,2) DEFAULT 0,
    grade VARCHAR(10) DEFAULT 'B',
    sales_target DECIMAL(12,2),
    sales_actual DECIMAL(12,2),
    target_achievement_rate DECIMAL(5,2),
    new_customers_count INT DEFAULT 0,
    customer_satisfaction DECIMAL(5,2),
    compliance_score DECIMAL(5,2),
    comments TEXT,
    assessed_by UUID,
    assessed_by_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    approved_by UUID,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_dealer_assessments_dealer_id ON dealer_assessments(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_assessments_period ON dealer_assessments(period);
CREATE INDEX IF NOT EXISTS idx_dealer_assessments_period_type ON dealer_assessments(period_type);
CREATE INDEX IF NOT EXISTS idx_dealer_assessments_grade ON dealer_assessments(grade);
CREATE INDEX IF NOT EXISTS idx_dealer_assessments_status ON dealer_assessments(status);

-- =====================================================
-- 2. 经销商返利表
-- =====================================================
CREATE TABLE IF NOT EXISTS dealer_rebates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    rebate_type VARCHAR(50) NOT NULL,
    period VARCHAR(20) NOT NULL,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    basis_amount DECIMAL(12,2),
    rebate_rate DECIMAL(5,4),
    calculation_formula TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    paid_at TIMESTAMP,
    payment_ref VARCHAR(100),
    notes TEXT,
    created_by UUID,
    created_by_name VARCHAR(100),
    approved_by UUID,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_dealer_rebates_dealer_id ON dealer_rebates(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_rebates_period ON dealer_rebates(period);
CREATE INDEX IF NOT EXISTS idx_dealer_rebates_rebate_type ON dealer_rebates(rebate_type);
CREATE INDEX IF NOT EXISTS idx_dealer_rebates_status ON dealer_rebates(status);

-- =====================================================
-- 3. 经销商等级变更历史表
-- =====================================================
CREATE TABLE IF NOT EXISTS dealer_level_histories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
    old_level VARCHAR(50),
    new_level VARCHAR(50) NOT NULL,
    reason VARCHAR(500),
    reason_type VARCHAR(50),
    assessment_ids UUID[],
    approved_by UUID,
    approved_by_name VARCHAR(100),
    effective_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_dealer_level_histories_dealer_id ON dealer_level_histories(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_level_histories_effective_date ON dealer_level_histories(effective_date);
CREATE INDEX IF NOT EXISTS idx_dealer_level_histories_old_level ON dealer_level_histories(old_level);
CREATE INDEX IF NOT EXISTS idx_dealer_level_histories_new_level ON dealer_level_histories(new_level);

-- =====================================================
-- 4. 经销商返利政策配置表
-- =====================================================
CREATE TABLE IF NOT EXISTS dealer_rebate_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    policy_type VARCHAR(50) NOT NULL,
    dealer_level VARCHAR(50),
    product_category VARCHAR(100),
    min_sales_amount DECIMAL(12,2),
    rebate_rate DECIMAL(5,4) NOT NULL,
    calculation_method VARCHAR(50) DEFAULT 'percentage',
    period_type VARCHAR(20) DEFAULT 'quarterly',
    start_date DATE,
    end_date DATE,
    conditions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_dealer_rebate_policies_type ON dealer_rebate_policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_dealer_rebate_policies_level ON dealer_rebate_policies(dealer_level);
CREATE INDEX IF NOT EXISTS idx_dealer_rebate_policies_active ON dealer_rebate_policies(is_active);

-- =====================================================
-- 5. 经销商考核指标配置表
-- =====================================================
CREATE TABLE IF NOT EXISTS dealer_assessment_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    calculation_method VARCHAR(100),
    target_value DECIMAL(12,2),
    scoring_rules JSONB,
    is_active BOOLEAN DEFAULT true,
    applicable_levels VARCHAR(100)[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_dealer_assessment_metrics_category ON dealer_assessment_metrics(category);
CREATE INDEX IF NOT EXISTS idx_dealer_assessment_metrics_active ON dealer_assessment_metrics(is_active);

-- =====================================================
-- 6. 增强 dealers 表字段
-- =====================================================
-- 添加绩效相关字段
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS performance_score DECIMAL(5,2) DEFAULT 0;
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS last_assessment_date TIMESTAMP;
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS last_assessment_grade VARCHAR(10);
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS total_rebate DECIMAL(12,2) DEFAULT 0;
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS next_review_date DATE;
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS assessment_count INT DEFAULT 0;
ALTER TABLE dealers ADD COLUMN IF NOT EXISTS consecutive_qualified_quarters INT DEFAULT 0;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_dealers_performance_score ON dealers(performance_score);
CREATE INDEX IF NOT EXISTS idx_dealers_level ON dealers(level);

-- =====================================================
-- 7. 插入默认返利政策配置
-- =====================================================
INSERT INTO dealer_rebate_policies (name, policy_type, dealer_level, rebate_rate, calculation_method, period_type, is_active) VALUES
    ('试用经销商销售返利', 'sales', 'trial', 0.01, 'percentage', 'quarterly', true),
    ('标准经销商销售返利', 'sales', 'standard', 0.02, 'percentage', 'quarterly', true),
    ('金牌经销商销售返利', 'sales', 'gold', 0.03, 'percentage', 'quarterly', true),
    ('白金经销商销售返利', 'sales', 'platinum', 0.05, 'percentage', 'quarterly', true),
    ('战略经销商销售返利', 'sales', 'strategic', 0.08, 'percentage', 'quarterly', true),
    
    ('金牌经销商增长返利', 'growth', 'gold', 0.01, 'percentage', 'yearly', true),
    ('白金经销商增长返利', 'growth', 'platinum', 0.02, 'percentage', 'yearly', true),
    ('战略经销商增长返利', 'growth', 'strategic', 0.03, 'percentage', 'yearly', true),
    
    ('市场活动匹配返利', 'market', NULL, 0.5, 'percentage', 'per_activity', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. 插入默认考核指标配置
-- =====================================================
INSERT INTO dealer_assessment_metrics (name, category, weight, calculation_method, is_active) VALUES
    ('销售目标达成率', 'sales', 40.00, 'actual/target*100', true),
    ('销售增长率', 'sales', 0.00, '(current-prev)/prev*100', true),
    ('新客户开发数', 'market', 10.00, 'count', true),
    ('区域覆盖率', 'market', 10.00, 'covered/total*100', true),
    ('客户满意度', 'service', 15.00, 'avg_rating', true),
    ('投诉率', 'service', 5.00, 'complaints/orders*100', true),
    ('价格合规', 'compliance', 5.00, 'compliance_check', true),
    ('区域合规', 'compliance', 5.00, 'compliance_check', true),
    ('活动参与度', 'cooperation', 5.00, 'attended/total*100', true),
    ('培训参与度', 'cooperation', 5.00, 'attended/total*100', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. 创建视图：经销商综合统计
-- =====================================================
CREATE OR REPLACE VIEW dealer_summary_view AS
SELECT 
    d.id,
    d.dealer_code,
    d.company_name,
    d.level,
    d.status,
    d.province,
    d.city,
    d.sales_target,
    d.sales_actual,
    d.performance_score,
    d.last_assessment_grade,
    d.total_rebate,
    (SELECT COUNT(*) FROM dealer_assessments da WHERE da.dealer_id = d.id) as assessment_count,
    (SELECT SUM(amount) FROM dealer_rebates dr WHERE dr.dealer_id = d.id AND dr.status = 'paid') as paid_rebate_total,
    (SELECT SUM(amount) FROM dealer_rebates dr WHERE dr.dealer_id = d.id AND dr.status = 'pending') as pending_rebate_total
FROM dealers d;

-- =====================================================
-- 验证查询
-- =====================================================
-- 查看创建的表
-- SELECT tablename FROM pg_tables WHERE tablename LIKE 'dealer%' ORDER BY tablename;

-- 查看默认返利政策
-- SELECT name, dealer_level, rebate_rate, period_type FROM dealer_rebate_policies WHERE is_active = true;

-- 查看默认考核指标
-- SELECT name, category, weight FROM dealer_assessment_metrics WHERE is_active = true ORDER BY category, weight DESC;

-- =====================================================
