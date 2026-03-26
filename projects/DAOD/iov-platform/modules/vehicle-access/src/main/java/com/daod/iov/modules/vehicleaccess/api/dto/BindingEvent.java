package com.daod.iov.modules.vehicleaccess.api.dto;

import java.time.LocalDateTime;

/**
 * 绑定事件
 * 
 * 记录设备绑定过程中的事件，用于审计和追溯
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public class BindingEvent {
    
    /** 事件 ID */
    private String eventId;
    
    /** 绑定 ID */
    private String bindingId;
    
    /** 设备 ID */
    private String deviceId;
    
    /** 车辆 VIN */
    private String vin;
    
    /** 事件类型 */
    private BindingEventType eventType;
    
    /** 事件时间 */
    private LocalDateTime eventTime;
    
    /** 协议类型 */
    private ProtocolType protocol;
    
    /** 操作结果 */
    private boolean success;
    
    /** 错误信息 */
    private String errorMessage;
    
    /** 错误码 */
    private String errorCode;
    
    /** 重试次数 */
    private int retryCount;
    
    /** 客户端 IP */
    private String clientIp;
    
    /** 扩展信息 */
    private String extraInfo;
    
    // ==================== 构造函数 ====================
    
    public BindingEvent() {
        this.eventTime = LocalDateTime.now();
        this.success = true;
        this.retryCount = 0;
    }
    
    // ==================== 静态工厂方法 ====================
    
    /**
     * 创建绑定请求事件
     */
    public static BindingEvent bindRequest(String bindingId, String deviceId, String vin, 
                                            ProtocolType protocol) {
        BindingEvent event = new BindingEvent();
        event.setBindingId(bindingId);
        event.setDeviceId(deviceId);
        event.setVin(vin);
        event.setEventType(BindingEventType.BIND_REQUEST);
        event.setProtocol(protocol);
        return event;
    }
    
    /**
     * 创建绑定成功事件
     */
    public static BindingEvent bindSuccess(String bindingId, String deviceId, String vin,
                                            ProtocolType protocol) {
        BindingEvent event = new BindingEvent();
        event.setBindingId(bindingId);
        event.setDeviceId(deviceId);
        event.setVin(vin);
        event.setEventType(BindingEventType.BIND_SUCCESS);
        event.setProtocol(protocol);
        event.setSuccess(true);
        return event;
    }
    
    /**
     * 创建绑定失败事件
     */
    public static BindingEvent bindFailure(String bindingId, String deviceId, String vin,
                                            ProtocolType protocol, String errorMessage) {
        BindingEvent event = new BindingEvent();
        event.setBindingId(bindingId);
        event.setDeviceId(deviceId);
        event.setVin(vin);
        event.setEventType(BindingEventType.BIND_FAILURE);
        event.setProtocol(protocol);
        event.setSuccess(false);
        event.setErrorMessage(errorMessage);
        return event;
    }
    
    /**
     * 创建解绑成功事件
     */
    public static BindingEvent unbindSuccess(String bindingId, String deviceId, String vin,
                                              ProtocolType protocol) {
        BindingEvent event = new BindingEvent();
        event.setBindingId(bindingId);
        event.setDeviceId(deviceId);
        event.setVin(vin);
        event.setEventType(BindingEventType.UNBIND_SUCCESS);
        event.setProtocol(protocol);
        event.setSuccess(true);
        return event;
    }
    
    /**
     * 创建绑定恢复事件
     */
    public static BindingEvent bindRecovered(String bindingId, String deviceId, String vin,
                                              ProtocolType protocol) {
        BindingEvent event = new BindingEvent();
        event.setBindingId(bindingId);
        event.setDeviceId(deviceId);
        event.setVin(vin);
        event.setEventType(BindingEventType.BIND_RECOVERED);
        event.setProtocol(protocol);
        event.setSuccess(true);
        return event;
    }
    
    /**
     * 创建绑定过期事件
     */
    public static BindingEvent bindExpired(String bindingId, String deviceId, String vin,
                                            ProtocolType protocol) {
        BindingEvent event = new BindingEvent();
        event.setBindingId(bindingId);
        event.setDeviceId(deviceId);
        event.setVin(vin);
        event.setEventType(BindingEventType.BIND_EXPIRED);
        event.setProtocol(protocol);
        event.setSuccess(true);
        return event;
    }
    
    /**
     * 创建认证成功事件
     */
    public static BindingEvent authSuccess(String bindingId, String deviceId, String vin,
                                            ProtocolType protocol) {
        BindingEvent event = new BindingEvent();
        event.setBindingId(bindingId);
        event.setDeviceId(deviceId);
        event.setVin(vin);
        event.setEventType(BindingEventType.AUTH_SUCCESS);
        event.setProtocol(protocol);
        event.setSuccess(true);
        return event;
    }
    
    /**
     * 创建认证失败事件
     */
    public static BindingEvent authFailure(String bindingId, String deviceId, String vin,
                                            ProtocolType protocol, String errorMessage) {
        BindingEvent event = new BindingEvent();
        event.setBindingId(bindingId);
        event.setDeviceId(deviceId);
        event.setVin(vin);
        event.setEventType(BindingEventType.AUTH_FAILURE);
        event.setProtocol(protocol);
        event.setSuccess(false);
        event.setErrorMessage(errorMessage);
        return event;
    }
    
    // ==================== Getters and Setters ====================
    
    public String getEventId() {
        return eventId;
    }
    
    public void setEventId(String eventId) {
        this.eventId = eventId;
    }
    
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
    
    public BindingEventType getEventType() {
        return eventType;
    }
    
    public void setEventType(BindingEventType eventType) {
        this.eventType = eventType;
    }
    
    public LocalDateTime getEventTime() {
        return eventTime;
    }
    
    public void setEventTime(LocalDateTime eventTime) {
        this.eventTime = eventTime;
    }
    
    public ProtocolType getProtocol() {
        return protocol;
    }
    
    public void setProtocol(ProtocolType protocol) {
        this.protocol = protocol;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
    
    public int getRetryCount() {
        return retryCount;
    }
    
    public void setRetryCount(int retryCount) {
        this.retryCount = retryCount;
    }
    
    public String getClientIp() {
        return clientIp;
    }
    
    public void setClientIp(String clientIp) {
        this.clientIp = clientIp;
    }
    
    public String getExtraInfo() {
        return extraInfo;
    }
    
    public void setExtraInfo(String extraInfo) {
        this.extraInfo = extraInfo;
    }
}