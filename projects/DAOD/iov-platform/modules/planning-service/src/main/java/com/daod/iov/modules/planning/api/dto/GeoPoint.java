package com.daod.iov.modules.planning.api.dto;

/**
 * 地理坐标点
 */
public class GeoPoint {
    
    private double lat;  // 纬度
    private double lng;  // 经度
    
    public GeoPoint() {}
    
    public GeoPoint(double lat, double lng) {
        this.lat = lat;
        this.lng = lng;
    }
    
    public double getLat() {
        return lat;
    }
    
    public void setLat(double lat) {
        this.lat = lat;
    }
    
    public double getLng() {
        return lng;
    }
    
    public void setLng(double lng) {
        this.lng = lng;
    }
    
    /**
     * 计算两点间距离 (Haversine 公式)
     */
    public double distanceTo(GeoPoint other) {
        final double R = 6371000; // 地球半径 (米)
        
        double lat1 = Math.toRadians(this.lat);
        double lat2 = Math.toRadians(other.lat);
        double deltaLat = Math.toRadians(other.lat - this.lat);
        double deltaLng = Math.toRadians(other.lng - this.lng);
        
        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                   Math.cos(lat1) * Math.cos(lat2) *
                   Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
    
    @Override
    public String toString() {
        return String.format("GeoPoint(%.6f, %.6f)", lat, lng);
    }
}