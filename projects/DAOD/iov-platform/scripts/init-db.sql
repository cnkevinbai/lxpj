-- 初始化数据库脚本

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 租户表
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    email VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, email)
);

-- 角色表
CREATE TABLE IF NOT EXISTS roles (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    name VARCHAR(50) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    permissions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, code)
);

-- 车辆表
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    vehicle_id VARCHAR(50) NOT NULL,
    vin VARCHAR(17) UNIQUE,
    plate_no VARCHAR(20),
    vehicle_type VARCHAR(50),
    brand VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(20),
    status VARCHAR(20) DEFAULT 'offline',
    terminal_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, vehicle_id)
);

-- 终端表
CREATE TABLE IF NOT EXISTS terminals (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    terminal_id VARCHAR(50) NOT NULL,
    sim_card VARCHAR(20),
    vehicle_id VARCHAR(36) REFERENCES vehicles(id),
    status VARCHAR(20) DEFAULT 'offline',
    signal_strength INTEGER DEFAULT 0,
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tenant_id, terminal_id)
);

-- 告警表
CREATE TABLE IF NOT EXISTS alarms (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    alarm_no VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    title VARCHAR(200),
    content TEXT,
    vehicle_id VARCHAR(36) REFERENCES vehicles(id),
    terminal_id VARCHAR(36) REFERENCES terminals(id),
    location GEOMETRY(Point, 4326),
    occur_at TIMESTAMP,
    handled_at TIMESTAMP,
    handler VARCHAR(100),
    handle_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 电子围栏表
CREATE TABLE IF NOT EXISTS geofences (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    coordinates JSONB NOT NULL,
    radius INTEGER,
    alarm_type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTA 固件表
CREATE TABLE IF NOT EXISTS firmwares (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    version VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    device_model VARCHAR(100),
    file_size BIGINT,
    checksum VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTA 任务表
CREATE TABLE IF NOT EXISTS ota_tasks (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(36) REFERENCES tenants(id),
    firmware_id VARCHAR(36) REFERENCES firmwares(id),
    status VARCHAR(20) DEFAULT 'pending',
    total_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    progress DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- 模块表
CREATE TABLE IF NOT EXISTS modules (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    version VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    state VARCHAR(20) DEFAULT 'uninitialized',
    health_status VARCHAR(20) DEFAULT 'unknown',
    priority INTEGER DEFAULT 50,
    description TEXT,
    dependencies JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX idx_terminals_tenant ON terminals(tenant_id);
CREATE INDEX idx_alarms_tenant ON alarms(tenant_id);
CREATE INDEX idx_alarms_status ON alarms(status);
CREATE INDEX idx_terminals_status ON terminals(status);

-- 插入默认租户
INSERT INTO tenants (id, name, code, status) 
VALUES ('00000000-0000-0000-0000-000000000001', '默认租户', 'default', 'active')
ON CONFLICT (id) DO NOTHING;

-- 插入默认管理员
INSERT INTO users (id, tenant_id, email, password_hash, name, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'admin@daod.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrD4aK0W4sPqF6xnB3hLQJmJD4K.M8S', -- password: admin123
    '系统管理员',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- 插入核心模块
INSERT INTO modules (id, name, version, type, state, health_status, priority, description) VALUES
('10000000-0000-0000-0000-000000000001', 'plugin-framework', '1.0.0', 'core', 'running', 'healthy', 5, '插件框架核心'),
('10000000-0000-0000-0000-000000000002', 'event-bus', '1.0.0', 'core', 'running', 'healthy', 5, '事件总线'),
('10000000-0000-0000-0000-000000000003', 'config-center', '1.0.0', 'core', 'running', 'healthy', 10, '配置中心'),
('10000000-0000-0000-0000-000000000004', 'auth-service', '1.0.0', 'core', 'running', 'healthy', 15, '认证服务'),
('10000000-0000-0000-0000-000000000005', 'vehicle-access', '1.0.0', 'business', 'running', 'healthy', 60, '车辆接入服务'),
('10000000-0000-0000-0000-000000000006', 'monitor-service', '1.0.0', 'business', 'running', 'healthy', 70, '监控服务'),
('10000000-0000-0000-0000-000000000007', 'alarm-service', '1.0.0', 'business', 'running', 'healthy', 70, '告警服务'),
('10000000-0000-0000-0000-000000000008', 'planning-service', '1.0.0', 'business', 'running', 'healthy', 50, '规划服务'),
('10000000-0000-0000-0000-000000000009', 'mqtt-adapter', '1.0.0', 'adapter', 'stopped', 'offline', 20, 'MQTT适配器')
ON CONFLICT (name) DO NOTHING;