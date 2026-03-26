package com.daod.iov.modules.planning.api.dto;

import java.util.List;

/**
 * 路径规划请求
 */
public class RoutePlanRequest {
    
    /** 起点 */
    private GeoPoint origin;
    
    /** 终点 */
    private GeoPoint destination;
    
    /** 途经点列表 */
    private List<GeoPoint> waypoints;
    
    /** 规划策略 */
    private RouteStrategy strategy = RouteStrategy.FASTEST;
    
    /** 车辆类型 */
    private VehicleType vehicleType = VehicleType.CAR;
    
    /** 是否启用实时路况 */
    private boolean enableTraffic = false;
    
    /** 是否返回备选路线 */
    private int alternativeCount = 0;
    
    /** 排除条件 */
    private List<AvoidType> avoidList;
    
    /** 租户ID */
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
    
    public List<GeoPoint> getWaypoints() {
        return waypoints;
    }
    
    public void setWaypoints(List<GeoPoint> waypoints) {
        this.waypoints = waypoints;
    }
    
    public RouteStrategy getStrategy() {
        return strategy;
    }
    
    public void setStrategy(RouteStrategy strategy) {
        this.strategy = strategy;
    }
    
    public VehicleType getVehicleType() {
        return vehicleType;
    }
    
    public void setVehicleType(VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }
    
    public boolean isEnableTraffic() {
        return enableTraffic;
    }
    
    public void setEnableTraffic(boolean enableTraffic) {
        this.enableTraffic = enableTraffic;
    }
    
    public int getAlternativeCount() {
        return alternativeCount;
    }
    
    public void setAlternativeCount(int alternativeCount) {
        this.alternativeCount = alternativeCount;
    }
    
    public List<AvoidType> getAvoidList() {
        return avoidList;
    }
    
    public void setAvoidList(List<AvoidType> avoidList) {
        this.avoidList = avoidList;
    }
    
    public String getTenantId() {
        return tenantId;
    }
    
    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }
}