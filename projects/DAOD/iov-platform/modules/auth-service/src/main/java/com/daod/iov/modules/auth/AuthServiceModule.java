package com.daod.iov.modules.auth;

import com.daod.iov.plugin.*;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 认证服务模块
 * 
 * 功能：
 * - 用户登录/登出
 * - Token 管理
 * - 会话管理
 * - 权限验证
 * 
 * @author daod-team
 * @version 1.0.0
 */
@Component
public class AuthServiceModule implements ISFU {
    
    private static final Logger logger = LoggerFactory.getLogger(AuthServiceModule.class);
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    private final Map<String, Session> sessions = new ConcurrentHashMap<>();
    private final SecretKey jwtKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long tokenExpireMs = 24 * 60 * 60 * 1000; // 24小时
    
    public AuthServiceModule() {
        this.metadata = new ModuleMetadata("auth-service", "1.0.0", "认证服务");
        this.metadata.setType("business");
        this.metadata.setPriority(5);
    }
    
    @Override
    public void initialize(ModuleContext context) {
        this.context = context;
        logger.info("认证服务初始化完成");
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }
    
    @Override
    public void start() {
        logger.info("认证服务启动完成");
        state = ModuleState.RUNNING;
    }
    
    @Override
    public void stop() {
        sessions.clear();
        logger.info("认证服务已停止");
        state = ModuleState.STOPPED;
    }
    
    @Override
    public void destroy() {
        sessions.clear();
        state = ModuleState.DESTROYED;
    }
    
    // ==================== 认证功能 ====================
    
    public String login(String userId, String username) {
        String token = Jwts.builder()
            .setSubject(userId)
            .claim("username", username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + tokenExpireMs))
            .signWith(jwtKey)
            .compact();
        
        Session session = new Session(userId, username, token);
        sessions.put(token, session);
        
        logger.info("用户登录: {} ({})", username, userId);
        return token;
    }
    
    public void logout(String token) {
        Session session = sessions.remove(token);
        if (session != null) {
            logger.info("用户登出: {}", session.getUsername());
        }
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(jwtKey)
                .build()
                .parseClaimsJws(token);
            return sessions.containsKey(token);
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getUserId(String token) {
        try {
            return Jwts.parserBuilder()
                .setSigningKey(jwtKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        } catch (Exception e) {
            return null;
        }
    }
    
    public int getActiveSessionCount() {
        return sessions.size();
    }
    
    // ==================== 接口实现 ====================
    
    @Override public ModuleMetadata getMetadata() { return metadata; }
    @Override public ModuleState getState() { return state; }
    @Override public HealthStatus getHealthStatus() { return healthStatus; }
    
    @Override
    public List<Metric> getMetrics() {
        return Arrays.asList(
            new Metric("auth_sessions", Metric.MetricType.GAUGE, sessions.size())
        );
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.healthy("认证服务运行正常")
            .withDetail("activeSessions", sessions.size());
    }
    
    @Override public String getApiSpecification() { return ""; }
    @Override public List<ApiDependency> getApiDependencies() { return Collections.emptyList(); }
    @Override public List<Permission> getRequiredPermissions() { return Collections.emptyList(); }
    @Override public ResourceRequirements getResourceRequirements() { return ResourceRequirements.defaults(); }
    
    // ==================== 内部类 ====================
    
    public static class Session {
        private final String userId;
        private final String username;
        private final String token;
        private final long createdAt;
        
        public Session(String userId, String username, String token) {
            this.userId = userId;
            this.username = username;
            this.token = token;
            this.createdAt = System.currentTimeMillis();
        }
        
        public String getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getToken() { return token; }
        public long getCreatedAt() { return createdAt; }
    }
}