package com.daod.iov.modules.vehicleaccess.api.dto;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 车辆会话信息
 * 
 * 表示一个终端与平台的连接会话
 */
public class VehicleSession {
    
    /** 会话 ID */
    private String sessionId;
    
    /** 车辆识别码 */
    private String vin;
    
    /** 终端序列号 */
    private String terminalId;
    
    /** 会话状态 */
    private SessionState state;
    
    /** 认证结果 */
    private AuthResult authResult;
    
    /** 访问令牌 */
    private String accessToken;
    
    /** 会话数据 */
    private SessionData data;
    
    /** 创建时间 */
    private Instant createdAt;
    
    /** 最后活跃时间 */
    private Instant lastActiveAt;
    
    /** 过期时间 */
    private Instant expiresAt;
    
    /** 扩展属性 */
    private Map<String, Object> attributes = new ConcurrentHashMap<>();
    
    // 会话状态枚举
    public enum SessionState {
        /** 已连接 */
        CONNECTED,
        /** 已认证 */
        AUTHENTICATED,
        /** 活跃中 */
        ACTIVE,
        /** 已断开 */
        DISCONNECTED,
        /** 已过期 */
        EXPIRED
    }
    
    // 构造函数
    public VehicleSession() {
        this.state = SessionState.CONNECTED;
        this.createdAt = Instant.now();
        this.lastActiveAt = Instant.now();
        this.data = new SessionData();
    }
    
    public VehicleSession(String sessionId, String vin) {
        this();
        this.sessionId = sessionId;
        this.vin = vin;
    }
    
    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getVin() {
        return vin;
    }
    
    public void setVin(String vin) {
        this.vin = vin;
    }
    
    public String getTerminalId() {
        return terminalId;
    }
    
    public void setTerminalId(String terminalId) {
        this.terminalId = terminalId;
    }
    
    public SessionState getState() {
        return state;
    }
    
    public void setState(SessionState state) {
        this.state = state;
    }
    
    public AuthResult getAuthResult() {
        return authResult;
    }
    
    public void setAuthResult(AuthResult authResult) {
        this.authResult = authResult;
    }
    
    public String getAccessToken() {
        return accessToken;
    }
    
    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }
    
    public SessionData getData() {
        return data;
    }
    
    public void setData(SessionData data) {
        this.data = data;
    }
    
    public Instant getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    
    public Instant getLastActiveAt() {
        return lastActiveAt;
    }
    
    public void setLastActiveAt(Instant lastActiveAt) {
        this.lastActiveAt = lastActiveAt;
    }
    
    public Instant getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public Map<String, Object> getAttributes() {
        return attributes;
    }
    
    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }
    
    public Object getAttribute(String key) {
        return attributes.get(key);
    }
    
    public void setAttribute(String key, Object value) {
        attributes.put(key, value);
    }
    
    /**
     * 更新最后活跃时间
     */
    public void touch() {
        this.lastActiveAt = Instant.now();
    }
    
    /**
     * 判断会话是否活跃
     */
    public boolean isActive() {
        return state == SessionState.ACTIVE || state == SessionState.AUTHENTICATED;
    }
    
    /**
     * 判断会话是否过期
     */
    public boolean isExpired() {
        return expiresAt != null && Instant.now().isAfter(expiresAt);
    }
}