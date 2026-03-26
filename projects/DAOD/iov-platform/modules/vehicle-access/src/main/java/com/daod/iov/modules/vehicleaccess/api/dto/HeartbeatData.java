package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 心跳数据
 */
public class HeartbeatData {
    
    /** 位置 */
    private GeoPoint location;
    
    /** 速度 (km/h) */
    private double speed;
    
    /** 方向 (度) */
    private int direction;
    
    /** 电量百分比 */
    private int batteryLevel;
    
    /** 信号强度 */
    private int signalStrength;
    
    /** 里程 (km) */
    private double mileage;
    
    /** 自定义数据 */
    private String customData;
    
    // Getters and Setters
    
    public GeoPoint getLocation() { return location; }
    public void setLocation(GeoPoint location) { this.location = location; }
    
    public double getSpeed() { return speed; }
    public void setSpeed(double speed) { this.speed = speed; }
    
    public int getDirection() { return direction; }
    public void setDirection(int direction) { this.direction = direction; }
    
    public int getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(int batteryLevel) { this.batteryLevel = batteryLevel; }
    
    public int getSignalStrength() { return signalStrength; }
    public void setSignalStrength(int signalStrength) { this.signalStrength = signalStrength; }
    
    public double getMileage() { return mileage; }
    public void setMileage(double mileage) { this.mileage = mileage; }
    
    public String getCustomData() { return customData; }
    public void setCustomData(String customData) { this.customData = customData; }
}