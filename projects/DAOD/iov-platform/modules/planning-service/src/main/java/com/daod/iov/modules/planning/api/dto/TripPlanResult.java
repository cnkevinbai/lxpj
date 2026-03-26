package com.daod.iov.modules.planning.api.dto;

import java.util.List;

/**
 * 行程规划结果
 */
public class TripPlanResult {
    
    private String tripId;
    private List<TripStop> orderedStops;
    private double totalDistance;
    private double totalDuration;
    private double totalStayDuration;
    private String geometry;
    private List<Warning> warnings;
    
    // Getters and Setters
    
    public String getTripId() {
        return tripId;
    }
    
    public void setTripId(String tripId) {
        this.tripId = tripId;
    }
    
    public List<TripStop> getOrderedStops() {
        return orderedStops;
    }
    
    public void setOrderedStops(List<TripStop> orderedStops) {
        this.orderedStops = orderedStops;
    }
    
    public double getTotalDistance() {
        return totalDistance;
    }
    
    public void setTotalDistance(double totalDistance) {
        this.totalDistance = totalDistance;
    }
    
    public double getTotalDuration() {
        return totalDuration;
    }
    
    public void setTotalDuration(double totalDuration) {
        this.totalDuration = totalDuration;
    }
    
    public double getTotalStayDuration() {
        return totalStayDuration;
    }
    
    public void setTotalStayDuration(double totalStayDuration) {
        this.totalStayDuration = totalStayDuration;
    }
    
    public String getGeometry() {
        return geometry;
    }
    
    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }
    
    public List<Warning> getWarnings() {
        return warnings;
    }
    
    public void setWarnings(List<Warning> warnings) {
        this.warnings = warnings;
    }
}