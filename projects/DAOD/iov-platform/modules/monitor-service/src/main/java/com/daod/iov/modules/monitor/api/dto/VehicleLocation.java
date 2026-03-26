package com.daod.iov.modules.monitor.api.dto;

/**
 * 车辆位置
 */
public class VehicleLocation {
    
    private String vehicleId;
    private String vehicleNo;
    private GeoPoint location;
    private double speed;
    private int direction;
    private int batteryLevel;
    private VehicleStatus status;
    private long updateTime;
    
    // Getters and Setters
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }
    public String getVehicleNo() { return vehicleNo; }
    public void setVehicleNo(String vehicleNo) { this.vehicleNo = vehicleNo; }
    public GeoPoint getLocation() { return location; }
    public void setLocation(GeoPoint location) { this.location = location; }
    public double getSpeed() { return speed; }
    public void setSpeed(double speed) { this.speed = speed; }
    public int getDirection() { return direction; }
    public void setDirection(int direction) { this.direction = direction; }
    public int getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(int batteryLevel) { this.batteryLevel = batteryLevel; }
    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }
    public long getUpdateTime() { return updateTime; }
    public void setUpdateTime(long updateTime) { this.updateTime = updateTime; }
}

/**
 * 车辆状态
 */
enum VehicleStatus {
    RUNNING, STOPPED, CHARGING, FAULT, OFFLINE
}

/**
 * 地理坐标点
 */
class GeoPoint {
    private double lat;
    private double lng;
    
    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }
    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }
}