# 子账号服务模块 (sub-account-service)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | sub-account-service |
| 模块版本 | 1.0.0 |
| 模块类型 | business |
| 优先级 | 50 |
| 负责人 | 后端开发 |
| 开发周期 | Week 10 |

### 1.2 功能描述

子账号服务模块负责管理经销商、车辆运营者、景区管理员、维保人员、驾驶员等子账号的创建、授权和管理。子账号由主账号创建，具有独立登录能力和独立面板。

### 1.3 核心能力

- 子账号创建与管理
- 子账号类型管理（经销商/运营者/景区管理员/维保/驾驶员）
- 子账号授权管理
- 子账号独立登录
- 子账号数据权限

## 2. 技术设计

### 2.1 账号类型定义

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          子账号类型定义                                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  账号类型        │ 代码          │ 特有字段                    │ 权限范围       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  经销商          │ DEALER        │ dealer_code, dealer_level   │ 授权车辆       │
│  运营者          │ OPERATOR      │ operator_code, operation_area│ 运营车辆       │
│  景区管理员      │ SCENIC_ADMIN  │ scenic_id, scenic_name      │ 景区车辆       │
│  维保人员        │ MAINTENANCE   │ maintenance_team_id, skill_level│ 维保车辆    │
│  驾驶员          │ DRIVER        │ driver_license, license_type│ 驾驶车辆       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.subaccount;

public interface SubAccountService {
    
    SubAccount createSubAccount(SubAccountCreateRequest request);
    
    SubAccount getSubAccount(String accountId);
    
    SubAccount getSubAccountByUsername(String username);
    
    SubAccount updateSubAccount(String accountId, SubAccountUpdateRequest request);
    
    void deleteSubAccount(String accountId);
    
    void enableSubAccount(String accountId);
    
    void disableSubAccount(String accountId);
    
    PageResult<SubAccount> listSubAccounts(SubAccountQueryRequest request);
    
    List<SubAccount> listByMasterAccount(String masterAccountId);
    
    List<SubAccount> listByType(String tenantId, AccountType type);
    
    void resetPassword(String accountId, String newPassword);
    
    void updateExpireTime(String accountId, LocalDateTime expireTime);
}

public interface SubAccountAuthService {
    
    SubAccountLoginResult login(SubAccountLoginRequest request);
    
    void logout(String accountId);
    
    SubAccountSession getSession(String accountId);
    
    boolean validateSession(String accountId, String token);
    
    void refreshSession(String accountId);
}

public interface SubAccountDataScopeService {
    
    void grantVehicleAccess(String accountId, List<String> vehicleIds);
    
    void revokeVehicleAccess(String accountId, List<String> vehicleIds);
    
    List<String> getAccessibleVehicles(String accountId);
    
    boolean hasVehicleAccess(String accountId, String vehicleId);
    
    void grantScenicAccess(String accountId, String scenicId);
    
    void revokeScenicAccess(String accountId);
    
    String getAccessibleScenic(String accountId);
}
```

### 2.3 数据模型

```java
@Data
public class SubAccount {
    private String id;
    private String tenantId;
    private String masterAccountId;
    private String accountCode;
    private String accountName;
    private AccountType accountType;
    private String username;
    private String password;
    private String phone;
    private String email;
    private String avatar;
    
    private String dealerCode;
    private String dealerLevel;
    private String salesArea;
    
    private String operatorCode;
    private String operationArea;
    
    private String scenicId;
    private String scenicName;
    
    private String maintenanceTeamId;
    private String skillLevel;
    
    private String driverLicense;
    private String licenseType;
    
    private AccountStatus status;
    private LocalDateTime expireTime;
    private LocalDateTime lastLoginTime;
    private String lastLoginIp;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

public enum AccountType {
    DEALER,
    OPERATOR,
    SCENIC_ADMIN,
    MAINTENANCE,
    DRIVER
}

public enum AccountStatus {
    ACTIVE,
    DISABLED,
    EXPIRED,
    LOCKED
}

@Data
public class SubAccountLoginResult {
    private String accountId;
    private String token;
    private String refreshToken;
    private AccountType accountType;
    private String tenantId;
    private String masterAccountId;
    private LocalDateTime expireTime;
    private List<String> permissions;
    private String dashboardUrl;
}
```

### 2.4 数据库设计

```sql
CREATE TABLE sub_accounts (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    master_account_id VARCHAR(32) NOT NULL,
    account_code VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    avatar VARCHAR(200),
    
    dealer_code VARCHAR(50),
    dealer_level VARCHAR(20),
    sales_area VARCHAR(200),
    
    operator_code VARCHAR(50),
    operation_area VARCHAR(200),
    
    scenic_id VARCHAR(32),
    scenic_name VARCHAR(100),
    
    maintenance_team_id VARCHAR(32),
    skill_level VARCHAR(20),
    
    driver_license VARCHAR(50),
    license_type VARCHAR(10),
    
    status VARCHAR(20) DEFAULT 'ACTIVE',
    expire_time TIMESTAMP,
    last_login_time TIMESTAMP,
    last_login_ip VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (master_account_id) REFERENCES master_accounts(id)
);

CREATE TABLE account_vehicle_relation (
    id VARCHAR(32) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    vehicle_id VARCHAR(32) NOT NULL,
    grant_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grant_by VARCHAR(32),
    FOREIGN KEY (account_id) REFERENCES sub_accounts(id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    UNIQUE(account_id, vehicle_id)
);

CREATE TABLE account_scenic_relation (
    id VARCHAR(32) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    scenic_id VARCHAR(32) NOT NULL,
    grant_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    grant_by VARCHAR(32),
    FOREIGN KEY (account_id) REFERENCES sub_accounts(id),
    UNIQUE(account_id)
);

CREATE TABLE sub_account_sessions (
    id VARCHAR(32) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    token VARCHAR(500) NOT NULL,
    refresh_token VARCHAR(500),
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expire_time TIMESTAMP NOT NULL,
    login_ip VARCHAR(50),
    user_agent VARCHAR(500),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    FOREIGN KEY (account_id) REFERENCES sub_accounts(id)
);

CREATE INDEX idx_sub_accounts_tenant ON sub_accounts(tenant_id);
CREATE INDEX idx_sub_accounts_master ON sub_accounts(master_account_id);
CREATE INDEX idx_sub_accounts_type ON sub_accounts(account_type);
CREATE INDEX idx_sub_accounts_username ON sub_accounts(username);
```

### 2.5 登录与跳转实现

```java
@Service
public class SubAccountAuthServiceImpl implements SubAccountAuthService {
    
    @Autowired
    private SubAccountRepository subAccountRepository;
    
    @Autowired
    private JwtTokenService jwtTokenService;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private PermissionService permissionService;
    
    @Override
    public SubAccountLoginResult login(SubAccountLoginRequest request) {
        SubAccount account = subAccountRepository.findByUsername(request.getUsername());
        
        if (account == null) {
            throw new AuthenticationException("Account not found");
        }
        
        if (!PasswordUtil.matches(request.getPassword(), account.getPassword())) {
            throw new AuthenticationException("Invalid password");
        }
        
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new AuthenticationException("Account is " + account.getStatus().name().toLowerCase());
        }
        
        if (account.getExpireTime() != null && account.getExpireTime().isBefore(LocalDateTime.now())) {
            throw new AuthenticationException("Account has expired");
        }
        
        String token = jwtTokenService.generateToken(buildTokenPayload(account));
        String refreshToken = jwtTokenService.generateRefreshToken(account.getId());
        
        saveSession(account, token, request);
        
        List<String> permissions = permissionService.getAccountPermissions(account.getId());
        String dashboardUrl = getDashboardUrl(account.getAccountType());
        
        return SubAccountLoginResult.builder()
            .accountId(account.getId())
            .token(token)
            .refreshToken(refreshToken)
            .accountType(account.getAccountType())
            .tenantId(account.getTenantId())
            .masterAccountId(account.getMasterAccountId())
            .expireTime(LocalDateTime.now().plusHours(24))
            .permissions(permissions)
            .dashboardUrl(dashboardUrl)
            .build();
    }
    
    private String getDashboardUrl(AccountType accountType) {
        return switch (accountType) {
            case DEALER -> "/dealer/dashboard";
            case OPERATOR -> "/operator/dashboard";
            case SCENIC_ADMIN -> "/scenic/dashboard";
            case MAINTENANCE -> "/maintenance/dashboard";
            case DRIVER -> "/driver/dashboard";
        };
    }
    
    private JwtPayload buildTokenPayload(SubAccount account) {
        return JwtPayload.builder()
            .accountId(account.getId())
            .tenantId(account.getTenantId())
            .accountType(account.getAccountType().name())
            .username(account.getUsername())
            .build();
    }
    
    private void saveSession(SubAccount account, String token, SubAccountLoginRequest request) {
        String sessionKey = "session:sub:" + account.getId();
        SubAccountSession session = SubAccountSession.builder()
            .accountId(account.getId())
            .token(token)
            .loginTime(LocalDateTime.now())
            .expireTime(LocalDateTime.now().plusHours(24))
            .loginIp(request.getClientIp())
            .userAgent(request.getUserAgent())
            .build();
        
        redisTemplate.opsForValue().set(sessionKey, session, Duration.ofHours(24));
        
        subAccountRepository.updateLoginInfo(account.getId(), LocalDateTime.now(), request.getClientIp());
    }
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/sub-account | 创建子账号 |
| GET | /api/sub-account/{accountId} | 获取子账号信息 |
| PUT | /api/sub-account/{accountId} | 更新子账号信息 |
| DELETE | /api/sub-account/{accountId} | 删除子账号 |
| POST | /api/sub-account/{accountId}/enable | 启用子账号 |
| POST | /api/sub-account/{accountId}/disable | 禁用子账号 |
| GET | /api/sub-account | 查询子账号列表 |
| POST | /api/sub-account/{accountId}/reset-password | 重置密码 |
| POST | /api/sub-account/{accountId}/grant-vehicles | 授权车辆 |
| POST | /api/sub-account/{accountId}/revoke-vehicles | 撤销车辆授权 |
| GET | /api/sub-account/{accountId}/vehicles | 获取授权车辆 |
| POST | /api/sub-account/login | 子账号登录 |
| POST | /api/sub-account/logout | 子账号登出 |

### 3.2 API示例

```json
POST /api/sub-account
{
    "tenantId": "T001",
    "masterAccountId": "M001",
    "accountName": "成都经销商001",
    "accountType": "DEALER",
    "username": "dealer001",
    "password": "encrypted_password",
    "phone": "13800138001",
    "email": "dealer001@example.com",
    "dealerCode": "DL001",
    "dealerLevel": "LEVEL1",
    "salesArea": "四川省成都市",
    "expireTime": "2027-03-17T00:00:00Z"
}

Response:
{
    "code": 200,
    "message": "Sub-account created successfully",
    "data": {
        "id": "SA001",
        "accountCode": "SA20260317001",
        "accountName": "成都经销商001",
        "accountType": "DEALER",
        "status": "ACTIVE",
        "createdAt": "2026-03-17T10:00:00Z"
    }
}

POST /api/sub-account/login
{
    "username": "dealer001",
    "password": "password123"
}

Response:
{
    "code": 200,
    "message": "Login successful",
    "data": {
        "accountId": "SA001",
        "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "refresh_token_here",
        "accountType": "DEALER",
        "tenantId": "T001",
        "masterAccountId": "M001",
        "permissions": ["vehicle:view", "vehicle:edit", "monitor:view"],
        "dashboardUrl": "/dealer/dashboard"
    }
}
```

## 4. 配置项

```yaml
sub-account:
  enabled: true
  password:
    min-length: 8
    require-special-char: true
    expire-days: 90
  session:
    timeout-hours: 24
    max-sessions: 5
  login:
    max-attempts: 5
    lock-duration-minutes: 30
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testCreateDealer | 测试创建经销商账号 | 账号创建成功 |
| testCreateOperator | 测试创建运营者账号 | 账号创建成功 |
| testCreateScenicAdmin | 测试创建景区管理员账号 | 账号创建成功 |
| testSubAccountLogin | 测试子账号登录 | 登录成功，返回正确面板URL |
| testGrantVehicleAccess | 测试授权车辆 | 授权成功 |
| testDataScopeIsolation | 测试数据范围隔离 | 数据隔离正确 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testSubAccountFullFlow | 测试子账号完整流程 | 创建、登录、操作、登出正常 |
| testMultiAccountType | 测试多种账号类型 | 各类型账号功能正确 |
| testAccountExpiration | 测试账号到期 | 到期后登录失败 |

## 6. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: common-security
    version: ">=1.0.0"
  - name: tenant-service
    version: ">=1.0.0"
  - name: master-account-service
    version: ">=1.0.0"
  - name: role-service
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
| sub_account_total | Gauge | 子账号总数 |
| sub_account_by_type | Gauge | 各类型子账号数量 |
| sub_account_login_total | Counter | 子账号登录次数 |
| sub_account_active | Gauge | 活跃子账号数 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
