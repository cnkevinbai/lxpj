package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 认证会话
 */
public class AuthSession {
    
    /** 会话 ID */
    private String sessionId;
    
    /** 车辆识别码 */
    private String vin;
    
    /** 设备 ID */
    private String deviceId;
    
    /** 租户 ID */
    private String tenantId;
    
    /** 访问 Token */
    private String accessToken;
    
    /** 创建时间 */
    private long createdAt;
    
    /** 最后活跃时间 */
    private long lastActiveAt;
    
    /** 过期时间 */
    private long expiresAt;
    
    // Getters and Setters
    
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    
    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }
    
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    
    public long getCreatedAt() { return createdAt; }
    public void setCreatedAt(long createdAt) { this.createdAt = createdAt; }
    
    public long getLastActiveAt() { return lastActiveAt; }
    public void setLastActiveAt(long lastActiveAt) { this.lastActiveAt = lastActiveAt; }
    
    public long getExpiresAt() { return expiresAt; }
    public void setExpiresAt(long expiresAt) { this.expiresAt = expiresAt; }
}