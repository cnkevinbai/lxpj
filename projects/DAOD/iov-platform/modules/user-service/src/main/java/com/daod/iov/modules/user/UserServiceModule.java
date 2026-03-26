package com.daod.iov.modules.user;

import com.daod.iov.plugin.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 用户服务模块
 * 
 * 功能：
 * - 用户管理
 * - 用户认证
 * - 用户权限
 * - 用户配置
 * 
 * @author daod-team
 * @version 1.0.0
 */
@Component
public class UserServiceModule implements ISFU {
    
    private static final Logger logger = LoggerFactory.getLogger(UserServiceModule.class);
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    private final Map<String, User> users = new ConcurrentHashMap<>();
    
    public UserServiceModule() {
        this.metadata = new ModuleMetadata("user-service", "1.0.0", "用户服务");
        this.metadata.setType("business");
        this.metadata.setPriority(8);
    }
    
    @Override
    public void initialize(ModuleContext context) {
        this.context = context;
        initDefaultUsers();
        logger.info("用户服务初始化完成");
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }
    
    private void initDefaultUsers() {
        users.put("admin", new User("admin", "admin", "admin@daoda.com", "管理员", "admin", "ACTIVE"));
    }
    
    @Override
    public void start() {
        logger.info("用户服务启动完成");
        state = ModuleState.RUNNING;
    }
    
    @Override
    public void stop() {
        logger.info("用户服务已停止");
        state = ModuleState.STOPPED;
    }
    
    @Override
    public void destroy() {
        users.clear();
        state = ModuleState.DESTROYED;
    }
    
    // ==================== 用户管理 ====================
    
    public User createUser(String username, String email, String name, String role) {
        String id = UUID.randomUUID().toString();
        User user = new User(id, username, email, name, role, "ACTIVE");
        users.put(id, user);
        logger.info("创建用户: {} ({})", username, id);
        return user;
    }
    
    public User getUser(String id) {
        return users.get(id);
    }
    
    public User getUserByUsername(String username) {
        return users.values().stream()
            .filter(u -> u.getUsername().equals(username))
            .findFirst()
            .orElse(null);
    }
    
    public List<User> listUsers() {
        return new ArrayList<>(users.values());
    }
    
    public void updateUser(String id, String name, String email) {
        User user = users.get(id);
        if (user != null) {
            user.setName(name);
            user.setEmail(email);
            logger.info("更新用户: {}", id);
        }
    }
    
    public void deleteUser(String id) {
        if (!id.equals("admin")) {
            users.remove(id);
            logger.info("删除用户: {}", id);
        }
    }
    
    public void changePassword(String id, String newPassword) {
        User user = users.get(id);
        if (user != null) {
            user.setPassword(newPassword);
            logger.info("修改密码: {}", id);
        }
    }
    
    // ==================== 接口实现 ====================
    
    @Override public ModuleMetadata getMetadata() { return metadata; }
    @Override public ModuleState getState() { return state; }
    @Override public HealthStatus getHealthStatus() { return healthStatus; }
    
    @Override
    public List<Metric> getMetrics() {
        return List.of(new Metric("users_count", Metric.MetricType.GAUGE, users.size()));
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.healthy("用户服务运行正常")
            .withDetail("users", users.size());
    }
    
    @Override public String getApiSpecification() { return ""; }
    @Override public List<ApiDependency> getApiDependencies() { return List.of(); }
    @Override public List<Permission> getRequiredPermissions() { return List.of(); }
    @Override public ResourceRequirements getResourceRequirements() { return ResourceRequirements.defaults(); }
    
    // ==================== 内部类 ====================
    
    public static class User {
        private final String id;
        private final String username;
        private String email;
        private String name;
        private String role;
        private String status;
        private String password;
        private final long createdAt;
        
        public User(String id, String username, String email, String name, String role, String status) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.name = name;
            this.role = role;
            this.status = status;
            this.createdAt = System.currentTimeMillis();
        }
        
        public String getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public long getCreatedAt() { return createdAt; }
    }
}