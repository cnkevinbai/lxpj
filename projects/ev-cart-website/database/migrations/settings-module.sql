-- =====================================================
-- 系统设置模块 - 数据库表
-- =====================================================

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    key_name VARCHAR(100) NOT NULL,
    value_text TEXT,
    value_json JSONB,
    description TEXT,
    updated_by UUID,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, key_name)
);

CREATE INDEX IF NOT EXISTS idx_system_settings_category ON system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key_name);

-- 字典表
CREATE TABLE IF NOT EXISTS system_dictionary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category VARCHAR(50) NOT NULL,
    item_key VARCHAR(100) NOT NULL,
    item_value VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, item_key)
);

CREATE INDEX IF NOT EXISTS idx_system_dictionary_category ON system_dictionary(category);
CREATE INDEX IF NOT EXISTS idx_system_dictionary_active ON system_dictionary(is_active);

-- 插入默认字典数据
INSERT INTO system_dictionary (category, item_key, item_value, sort_order) VALUES
    ('customer_source', 'website', '官网', 1),
    ('customer_source', 'phone', '电话', 2),
    ('customer_source', 'exhibition', '展会', 3),
    ('customer_source', 'referral', '推荐', 4),
    ('customer_source', 'advertising', '广告', 5),
    ('customer_source', 'other', '其他', 6),
    
    ('customer_level', 'A', 'A 级 - 重点客户', 1),
    ('customer_level', 'B', 'B 级 - 普通客户', 2),
    ('customer_level', 'C', 'C 级 - 潜在客户', 3),
    
    ('dealer_level', 'trial', '试用经销商', 1),
    ('dealer_level', 'standard', '标准经销商', 2),
    ('dealer_level', 'gold', '金牌经销商', 3),
    ('dealer_level', 'platinum', '白金经销商', 4),
    ('dealer_level', 'strategic', '战略经销商', 5),
    
    ('order_status', 'pending', '待处理', 1),
    ('order_status', 'processing', '处理中', 2),
    ('order_status', 'completed', '已完成', 3),
    ('order_status', 'cancelled', '已取消', 4)
ON CONFLICT DO NOTHING;

-- 插入默认系统配置
INSERT INTO system_settings (category, key_name, value_text, description) VALUES
    ('basic', 'company_name', 'EV Cart 科技有限公司', '公司名称'),
    ('basic', 'company_address', '深圳市南山区科技园', '公司地址'),
    ('basic', 'company_phone', '400-888-8888', '联系电话'),
    ('basic', 'company_email', 'info@evcart.com', '联系邮箱'),
    ('basic', 'website', 'https://www.evcart.com', '公司官网'),
    ('basic', 'icp_license', '粤 ICP 备 12345678 号', 'ICP 备案号'),
    
    ('notification', 'email_enabled', 'true', '启用邮件通知'),
    ('notification', 'email_smtp_host', 'smtp.qq.com', 'SMTP 服务器'),
    ('notification', 'email_smtp_port', '587', 'SMTP 端口'),
    ('notification', 'email_username', 'noreply@evcart.com', '邮箱账号'),
    ('notification', 'sms_enabled', 'false', '启用短信通知'),
    ('notification', 'sms_provider', 'aliyun', '短信服务商'),
    ('notification', 'push_enabled', 'true', '启用 APP 推送')
ON CONFLICT DO NOTHING;
