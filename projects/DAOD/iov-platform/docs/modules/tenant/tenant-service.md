# 租户服务模块 (tenant-service)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | tenant-service |
| 模块版本 | 1.0.0 |
| 模块类型 | business |
| 优先级 | 50 |
| 负责人 | 后端开发 |
| 开发周期 | Week 10 |

### 1.2 功能描述

租户服务模块是多租户账号体系的核心模块，负责管理生产厂家租户的创建、配置、授权和到期管理。每个生产厂家对应一个独立租户，实现数据隔离和资源隔离。

### 1.3 核心能力

- 租户创建与管理
- 租户配置管理
- 租户授权管理
- 租户到期管理
- 租户数据隔离
- 租户资源配额

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          租户服务架构                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API Layer                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ TenantAPI       │  │ TenantConfigAPI │  │ TenantAuthAPI   │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Service Layer                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        TenantService                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │TenantManager│ │ConfigManager│ │AuthManager  │ │QuotaManager │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Data Isolation Layer                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    TenantContextManager                                  │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                       │   │
│  │  │ContextFilter│ │DataScope    │ │CacheIsolate │                       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Storage Layer                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ PostgreSQL      │  │ Redis Cache     │  │ MinIO Storage   │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.tenant;

public interface TenantService {
    
    Tenant createTenant(TenantCreateRequest request);
    
    Tenant getTenant(String tenantId);
    
    Tenant getTenantByCode(String tenantCode);
    
    Tenant updateTenant(String tenantId, TenantUpdateRequest request);
    
    void deleteTenant(String tenantId);
    
    void enableTenant(String tenantId);
    
    void disableTenant(String tenantId);
    
    PageResult<Tenant> listTenants(TenantQueryRequest request);
    
    TenantStatus getTenantStatus(String tenantId);
    
    boolean checkTenantAvailable(String tenantId);
}

public interface TenantConfigService {
    
    TenantConfig getConfig(String tenantId);
    
    void updateConfig(String tenantId, TenantConfig config);
    
    void setConfigValue(String tenantId, String key, String value);
    
    String getConfigValue(String tenantId, String key);
}

public interface TenantQuotaService {
    
    TenantQuota getQuota(String tenantId);
    
    void updateQuota(String tenantId, TenantQuota quota);
    
    boolean checkQuotaAvailable(String tenantId, QuotaType type, int amount);
    
    void consumeQuota(String tenantId, QuotaType type, int amount);
    
    void releaseQuota(String tenantId, QuotaType type, int amount);
    
    QuotaUsage getQuotaUsage(String tenantId);
}

public interface TenantContextService {
    
    void setCurrentTenant(String tenantId);
    
    Tenant getCurrentTenant();
    
    String getCurrentTenantId();
    
    void clearCurrentTenant();
    
    boolean isInTenantContext();
}
```

### 2.3 数据模型

```java
@Data
public class Tenant {
    private String id;
    private String tenantCode;
    private String tenantName;
    private TenantType tenantType;
    private String contactName;
    private String contactPhone;
    private String contactEmail;
    private String address;
    private String licenseNo;
    private TenantStatus status;
    private LocalDateTime expireTime;
    private TenantConfig config;
    private TenantQuota quota;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
public class TenantConfig {
    private String logo;
    private String theme;
    private String domain;
    private Map<String, String> settings;
    private NotificationConfig notification;
    private SecurityConfig security;
}

@Data
public class TenantQuota {
    private int maxVehicles;
    private int maxUsers;
    private int maxStorageMB;
    private int maxApiCallsPerDay;
    private int maxSubAccounts;
}

@Data
public class TenantQuotaUsage {
    private String tenantId;
    private int vehicleCount;
    private int userCount;
    private long storageUsedMB;
    private int apiCallsToday;
    private int subAccountCount;
    private LocalDateTime updatedAt;
}

public enum TenantType {
    MANUFACTURER,
    DEALER,
    OPERATOR
}

public enum TenantStatus {
    ACTIVE,
    DISABLED,
    EXPIRED,
    PENDING
}
```

### 2.4 数据库设计

```sql
CREATE TABLE tenants (
    id VARCHAR(32) PRIMARY KEY,
    tenant_code VARCHAR(50) UNIQUE NOT NULL,
    tenant_name VARCHAR(100) NOT NULL,
    tenant_type VARCHAR(20) NOT NULL DEFAULT 'MANUFACTURER',
    contact_name VARCHAR(50),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    address VARCHAR(200),
    license_no VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    expire_time TIMESTAMP,
    config JSONB,
    quota JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tenant_configs (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    config_type VARCHAR(20) DEFAULT 'STRING',
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(tenant_id, config_key)
);

CREATE TABLE tenant_quotas (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    quota_type VARCHAR(50) NOT NULL,
    quota_limit INT NOT NULL,
    quota_used INT DEFAULT 0,
    reset_cycle VARCHAR(20) DEFAULT 'MONTHLY',
    last_reset_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(tenant_id, quota_type)
);

CREATE TABLE tenant_usage_stats (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    stat_date DATE NOT NULL,
    vehicle_count INT DEFAULT 0,
    user_count INT DEFAULT 0,
    storage_used_mb BIGINT DEFAULT 0,
    api_calls INT DEFAULT 0,
    sub_account_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(tenant_id, stat_date)
);

CREATE INDEX idx_tenants_code ON tenants(tenant_code);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenant_quotas_tenant ON tenant_quotas(tenant_id);
```

### 2.5 租户上下文实现

```java
@Component
public class TenantContextManager {
    
    private static final ThreadLocal<TenantContext> CONTEXT = new ThreadLocal<>();
    
    public void setCurrentTenant(String tenantId, String tenantCode) {
        TenantContext context = new TenantContext(tenantId, tenantCode);
        CONTEXT.set(context);
    }
    
    public TenantContext getCurrentContext() {
        return CONTEXT.get();
    }
    
    public String getCurrentTenantId() {
        TenantContext context = CONTEXT.get();
        return context != null ? context.getTenantId() : null;
    }
    
    public void clear() {
        CONTEXT.remove();
    }
    
    @Data
    @AllArgsConstructor
    public static class TenantContext {
        private String tenantId;
        private String tenantCode;
    }
}

@Component
public class TenantFilter implements Filter {
    
    @Autowired
    private TenantContextManager tenantContextManager;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String token = extractToken(httpRequest);
        
        if (token != null) {
            try {
                JwtPayload payload = jwtTokenService.parseToken(token);
                tenantContextManager.setCurrentTenant(
                    payload.getTenantId(), 
                    payload.getTenantCode()
                );
            } catch (Exception e) {
                log.warn("Failed to parse tenant context from token: {}", e.getMessage());
            }
        }
        
        try {
            chain.doFilter(request, response);
        } finally {
            tenantContextManager.clear();
        }
    }
}
```

### 2.6 数据隔离实现

```java
@Aspect
@Component
public class TenantDataIsolationAspect {
    
    @Autowired
    private TenantContextManager tenantContextManager;
    
    @Before("@annotation(tenantScoped)")
    public void beforeTenantScoped(JoinPoint joinPoint, TenantScoped tenantScoped) {
        String tenantId = tenantContextManager.getCurrentTenantId();
        if (tenantId == null) {
            throw new TenantContextException("No tenant context found");
        }
    }
    
    @Around("execution(* com.daod.iov.modules..repository..*(..))")
    public Object applyTenantFilter(ProceedingJoinPoint joinPoint) throws Throwable {
        String tenantId = tenantContextManager.getCurrentTenantId();
        
        if (tenantId != null) {
            MybatisPlusInterceptor interceptor = getInterceptor(joinPoint);
            if (interceptor != null) {
                TenantLineHandler handler = new TenantLineHandler() {
                    @Override
                    public Expression getTenantId() {
                        return new StringValue(tenantId);
                    }
                    
                    @Override
                    public boolean ignoreTable(String tableName) {
                        return !shouldFilterTable(tableName);
                    }
                };
                setTenantHandler(interceptor, handler);
            }
        }
        
        return joinPoint.proceed();
    }
    
    private boolean shouldFilterTable(String tableName) {
        return Arrays.asList(
            "vehicles", "device_bindings", "vehicle_groups",
            "alarms", "alarm_rules", "geofences",
            "ota_tasks", "ota_packages"
        ).contains(tableName.toLowerCase());
    }
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/tenant | 创建租户 |
| GET | /api/tenant/{tenantId} | 获取租户信息 |
| PUT | /api/tenant/{tenantId} | 更新租户信息 |
| DELETE | /api/tenant/{tenantId} | 删除租户 |
| POST | /api/tenant/{tenantId}/enable | 启用租户 |
| POST | /api/tenant/{tenantId}/disable | 禁用租户 |
| GET | /api/tenant | 查询租户列表 |
| GET | /api/tenant/{tenantId}/config | 获取租户配置 |
| PUT | /api/tenant/{tenantId}/config | 更新租户配置 |
| GET | /api/tenant/{tenantId}/quota | 获取租户配额 |
| PUT | /api/tenant/{tenantId}/quota | 更新租户配额 |
| GET | /api/tenant/{tenantId}/usage | 获取租户使用量 |

### 3.2 API示例

```json
POST /api/tenant
{
    "tenantCode": "DAOD001",
    "tenantName": "四川道达智能车辆制造有限公司",
    "tenantType": "MANUFACTURER",
    "contactName": "张三",
    "contactPhone": "13800138000",
    "contactEmail": "zhangsan@daod.com",
    "address": "四川省成都市高新区",
    "licenseNo": "91510100MA12345678",
    "expireTime": "2027-03-17T00:00:00Z",
    "quota": {
        "maxVehicles": 1000,
        "maxUsers": 100,
        "maxStorageMB": 10240,
        "maxApiCallsPerDay": 100000,
        "maxSubAccounts": 50
    }
}

Response:
{
    "code": 200,
    "message": "Tenant created successfully",
    "data": {
        "id": "T001",
        "tenantCode": "DAOD001",
        "tenantName": "四川道达智能车辆制造有限公司",
        "status": "ACTIVE",
        "createdAt": "2026-03-17T10:00:00Z"
    }
}

GET /api/tenant/T001/quota

Response:
{
    "code": 200,
    "data": {
        "tenantId": "T001",
        "quota": {
            "maxVehicles": 1000,
            "maxUsers": 100,
            "maxStorageMB": 10240,
            "maxApiCallsPerDay": 100000,
            "maxSubAccounts": 50
        },
        "usage": {
            "vehicleCount": 150,
            "userCount": 25,
            "storageUsedMB": 2048,
            "apiCallsToday": 5000,
            "subAccountCount": 10
        }
    }
}
```

## 4. 配置项

```yaml
tenant:
  enabled: true
  default-quota:
    max-vehicles: 100
    max-users: 10
    max-storage-mb: 1024
    max-api-calls-per-day: 10000
    max-sub-accounts: 5
  cache:
    enabled: true
    ttl: 300
  isolation:
    enabled: true
    filter-tables:
      - vehicles
      - device_bindings
      - alarms
      - geofences
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testCreateTenant | 测试创建租户 | 租户创建成功 |
| testUpdateTenant | 测试更新租户 | 租户信息更新成功 |
| testDeleteTenant | 测试删除租户 | 租户删除成功 |
| testTenantQuota | 测试配额管理 | 配额检查和消耗正确 |
| testTenantContext | 测试租户上下文 | 上下文设置和获取正确 |
| testDataIsolation | 测试数据隔离 | 数据隔离正确 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testMultiTenantAccess | 测试多租户访问 | 租户间数据隔离 |
| testTenantExpiration | 测试租户到期 | 到期后访问受限 |
| testQuotaExceeded | 测试配额超限 | 超限后操作被拒绝 |

## 6. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: common-security
    version: ">=1.0.0"
  - name: common-cache
    version: ">=1.0.0"
  - name: config-center
    version: ">=1.0.0"
```

## 7. 部署说明

### 7.1 资源需求

```yaml
resources:
  cpu: "100m"
  memory: "128Mi"
```

### 7.2 健康检查

```yaml
healthCheck:
  liveness: /health/live
  readiness: /health/ready
```

## 8. 监控指标

| 指标名 | 类型 | 描述 |
|-------|------|------|
| tenant_total | Gauge | 租户总数 |
| tenant_active | Gauge | 活跃租户数 |
| tenant_quota_usage | Gauge | 租户配额使用率 |
| tenant_api_calls | Counter | 租户API调用次数 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
