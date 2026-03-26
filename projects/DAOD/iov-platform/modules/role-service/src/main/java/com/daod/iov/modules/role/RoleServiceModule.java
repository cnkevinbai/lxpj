package com.daod.iov.modules.role;

import com.daod.iov.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * 角色服务模块
 * 
 * 功能：
 * - 角色管理
 * - 权限配置
 * - 数据权限
 * - 角色继承
 * 
 * @author daod-team
 * @version 1.0.0
 */
@Component
public class RoleServiceModule implements ISFU {
    
    private static final Logger logger = LoggerFactory.getLogger(RoleServiceModule.class);
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    private final Map<String, Role> roles = new HashMap<>();
    
    public RoleServiceModule() {
        this.metadata = new ModuleMetadata("role-service", "1.0.0", "角色服务");
        this.metadata.setType("business");
        this.metadata.setPriority(10);
    }
    
    @Override
    public void initialize(ModuleContext context) {
        this.context = context;
        initDefaultRoles();
        logger.info("角色服务初始化完成");
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }
    
    private void initDefaultRoles() {
        roles.put("admin", new Role("admin", "管理员", Arrays.asList("ALL")));
        roles.put("manager", new Role("manager", "经理", Arrays.asList("READ", "WRITE", "APPROVE")));
        roles.put("user", new Role("user", "普通用户", Arrays.asList("READ")));
    }
    
    @Override
    public void start() {
        logger.info("角色服务启动完成");
        state = ModuleState.RUNNING;
    }
    
    @Override
    public void stop() {
        logger.info("角色服务已停止");
        state = ModuleState.STOPPED;
    }
    
    @Override
    public void destroy() {
        roles.clear();
        state = ModuleState.DESTROYED;
    }
    
    // ==================== 角色管理 ====================
    
    public Role createRole(String code, String name, List<String> permissions) {
        Role role = new Role(code, name, permissions);
        roles.put(code, role);
        logger.info("创建角色: {}", code);
        return role;
    }
    
    public Role getRole(String code) {
        return roles.get(code);
    }
    
    public List<Role> listRoles() {
        return new ArrayList<>(roles.values());
    }
    
    public void updateRole(String code, List<String> permissions) {
        Role role = roles.get(code);
        if (role != null) {
            role.setPermissions(permissions);
            logger.info("更新角色权限: {}", code);
        }
    }
    
    public void deleteRole(String code) {
        if (!code.equals("admin")) {
            roles.remove(code);
            logger.info("删除角色: {}", code);
        }
    }
    
    public boolean hasPermission(String roleCode, String permission) {
        Role role = roles.get(roleCode);
        if (role == null) return false;
        return role.getPermissions().contains("ALL") || role.getPermissions().contains(permission);
    }
    
    // ==================== 接口实现 ====================
    
    @Override public ModuleMetadata getMetadata() { return metadata; }
    @Override public ModuleState getState() { return state; }
    @Override public HealthStatus getHealthStatus() { return healthStatus; }
    
    @Override
    public List<Metric> getMetrics() {
        return List.of(new Metric("roles_count", Metric.MetricType.GAUGE, roles.size()));
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.healthy("角色服务运行正常")
            .withDetail("roles", roles.size());
    }
    
    @Override public String getApiSpecification() { return ""; }
    @Override public List<ApiDependency> getApiDependencies() { return List.of(); }
    @Override public List<Permission> getRequiredPermissions() { return List.of(); }
    @Override public ResourceRequirements getResourceRequirements() { return ResourceRequirements.defaults(); }
    
    // ==================== 内部类 ====================
    
    public static class Role {
        private final String code;
        private final String name;
        private List<String> permissions;
        
        public Role(String code, String name, List<String> permissions) {
            this.code = code;
            this.name = name;
            this.permissions = permissions;
        }
        
        public String getCode() { return code; }
        public String getName() { return name; }
        public List<String> getPermissions() { return permissions; }
        public void setPermissions(List<String> permissions) { this.permissions = permissions; }
    }
}