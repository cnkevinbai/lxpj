package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 绑定事件类型枚举
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public enum BindingEventType {
    
    /** 绑定请求 */
    BIND_REQUEST("BIND_REQUEST", "绑定请求"),
    
    /** 绑定成功 */
    BIND_SUCCESS("BIND_SUCCESS", "绑定成功"),
    
    /** 绑定失败 */
    BIND_FAILURE("BIND_FAILURE", "绑定失败"),
    
    /** 解绑请求 */
    UNBIND_REQUEST("UNBIND_REQUEST", "解绑请求"),
    
    /** 解绑成功 */
    UNBIND_SUCCESS("UNBIND_SUCCESS", "解绑成功"),
    
    /** 解绑失败 */
    UNBIND_FAILURE("UNBIND_FAILURE", "解绑失败"),
    
    /** 绑定恢复 */
    BIND_RECOVERED("BIND_RECOVERED", "绑定恢复"),
    
    /** 绑定过期 */
    BIND_EXPIRED("BIND_EXPIRED", "绑定过期"),
    
    /** 设备上线 */
    DEVICE_ONLINE("DEVICE_ONLINE", "设备上线"),
    
    /** 设备离线 */
    DEVICE_OFFLINE("DEVICE_OFFLINE", "设备离线"),
    
    /** 心跳超时 */
    HEARTBEAT_TIMEOUT("HEARTBEAT_TIMEOUT", "心跳超时"),
    
    /** 重连成功 */
    RECONNECT_SUCCESS("RECONNECT_SUCCESS", "重连成功"),
    
    /** 认证成功 */
    AUTH_SUCCESS("AUTH_SUCCESS", "认证成功"),
    
    /** 认证失败 */
    AUTH_FAILURE("AUTH_FAILURE", "认证失败");
    
    private final String code;
    private final String description;
    
    BindingEventType(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * 根据代码获取事件类型
     */
    public static BindingEventType fromCode(String code) {
        for (BindingEventType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        return null;
    }
    
    /**
     * 是否为成功事件
     */
    public boolean isSuccessEvent() {
        return this == BIND_SUCCESS || this == UNBIND_SUCCESS || 
               this == BIND_RECOVERED || this == RECONNECT_SUCCESS ||
               this == AUTH_SUCCESS;
    }
    
    /**
     * 是否为失败事件
     */
    public boolean isFailureEvent() {
        return this == BIND_FAILURE || this == UNBIND_FAILURE || 
               this == AUTH_FAILURE;
    }
}