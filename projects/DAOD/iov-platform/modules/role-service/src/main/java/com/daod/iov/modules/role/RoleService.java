package com.daod.iov.modules.role;

import com.daod.iov.plugin.IModule;
import com.daod.iov.plugin.ISFU;
import com.daod.iov.plugin.Metric;
import com.daod.iov.plugin.ModuleContext;
import com.daod.iov.plugin.ModuleMetadata;
import com.daod.iov.plugin.ModuleState;
import com.daod.iov.plugin.ModuleException;
import com.daod.iov.plugin.HealthStatus;
import com.daod.iov.plugin.HealthCheckResult;
import com.daod.iov.plugin.ApiDependency;
import com.daod.iov.plugin.ResourceRequirements;
import com.daod.iov.modules.role.entity.*;
import com.daod.iov.modules.role.dto.*;
import com.daod.iov.modules.role.event.*;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;

import java.util.*;
import java.util.concurrent.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;

/**
 * 角色服务模块
 * 实现多租户角色权限管理功能
 * 
 * 功能特性:
 * - 角色CRUD管理（创建、查询、更新、删除）
 * - 权限定义和管理（菜单权限、操作权限、数据权限）
 * - 角色-权限关联管理
 * - 多租户角色隔离
 * - 默认角色模板
 * - 角色继承机制
 * - 权限缓存
 */
@Slf4j
public class RoleService implements IModule {
    
    // ==================== 模块元数据 ====================
    private ModuleMetadata metadata;
    private ModuleState state;
    private HealthStatus healthStatus;
    private ModuleContext context;
    
    // ==================== 配置属性 ====================
    private boolean enabled;
    private int maxRolesPerTenant;
    private List<String> defaultRoles;
    private boolean cacheEnabled;
    private int cacheTtl;
    
    // ==================== 服务组件 ====================
    private RoleRepository roleRepository;
    private PermissionRepository permissionRepository;
    private RolePermissionService rolePermissionService;
    private RoleCacheService roleCacheService;
    private EventBus eventBus;
    
    // ==================== 线程池 ====================
    private ScheduledExecutorService cacheCleanupExecutor;
    
    // ==================== 缓存机制 ====================
    private Cache<String, Role> roleCache;
    private Cache<String, Permission> permissionCache;
    private Cache<String, List<String>> rolePermissionCache;
    private Cache<String, List<String>> userRoleCache;
    
    public RoleService() {
        // 初始化模块元数据
        this.metadata = new ModuleMetadata(
            "role-service",
            "1.0.0",
            "角色服务模块 - 多租户角色权限管理"
        );
        
        this.metadata.setType("business");
        this.metadata.setPriority(50);
        
        // 设置扩展点
        Map<String, ModuleMetadata.ExtensionPoint> extensionPoints = new HashMap<>();
        extensionPoints.put("permission-provider", 
            new ModuleMetadata.ExtensionPoint(
                "permission-provider",
                "com.daod.iov.modules.role.PermissionProvider",
                "权限提供者扩展点"
            ));
        extensionPoints.put("role-listener",
            new ModuleMetadata.ExtensionPoint(
                "role-listener",
                "com.daod.iov.modules.role.RoleListener",
                "角色变更监听器"
            ));
        this.metadata.setExtensionPoints(extensionPoints);
        
        // 设置初始状态
        this.state = ModuleState.UNINITIALIZED;
        this.healthStatus = HealthStatus.UNKNOWN;
    }
    
    @Override
    public ModuleMetadata getMetadata() {
        return metadata;
    }
    
    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        this.context = context;
        log.info("角色服务模块初始化: {}", metadata.getName());
        
        try {
            // 加载配置
            loadConfiguration();
            
            // 初始化缓存
            initCache();
            
            // 初始化存储层
            roleRepository = new RoleRepository();
            permissionRepository = new PermissionRepository();
            rolePermissionService = new RolePermissionService(roleRepository, permissionRepository);
            roleCacheService = new RoleCacheService(roleCache, cacheTtl);
            
            // 初始化事件总线
            eventBus = new EventBus();
            
            // 初始化默认角色
            initDefaultRoles();
            
            // 启动缓存清理任务
            startCacheCleanupTask();
            
            log.info("角色服务模块初始化完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("INITIALIZATION_FAILED", "role-service",
                "角色服务模块初始化失败: " + e.getMessage(), e);
        }
        
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }
    
    @Override
    public void start() throws ModuleException {
        log.info("角色服务模块启动: {}", metadata.getName());
        
        try {
            // 发布模块启动事件
            eventBus.publish(new ModuleStartedEvent(metadata.getName()));
            
            log.info("角色服务模块启动完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("START_FAILED", "role-service",
                "角色服务模块启动失败: " + e.getMessage(), e);
        }
        
        state = ModuleState.RUNNING;
        healthStatus = HealthStatus.HEALTHY;
    }
    
    @Override
    public void stop() throws ModuleException {
        log.info("角色服务模块停止: {}", metadata.getName());
        
        try {
            // 停止缓存清理任务
            stopCacheCleanupTask();
            
            // 发布模块停止事件
            eventBus.publish(new ModuleStoppedEvent(metadata.getName()));
            
            log.info("角色服务模块停止完成");
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("STOP_INTERRUPTED", 
                "角色服务模块停止被中断");
        }
        
        state = ModuleState.STOPPED;
        healthStatus = HealthStatus.OFFLINE;
    }
    
    @Override
    public void destroy() throws ModuleException {
        log.info("角色服务模块销毁: {}", metadata.getName());
        
        try {
            // 清理缓存
            roleCache.invalidateAll();
            permissionCache.invalidateAll();
            rolePermissionCache.invalidateAll();
            userRoleCache.invalidateAll();
            
            // 清理服务组件
            roleRepository = null;
            permissionRepository = null;
            rolePermissionService = null;
            roleCacheService = null;
            eventBus = null;
            
            log.info("角色服务模块销毁完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("DESTROY_FAILED", "role-service",
                "角色服务模块销毁失败: " + e.getMessage(), e);
        }
        
        state = ModuleState.DESTROYED;
    }
    
    @Override
    public ModuleState getState() {
        return state;
    }
    
    @Override
    public HealthStatus getHealthStatus() {
        return healthStatus;
    }
    
    // ==================== 配置加载 ====================
    
    private void loadConfiguration() {
        Map<String, Object> config = context.getConfig();
        
        this.enabled = Optional.ofNullable(config.get("enabled"))
            .map(v -> (Boolean) v)
            .orElse(true);
            
        this.maxRolesPerTenant = Optional.ofNullable(config.get("maxRolesPerTenant"))
            .map(v -> ((Number) v).intValue())
            .orElse(100);
            
        this.defaultRoles = Optional.ofNullable(config.get("defaultRoles"))
            .map(v -> (List<String>) v)
            .orElse(Arrays.asList("admin", "operator", "viewer"));
            
        this.cacheEnabled = Optional.ofNullable(config.get("cacheEnabled"))
            .map(v -> (Boolean) v)
            .orElse(true);
            
        this.cacheTtl = Optional.ofNullable(config.get("cacheTtl"))
            .map(v -> ((Number) v).intValue())
            .orElse(3600);
    }
    
    // ==================== 缓存管理 ====================
    
    private void initCache() {
        if (!cacheEnabled) {
            // 使用空的缓存构建器创建空缓存
            roleCache = Caffeine.newBuilder().maximumSize(0).build();
            permissionCache = Caffeine.newBuilder().maximumSize(0).build();
            rolePermissionCache = Caffeine.newBuilder().maximumSize(0).build();
            userRoleCache = Caffeine.newBuilder().maximumSize(0).build();
            return;
        }
        
        // 角色缓存
        roleCache = Caffeine.newBuilder()
            .maximumSize(10000)
            .expireAfterWrite(cacheTtl, TimeUnit.SECONDS)
            .recordStats()
            .build();
            
        // 权限缓存
        permissionCache = Caffeine.newBuilder()
            .maximumSize(50000)
            .expireAfterWrite(cacheTtl, TimeUnit.SECONDS)
            .recordStats()
            .build();
            
        // 角色权限缓存
        rolePermissionCache = Caffeine.newBuilder()
            .maximumSize(10000)
            .expireAfterWrite(cacheTtl, TimeUnit.SECONDS)
            .recordStats()
            .build();
            
        // 用户角色缓存
        userRoleCache = Caffeine.newBuilder()
            .maximumSize(50000)
            .expireAfterWrite(cacheTtl, TimeUnit.SECONDS)
            .recordStats()
            .build();
    }
    
    private void startCacheCleanupTask() {
        if (!cacheEnabled) {
            return;
        }
        
        cacheCleanupExecutor = Executors.newSingleThreadScheduledExecutor(
            r -> new Thread(r, "role-cache-cleanup")
        );
        
        cacheCleanupExecutor.scheduleAtFixedRate(
            this::cleanupExpiredCache,
            60, 60, TimeUnit.SECONDS
        );
    }
    
    private void stopCacheCleanupTask() throws InterruptedException {
        if (cacheCleanupExecutor != null) {
            cacheCleanupExecutor.shutdown();
            if (!cacheCleanupExecutor.awaitTermination(10, TimeUnit.SECONDS)) {
                cacheCleanupExecutor.shutdownNow();
            }
        }
    }
    
    private void cleanupExpiredCache() {
        if (!cacheEnabled) {
            return;
        }
        
        try {
            roleCache.cleanUp();
            permissionCache.cleanUp();
            rolePermissionCache.cleanUp();
            userRoleCache.cleanUp();
            
            log.debug("缓存清理完成, 角色缓存命中率: {}", 
                roleCache.stats().hitRate());
                
        } catch (Exception e) {
            log.error("缓存清理失败", e);
        }
    }
    
    // ==================== 默认角色初始化 ====================
    
    private void initDefaultRoles() {
        if (!enabled) {
            return;
        }
        
        String tenantId = "system";
        
        // 创建默认角色
        for (String roleName : defaultRoles) {
            try {
                Role role = buildDefaultRole(roleName, tenantId);
                
                // 检查角色是否已存在
                if (!roleRepository.existsByCode(tenantId, roleName)) {
                    roleRepository.save(role);
                    log.info("初始化默认角色: {}", roleName);
                    
                    // 发布角色创建事件
                    eventBus.publish(new RoleCreatedEvent(role));
                    
                    // 清理缓存
                    roleCache.invalidateAll();
                }
            } catch (Exception e) {
                log.error("初始化默认角色失败: {}", roleName, e);
            }
        }
    }
    
    private Role buildDefaultRole(String roleName, String tenantId) {
        Role.DataPermissionConfig dataPermission = Role.DataPermissionConfig.builder()
            .type("tenant")
            .inheritParent(false)
            .build();
            
        Role role = Role.builder()
            .tenantId(tenantId)
            .name(roleName)
            .code(roleName)
            .description("系统默认角色: " + roleName)
            .type("system")
            .defaultRole(true)
            .disabled(false)
            .level(0)
            .dataPermission(dataPermission)
            .createdAt(LocalDateTime.now())
            .createdBy("system")
            .build();
            
        // 根据角色名称设置默认权限
        setDefaultPermissions(role, roleName);
        
        return role;
    }
    
    private void setDefaultPermissions(Role role, String roleName) {
        switch (roleName) {
            case "admin":
                // 管理员拥有所有权限
                role.setMenuPermissions(Arrays.asList(
                    "menu_all", "menu_user", "menu_role", "menu_permission", 
                    "menu_vehicle", "menu_monitor", "menu_alarm", "menu_ota"
                ));
                role.setOperationPermissions(Arrays.asList(
                    "op_all", "op_create", "op_update", "op_delete", 
                    "op_query", "op_export", "op_import"
                ));
                break;
                
            case "operator":
                // 操作员拥有操作权限
                role.setMenuPermissions(Arrays.asList(
                    "menu_user", "menu_vehicle", "menu_monitor", "menu_alarm"
                ));
                role.setOperationPermissions(Arrays.asList(
                    "op_query", "op_update", "op_export"
                ));
                break;
                
            case "viewer":
                // 查看员只拥有查询权限
                role.setMenuPermissions(Arrays.asList(
                    "menu_vehicle", "menu_monitor"
                ));
                role.setOperationPermissions(Arrays.asList(
                    "op_query"
                ));
                break;
                
            default:
                role.setMenuPermissions(new ArrayList<>());
                role.setOperationPermissions(new ArrayList<>());
                break;
        }
    }
    
    // ==================== 对外API ====================
    
    /**
     * 创建角色
     */
    public RoleResponse createRole(RoleCreateRequest request) throws RoleException {
        // 参数验证
        if (request.getTenantId() == null) {
            throw new RoleException("TENANT_ID_REQUIRED", "租户ID不能为空");
        }
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RoleException("ROLE_NAME_REQUIRED", "角色名称不能为空");
        }
        if (request.getCode() == null || request.getCode().trim().isEmpty()) {
            throw new RoleException("ROLE_CODE_REQUIRED", "角色编码不能为空");
        }
        
        String tenantId = request.getTenantId();
        String code = request.getCode();
        
        // 检查租户角色数量限制
        long roleCount = roleRepository.countByTenantId(tenantId);
        if (roleCount >= maxRolesPerTenant) {
            throw new RoleException("MAX_ROLES_REACHED", 
                String.format("租户%s角色数量已达到上限: %d", tenantId, maxRolesPerTenant));
        }
        
        // 检查角色编码是否重复
        if (roleRepository.existsByCode(tenantId, code)) {
            throw new RoleException("ROLE_CODE_DUPLICATE", 
                String.format("角色编码%s已存在", code));
        }
        
        // 构建角色实体
        Role role = Role.builder()
            .tenantId(tenantId)
            .name(request.getName())
            .code(code)
            .parentId(request.getParentId())
            .description(request.getDescription())
            .type(request.isDefaultRole() ? "system" : "custom")
            .defaultRole(request.isDefaultRole())
            .disabled(false)
            .level(calculateRoleLevel(request.getParentId()))
            .menuPermissions(request.getMenuPermissions())
            .operationPermissions(request.getOperationPermissions())
            .dataPermission(request.getDataPermission() != null ? 
                convertDataPermission(request.getDataPermission()) : null)
            .extensions(request.getExtensions())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .createdBy("system")
            .updatedBy("system")
            .build();
            
        // 保存角色
        roleRepository.save(role);
        log.info("创建角色成功: {}", role.getId());
        
        // 发布角色创建事件
        eventBus.publish(new RoleCreatedEvent(role));
        
        // 清理相关缓存
        roleCache.invalidate(tenantId);
        rolePermissionCache.invalidateAll();
        
        return convertToResponse(role);
    }
    
    /**
     * 查询角色
     */
    public RoleResponse getRole(String roleId) throws RoleException {
        if (roleId == null || roleId.trim().isEmpty()) {
            throw new RoleException("ROLE_ID_REQUIRED", "角色ID不能为空");
        }
        
        // 尝试从缓存获取
        if (cacheEnabled) {
            Role cached = roleCache.getIfPresent(roleId);
            if (cached != null) {
                return convertToResponse(cached);
            }
        }
        
        // 从数据库获取
        Role role = roleRepository.findById(roleId);
        if (role == null) {
            throw new RoleException("ROLE_NOT_FOUND", 
                String.format("角色%s不存在", roleId));
        }
        
        // 写入缓存
        if (cacheEnabled) {
            roleCache.put(roleId, role);
        }
        
        return convertToResponse(role);
    }
    
    /**
     * 查询角色列表
     */
    public PageResponse<RoleResponse> listRoles(RoleQueryRequest query) {
        // 参数验证
        if (query.getTenantId() == null) {
            throw new RoleException("TENANT_ID_REQUIRED", "租户ID不能为空");
        }
        
        // 构建分页参数
        int page = Math.max(1, query.getPage());
        int size = Math.min(Math.max(1, query.getSize()), 100);
        int offset = (page - 1) * size;
        
        // 查询角色列表
        List<Role> roles = roleRepository.findByTenantId(
            query.getTenantId(),
            query.getName(),
            query.getCode(),
            query.getType(),
            query.getDefaultRole(),
            query.getDisabled(),
            query.getParentId(),
            offset,
            size
        );
        
        // 查询总数
        long total = roleRepository.countByTenantId(
            query.getTenantId(),
            query.getName(),
            query.getCode(),
            query.getType(),
            query.getDefaultRole(),
            query.getDisabled(),
            query.getParentId()
        );
        
        // 转换为响应DTO
        List<RoleResponse> responses = roles.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
            
        // 构建分页响应
        int totalPages = (int) Math.ceil((double) total / size);
        
        return PageResponse.<RoleResponse>builder()
            .page(page)
            .size(size)
            .total(total)
            .totalPages(totalPages)
            .records(responses)
            .build();
    }
    
    /**
     * 更新角色
     */
    public RoleResponse updateRole(RoleUpdateRequest request) throws RoleException {
        // 参数验证
        if (request.getId() == null || request.getId().trim().isEmpty()) {
            throw new RoleException("ROLE_ID_REQUIRED", "角色ID不能为空");
        }
        
        String roleId = request.getId();
        String tenantId = request.getTenantId();
        
        // 查询原角色
        Role existingRole = roleRepository.findById(roleId);
        if (existingRole == null) {
            throw new RoleException("ROLE_NOT_FOUND", 
                String.format("角色%s不存在", roleId));
        }
        
        // 检查租户匹配
        if (tenantId != null && !tenantId.equals(existingRole.getTenantId())) {
            throw new RoleException("TENANT_MISMATCH", 
                "角色不属于指定租户");
        }
        
        // 检查系统角色不能修改基础属性
        if (existingRole.isDefaultRole() && 
            (request.getName() != null || request.getCode() != null)) {
            throw new RoleException("SYSTEM_ROLE_IMMUTABLE", 
                "系统默认角色的基础属性不可修改");
        }
        
        // 更新字段
        if (request.getName() != null) {
            existingRole.setName(request.getName());
        }
        if (request.getCode() != null && !existingRole.isDefaultRole()) {
            existingRole.setCode(request.getCode());
        }
        if (request.getParentId() != null && !existingRole.isDefaultRole()) {
            existingRole.setParentId(request.getParentId());
            existingRole.setLevel(calculateRoleLevel(request.getParentId()));
        }
        if (request.getDescription() != null) {
            existingRole.setDescription(request.getDescription());
        }
        if (request.getMenuPermissions() != null) {
            existingRole.setMenuPermissions(request.getMenuPermissions());
        }
        if (request.getOperationPermissions() != null) {
            existingRole.setOperationPermissions(request.getOperationPermissions());
        }
        if (request.getDataPermission() != null) {
            existingRole.setDataPermission(convertDataPermission(request.getDataPermission()));
        }
        if (request.getDisabled() != null) {
            existingRole.setDisabled(request.getDisabled());
        }
        if (request.getExtensions() != null) {
            existingRole.setExtensions(request.getExtensions());
        }
        
        // 更新时间
        existingRole.setUpdatedAt(LocalDateTime.now());
        existingRole.setUpdatedBy("system");
        
        // 保存角色
        roleRepository.save(existingRole);
        log.info("更新角色成功: {}", roleId);
        
        // 发布角色更新事件
        eventBus.publish(new RoleUpdatedEvent(existingRole));
        
        // 清理缓存
        roleCache.invalidate(roleId);
        rolePermissionCache.invalidate(roleId);
        
        return convertToResponse(existingRole);
    }
    
    /**
     * 删除角色
     */
    public void deleteRole(String roleId, String tenantId) throws RoleException {
        // 参数验证
        if (roleId == null || roleId.trim().isEmpty()) {
            throw new RoleException("ROLE_ID_REQUIRED", "角色ID不能为空");
        }
        
        // 查询角色
        Role role = roleRepository.findById(roleId);
        if (role == null) {
            throw new RoleException("ROLE_NOT_FOUND", 
                String.format("角色%s不存在", roleId));
        }
        
        // 检查租户匹配
        if (tenantId != null && !tenantId.equals(role.getTenantId())) {
            throw new RoleException("TENANT_MISMATCH", 
                "角色不属于指定租户");
        }
        
        // 检查系统角色不能删除
        if (role.isDefaultRole()) {
            throw new RoleException("SYSTEM_ROLE_IMMUTABLE", 
                "系统默认角色不能删除");
        }
        
        // 检查是否有子角色
        int childCount = roleRepository.countByParentId(roleId);
        if (childCount > 0) {
            throw new RoleException("ROLE_HAS_CHILDREN", 
                "角色下存在子角色，无法删除");
        }
        
        // 删除角色
        roleRepository.delete(roleId);
        log.info("删除角色成功: {}", roleId);
        
        // 发布角色删除事件
        eventBus.publish(new RoleDeletedEvent(role));
        
        // 清理缓存
        roleCache.invalidate(roleId);
        rolePermissionCache.invalidateAll();
    }
    
    /**
     * 分配权限给角色
     */
    public RoleResponse assignPermissions(String roleId, RolePermissionAssignRequest request) 
            throws RoleException {
        // 参数验证
        if (roleId == null || roleId.trim().isEmpty()) {
            throw new RoleException("ROLE_ID_REQUIRED", "角色ID不能为空");
        }
        if (request.getTenantId() == null) {
            throw new RoleException("TENANT_ID_REQUIRED", "租户ID不能为空");
        }
        
        // 查询角色
        Role role = roleRepository.findById(roleId);
        if (role == null) {
            throw new RoleException("ROLE_NOT_FOUND", 
                String.format("角色%s不存在", roleId));
        }
        
        // 检查租户匹配
        if (!request.getTenantId().equals(role.getTenantId())) {
            throw new RoleException("TENANT_MISMATCH", 
                "角色不属于指定租户");
        }
        
        // 检查系统角色
        if (role.isDefaultRole()) {
            log.warn("尝试修改系统角色权限: {}", roleId);
        }
        
        // 更新权限
        if (request.getMenuPermissionIds() != null) {
            role.setMenuPermissions(request.getMenuPermissionIds());
        }
        if (request.getOperationPermissionIds() != null) {
            role.setOperationPermissions(request.getOperationPermissionIds());
        }
        if (request.getDataPermission() != null) {
            role.setDataPermission(convertDataPermission(request.getDataPermission()));
        }
        
        // 保存角色
        roleRepository.save(role);
        log.info("分配权限成功: {}", roleId);
        
        // 发布权限变更事件
        eventBus.publish(new RolePermissionAssignedEvent(role));
        
        // 清理缓存
        roleCache.invalidate(roleId);
        rolePermissionCache.invalidate(roleId);
        
        return convertToResponse(role);
    }
    
    /**
     * 查询角色权限
     */
    public List<String> getRolePermissions(String roleId, String tenantId) 
            throws RoleException {
        // 参数验证
        if (roleId == null || roleId.trim().isEmpty()) {
            throw new RoleException("ROLE_ID_REQUIRED", "角色ID不能为空");
        }
        
        // 尝试从缓存获取
        if (cacheEnabled) {
            List<String> cached = rolePermissionCache.getIfPresent(roleId);
            if (cached != null) {
                return cached;
            }
        }
        
        // 查询角色
        Role role = roleRepository.findById(roleId);
        if (role == null) {
            throw new RoleException("ROLE_NOT_FOUND", 
                String.format("角色%s不存在", roleId));
        }
        
        // 检查租户匹配
        if (tenantId != null && !tenantId.equals(role.getTenantId())) {
            throw new RoleException("TENANT_MISMATCH", 
                "角色不属于指定租户");
        }
        
        // 获取角色权限
        List<String> permissions = new ArrayList<>();
        
        // 获取继承的权限
        if (role.getParentId() != null) {
            permissions.addAll(getInheritedPermissions(role.getParentId()));
        }
        
        // 添加角色自身的权限
        if (role.getMenuPermissions() != null) {
            permissions.addAll(role.getMenuPermissions());
        }
        if (role.getOperationPermissions() != null) {
            permissions.addAll(role.getOperationPermissions());
        }
        
        // 去重
        permissions = permissions.stream()
            .distinct()
            .collect(Collectors.toList());
        
        // 写入缓存
        if (cacheEnabled) {
            rolePermissionCache.put(roleId, permissions);
        }
        
        return permissions;
    }
    
    /**
     * 获取继承的权限
     */
    private List<String> getInheritedPermissions(String parentId) throws RoleException {
        List<String> permissions = new ArrayList<>();
        
        Role parentRole = roleRepository.findById(parentId);
        if (parentRole == null) {
            return permissions;
        }
        
        // 递归获取父角色权限
        if (parentRole.getParentId() != null) {
            permissions.addAll(getInheritedPermissions(parentRole.getParentId()));
        }
        
        // 添加父角色权限
        if (parentRole.getMenuPermissions() != null) {
            permissions.addAll(parentRole.getMenuPermissions());
        }
        if (parentRole.getOperationPermissions() != null) {
            permissions.addAll(parentRole.getOperationPermissions());
        }
        
        return permissions;
    }
    
    // ==================== 权限管理 ====================
    
    /**
     * 创建权限
     */
    public PermissionResponse createPermission(PermissionCreateRequest request) 
            throws RoleException {
        // 参数验证
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RoleException("PERMISSION_NAME_REQUIRED", "权限名称不能为空");
        }
        if (request.getCode() == null || request.getCode().trim().isEmpty()) {
            throw new RoleException("PERMISSION_CODE_REQUIRED", "权限编码不能为空");
        }
        
        String tenantId = request.getTenantId();
        String code = request.getCode();
        
        // 检查权限编码是否重复
        if (permissionRepository.existsByCode(tenantId, code)) {
            throw new RoleException("PERMISSION_CODE_DUPLICATE", 
                String.format("权限编码%s已存在", code));
        }
        
        // 构建权限实体
        Permission permission = Permission.builder()
            .tenantId(tenantId)
            .name(request.getName())
            .code(code)
            .type(request.getType())
            .parentId(request.getParentId())
            .path(request.getPath())
            .component(request.getComponent())
            .icon(request.getIcon())
            .sort(request.getSort())
            .hidden(request.isHidden())
            .disabled(false)
            .extensions(request.getExtensions())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .createdBy("system")
            .updatedBy("system")
            .build();
            
        // 保存权限
        permissionRepository.save(permission);
        log.info("创建权限成功: {}", permission.getId());
        
        // 清理缓存
        if (cacheEnabled) {
            permissionCache.put(permission.getId(), permission);
        }
        
        return convertToPermissionResponse(permission);
    }
    
    /**
     * 查询权限列表
     */
    public PageResponse<PermissionResponse> listPermissions(PermissionQueryRequest query) {
        // 参数验证
        if (query.getTenantId() == null) {
            throw new RoleException("TENANT_ID_REQUIRED", "租户ID不能为空");
        }
        
        // 构建分页参数
        int page = Math.max(1, query.getPage());
        int size = Math.min(Math.max(1, query.getSize()), 100);
        int offset = (page - 1) * size;
        
        // 查询权限列表
        List<Permission> permissions = permissionRepository.findByTenantId(
            query.getTenantId(),
            query.getName(),
            query.getCode(),
            query.getType(),
            offset,
            size
        );
        
        // 查询总数
        long total = permissionRepository.countByTenantId(
            query.getTenantId(),
            query.getName(),
            query.getCode(),
            query.getType()
        );
        
        // 转换为响应DTO
        List<PermissionResponse> responses = permissions.stream()
            .map(this::convertToPermissionResponse)
            .collect(Collectors.toList());
            
        // 构建分页响应
        int totalPages = (int) Math.ceil((double) total / size);
        
        return PageResponse.<PermissionResponse>builder()
            .page(page)
            .size(size)
            .total(total)
            .totalPages(totalPages)
            .records(responses)
            .build();
    }
    
    /**
     * 查询权限树
     */
    public List<PermissionTreeItem> getPermissionTree(String tenantId, String type) {
        // 查询所有权限
        List<Permission> permissions = permissionRepository.findByTenantId(tenantId, type);
        
        // 构建权限树
        Map<String, PermissionTreeItem> permissionMap = permissions.stream()
            .map(this::convertToTreeItem)
            .collect(Collectors.toMap(PermissionTreeItem::getId, item -> item));
            
        List<PermissionTreeItem> tree = new ArrayList<>();
        
        for (PermissionTreeItem item : permissionMap.values()) {
            String parentId = item.getParentId();
            if (parentId != null && permissionMap.containsKey(parentId)) {
                PermissionTreeItem parent = permissionMap.get(parentId);
                if (parent.getChildren() == null) {
                    parent.setChildren(new ArrayList<>());
                }
                parent.getChildren().add(item);
            } else {
                tree.add(item);
            }
        }
        
        // 排序
        tree.sort(Comparator.comparing(PermissionTreeItem::getSort));
        
        return tree;
    }
    
    /**
     * 更新权限
     */
    public PermissionResponse updatePermission(String permissionId, PermissionUpdateRequest request) 
            throws RoleException {
        // 参数验证
        if (permissionId == null || permissionId.trim().isEmpty()) {
            throw new RoleException("PERMISSION_ID_REQUIRED", "权限ID不能为空");
        }
        
        // 查询权限
        Permission permission = permissionRepository.findById(permissionId);
        if (permission == null) {
            throw new RoleException("PERMISSION_NOT_FOUND", 
                String.format("权限%s不存在", permissionId));
        }
        
        // 更新字段
        if (request.getName() != null) {
            permission.setName(request.getName());
        }
        if (request.getCode() != null) {
            permission.setCode(request.getCode());
        }
        if (request.getParentId() != null) {
            permission.setParentId(request.getParentId());
        }
        if (request.getPath() != null) {
            permission.setPath(request.getPath());
        }
        if (request.getComponent() != null) {
            permission.setComponent(request.getComponent());
        }
        if (request.getIcon() != null) {
            permission.setIcon(request.getIcon());
        }
        if (request.getSort() != null) {
            permission.setSort(request.getSort());
        }
        if (request.getHidden() != null) {
            permission.setHidden(request.getHidden());
        }
        if (request.getDisabled() != null) {
            permission.setDisabled(request.getDisabled());
        }
        if (request.getExtensions() != null) {
            permission.setExtensions(request.getExtensions());
        }
        
        // 更新时间
        permission.setUpdatedAt(LocalDateTime.now());
        permission.setUpdatedBy("system");
        
        // 保存权限
        permissionRepository.save(permission);
        log.info("更新权限成功: {}", permissionId);
        
        // 清理缓存
        if (cacheEnabled) {
            permissionCache.put(permissionId, permission);
        }
        
        return convertToPermissionResponse(permission);
    }
    
    /**
     * 删除权限
     */
    public void deletePermission(String permissionId, String tenantId) throws RoleException {
        // 参数验证
        if (permissionId == null || permissionId.trim().isEmpty()) {
            throw new RoleException("PERMISSION_ID_REQUIRED", "权限ID不能为空");
        }
        
        // 查询权限
        Permission permission = permissionRepository.findById(permissionId);
        if (permission == null) {
            throw new RoleException("PERMISSION_NOT_FOUND", 
                String.format("权限%s不存在", permissionId));
        }
        
        // 检查租户匹配
        if (tenantId != null && !tenantId.equals(permission.getTenantId())) {
            throw new RoleException("TENANT_MISMATCH", 
                "权限不属于指定租户");
        }
        
        // 检查是否有子权限
        int childCount = permissionRepository.countByParentId(permissionId);
        if (childCount > 0) {
            throw new RoleException("PERMISSION_HAS_CHILDREN", 
                "权限下存在子权限，无法删除");
        }
        
        // 删除权限
        permissionRepository.delete(permissionId);
        log.info("删除权限成功: {}", permissionId);
        
        // 清理缓存
        if (cacheEnabled) {
            permissionCache.invalidate(permissionId);
        }
    }
    
    // ==================== 辅助方法 ====================
    
    private RoleResponse convertToResponse(Role role) {
        RoleResponse response = RoleResponse.builder()
            .id(role.getId())
            .tenantId(role.getTenantId())
            .name(role.getName())
            .code(role.getCode())
            .parentId(role.getParentId())
            .level(role.getLevel())
            .description(role.getDescription())
            .type(role.getType())
            .defaultRole(role.isDefaultRole())
            .disabled(role.isDisabled())
            .menuPermissions(role.getMenuPermissions())
            .operationPermissions(role.getOperationPermissions())
            .dataPermission(role.getDataPermission() != null ? 
                convertDataPermissionResponse(role.getDataPermission()) : null)
            .extensions(role.getExtensions())
            .createdAt(role.getCreatedAt() != null ? 
                role.getCreatedAt().toString() : null)
            .updatedAt(role.getUpdatedAt() != null ? 
                role.getUpdatedAt().toString() : null)
            .createdBy(role.getCreatedBy())
            .updatedBy(role.getUpdatedBy())
            .build();
            
        // 获取父角色名称
        if (role.getParentId() != null) {
            Role parentRole = roleRepository.findById(role.getParentId());
            if (parentRole != null) {
                response.setParentName(parentRole.getName());
            }
        }
        
        // 获取子角色数量
        response.setChildRoleCount(roleRepository.countByParentId(role.getId()));
        
        // 计算继承的权限
        if (role.getParentId() != null) {
            response.setInheritedPermissions(getInheritedPermissions(role.getParentId()));
        }
        
        return response;
    }
    
    private PermissionResponse convertToPermissionResponse(Permission permission) {
        PermissionResponse response = PermissionResponse.builder()
            .id(permission.getId())
            .tenantId(permission.getTenantId())
            .name(permission.getName())
            .code(permission.getCode())
            .type(permission.getType())
            .parentId(permission.getParentId())
            .path(permission.getPath())
            .component(permission.getComponent())
            .icon(permission.getIcon())
            .sort(permission.getSort())
            .hidden(permission.isHidden())
            .disabled(permission.isDisabled())
            .extensions(permission.getExtensions())
            .createdAt(permission.getCreatedAt() != null ? 
                permission.getCreatedAt().toString() : null)
            .updatedAt(permission.getUpdatedAt() != null ? 
                permission.getUpdatedAt().toString() : null)
            .build();
            
        // 获取父权限名称
        if (permission.getParentId() != null) {
            Permission parentPermission = permissionRepository.findById(permission.getParentId());
            if (parentPermission != null) {
                response.setParentName(parentPermission.getName());
            }
        }
        
        return response;
    }
    
    private PermissionTreeItem convertToTreeItem(Permission permission) {
        return PermissionTreeItem.builder()
            .id(permission.getId())
            .name(permission.getName())
            .code(permission.getCode())
            .type(permission.getType())
            .parentId(permission.getParentId())
            .path(permission.getPath())
            .component(permission.getComponent())
            .icon(permission.getIcon())
            .sort(permission.getSort())
            .hidden(permission.isHidden())
            .children(null)
            .build();
    }
    
    private Role.DataPermissionConfig convertDataPermission(
            RoleDataPermissionRequest request) {
        return Role.DataPermissionConfig.builder()
            .type(request.getType())
            .scopeIds(request.getScopeIds())
            .inheritParent(request.getInheritParent() != null ? 
                request.getInheritParent() : false)
            .build();
    }
    
    private RoleDataPermissionResponse convertDataPermissionResponse(
            Role.DataPermissionConfig config) {
        return RoleDataPermissionResponse.builder()
            .type(config.getType())
            .scopeIds(config.getScopeIds())
            .inheritParent(config.isInheritParent())
            .build();
    }
    
    private Integer calculateRoleLevel(String parentId) {
        if (parentId == null) {
            return 0;
        }
        
        Role parentRole = roleRepository.findById(parentId);
        if (parentRole == null) {
            return 0;
        }
        
        return parentRole.getLevel() != null ? parentRole.getLevel() + 1 : 1;
    }
    
    // ==================== 内部类 ====================
    
    /**
     * 角色存储接口
     */
    private static class RoleRepository {
        private final Map<String, Role> storage = new ConcurrentHashMap<>();
        
        public void save(Role role) {
            role.setId(role.getId() != null ? role.getId() : 
                "role-" + UUID.randomUUID().toString().replace("-", ""));
            storage.put(role.getId(), role);
        }
        
        public Role findById(String id) {
            return storage.get(id);
        }
        
        public boolean existsByCode(String tenantId, String code) {
            return storage.values().stream()
                .anyMatch(r -> r.getTenantId().equals(tenantId) && 
                    r.getCode().equals(code));
        }
        
        public long countByTenantId(String tenantId) {
            return storage.values().stream()
                .filter(r -> r.getTenantId().equals(tenantId))
                .count();
        }
        
        public List<Role> findByTenantId(String tenantId, String name, String code, 
                String type, Boolean defaultRole, Boolean disabled, String parentId,
                int offset, int size) {
            return storage.values().stream()
                .filter(r -> r.getTenantId().equals(tenantId))
                .filter(r -> name == null || r.getName().contains(name))
                .filter(r -> code == null || r.getCode().equals(code))
                .filter(r -> type == null || r.getType().equals(type))
                .filter(r -> defaultRole == null || r.isDefaultRole() == defaultRole)
                .filter(r -> disabled == null || r.isDisabled() == disabled)
                .filter(r -> parentId == null || parentId.equals(r.getParentId()))
                .sorted(Comparator.comparing(Role::getCreatedAt).reversed())
                .skip(offset)
                .limit(size)
                .collect(Collectors.toList());
        }
        
        public long countByTenantId(String tenantId, String name, String code,
                String type, Boolean defaultRole, Boolean disabled, String parentId) {
            return storage.values().stream()
                .filter(r -> r.getTenantId().equals(tenantId))
                .filter(r -> name == null || r.getName().contains(name))
                .filter(r -> code == null || r.getCode().equals(code))
                .filter(r -> type == null || r.getType().equals(type))
                .filter(r -> defaultRole == null || r.isDefaultRole() == defaultRole)
                .filter(r -> disabled == null || r.isDisabled() == disabled)
                .filter(r -> parentId == null || parentId.equals(r.getParentId()))
                .count();
        }
        
        public int countByParentId(String parentId) {
            return (int) storage.values().stream()
                .filter(r -> parentId.equals(r.getParentId()))
                .count();
        }
        
        public void delete(String id) {
            storage.remove(id);
        }
    }
    
    /**
     * 权限存储接口
     */
    private static class PermissionRepository {
        private final Map<String, Permission> storage = new ConcurrentHashMap<>();
        
        public void save(Permission permission) {
            permission.setId(permission.getId() != null ? permission.getId() : 
                "permission-" + UUID.randomUUID().toString().replace("-", ""));
            storage.put(permission.getId(), permission);
        }
        
        public Permission findById(String id) {
            return storage.get(id);
        }
        
        public boolean existsByCode(String tenantId, String code) {
            return storage.values().stream()
                .anyMatch(p -> p.getTenantId().equals(tenantId) && 
                    p.getCode().equals(code));
        }
        
        public List<Permission> findByTenantId(String tenantId, String name, 
                String code, String type, int offset, int size) {
            return storage.values().stream()
                .filter(p -> p.getTenantId().equals(tenantId))
                .filter(p -> name == null || p.getName().contains(name))
                .filter(p -> code == null || p.getCode().equals(code))
                .filter(p -> type == null || p.getType().equals(type))
                .sorted(Comparator.comparing(Permission::getSort).thenComparing(Permission::getCreatedAt))
                .skip(offset)
                .limit(size)
                .collect(Collectors.toList());
        }
        
        public long countByTenantId(String tenantId, String name, String code, String type) {
            return storage.values().stream()
                .filter(p -> p.getTenantId().equals(tenantId))
                .filter(p -> name == null || p.getName().contains(name))
                .filter(p -> code == null || p.getCode().equals(code))
                .filter(p -> type == null || p.getType().equals(type))
                .count();
        }
        
        public int countByParentId(String parentId) {
            return (int) storage.values().stream()
                .filter(p -> parentId.equals(p.getParentId()))
                .count();
        }
        
        public void delete(String id) {
            storage.remove(id);
        }
        
        public List<Permission> findByTenantId(String tenantId, String type) {
            return storage.values().stream()
                .filter(p -> p.getTenantId().equals(tenantId))
                .filter(p -> type == null || p.getType().equals(type))
                .sorted(Comparator.comparing(Permission::getSort))
                .collect(Collectors.toList());
        }
    }
    
    /**
     * 角色权限服务
     */
    private static class RolePermissionService {
        private final RoleRepository roleRepository;
        private final PermissionRepository permissionRepository;
        
        public RolePermissionService(RoleRepository roleRepository, 
                PermissionRepository permissionRepository) {
            this.roleRepository = roleRepository;
            this.permissionRepository = permissionRepository;
        }
        
        public void validatePermissionAssignment(String roleId, List<String> permissionIds) {
            // 验证角色是否存在
            Role role = roleRepository.findById(roleId);
            if (role == null) {
                throw new RoleException("ROLE_NOT_FOUND", 
                    String.format("角色%s不存在", roleId));
            }
            
            // 验证权限是否存在
            for (String permissionId : permissionIds) {
                Permission permission = permissionRepository.findById(permissionId);
                if (permission == null) {
                    throw new RoleException("PERMISSION_NOT_FOUND", 
                        String.format("权限%s不存在", permissionId));
                }
            }
        }
    }
    
    /**
     * 角色缓存服务
     */
    private static class RoleCacheService {
        private final Cache<String, Role> cache;
        private final int ttl;
        
        public RoleCacheService(Cache<String, Role> cache, int ttl) {
            this.cache = cache;
            this.ttl = ttl;
        }
        
        public Role get(String key) {
            return cache.getIfPresent(key);
        }
        
        public void put(String key, Role value) {
            cache.put(key, value);
        }
        
        public void invalidate(String key) {
            cache.invalidate(key);
        }
        
        public void invalidateAll() {
            cache.invalidateAll();
        }
    }
    
    /**
     * 事件总线
     */
    private static class EventBus {
        private final List<Runnable> listeners = new ArrayList<>();
        
        public void publish(Object event) {
            // 发布事件
            listeners.forEach(Runnable::run);
        }
        
        public void addListener(Runnable listener) {
            listeners.add(listener);
        }
    }
    
    // ==================== 事件类 ====================
    
    /**
     * 模块启动事件
     */
    public static class ModuleStartedEvent {
        private final String moduleName;
        private final LocalDateTime timestamp;
        
        public ModuleStartedEvent(String moduleName) {
            this.moduleName = moduleName;
            this.timestamp = LocalDateTime.now();
        }
        
        public String getModuleName() { return moduleName; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
    
    /**
     * 模块停止事件
     */
    public static class ModuleStoppedEvent {
        private final String moduleName;
        private final LocalDateTime timestamp;
        
        public ModuleStoppedEvent(String moduleName) {
            this.moduleName = moduleName;
            this.timestamp = LocalDateTime.now();
        }
        
        public String getModuleName() { return moduleName; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
    
    /**
     * 角色创建事件
     */
    public static class RoleCreatedEvent {
        private final Role role;
        private final LocalDateTime timestamp;
        
        public RoleCreatedEvent(Role role) {
            this.role = role;
            this.timestamp = LocalDateTime.now();
        }
        
        public Role getRole() { return role; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
    
    /**
     * 角色更新事件
     */
    public static class RoleUpdatedEvent {
        private final Role role;
        private final LocalDateTime timestamp;
        
        public RoleUpdatedEvent(Role role) {
            this.role = role;
            this.timestamp = LocalDateTime.now();
        }
        
        public Role getRole() { return role; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
    
    /**
     * 角色删除事件
     */
    public static class RoleDeletedEvent {
        private final Role role;
        private final LocalDateTime timestamp;
        
        public RoleDeletedEvent(Role role) {
            this.role = role;
            this.timestamp = LocalDateTime.now();
        }
        
        public Role getRole() { return role; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
    
    /**
     * 角色权限分配事件
     */
    public static class RolePermissionAssignedEvent {
        private final Role role;
        private final LocalDateTime timestamp;
        
        public RolePermissionAssignedEvent(Role role) {
            this.role = role;
            this.timestamp = LocalDateTime.now();
        }
        
        public Role getRole() { return role; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
    
    /**
     * 角色异常
     */
    public static class RoleException extends RuntimeException {
        private final String code;
        
        public RoleException(String code, String message) {
            super(message);
            this.code = code;
        }
        
        public RoleException(String code, String message, Throwable cause) {
            super(message, cause);
            this.code = code;
        }
        
        public String getCode() { return code; }
    }
    
    /**
     * 扩展点接口 - 权限提供者
     */
    public interface PermissionProvider {
        List<String> getPermissions(String roleId, String tenantId);
    }
    
    /**
     * 扩展点接口 - 角色监听器
     */
    public interface RoleListener {
        void onRoleCreated(Role role);
        void onRoleUpdated(Role role);
        void onRoleDeleted(Role role);
        void onPermissionAssigned(Role role);
    }
}
