package com.daod.iov.modules.planning.api.dto;

/**
 * 行程途经点
 */
public class TripWaypoint {
    
    private String id;
    private GeoPoint location;
    private int priority = 0;
    private int stayDuration = 0;
    private TimeWindow timeWindow;
    private String type; // DELIVERY, PICKUP, VISIT
    
    // Getters and Setters
    
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public GeoPoint getLocation() {
        return location;
    }
    
    public void setLocation(GeoPoint location) {
        this.location = location;
    }
    
    public int getPriority() {
        return priority;
    }
    
    public void setPriority(int priority) {
        this.priority = priority;
    }
    
    public int getStayDuration() {
        return stayDuration;
    }
    
    public void setStayDuration(int stayDuration) {
        this.stayDuration = stayDuration;
    }
    
    public TimeWindow getTimeWindow() {
        return timeWindow;
    }
    
    public void setTimeWindow(TimeWindow timeWindow) {
        this.timeWindow = timeWindow;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
}