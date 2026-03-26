package com.daod.iov.modules.httpadapter.api.dto;

/**
 * 位置信息
 */
public class PositionInfo {
    
    /** 纬度 */
    private double latitude;
    
    /** 经度 */
    private double longitude;
    
    /** 海拔 (米) */
    private Double altitude;
    
    /** 方向 (度) */
    private Integer direction;
    
    /** 定位类型 (GPS/LBS/WiFi) */
    private String locationType;
    
    /** 精度 (米) */
    private Double accuracy;
    
    /** 定位时间 */
    private Long locationTime;
    
    // Getters and Setters
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    
    public Double getAltitude() { return altitude; }
    public void setAltitude(Double altitude) { this.altitude = altitude; }
    
    public Integer getDirection() { return direction; }
    public void setDirection(Integer direction) { this.direction = direction; }
    
    public String getLocationType() { return locationType; }
    public void setLocationType(String locationType) { this.locationType = locationType; }
    
    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
    
    public Long getLocationTime() { return locationTime; }
    public void setLocationTime(Long locationTime) { this.locationTime = locationTime; }
}