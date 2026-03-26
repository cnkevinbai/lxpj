# 角色权限服务模块 (role-service)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | role-service |
| 模块版本 | 1.0.0 |
| 模块类型 | business |
| 优先级 | 50 |
| 负责人 | 后端开发 |
| 开发周期 | Week 10 |

### 1.2 功能描述

角色权限服务模块提供基于RBAC（基于角色的访问控制）的权限管理能力，支持角色定义、权限分配、菜单权限管理等功能。

### 1.3 核心能力

- 角色管理
- 权限管理
- 角色权限分配
- 菜单权限管理
- 数据权限管理

## 2. 技术设计

### 2.1 RBAC模型

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          RBAC权限模型                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              用户层                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ 主账号          │  │ 子账号          │  │ 平台管理员       │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              角色层                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ 生产厂家管理员   │  │ 经销商角色      │  │ 运营者角色       │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ 景区管理员角色   │  │ 维保人员角色    │  │ 驾驶员角色       │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              权限层                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ 菜单权限        │  │ 功能权限        │  │ 数据权限        │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.role;

public interface RoleService {
    
    Role createRole(RoleCreateRequest request);
    
    Role getRole(String roleId);
    
    Role updateRole(String roleId, RoleUpdateRequest request);
    
    void deleteRole(String roleId);
    
    PageResult<Role> listRoles(RoleQueryRequest request);
    
    List<Role> listRolesByTenant(String tenantId);
    
    void assignPermissions(String roleId, List<String> permissionIds);
    
    void removePermissions(String roleId, List<String> permissionIds);
    
    List<Permission> getRolePermissions(String roleId);
}

public interface PermissionService {
    
    Permission createPermission(PermissionCreateRequest request);
    
    Permission getPermission(String permissionId);
    
    void deletePermission(String permissionId);
    
    List<Permission> listPermissions();
    
    List<Permission> listPermissionsByType(PermissionType type);
    
    List<Permission> getAccountPermissions(String accountId);
    
    boolean hasPermission(String accountId, String permissionCode);
    
    boolean hasAnyPermission(String accountId, List<String> permissionCodes);
    
    boolean hasAllPermissions(String accountId, List<String> permissionCodes);
}

public interface MenuService {
    
    Menu createMenu(MenuCreateRequest request);
    
    Menu getMenu(String menuId);
    
    Menu updateMenu(String menuId, MenuUpdateRequest request);
    
    void deleteMenu(String menuId);
    
    List<Menu> listMenus();
    
    List<Menu> getMenuTree();
    
    void assignMenusToRole(String roleId, List<String> menuIds);
    
    List<Menu> getRoleMenus(String roleId);
    
    List<Menu> getAccountMenus(String accountId);
}

public interface DataScopeService {
    
    DataScope createDataScope(DataScopeCreateRequest request);
    
    DataScope getDataScope(String scopeId);
    
    void updateDataScope(String scopeId, DataScopeUpdateRequest request);
    
    void deleteDataScope(String scopeId);
    
    void assignDataScopeToRole(String roleId, String scopeId);
    
    DataScope getRoleDataScope(String roleId);
    
    DataScope getAccountDataScope(String accountId);
}
```

### 2.3 数据模型

```java
@Data
public class Role {
    private String id;
    private String tenantId;
    private String roleCode;
    private String roleName;
    private String description;
    private RoleType roleType;
    private boolean isSystem;
    private int sortOrder;
    private RoleStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
public class Permission {
    private String id;
    private String permissionCode;
    private String permissionName;
    private PermissionType permissionType;
    private String resourceId;
    private String action;
    private String description;
    private LocalDateTime createdAt;
}

@Data
public class Menu {
    private String id;
    private String parentId;
    private String menuCode;
    private String menuName;
    private MenuType menuType;
    private String path;
    private String component;
    private String icon;
    private int sortOrder;
    private boolean visible;
    private MenuStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
public class DataScope {
    private String id;
    private String scopeName;
    private DataScopeType scopeType;
    private String scopeValue;
    private String description;
    private LocalDateTime createdAt;
}

public enum PermissionType {
    MENU,
    BUTTON,
    API
}

public enum MenuType {
    DIR,
    MENU,
    BUTTON
}

public enum DataScopeType {
    ALL,
    DEPARTMENT,
    DEPARTMENT_AND_SUB,
    SELF,
    CUSTOM
}

public enum RoleType {
    SYSTEM,
    TENANT,
    CUSTOM
}
```

### 2.4 数据库设计

```sql
CREATE TABLE roles (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32),
    role_code VARCHAR(50) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    role_type VARCHAR(20) DEFAULT 'CUSTOM',
    is_system BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id VARCHAR(32) PRIMARY KEY,
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    permission_name VARCHAR(100) NOT NULL,
    permission_type VARCHAR(20) NOT NULL,
    resource_id VARCHAR(100),
    action VARCHAR(50),
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE menus (
    id VARCHAR(32) PRIMARY KEY,
    parent_id VARCHAR(32),
    menu_code VARCHAR(50) NOT NULL,
    menu_name VARCHAR(100) NOT NULL,
    menu_type VARCHAR(20) NOT NULL,
    path VARCHAR(200),
    component VARCHAR(200),
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    visible BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_permission_relation (
    id VARCHAR(32) PRIMARY KEY,
    role_id VARCHAR(32) NOT NULL,
    permission_id VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    UNIQUE(role_id, permission_id)
);

CREATE TABLE role_menu_relation (
    id VARCHAR(32) PRIMARY KEY,
    role_id VARCHAR(32) NOT NULL,
    menu_id VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (menu_id) REFERENCES menus(id),
    UNIQUE(role_id, menu_id)
);

CREATE TABLE account_role_relation (
    id VARCHAR(32) PRIMARY KEY,
    account_id VARCHAR(32) NOT NULL,
    account_type VARCHAR(20) NOT NULL,
    role_id VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    UNIQUE(account_id, role_id)
);

CREATE TABLE data_scopes (
    id VARCHAR(32) PRIMARY KEY,
    scope_name VARCHAR(100) NOT NULL,
    scope_type VARCHAR(20) NOT NULL,
    scope_value TEXT,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE role_data_scope_relation (
    id VARCHAR(32) PRIMARY KEY,
    role_id VARCHAR(32) NOT NULL,
    scope_id VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (scope_id) REFERENCES data_scopes(id),
    UNIQUE(role_id)
);

CREATE INDEX idx_roles_tenant ON roles(tenant_id);
CREATE INDEX idx_role_permission_role ON role_permission_relation(role_id);
CREATE INDEX idx_role_menu_role ON role_menu_relation(role_id);
CREATE INDEX idx_account_role_account ON account_role_relation(account_id);
```

### 2.5 权限校验实现

```java
@Aspect
@Component
public class PermissionAspect {
    
    @Autowired
    private PermissionService permissionService;
    
    @Autowired
    private TenantContextManager tenantContextManager;
    
    @Around("@annotation(requirePermission)")
    public Object checkPermission(ProceedingJoinPoint joinPoint, RequirePermission requirePermission) 
            throws Throwable {
        
        String accountId = tenantContextManager.getCurrentAccountId();
        if (accountId == null) {
            throw new UnauthorizedException("Not authenticated");
        }
        
        String[] permissions = requirePermission.value();
        Logical logical = requirePermission.logical();
        
        boolean hasPermission;
        if (logical == Logical.AND) {
            hasPermission = permissionService.hasAllPermissions(accountId, Arrays.asList(permissions));
        } else {
            hasPermission = permissionService.hasAnyPermission(accountId, Arrays.asList(permissions));
        }
        
        if (!hasPermission) {
            throw new ForbiddenException("Permission denied: " + String.join(",", permissions));
        }
        
        return joinPoint.proceed();
    }
}

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequirePermission {
    String[] value();
    Logical logical() default Logical.AND;
}

public enum Logical {
    AND,
    OR
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/role | 创建角色 |
| GET | /api/role/{roleId} | 获取角色信息 |
| PUT | /api/role/{roleId} | 更新角色信息 |
| DELETE | /api/role/{roleId} | 删除角色 |
| GET | /api/role | 查询角色列表 |
| POST | /api/role/{roleId}/permissions | 分配权限 |
| GET | /api/role/{roleId}/permissions | 获取角色权限 |
| GET | /api/permission | 查询权限列表 |
| GET | /api/menu/tree | 获取菜单树 |
| POST | /api/menu | 创建菜单 |
| GET | /api/menu/{menuId} | 获取菜单信息 |
| PUT | /api/menu/{menuId} | 更新菜单信息 |
| DELETE | /api/menu/{menuId} | 删除菜单 |
| POST | /api/role/{roleId}/menus | 分配菜单 |
| GET | /api/role/{roleId}/menus | 获取角色菜单 |

### 3.2 API示例

```json
POST /api/role
{
    "tenantId": "T001",
    "roleCode": "DEALER_ADMIN",
    "roleName": "经销商管理员",
    "description": "经销商管理员角色，拥有经销商相关功能权限",
    "roleType": "TENANT"
}

Response:
{
    "code": 200,
    "message": "Role created successfully",
    "data": {
        "id": "R001",
        "roleCode": "DEALER_ADMIN",
        "roleName": "经销商管理员",
        "status": "ACTIVE"
    }
}

POST /api/role/R001/permissions
{
    "permissionIds": ["P001", "P002", "P003"]
}

Response:
{
    "code": 200,
    "message": "Permissions assigned successfully"
}

GET /api/menu/tree

Response:
{
    "code": 200,
    "data": [
        {
            "id": "M001",
            "menuName": "车辆管理",
            "menuType": "DIR",
            "icon": "car",
            "children": [
                {
                    "id": "M002",
                    "menuName": "车辆列表",
                    "menuType": "MENU",
                    "path": "/vehicle/list",
                    "component": "vehicle/VehicleList"
                },
                {
                    "id": "M003",
                    "menuName": "车辆监控",
                    "menuType": "MENU",
                    "path": "/vehicle/monitor",
                    "component": "vehicle/VehicleMonitor"
                }
            ]
        }
    ]
}
```

## 4. 配置项

```yaml
role:
  enabled: true
  cache:
    enabled: true
    ttl: 3600
  super-admin:
    role-code: SUPER_ADMIN
    permissions: all
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testCreateRole | 测试创建角色 | 角色创建成功 |
| testAssignPermissions | 测试分配权限 | 权限分配成功 |
| testCheckPermission | 测试权限校验 | 权限校验正确 |
| testMenuTree | 测试菜单树 | 菜单树结构正确 |
| testDataScope | 测试数据权限 | 数据范围正确 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testRolePermissionFlow | 测试角色权限流程 | 完整流程正常 |
| testPermissionAspect | 测试权限切面 | 权限拦截正确 |
| testMultiTenantRole | 测试多租户角色 | 租户角色隔离 |

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
| role_total | Gauge | 角色总数 |
| permission_check_total | Counter | 权限检查总次数 |
| permission_check_failed | Counter | 权限检查失败次数 |
| menu_access_total | Counter | 菜单访问次数 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
