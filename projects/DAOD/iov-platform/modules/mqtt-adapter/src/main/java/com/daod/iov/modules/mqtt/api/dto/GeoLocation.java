package com.daod.iov.modules.mqtt.api.dto;

/**
 * 地理位置信息
 */
public class GeoLocation {
    
    /** 纬度 */
    private double latitude;
    
    /** 经度 */
    private double longitude;
    
    /** 海拔 */
    private Double altitude;
    
    /** 精度 */
    private Double accuracy;
    
    /** 定位时间 */
    private Long timestamp;
    
    // 构造函数
    public GeoLocation() {}
    
    public GeoLocation(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    // Getters and Setters
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    
    public Double getAltitude() { return altitude; }
    public void setAltitude(Double altitude) { this.altitude = altitude; }
    
    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
    
    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
}