package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 认证结果
 */
public class AuthResult {
    
    /** 是否成功 */
    private boolean success;
    
    /** 访问 Token */
    private String accessToken;
    
    /** 刷新 Token */
    private String refreshToken;
    
    /** 过期时间 (秒) */
    private long expiresIn;
    
    /** 车辆信息 */
    private VehicleInfo vehicleInfo;
    
    /** 错误码 */
    private String errorCode;
    
    /** 错误消息 */
    private String errorMessage;
    
    // Getters and Setters
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
    
    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    
    public long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(long expiresIn) { this.expiresIn = expiresIn; }
    
    public VehicleInfo getVehicleInfo() { return vehicleInfo; }
    public void setVehicleInfo(VehicleInfo vehicleInfo) { this.vehicleInfo = vehicleInfo; }
    
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}