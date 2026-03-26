package com.daod.iov.modules.vehicleaccess.api.dto;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 会话数据
 * 
 * 存储会话相关的动态数据
 */
public class SessionData {
    
    /** 最后位置 */
    private GeoPoint lastPosition;
    
    /** 最后速度 (km/h) */
    private Double lastSpeed;
    
    /** 最后方向 (度) */
    private Integer lastDirection;
    
    /** 最后里程 (km) */
    private Double lastMileage;
    
    /** 信号强度 */
    private Integer signalStrength;
    
    /** 在线时长 (秒) */
    private Long onlineDuration;
    
    /** 位置更新时间 */
    private Instant positionUpdateTime;
    
    /** 心跳时间 */
    private Instant heartbeatTime;
    
    /** 协议版本 */
    private String protocolVersion;
    
    /** 固件版本 */
    private String firmwareVersion;
    
    /** 扩展数据 */
    private Map<String, Object> extra = new ConcurrentHashMap<>();
    
    // 构造函数
    public SessionData() {}
    
    // Getters and Setters
    public GeoPoint getLastPosition() {
        return lastPosition;
    }
    
    public void setLastPosition(GeoPoint lastPosition) {
        this.lastPosition = lastPosition;
        this.positionUpdateTime = Instant.now();
    }
    
    public Double getLastSpeed() {
        return lastSpeed;
    }
    
    public void setLastSpeed(Double lastSpeed) {
        this.lastSpeed = lastSpeed;
    }
    
    public Integer getLastDirection() {
        return lastDirection;
    }
    
    public void setLastDirection(Integer lastDirection) {
        this.lastDirection = lastDirection;
    }
    
    public Double getLastMileage() {
        return lastMileage;
    }
    
    public void setLastMileage(Double lastMileage) {
        this.lastMileage = lastMileage;
    }
    
    public Integer getSignalStrength() {
        return signalStrength;
    }
    
    public void setSignalStrength(Integer signalStrength) {
        this.signalStrength = signalStrength;
    }
    
    public Long getOnlineDuration() {
        return onlineDuration;
    }
    
    public void setOnlineDuration(Long onlineDuration) {
        this.onlineDuration = onlineDuration;
    }
    
    public Instant getPositionUpdateTime() {
        return positionUpdateTime;
    }
    
    public void setPositionUpdateTime(Instant positionUpdateTime) {
        this.positionUpdateTime = positionUpdateTime;
    }
    
    public Instant getHeartbeatTime() {
        return heartbeatTime;
    }
    
    public void setHeartbeatTime(Instant heartbeatTime) {
        this.heartbeatTime = heartbeatTime;
    }
    
    public String getProtocolVersion() {
        return protocolVersion;
    }
    
    public void setProtocolVersion(String protocolVersion) {
        this.protocolVersion = protocolVersion;
    }
    
    public String getFirmwareVersion() {
        return firmwareVersion;
    }
    
    public void setFirmwareVersion(String firmwareVersion) {
        this.firmwareVersion = firmwareVersion;
    }
    
    public Map<String, Object> getExtra() {
        return extra;
    }
    
    public void setExtra(Map<String, Object> extra) {
        this.extra = extra;
    }
    
    public Object get(String key) {
        return extra.get(key);
    }
    
    public void put(String key, Object value) {
        extra.put(key, value);
    }
    
    /**
     * 更新心跳时间
     */
    public void updateHeartbeat() {
        this.heartbeatTime = Instant.now();
    }
}