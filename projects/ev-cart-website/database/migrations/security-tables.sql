-- =====================================================
-- 数据安全模块 - 数据库表创建脚本
-- =====================================================
-- 创建时间：2026-03-12
-- 模块：操作审计日志 + 数据导出限制 + 离职交接
-- =====================================================

-- 1. 导出限制表
CREATE TABLE IF NOT EXISTS export_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL,
    dataType VARCHAR(50) NOT NULL,
    dailyLimit INT DEFAULT 10,
    singleLimit INT DEFAULT 1000,
    todayCount INT DEFAULT 0,
    todayRecordCount INT DEFAULT 0,
    lastResetDate DATE,
    requiresApproval BOOLEAN DEFAULT false,
    approverId UUID,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_export_limits_userId ON export_limits(userId);
CREATE INDEX IF NOT EXISTS idx_export_limits_dataType ON export_limits(dataType);
CREATE UNIQUE INDEX IF NOT EXISTS idx_export_limits_userId_dataType ON export_limits(userId, dataType);

-- 2. 导出记录表
CREATE TABLE IF NOT EXISTS export_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    userId UUID NOT NULL,
    userName VARCHAR(100) NOT NULL,
    dataType VARCHAR(50) NOT NULL,
    recordCount INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    reason TEXT,
    approverId UUID,
    approverName VARCHAR(100),
    approvedAt TIMESTAMP,
    rejectReason TEXT,
    ip VARCHAR(45) NOT NULL,
    userAgent TEXT,
    downloadUrl TEXT,
    downloadExpiresAt TIMESTAMP,
    downloadCount INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_export_records_userId ON export_records(userId);
CREATE INDEX IF NOT EXISTS idx_export_records_dataType ON export_records(dataType);
CREATE INDEX IF NOT EXISTS idx_export_records_status ON export_records(status);
CREATE INDEX IF NOT EXISTS idx_export_records_createdAt ON export_records(createdAt);

-- 3. 离职交接单表
CREATE TABLE IF NOT EXISTS user_handovers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leavingUserId UUID NOT NULL,
    leavingUserName VARCHAR(100) NOT NULL,
    receiverUserId UUID NOT NULL,
    receiverUserName VARCHAR(100) NOT NULL,
    handoverType VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    customerCount INT DEFAULT 0,
    leadCount INT DEFAULT 0,
    opportunityCount INT DEFAULT 0,
    orderCount INT DEFAULT 0,
    todoCount INT DEFAULT 0,
    description TEXT,
    handoverList JSONB,
    approverId UUID,
    approverName VARCHAR(100),
    approvedAt TIMESTAMP,
    completedAt TIMESTAMP,
    cancelReason TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_handovers_leavingUserId ON user_handovers(leavingUserId);
CREATE INDEX IF NOT EXISTS idx_user_handovers_receiverUserId ON user_handovers(receiverUserId);
CREATE INDEX IF NOT EXISTS idx_user_handovers_status ON user_handovers(status);

-- 4. 交接清单项表
CREATE TABLE IF NOT EXISTS handover_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    handoverId UUID NOT NULL,
    itemType VARCHAR(50) NOT NULL,
    itemId UUID NOT NULL,
    itemName VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    remark TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_handover_items_handoverId ON handover_items(handoverId);
CREATE INDEX IF NOT EXISTS idx_handover_items_itemId ON handover_items(itemId);

-- 5. 插入默认导出限制配置
INSERT INTO export_limits (userId, dataType, dailyLimit, singleLimit, requiresApproval)
VALUES 
    ('default', 'customer', 10, 1000, false),
    ('default', 'lead', 10, 1000, false),
    ('default', 'opportunity', 10, 1000, false),
    ('default', 'order', 10, 1000, false),
    ('default', 'dealer', 10, 1000, false)
ON CONFLICT (userId, dataType) DO NOTHING;

-- =====================================================
-- 验证查询
-- =====================================================
-- 查看创建的表
-- SELECT tablename FROM pg_tables WHERE tablename IN ('export_limits', 'export_records', 'user_handovers', 'handover_items');

-- 查看默认配置
-- SELECT * FROM export_limits WHERE userId = 'default';
