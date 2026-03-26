package com.daod.iov.modules.mqtt.api.dto;

/**
 * 设备认证结果
 */
public class DeviceAuthResult {
    
    /** 是否认证成功 */
    private boolean success;
    
    /** 错误码 */
    private String errorCode;
    
    /** 错误信息 */
    private String errorMessage;
    
    /** 终端 ID */
    private String terminalId;
    
    /** 车辆 ID */
    private String vehicleId;
    
    /** 租户 ID */
    private String tenantId;
    
    /** 会话 Token */
    private String sessionToken;
    
    /** Topic 前缀 */
    private String topicPrefix;
    
    // 静态工厂方法
    public static DeviceAuthResult success(String terminalId, String tenantId) {
        DeviceAuthResult result = new DeviceAuthResult();
        result.setSuccess(true);
        result.setTerminalId(terminalId);
        result.setTenantId(tenantId);
        result.setTopicPrefix("device/" + terminalId);
        return result;
    }
    
    public static DeviceAuthResult failure(String errorCode, String errorMessage) {
        DeviceAuthResult result = new DeviceAuthResult();
        result.setSuccess(false);
        result.setErrorCode(errorCode);
        result.setErrorMessage(errorMessage);
        return result;
    }
    
    /**
     * 失败结果 (简化版)
     */
    public static DeviceAuthResult failed(String errorMessage) {
        return failure("AUTH_FAILED", errorMessage);
    }
    
    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    
    public String getTerminalId() { return terminalId; }
    public void setTerminalId(String terminalId) { this.terminalId = terminalId; }
    
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    
    public String getSessionToken() { return sessionToken; }
    public void setSessionToken(String sessionToken) { this.sessionToken = sessionToken; }
    
    public String getTopicPrefix() { return topicPrefix; }
    public void setTopicPrefix(String topicPrefix) { this.topicPrefix = topicPrefix; }
}