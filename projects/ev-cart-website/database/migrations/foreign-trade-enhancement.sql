-- =====================================================
-- 外贸功能增强 - 数据库表创建脚本
-- =====================================================
-- 创建时间：2026-03-12
-- 模块：多币种支持 + WhatsApp 集成 + 多语言
-- =====================================================

-- 1. 货币表
CREATE TABLE IF NOT EXISTS currencies (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    rateToCNY DECIMAL(10, 6) DEFAULT 1,
    rateToUSD DECIMAL(10, 6) DEFAULT 1,
    baseCurrency VARCHAR(10) DEFAULT 'CNY',
    enabled BOOLEAN DEFAULT true,
    precision INT DEFAULT 2,
    metadata JSONB,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_currencies_rateToCNY ON currencies(rateToCNY);
CREATE INDEX IF NOT EXISTS idx_currencies_enabled ON currencies(enabled);

-- 2. 汇率历史表
CREATE TABLE IF NOT EXISTS currency_rates_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fromCurrency VARCHAR(3) NOT NULL,
    toCurrency VARCHAR(3) NOT NULL,
    rate DECIMAL(10, 6) NOT NULL,
    inverseRate DECIMAL(10, 6),
    source VARCHAR(50),
    rateDate TIMESTAMP NOT NULL,
    remark TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_currency_history_from ON currency_rates_history(fromCurrency);
CREATE INDEX IF NOT EXISTS idx_currency_history_to ON currency_rates_history(toCurrency);
CREATE INDEX IF NOT EXISTS idx_currency_history_date ON currency_rates_history(rateDate);
CREATE INDEX IF NOT EXISTS idx_currency_history_from_to_date ON currency_rates_history(fromCurrency, toCurrency, rateDate);

-- 3. WhatsApp 配置表
CREATE TABLE IF NOT EXISTS whatsapp_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    phoneNumberId VARCHAR(100) NOT NULL,
    accessToken TEXT NOT NULL,
    verifyToken VARCHAR(200),
    webhookUrl TEXT,
    enabled BOOLEAN DEFAULT true,
    metadata JSONB,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_whatsapp_enabled ON whatsapp_configs(enabled);

-- 4. WhatsApp 消息记录表
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    to VARCHAR(50) NOT NULL,
    from VARCHAR(50),
    messageType VARCHAR(20) NOT NULL, -- text, template, image, video, document
    content TEXT,
    templateName VARCHAR(100),
    mediaUrl TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, read, failed
    errorCode VARCHAR(50),
    errorMessage TEXT,
    metadata JSONB,
    sentAt TIMESTAMP,
    deliveredAt TIMESTAMP,
    readAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_whatsapp_msg_to ON whatsapp_messages(to);
CREATE INDEX IF NOT EXISTS idx_whatsapp_msg_status ON whatsapp_messages(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_msg_created ON whatsapp_messages(createdAt);

-- 5. 多语言翻译表
CREATE TABLE IF NOT EXISTS i18n_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    translationKey VARCHAR(200) NOT NULL,
    language VARCHAR(10) NOT NULL,
    translation TEXT NOT NULL,
    context VARCHAR(100), -- 上下文，如 common, order, customer 等
    namespace VARCHAR(50) DEFAULT 'default',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(translationKey, language, namespace)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_i18n_key ON i18n_translations(translationKey);
CREATE INDEX IF NOT EXISTS idx_i18n_language ON i18n_translations(language);
CREATE INDEX IF NOT EXISTS idx_i18n_namespace ON i18n_translations(namespace);

-- ==================== 插入默认数据 ====================

-- 插入主要货币
INSERT INTO currencies (code, name, symbol, rateToCNY, rateToUSD, precision, metadata) VALUES
    ('CNY', '人民币', '¥', 1.0, 0.14, 2, '{"country": "China", "flag": "🇨🇳"}'::jsonb),
    ('USD', '美元', '$', 7.2, 1.0, 2, '{"country": "United States", "flag": "🇺🇸"}'::jsonb),
    ('EUR', '欧元', '€', 7.8, 1.08, 2, '{"country": "Eurozone", "flag": "🇪🇺"}'::jsonb),
    ('GBP', '英镑', '£', 9.1, 1.26, 2, '{"country": "United Kingdom", "flag": "🇬🇧"}'::jsonb),
    ('JPY', '日元', '¥', 0.048, 0.0067, 0, '{"country": "Japan", "flag": "🇯🇵"}'::jsonb),
    ('KRW', '韩元', '₩', 0.0054, 0.00075, 0, '{"country": "South Korea", "flag": "🇰🇷"}'::jsonb),
    ('RUB', '卢布', '₽', 0.078, 0.011, 2, '{"country": "Russia", "flag": "🇷🇺"}'::jsonb),
    ('BRL', '雷亚尔', 'R$', 1.45, 0.20, 2, '{"country": "Brazil", "flag": "🇧🇷"}'::jsonb),
    ('INR', '卢比', '₹', 0.086, 0.012, 2, '{"country": "India", "flag": "🇮🇳"}'::jsonb),
    ('AUD', '澳元', 'A$', 4.7, 0.65, 2, '{"country": "Australia", "flag": "🇦🇺"}'::jsonb),
    ('CAD', '加元', 'C$', 5.3, 0.74, 2, '{"country": "Canada", "flag": "🇨🇦"}'::jsonb),
    ('CHF', '瑞郎', 'Fr', 8.1, 1.12, 2, '{"country": "Switzerland", "flag": "🇨🇭"}'::jsonb),
    ('SGD', '新加坡元', 'S$', 5.4, 0.75, 2, '{"country": "Singapore", "flag": "🇸🇬"}'::jsonb),
    ('AED', '迪拉姆', 'د.إ', 1.96, 0.27, 2, '{"country": "UAE", "flag": "🇦🇪"}'::jsonb),
    ('SAR', '里亚尔', '﷼', 1.92, 0.27, 2, '{"country": "Saudi Arabia", "flag": "🇸🇦"}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 插入默认汇率历史（今日）
INSERT INTO currency_rates_history (fromCurrency, toCurrency, rate, inverseRate, source, rateDate)
SELECT 
    code,
    'CNY',
    rateToCNY,
    1.0 / rateToCNY,
    'system',
    CURRENT_DATE
FROM currencies
WHERE code != 'CNY'
ON CONFLICT DO NOTHING;

-- 插入常用多语言翻译
INSERT INTO i18n_translations (translationKey, language, translation, context, namespace) VALUES
    -- 通用
    ('common.save', 'zh', '保存', 'common', 'default'),
    ('common.save', 'en', 'Save', 'common', 'default'),
    ('common.delete', 'zh', '删除', 'common', 'default'),
    ('common.delete', 'en', 'Delete', 'common', 'default'),
    ('common.edit', 'zh', '编辑', 'common', 'default'),
    ('common.edit', 'en', 'Edit', 'common', 'default'),
    ('common.cancel', 'zh', '取消', 'common', 'default'),
    ('common.cancel', 'en', 'Cancel', 'common', 'default'),
    ('common.confirm', 'zh', '确认', 'common', 'default'),
    ('common.confirm', 'en', 'Confirm', 'common', 'default'),
    ('common.search', 'zh', '搜索', 'common', 'default'),
    ('common.search', 'en', 'Search', 'common', 'default'),
    ('common.loading', 'zh', '加载中...', 'common', 'default'),
    ('common.loading', 'en', 'Loading...', 'common', 'default'),
    ('common.success', 'zh', '成功', 'common', 'default'),
    ('common.success', 'en', 'Success', 'common', 'default'),
    ('common.error', 'zh', '错误', 'common', 'default'),
    ('common.error', 'en', 'Error', 'common', 'default'),
    -- 订单
    ('order.create', 'zh', '创建订单', 'order', 'default'),
    ('order.create', 'en', 'Create Order', 'order', 'default'),
    ('order.total', 'zh', '总金额', 'order', 'default'),
    ('order.total', 'en', 'Total Amount', 'order', 'default'),
    -- 客户
    ('customer.name', 'zh', '客户名称', 'customer', 'default'),
    ('customer.name', 'en', 'Customer Name', 'customer', 'default'),
    ('customer.email', 'zh', '邮箱', 'customer', 'default'),
    ('customer.email', 'en', 'Email', 'customer', 'default'),
    ('customer.phone', 'zh', '电话', 'customer', 'default'),
    ('customer.phone', 'en', 'Phone', 'customer', 'default')
ON CONFLICT (translationKey, language, namespace) DO NOTHING;

-- =====================================================
-- 验证查询
-- =====================================================
-- 查看创建的表
-- SELECT tablename FROM pg_tables WHERE tablename IN ('currencies', 'currency_rates_history', 'whatsapp_configs', 'whatsapp_messages', 'i18n_translations');

-- 查看支持的货币
-- SELECT code, name, symbol, rateToCNY, rateToUSD FROM currencies WHERE enabled = true;

-- 查看支持的语言翻译
-- SELECT DISTINCT language FROM i18n_translations;
