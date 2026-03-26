# 子账户服务模块设计文档

**模块名称**: sub-account-service  
**版本**: 1.0.0  
**优先级**: 🟡 中  
**最后更新**: 2026-03-18

---

## 1. 模块概述

子账户服务模块实现了多租户环境下的主账号-子账号管理，支持细粒度的权限控制和配额管理。

### 1.1 核心功能

| 功能 | 说明 |
|------|------|
| 子账户管理 | CRUD操作、状态管理 |
| 主子关联 | 主账号创建管理子账号 |
| 权限分配 | 子账号独立权限控制 |
| 配额管理 | 设备数、数据量限制 |
| 密码策略 | 复杂度、过期、重置 |
| 审计日志 | 登录日志、操作日志 |

### 1.2 账户体系

```
主账号 (Manufacturer)
├── 子账号1 (经销商A)
│   ├── 子账号1-1 (运营者)
│   └── 子账号1-2 (景区管理员)
├── 子账号2 (经销商B)
│   └── 子账号2-1 (运营者)
└── 子账号3 (自运营)
    └── 子账号3-1 (客服)
```

---

## 2. 数据模型

### 3.1 子账户实体

```java
public class SubAccount {
    private String id;              // 账户ID
    private String tenantId;        // 租户ID
    private String parentAccountId; // 主账号ID
    private String username;        // 用户名
    private String password;        // 密码(加密)
    private String name;            // 姓名
    private String phone;           // 手机号
    private String email;           // 邮箱
    private AccountStatus status;   // 状态
    private List<String> roleIds;   // 角色ID列表
    private AccountQuota quota;     // 配额
    private LocalDateTime expireTime;// 过期时间
    private LocalDateTime createTime;
    private LocalDateTime lastLoginTime;
}
```

### 3.2 配额模型

```java
public class AccountQuota {
    private int maxDevices;         // 最大设备数
    private int maxVehicles;        // 最大车辆数
    private int maxUsers;           // 最大用户数
    private long maxStorage;        // 最大存储空间
    private int maxApiCalls;        // API调用限制
}
```

---

## 3. API设计

```java
public class SubAccountService implements IModule {
    
    /**
     * 创建子账户
     */
    public SubAccount createAccount(SubAccountCreateRequest request);
    
    /**
     * 更新子账户
     */
    public SubAccount updateAccount(String accountId, SubAccountUpdateRequest request);
    
    /**
     * 删除子账户
     */
    public void deleteAccount(String accountId);
    
    /**
     * 启用账户
     */
    public void enableAccount(String accountId);
    
    /**
     * 禁用账户
     */
    public void disableAccount(String accountId);
    
    /**
     * 重置密码
     */
    public void resetPassword(String accountId, PasswordResetRequest request);
    
    /**
     * 分配角色
     */
    public void assignRoles(String accountId, List<String> roleIds);
    
    /**
     * 查询子账户列表
     */
    public PageResponse<SubAccount> listAccounts(AccountQueryRequest request);
    
    /**
     * 获取配额信息
     */
    public QuotaInfo getQuotaInfo(String accountId);
    
    /**
     * 查询登录日志
     */
    public PageResponse<LoginLog> queryLoginLogs(String accountId, LocalDateTime start, LocalDateTime end);
}
```

---

## 4. 密码策略

### 4.1 密码复杂度

| 策略 | 要求 |
|------|------|
| low | 最少6位 |
| medium | 最少8位，包含字母和数字 |
| high | 最少10位，包含大小写字母、数字和特殊字符 |

### 4.2 密码过期

```yaml
password:
  policy: medium              # 密码策略
  expireDays: 90              # 过期天数
  remindDays: 7               # 提前提醒天数
  historyCount: 5             # 历史密码数量
  lockAttempts: 5             # 锁定尝试次数
  lockDuration: 30            # 锁定时长(分钟)
```

---

## 5. 配额管理

### 5.1 配额限制

```java
public class QuotaValidator {
    
    /**
     * 检查设备配额
     */
    public boolean checkDeviceQuota(String accountId, int count);
    
    /**
     * 检查车辆配额
     */
    public boolean checkVehicleQuota(String accountId, int count);
    
    /**
     * 检查存储配额
     */
    public boolean checkStorageQuota(String accountId, long size);
    
    /**
     * 获取配额使用情况
     */
    public QuotaUsage getQuotaUsage(String accountId);
}
```

---

## 6. 配置项

```yaml
subAccount:
  maxSubAccountsPerTenant: 500    # 每主账号最大子账号数
  passwordPolicy: medium          # 密码策略
  accountExpirationDays: 365      # 账号过期天数
  enableAudit: true               # 启用审计
  defaultQuota:                   # 默认配额
    maxDevices: 100
    maxVehicles: 50
    maxUsers: 10
    maxStorage: 10737418240       # 10GB
```

---

_文档维护：渔晓白_