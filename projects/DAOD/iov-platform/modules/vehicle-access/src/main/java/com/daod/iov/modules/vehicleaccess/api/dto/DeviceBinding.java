package com.daod.iov.modules.vehicleaccess.api.dto;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 设备绑定信息
 * 
 * 表示设备与车辆之间的绑定关系，包含绑定状态、协议类型、时间信息等
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class DeviceBinding {
    
    /** 绑定 ID */
    private String bindingId;
    
    /** 设备序列号 */
    private String deviceId;
    
    /** 车辆识别码 */
    private String vin;
    
    /** 租户 ID */
    private String tenantId;
    
    /** 绑定状态 */
    private BindingStatus status;
    
    /** 绑定协议 */
    private ProtocolType protocol;
    
    /** 设备类型 */
    private String deviceType;
    
    /** 设备型号 */
    private String deviceModel;
    
    /** SIM 卡号 */
    private String simNumber;
    
    /** ICCID */
    private String iccid;
    
    /** 绑定时间 */
    private LocalDateTime bindTime;
    
    /** 最后确认时间 (心跳/重连) */
    private LocalDateTime lastConfirmTime;
    
    /** 过期时间 */
    private LocalDateTime expireTime;
    
    /** 鉴权码 (JT/T 808) */
    private String authCode;
    
    /** 鉴权码过期时间 */
    private LocalDateTime authCodeExpireTime;
    
    /** 重试次数 */
    private int retryCount;
    
    /** 扩展信息 */
    private Map<String, String> attributes;
    
    // ==================== 构造函数 ====================
    
    public DeviceBinding() {
        this.status = BindingStatus.PENDING;
        this.retryCount = 0;
        this.attributes = new HashMap<>();
    }
    
    public DeviceBinding(String deviceId, String vin) {
        this();
        this.deviceId = deviceId;
        this.vin = vin;
    }
    
    // ==================== 业务方法 ====================
    
    /**
     * 判断绑定是否有效
     */
    public boolean isValid() {
        return status == BindingStatus.BOUND || status == BindingStatus.PENDING_RECOVER;
    }
    
    /**
     * 判断是否需要心跳确认
     */
    public boolean needsHeartbeatConfirm() {
        if (!isValid()) {
            return false;
        }
        
        if (lastConfirmTime == null) {
            return true;
        }
        
        int timeoutMinutes = protocol.getHeartbeatTimeoutMinutes();
        return lastConfirmTime.plusMinutes(timeoutMinutes).isBefore(LocalDateTime.now());
    }
    
    /**
     * 判断鉴权码是否有效
     */
    public boolean isAuthCodeValid() {
        if (authCode == null || authCodeExpireTime == null) {
            return false;
        }
        return authCodeExpireTime.isAfter(LocalDateTime.now());
    }
    
    /**
     * 更新最后确认时间
     */
    public void updateConfirmTime() {
        this.lastConfirmTime = LocalDateTime.now();
        if (this.status == BindingStatus.PENDING_RECOVER) {
            this.status = BindingStatus.BOUND;
        }
    }
    
    /**
     * 增加重试次数
     */
    public void incrementRetry() {
        this.retryCount++;
    }
    
    /**
     * 重置重试次数
     */
    public void resetRetry() {
        this.retryCount = 0;
    }
    
    /**
     * 判断是否超过最大重试次数
     */
    public boolean isMaxRetryExceeded(int maxRetry) {
        return this.retryCount >= maxRetry;
    }
    
    // ==================== Getters and Setters ====================
    
    public String getBindingId() {
        return bindingId;
    }
    
    public void setBindingId(String bindingId) {
        this.bindingId = bindingId;
    }
    
    public String getDeviceId() {
        return deviceId;
    }
    
    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }
    
    public String getVin() {
        return vin;
    }
    
    public void setVin(String vin) {
        this.vin = vin;
    }
    
    public String getTenantId() {
        return tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
    
    public BindingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BindingStatus status) {
        this.status = status;
    }
    
    public ProtocolType getProtocol() {
        return protocol;
    }
    
    public void setProtocol(ProtocolType protocol) {
        this.protocol = protocol;
    }
    
    public String getDeviceType() {
        return deviceType;
    }
    
    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }
    
    public String getDeviceModel() {
        return deviceModel;
    }
    
    public void setDeviceModel(String deviceModel) {
        this.deviceModel = deviceModel;
    }
    
    public String getSimNumber() {
        return simNumber;
    }
    
    public void setSimNumber(String simNumber) {
        this.simNumber = simNumber;
    }
    
    public String getIccid() {
        return iccid;
    }
    
    public void setIccid(String iccid) {
        this.iccid = iccid;
    }
    
    public LocalDateTime getBindTime() {
        return bindTime;
    }
    
    public void setBindTime(LocalDateTime bindTime) {
        this.bindTime = bindTime;
    }
    
    public LocalDateTime getLastConfirmTime() {
        return lastConfirmTime;
    }
    
    public void setLastConfirmTime(LocalDateTime lastConfirmTime) {
        this.lastConfirmTime = lastConfirmTime;
    }
    
    public LocalDateTime getExpireTime() {
        return expireTime;
    }
    
    public void setExpireTime(LocalDateTime expireTime) {
        this.expireTime = expireTime;
    }
    
    public String getAuthCode() {
        return authCode;
    }
    
    public void setAuthCode(String authCode) {
        this.authCode = authCode;
    }
    
    public LocalDateTime getAuthCodeExpireTime() {
        return authCodeExpireTime;
    }
    
    public void setAuthCodeExpireTime(LocalDateTime authCodeExpireTime) {
        this.authCodeExpireTime = authCodeExpireTime;
    }
    
    public int getRetryCount() {
        return retryCount;
    }
    
    public void setRetryCount(int retryCount) {
        this.retryCount = retryCount;
    }
    
    public Map<String, String> getAttributes() {
        return attributes;
    }
    
    public void setAttributes(Map<String, String> attributes) {
        this.attributes = attributes;
    }
    
    public void addAttribute(String key, String value) {
        this.attributes.put(key, value);
    }
    
    public String getAttribute(String key) {
        return this.attributes.get(key);
    }
}