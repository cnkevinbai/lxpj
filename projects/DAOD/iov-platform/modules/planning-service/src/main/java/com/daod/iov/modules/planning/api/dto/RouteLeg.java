package com.daod.iov.modules.planning.api.dto;

/**
 * 路段
 */
public class RouteLeg {
    
    /** 起点坐标 */
    private GeoPoint startLocation;
    
    /** 终点坐标 */
    private GeoPoint endLocation;
    
    /** 距离 (米) */
    private double distance;
    
    /** 时间 (秒) */
    private double duration;
    
    /** 道路名称 */
    private String roadName;
    
    /** 道路类型 */
    private String roadType;
    
    /** 路段几何 */
    private String geometry;
    
    // Getters and Setters
    
    public GeoPoint getStartLocation() {
        return startLocation;
    }
    
    public void setStartLocation(GeoPoint startLocation) {
        this.startLocation = startLocation;
    }
    
    public GeoPoint getEndLocation() {
        return endLocation;
    }
    
    public void setEndLocation(GeoPoint endLocation) {
        this.endLocation = endLocation;
    }
    
    public double getDistance() {
        return distance;
    }
    
    public void setDistance(double distance) {
        this.distance = distance;
    }
    
    public double getDuration() {
        return duration;
    }
    
    public void setDuration(double duration) {
        this.duration = duration;
    }
    
    public String getRoadName() {
        return roadName;
    }
    
    public void setRoadName(String roadName) {
        this.roadName = roadName;
    }
    
    public String getRoadType() {
        return roadType;
    }
    
    public void setRoadType(String roadType) {
        this.roadType = roadType;
    }
    
    public String getGeometry() {
        return geometry;
    }
    
    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }
}