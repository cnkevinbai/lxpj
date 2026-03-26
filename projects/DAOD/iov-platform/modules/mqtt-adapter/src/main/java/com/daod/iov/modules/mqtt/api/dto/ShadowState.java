package com.daod.iov.modules.mqtt.api.dto;

import java.util.Map;

/**
 * 影子状态
 */
public class ShadowState {
    
    /** 在线状态 */
    private Boolean online;
    
    /** 锁车状态 */
    private Boolean locked;
    
    /** 心跳间隔 (秒) */
    private Integer heartbeatInterval;
    
    /** 定位上报间隔 (秒) */
    private Integer positionInterval;
    
    /** 固件版本 */
    private String firmwareVersion;
    
    /** 位置 */
    private GeoLocation location;
    
    /** 电量 */
    private Integer batteryLevel;
    
    /** 速度 */
    private Double speed;
    
    /** 扩展属性 */
    private Map<String, Object> properties;
    
    // Getters and Setters
    public Boolean getOnline() { return online; }
    public void setOnline(Boolean online) { this.online = online; }
    
    public Boolean getLocked() { return locked; }
    public void setLocked(Boolean locked) { this.locked = locked; }
    
    public Integer getHeartbeatInterval() { return heartbeatInterval; }
    public void setHeartbeatInterval(Integer heartbeatInterval) { this.heartbeatInterval = heartbeatInterval; }
    
    public Integer getPositionInterval() { return positionInterval; }
    public void setPositionInterval(Integer positionInterval) { this.positionInterval = positionInterval; }
    
    public String getFirmwareVersion() { return firmwareVersion; }
    public void setFirmwareVersion(String firmwareVersion) { this.firmwareVersion = firmwareVersion; }
    
    public GeoLocation getLocation() { return location; }
    public void setLocation(GeoLocation location) { this.location = location; }
    
    public Integer getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(Integer batteryLevel) { this.batteryLevel = batteryLevel; }
    
    public Double getSpeed() { return speed; }
    public void setSpeed(Double speed) { this.speed = speed; }
    
    public Map<String, Object> getProperties() { return properties; }
    public void setProperties(Map<String, Object> properties) { this.properties = properties; }
}