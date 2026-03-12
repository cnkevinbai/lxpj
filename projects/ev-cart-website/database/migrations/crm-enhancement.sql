-- =====================================================
-- CRM 增强功能 - 数据库表创建脚本
-- =====================================================
-- 创建时间：2026-03-12
-- 模块：公海池管理 + 客户画像 + 销售预测
-- =====================================================

-- 1. 公海池客户表
CREATE TABLE IF NOT EXISTS customer_pools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customerId UUID NOT NULL UNIQUE,
    customerName VARCHAR(200) NOT NULL,
    source VARCHAR(100),
    level VARCHAR(50),
    previousOwnerId UUID,
    previousOwnerName VARCHAR(100),
    currentOwnerId UUID,
    currentOwnerName VARCHAR(100),
    claimedAt TIMESTAMP,
    returnAt TIMESTAMP,
    claimCount INT DEFAULT 0,
    returnReason TEXT,
    status VARCHAR(50) DEFAULT 'available',
    lockUntil TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_customer_pools_customerId ON customer_pools(customerId);
CREATE INDEX IF NOT EXISTS idx_customer_pools_currentOwner ON customer_pools(currentOwnerId);
CREATE INDEX IF NOT EXISTS idx_customer_pools_previousOwner ON customer_pools(previousOwnerId);
CREATE INDEX IF NOT EXISTS idx_customer_pools_status ON customer_pools(status);

-- 2. 公海池规则表
CREATE TABLE IF NOT EXISTS pool_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    ruleType VARCHAR(50) NOT NULL, -- auto_return, claim_limit, distribution
    conditions JSONB NOT NULL,
    enabled BOOLEAN DEFAULT true,
    priority INT DEFAULT 0,
    applicableRoleId UUID,
    applicableRoleName VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_pool_rules_type ON pool_rules(ruleType);
CREATE INDEX IF NOT EXISTS idx_pool_rules_enabled ON pool_rules(enabled);
CREATE INDEX IF NOT EXISTS idx_pool_rules_role ON pool_rules(applicableRoleId);

-- ==================== 插入默认公海池规则 ====================

-- 自动退回规则
INSERT INTO pool_rules (name, description, ruleType, conditions, enabled, priority) VALUES
    ('15 天无跟进自动退回', '客户 15 天无跟进记录自动退回到公海池', 'auto_return', 
     '{"noFollowUpDays": 15, "excludeLevels": ["VIP", "A"]}'::jsonb, true, 100),
    ('30 天无进展自动退回', '客户 30 天无任何进展自动退回到公海池', 'auto_return',
     '{"noProgressDays": 30, "excludeLevels": ["VIP"]}'::jsonb, true, 90)
ON CONFLICT DO NOTHING;

-- 领取限制规则
INSERT INTO pool_rules (name, description, ruleType, conditions, enabled, priority) VALUES
    ('每日领取限制', '销售人员每日最多领取 10 个客户', 'claim_limit',
     '{"maxClaimPerDay": 10, "maxClaimPerMonth": 100}'::jsonb, true, 80),
    ('跟进率要求', '销售人员跟进率低于 80% 限制领取', 'claim_limit',
     '{"minFollowUpRate": 0.8}'::jsonb, true, 70)
ON CONFLICT DO NOTHING;

-- 3. 客户画像标签表
CREATE TABLE IF NOT EXISTS customer_profile_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customerId UUID NOT NULL,
    tagName VARCHAR(100) NOT NULL,
    tagCategory VARCHAR(50), -- basic, behavior, value, risk
    tagSource VARCHAR(50) DEFAULT 'system', -- system, manual
    score INT DEFAULT 0,
    expiresAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(customerId, tagName)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_customer_tags_customer ON customer_profile_tags(customerId);
CREATE INDEX IF NOT EXISTS idx_customer_tags_name ON customer_profile_tags(tagName);
CREATE INDEX IF NOT EXISTS idx_customer_tags_category ON customer_profile_tags(tagCategory);

-- 4. 客户评分表
CREATE TABLE IF NOT EXISTS customer_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customerId UUID NOT NULL UNIQUE,
    overallScore INT DEFAULT 0, -- 0-100
    valueScore INT DEFAULT 0,
    activityScore INT DEFAULT 0,
    loyaltyScore INT DEFAULT 0,
    riskScore INT DEFAULT 0,
    valueLevel VARCHAR(10), -- S, A, B, C, D, E
    activityLevel VARCHAR(20), -- 非常活跃，活跃，一般，不活跃，沉睡
    lastCalculatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_customer_scores_customer ON customer_scores(customerId);
CREATE INDEX IF NOT EXISTS idx_customer_scores_overall ON customer_scores(overallScore);
CREATE INDEX IF NOT EXISTS idx_customer_scores_valueLevel ON customer_scores(valueLevel);

-- 5. 销售预测表
CREATE TABLE IF NOT EXISTS sales_forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period VARCHAR(20) NOT NULL, -- week, month, quarter
    periodStart DATE NOT NULL,
    periodEnd DATE NOT NULL,
    predictedAmount DECIMAL(15, 2) DEFAULT 0,
    actualAmount DECIMAL(15, 2) DEFAULT 0,
    confidence DECIMAL(5, 2) DEFAULT 0, -- 0-100
    breakdown JSONB, -- 按阶段/人员/产品分解
    trends JSONB, -- 趋势数据
    recommendations JSONB, -- 推荐建议
    status VARCHAR(20) DEFAULT 'pending', -- pending, completed
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_sales_forecasts_period ON sales_forecasts(period);
CREATE INDEX IF NOT EXISTS idx_sales_forecasts_dates ON sales_forecasts(periodStart, periodEnd);
CREATE INDEX IF NOT EXISTS idx_sales_forecasts_status ON sales_forecasts(status);

-- 6. 销售预测明细表
CREATE TABLE IF NOT EXISTS sales_forecast_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    forecastId UUID NOT NULL,
    dimension VARCHAR(50) NOT NULL, -- stage, salesperson, product
    dimensionValue VARCHAR(200) NOT NULL,
    amount DECIMAL(15, 2) DEFAULT 0,
    probability DECIMAL(5, 2) DEFAULT 0,
    count INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (forecastId) REFERENCES sales_forecasts(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_forecast_details_forecast ON sales_forecast_details(forecastId);
CREATE INDEX IF NOT EXISTS idx_forecast_details_dimension ON sales_forecast_details(dimension);

-- ==================== 插入默认标签定义 ====================

-- 标签分类定义
INSERT INTO customer_profile_tags (customerId, tagName, tagCategory, tagSource)
SELECT 
    '00000000-0000-0000-0000-000000000000' as customerId, -- 占位符
    tag,
    category,
    'system'
FROM (
    VALUES 
        ('高频购买', 'behavior'),
        ('稳定客户', 'behavior'),
        ('大单客户', 'value'),
        ('高跟进', 'behavior'),
        ('未跟进', 'behavior'),
        ('VIP 客户', 'value'),
        ('重点客户', 'value'),
        ('企业客户', 'basic'),
        ('政府客户', 'basic'),
        ('新客户', 'basic'),
        ('老客户', 'basic'),
        ('沉睡客户', 'risk'),
        ('流失风险', 'risk')
) AS tags(tag, category)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 视图和函数
-- =====================================================

-- 创建公海池统计视图
CREATE OR REPLACE VIEW v_pool_stats AS
SELECT 
    status,
    COUNT(*) as count,
    COUNT(DISTINCT source) as source_count,
    AVG(claimCount) as avg_claim_count
FROM customer_pools
GROUP BY status;

-- 创建客户价值等级视图
CREATE OR REPLACE VIEW v_customer_value_levels AS
SELECT 
    cs.customerId,
    cs.valueLevel,
    cs.overallScore,
    cp.customerName,
    cp.source,
    cp.level
FROM customer_scores cs
JOIN customer_pools cp ON cs.customerId = cp.customerId
WHERE cs.valueLevel IS NOT NULL;

-- =====================================================
-- 验证查询
-- =====================================================
-- 查看创建的表
-- SELECT tablename FROM pg_tables WHERE tablename IN ('customer_pools', 'pool_rules', 'customer_profile_tags', 'customer_scores', 'sales_forecasts', 'sales_forecast_details');

-- 查看公海池规则
-- SELECT name, ruleType, conditions FROM pool_rules WHERE enabled = true;

-- 查看公海池统计
-- SELECT * FROM v_pool_stats;
