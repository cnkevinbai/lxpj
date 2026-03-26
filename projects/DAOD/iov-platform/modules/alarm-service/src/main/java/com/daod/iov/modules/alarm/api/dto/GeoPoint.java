package com.daod.iov.modules.alarm.api.dto;

/**
 * 地理坐标点
 */
public class GeoPoint {
    
    /** 纬度 */
    private double lat;
    
    /** 经度 */
    private double lng;
    
    // 构造函数
    public GeoPoint() {}
    
    public GeoPoint(double lat, double lng) {
        this.lat = lat;
        this.lng = lng;
    }
    
    // Getters and Setters
    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }
    
    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }
}