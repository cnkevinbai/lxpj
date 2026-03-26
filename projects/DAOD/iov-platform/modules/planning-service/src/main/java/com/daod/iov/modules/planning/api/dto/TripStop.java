package com.daod.iov.modules.planning.api.dto;

/**
 * 行程停靠点
 */
public class TripStop {
    
    private int index;
    private GeoPoint location;
    private String waypointId;
    private double distance;
    private double duration;
    private int stayDuration;
    
    // Getters and Setters
    
    public int getIndex() {
        return index;
    }
    
    public void setIndex(int index) {
        this.index = index;
    }
    
    public GeoPoint getLocation() {
        return location;
    }
    
    public void setLocation(GeoPoint location) {
        this.location = location;
    }
    
    public String getWaypointId() {
        return waypointId;
    }
    
    public void setWaypointId(String waypointId) {
        this.waypointId = waypointId;
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
    
    public int getStayDuration() {
        return stayDuration;
    }
    
    public void setStayDuration(int stayDuration) {
        this.stayDuration = stayDuration;
    }
}