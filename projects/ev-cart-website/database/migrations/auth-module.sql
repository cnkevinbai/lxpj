-- =====================================================
-- 权限管理模块 - 数据库表
-- =====================================================

-- 角色表
CREATE TABLE IF NOT EXISTS system_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_code VARCHAR(50) UNIQUE NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_roles_code ON system_roles(role_code);
CREATE INDEX IF NOT EXISTS idx_system_roles_active ON system_roles(is_active);

-- 用户表
CREATE TABLE IF NOT EXISTS system_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    real_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    department VARCHAR(100),
    position VARCHAR(100),
    role_id UUID REFERENCES system_roles(id),
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_users_username ON system_users(username);
CREATE INDEX IF NOT EXISTS idx_system_users_email ON system_users(email);
CREATE INDEX IF NOT EXISTS idx_system_users_role ON system_users(role_id);
CREATE INDEX IF NOT EXISTS idx_system_users_active ON system_users(is_active);

-- 菜单表
CREATE TABLE IF NOT EXISTS system_menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_code VARCHAR(50) UNIQUE NOT NULL,
    menu_name VARCHAR(100) NOT NULL,
    parent_id UUID,
    path VARCHAR(255),
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    permissions VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_menus_parent ON system_menus(parent_id);
CREATE INDEX IF NOT EXISTS idx_system_menus_visible ON system_menus(is_visible);

-- 操作日志表
CREATE TABLE IF NOT EXISTS system_operation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_name VARCHAR(100),
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50),
    resource_id UUID,
    request_method VARCHAR(10),
    request_url TEXT,
    request_body JSONB,
    response_status INT,
    ip_address VARCHAR(50),
    user_agent TEXT,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_operation_logs_user ON system_operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_operation_logs_action ON system_operation_logs(action);
CREATE INDEX IF NOT EXISTS idx_system_operation_logs_module ON system_operation_logs(module);
CREATE INDEX IF NOT EXISTS idx_system_operation_logs_created ON system_operation_logs(created_at);

-- 登录日志表
CREATE TABLE IF NOT EXISTS system_login_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    username VARCHAR(100),
    login_type VARCHAR(20) DEFAULT 'password',
    ip_address VARCHAR(50),
    user_agent TEXT,
    login_status VARCHAR(20) DEFAULT 'success',
    failure_reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_system_login_logs_user ON system_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_system_login_logs_status ON system_login_logs(login_status);

-- 插入默认角色
INSERT INTO system_roles (role_code, role_name, description, permissions) VALUES
    ('admin', '超级管理员', '系统超级管理员，拥有所有权限', '["*"]'),
    ('manager', '部门经理', '部门经理，拥有部门管理权限', '["users:read", "users:write", "reports:read"]'),
    ('sales', '销售人员', '销售人员，拥有客户和订单管理权限', '["customers:*", "orders:*", "products:read"]'),
    ('finance', '财务人员', '财务人员，拥有财务管理权限', '["finance:*", "reports:read"]'),
    ('service', '客服人员', '客服人员，拥有售后服务权限', '["service:*", "customers:read"]'),
    ('viewer', '普通员工', '普通员工，只读权限', '["dashboard:read", "products:read"]')
ON CONFLICT DO NOTHING;

-- 插入默认管理员账户（密码：admin123）
INSERT INTO system_users (username, email, password_hash, real_name, role_id, is_active) VALUES
    ('admin', 'admin@evcart.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '系统管理员', (SELECT id FROM system_roles WHERE role_code = 'admin'), true)
ON CONFLICT DO NOTHING;

-- 插入默认菜单
INSERT INTO system_menus (menu_code, menu_name, parent_id, path, icon, sort_order) VALUES
    ('dashboard', '仪表盘', NULL, '/dashboard', 'DashboardOutlined', 1),
    ('customers', '客户管理', NULL, '/customers', 'TeamOutlined', 2),
    ('orders', '订单管理', NULL, '/orders', 'ShoppingCartOutlined', 3),
    ('products', '产品管理', NULL, '/products', 'AppstoreOutlined', 4),
    ('dealers', '经销商管理', NULL, '/dealers', 'ShopOutlined', 5),
    ('jobs', '招聘管理', NULL, '/jobs', 'TeamOutlined', 6),
    ('resumes', '简历管理', 'jobs', '/resumes', 'FileTextOutlined', 7),
    ('interviews', '面试管理', 'jobs', '/interviews', 'CalendarOutlined', 8),
    ('finance', '财务管理', NULL, '/finance', 'DollarOutlined', 9),
    ('reports', '报表中心', NULL, '/reports', 'BarChartOutlined', 10),
    ('messages', '消息中心', NULL, '/messages', 'MailOutlined', 11),
    ('settings', '系统设置', NULL, '/settings', 'SettingOutlined', 12)
ON CONFLICT DO NOTHING;
