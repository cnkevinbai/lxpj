package com.daod.iov.modules.planning.api.dto;

import java.util.List;

/**
 * 行程规划请求
 */
public class TripPlanRequest {
    
    private GeoPoint origin;
    private GeoPoint destination;
    private List<TripWaypoint> waypoints;
    private OptimizeObjective objective = OptimizeObjective.MIN_DISTANCE;
    private List<TimeWindow> timeWindows;
    private boolean returnToOrigin = false;
    private VehicleConstraint constraint;
    private String tenantId;
    
    // Getters and Setters
    
    public GeoPoint getOrigin() {
        return origin;
    }
    
    public void setOrigin(GeoPoint origin) {
        this.origin = origin;
    }
    
    public GeoPoint getDestination() {
        return destination;
    }
    
    public void setDestination(GeoPoint destination) {
        this.destination = destination;
    }
    
    public List<TripWaypoint> getWaypoints() {
        return waypoints;
    }
    
    public void setWaypoints(List<TripWaypoint> waypoints) {
        this.waypoints = waypoints;
    }
    
    public OptimizeObjective getObjective() {
        return objective;
    }
    
    public void setObjective(OptimizeObjective objective) {
        this.objective = objective;
    }
    
    public List<TimeWindow> getTimeWindows() {
        return timeWindows;
    }
    
    public void setTimeWindows(List<TimeWindow> timeWindows) {
        this.timeWindows = timeWindows;
    }
    
    public boolean isReturnToOrigin() {
        return returnToOrigin;
    }
    
    public void setReturnToOrigin(boolean returnToOrigin) {
        this.returnToOrigin = returnToOrigin;
    }
    
    public VehicleConstraint getConstraint() {
        return constraint;
    }
    
    public void setConstraint(VehicleConstraint constraint) {
        this.constraint = constraint;
    }
    
    public String getTenantId() {
        return tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}