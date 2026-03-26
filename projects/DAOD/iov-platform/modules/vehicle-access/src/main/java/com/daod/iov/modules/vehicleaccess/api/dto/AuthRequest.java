package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 认证请求
 */
public class AuthRequest {
    
    /** 车辆识别码 */
    private String vin;
    
    /** 设备 ID */
    private String deviceId;
    
    /** 设备密钥 */
    private String deviceKey;
    
    /** 认证类型 */
    private AuthType authType;
    
    /** 租户 ID */
    private String tenantId;
    
    // Getters and Setters
    
    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }
    
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    
    public String getDeviceKey() { return deviceKey; }
    public void setDeviceKey(String deviceKey) { this.deviceKey = deviceKey; }
    
    public AuthType getAuthType() { return authType; }
    public void setAuthType(AuthType authType) { this.authType = authType; }
    
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    
    /**
     * 认证类型枚举
     */
    public enum AuthType {
        VIN,        // VIN 认证
        DEVICE,     // 设备认证
        TOKEN       // Token 认证
    }
}