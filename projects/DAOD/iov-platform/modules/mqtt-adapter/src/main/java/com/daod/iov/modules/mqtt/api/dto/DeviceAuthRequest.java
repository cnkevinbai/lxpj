package com.daod.iov.modules.mqtt.api.dto;

import java.util.Map;

/**
 * MQTT 设备认证请求
 */
public class DeviceAuthRequest {
    
    /** 客户端 ID (通常是终端序列号) */
    private String clientId;
    
    /** 用户名 */
    private String username;
    
    /** 密码/Token */
    private String password;
    
    /** 设备型号 */
    private String deviceModel;
    
    /** 固件版本 */
    private String firmwareVersion;
    
    /** 扩展属性 */
    private Map<String, String> attributes;
    
    // Getters and Setters
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getDeviceModel() { return deviceModel; }
    public void setDeviceModel(String deviceModel) { this.deviceModel = deviceModel; }
    
    public String getFirmwareVersion() { return firmwareVersion; }
    public void setFirmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; }
    
    public Map<String, String> getAttributes() { return attributes; }
    public void setAttributes(Map<String, String> attributes) { this.attributes = attributes; }
}