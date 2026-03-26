package com.daod.iov.modules.subaccount;

import com.daod.iov.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 子账户服务模块
 * 
 * 功能：
 * - 子账户管理
 * - 权限分配
 * - 访问控制
 * - 操作审计
 * 
 * @author daod-team
 * @version 1.0.0
 */
@Component
public class SubAccountServiceModule implements ISFU {
    
    private static final Logger logger = LoggerFactory.getLogger(SubAccountServiceModule.class);
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    private final Map<String, SubAccount> subAccounts = new ConcurrentHashMap<>();
    
    public SubAccountServiceModule() {
        this.metadata = new ModuleMetadata("sub-account-service", "1.0.0", "子账户服务");
        this.metadata.setType("business");
        this.metadata.setPriority(12);
    }
    
    @Override
    public void initialize(ModuleContext context) {
        this.context = context;
        logger.info("子账户服务初始化完成");
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }
    
    @Override
    public void start() {
        logger.info("子账户服务启动完成");
        state = ModuleState.RUNNING;
    }
    
    @Override
    public void stop() {
        logger.info("子账户服务已停止");
        state = ModuleState.STOPPED;
    }
    
    @Override
    public void destroy() {
        subAccounts.clear();
        state = ModuleState.DESTROYED;
    }
    
    // ==================== 子账户管理 ====================
    
    public SubAccount createSubAccount(String tenantId, String username, String name, List<String> permissions) {
        String id = UUID.randomUUID().toString();
        SubAccount account = new SubAccount(id, tenantId, username, name, permissions, "ACTIVE");
        subAccounts.put(id, account);
        logger.info("创建子账户: {} ({})", username, id);
        return account;
    }
    
    public SubAccount getSubAccount(String id) {
        return subAccounts.get(id);
    }
    
    public List<SubAccount> listSubAccounts(String tenantId) {
        if (tenantId == null) {
            return new ArrayList<>(subAccounts.values());
        }
        return subAccounts.values().stream()
            .filter(a -> a.getTenantId().equals(tenantId))
            .collect(Collectors.toList());
    }
    
    public void updatePermissions(String id, List<String> permissions) {
        SubAccount account = subAccounts.get(id);
        if (account != null) {
            account.setPermissions(permissions);
            logger.info("更新子账户权限: {}", id);
        }
    }
    
    public void deleteSubAccount(String id) {
        subAccounts.remove(id);
        logger.info("删除子账户: {}", id);
    }
    
    public boolean hasPermission(String id, String permission) {
        SubAccount account = subAccounts.get(id);
        if (account == null) return false;
        return account.getPermissions().contains("ALL") || 
               account.getPermissions().contains(permission);
    }
    
    // ==================== 接口实现 ====================
    
    @Override public ModuleMetadata getMetadata() { return metadata; }
    @Override public ModuleState getState() { return state; }
    @Override public HealthStatus getHealthStatus() { return healthStatus; }
    
    @Override
    public List<Metric> getMetrics() {
        return Arrays.asList(new Metric("sub_accounts_count", Metric.MetricType.GAUGE, subAccounts.size()));
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.healthy("子账户服务运行正常")
            .withDetail("subAccounts", subAccounts.size());
    }
    
    @Override public String getApiSpecification() { return ""; }
    @Override public List<ApiDependency> getApiDependencies() { return Collections.emptyList(); }
    @Override public List<Permission> getRequiredPermissions() { return Collections.emptyList(); }
    @Override public ResourceRequirements getResourceRequirements() { return ResourceRequirements.defaults(); }
    
    // ==================== 内部类 ====================
    
    public static class SubAccount {
        private final String id;
        private final String tenantId;
        private final String username;
        private String name;
        private List<String> permissions;
        private String status;
        private final long createdAt;
        
        public SubAccount(String id, String tenantId, String username, String name, 
                         List<String> permissions, String status) {
            this.id = id;
            this.tenantId = tenantId;
            this.username = username;
            this.name = name;
            this.permissions = permissions;
            this.status = status;
            this.createdAt = System.currentTimeMillis();
        }
        
        public String getId() { return id; }
        public String getTenantId() { return tenantId; }
        public String getUsername() { return username; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public List<String> getPermissions() { return permissions; }
        public void setPermissions(List<String> permissions) { this.permissions = permissions; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public long getCreatedAt() { return createdAt; }
    }
}