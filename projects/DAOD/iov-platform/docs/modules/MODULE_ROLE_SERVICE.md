# 角色服务模块设计文档

**模块名称**: role-service  
**版本**: 1.0.0  
**优先级**: 🟡 中  
**最后更新**: 2026-03-18

---

## 1. 模块概述

角色服务模块实现了基于RBAC（Role-Based Access Control）的权限管理，支持多租户隔离。

### 1.1 核心功能

| 功能 | 说明 |
|------|------|
| 角色管理 | CRUD操作、角色继承 |
| 权限管理 | 菜单权限、操作权限、数据权限 |
| 权限分配 | 角色-权限关联管理 |
| 租户隔离 | 多租户数据隔离 |
| 权限缓存 | 高性能权限查询 |

### 1.2 权限类型

| 类型 | 说明 | 示例 |
|------|------|------|
| 菜单权限 | 页面访问权限 | vehicle:list, monitor:dashboard |
| 操作权限 | 功能操作权限 | vehicle:create, vehicle:delete |
| 数据权限 | 数据范围权限 | 本部门、本部门及下级、全部 |

---

## 2. 架构设计

### 2.1 RBAC模型

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │──────▶│    Role     │──────▶│ Permission  │
│   (用户)    │       │   (角色)    │       │   (权限)    │
└─────────────┘       └─────────────┘       └─────────────┘
       │                     │                     │
       │                     │                     │
       ▼                     ▼                     ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  用户-角色  │       │  角色-权限  │       │  权限树    │
│  关联表     │       │  关联表     │       │            │
└─────────────┘       └─────────────┘       └─────────────┘
```

### 2.2 多租户隔离

```
Tenant A                    Tenant B
├── Roles                   ├── Roles
│   ├── Admin_A            │   ├── Admin_B
│   ├── Operator_A         │   ├── Operator_B
│   └── Viewer_A           │   └── Viewer_B
├── Permissions             ├── Permissions
│   ├── Menu_A             │   ├── Menu_B
│   └── Data_A             │   └── Data_B
└── User-Role-A             └── User-Role-B

数据完全隔离，租户间不可见
```

---

## 3. 数据模型

### 3.1 角色实体

```java
public class Role {
    private String id;              // 角色ID
    private String tenantId;        // 租户ID
    private String name;            // 角色名称
    private String code;            // 角色编码
    private String parentId;        // 父角色ID(继承)
    private String description;     // 描述
    private boolean isSystem;       // 是否系统角色
    private int level;              // 角色层级
    private int sort;               // 排序
    private RoleStatus status;      // 状态
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
```

### 3.2 权限实体

```java
public class Permission {
    private String id;              // 权限ID
    private String tenantId;        // 租户ID
    private String name;            // 权限名称
    private String code;            // 权限编码
    private PermissionType type;    // 权限类型
    private String parentId;        // 父权限ID
    private String path;            // 路径(菜单)
    private String icon;            // 图标
    private int level;              // 层级
    private int sort;               // 排序
    private PermissionStatus status;
}
```

### 3.3 数据权限

```java
public class RoleDataPermission {
    private String id;              // ID
    private String roleId;          // 角色ID
    private DataScope scope;        // 数据范围
    private List<String> orgIds;    // 组织ID列表
    private String customRule;      // 自定义规则
}
```

---

## 4. API设计

### 4.1 角色管理API

```java
public class RoleService implements IModule {
    
    // ==================== 角色管理 ====================
    
    /**
     * 创建角色
     */
    public Role createRole(RoleCreateRequest request);
    
    /**
     * 更新角色
     */
    public Role updateRole(String roleId, RoleUpdateRequest request);
    
    /**
     * 删除角色
     */
    public void deleteRole(String roleId);
    
    /**
     * 获取角色详情
     */
    public RoleResponse getRole(String roleId);
    
    /**
     * 查询角色列表
     */
    public PageResponse<RoleResponse> listRoles(RoleQueryRequest request);
    
    /**
     * 获取角色树
     */
    public List<RoleTreeNode> getRoleTree(String tenantId);
    
    // ==================== 权限管理 ====================
    
    /**
     * 创建权限
     */
    public Permission createPermission(PermissionCreateRequest request);
    
    /**
     * 更新权限
     */
    public Permission updatePermission(String permissionId, PermissionUpdateRequest request);
    
    /**
     * 删除权限
     */
    public void deletePermission(String permissionId);
    
    /**
     * 获取权限树
     */
    public List<PermissionTreeItem> getPermissionTree(String tenantId);
    
    // ==================== 权限分配 ====================
    
    /**
     * 分配权限给角色
     */
    public void assignPermissions(String roleId, List<String> permissionIds);
    
    /**
     * 获取角色的权限列表
     */
    public List<Permission> getRolePermissions(String roleId);
    
    /**
     * 获取用户的所有权限(包含继承)
     */
    public List<Permission> getUserPermissions(String userId);
    
    // ==================== 数据权限 ====================
    
    /**
     * 设置角色数据权限
     */
    public void setDataPermission(String roleId, RoleDataPermissionRequest request);
    
    /**
     * 获取角色数据权限
     */
    public RoleDataPermissionResponse getDataPermission(String roleId);
}
```

---

## 5. 默认角色模板

### 5.1 系统默认角色

| 角色 | 编码 | 说明 | 默认权限 |
|------|------|------|----------|
| 超级管理员 | admin | 系统最高权限 | 所有权限 |
| 运营管理员 | operator | 运营管理权限 | 车辆管理、监控、告警 |
| 普通用户 | viewer | 只读权限 | 查看权限 |

### 5.2 权限模板

```yaml
admin:
  permissions: ["*"]
  dataScope: ALL
  
operator:
  permissions:
    - "vehicle:*"
    - "monitor:*"
    - "alarm:*"
    - "report:view"
  dataScope: DEPARTMENT_AND_SUB
  
viewer:
  permissions:
    - "vehicle:view"
    - "monitor:view"
    - "alarm:view"
    - "report:view"
  dataScope: SELF
```

---

## 6. 权限缓存

### 6.1 缓存策略

```java
// 使用Caffeine本地缓存
Cache<String, List<Permission>> permissionCache = Caffeine.newBuilder()
    .maximumSize(10000)
    .expireAfterWrite(1, TimeUnit.HOURS)
    .build();

// 缓存键格式
// role:permissions:{roleId}     - 角色权限列表
// user:permissions:{userId}      - 用户权限列表
// permission:tree:{tenantId}     - 权限树
```

### 6.2 缓存更新

- 角色权限变更时，清除相关缓存
- 用户角色变更时，清除用户权限缓存
- 定时刷新缓存

---

## 7. 配置项

```yaml
role:
  maxRolesPerTenant: 100         # 每租户最大角色数
  defaultRoles:                  # 默认角色列表
    - admin
    - operator
    - viewer
  cacheEnabled: true             # 启用缓存
  cacheTtl: 3600                 # 缓存过期时间(秒)
  enableInheritance: true        # 启用角色继承
  maxInheritanceLevel: 3         # 最大继承层级
```

---

## 8. 扩展点

| 扩展点 | 接口 | 说明 |
|--------|------|------|
| 权限提供者 | PermissionProvider | 动态提供权限 |
| 角色监听器 | RoleListener | 角色变更监听 |

---

## 9. 使用示例

### 9.1 创建角色

```java
RoleCreateRequest request = new RoleCreateRequest();
request.setName("车队管理员");
request.setCode("fleet_manager");
request.setParentId("operator");
request.setTenantId("tenant_001");

Role role = roleService.createRole(request);
```

### 9.2 分配权限

```java
roleService.assignPermissions("role_001", Arrays.asList(
    "vehicle:view",
    "vehicle:create",
    "vehicle:update",
    "monitor:view"
));
```

### 9.3 检查权限

```java
List<Permission> permissions = roleService.getUserPermissions("user_001");
boolean hasPermission = permissions.stream()
    .anyMatch(p -> "vehicle:delete".equals(p.getCode()));
```

---

_文档维护：渔晓白_