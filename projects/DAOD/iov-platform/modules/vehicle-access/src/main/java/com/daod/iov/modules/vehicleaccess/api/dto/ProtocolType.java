package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 协议类型枚举
 * 
 * 定义设备接入的协议类型
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public enum ProtocolType {
    
    /**
     * JT/T 808 协议 - 道路运输车辆卫星定位系统终端通讯协议
     * 适用: 合规车载终端
     */
    JTT808("JTT808", "JT/T 808协议", 8808),
    
    /**
     * MQTT 协议 - 消息队列遥测传输协议
     * 适用: IoT智能设备
     */
    MQTT("MQTT", "MQTT协议", 1883),
    
    /**
     * HTTP 协议 - 超文本传输协议
     * 适用: 轻量设备、第三方平台
     */
    HTTP("HTTP", "HTTP协议", 8080);
    
    private final String code;
    private final String description;
    private final int defaultPort;
    
    ProtocolType(String code, String description, int defaultPort) {
        this.code = code;
        this.description = description;
        this.defaultPort = defaultPort;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
    
    public int getDefaultPort() {
        return defaultPort;
    }
    
    /**
     * 根据代码获取协议类型
     */
    public static ProtocolType fromCode(String code) {
        for (ProtocolType type : values()) {
            if (type.code.equalsIgnoreCase(code)) {
                return type;
            }
        }
        return null;
    }
    
    /**
     * 是否支持长连接
     */
    public boolean isLongConnection() {
        return this == JTT808 || this == MQTT;
    }
    
    /**
     * 是否支持遗嘱消息
     */
    public boolean supportsWillMessage() {
        return this == MQTT;
    }
    
    /**
     * 获取心跳超时时间 (分钟)
     */
    public int getHeartbeatTimeoutMinutes() {
        switch (this) {
            case JTT808:
                return 5;
            case MQTT:
                return 5;
            case HTTP:
                return 10;
            default:
                return 5;
        }
    }
    
    /**
     * 获取重连等待时间 (分钟)
     */
    public int getReconnectWaitMinutes() {
        switch (this) {
            case JTT808:
                return 30;
            case MQTT:
                return 30;
            case HTTP:
                return 60;
            default:
                return 30;
        }
    }
}