package com.daod.iov.modules.planning.api.dto;

import java.util.List;

/**
 * 路线详情
 */
public class Route {
    
    /** 路线ID */
    private String routeId;
    
    /** 总距离 (米) */
    private double distance;
    
    /** 总时间 (秒) */
    private double duration;
    
    /** 通行费 (元) */
    private double tollCost;
    
    /** 路段列表 */
    private List<RouteLeg> legs;
    
    /** 路线几何 (GeoJSON) */
    private String geometry;
    
    /** 路线指引 */
    private List<Maneuver> maneuvers;
    
    /** 路线名称 */
    private String name;
    
    /** 路线摘要 */
    private String summary;
    
    // Getters and Setters
    
    public String getRouteId() {
        return routeId;
    }
    
    public void setRouteId(String routeId) {
        this.routeId = routeId;
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
    
    public double getTollCost() {
        return tollCost;
    }
    
    public void setTollCost(double tollCost) {
        this.tollCost = tollCost;
    }
    
    public List<RouteLeg> getLegs() {
        return legs;
    }
    
    public void setLegs(List<RouteLeg> legs) {
        this.legs = legs;
    }
    
    public String getGeometry() {
        return geometry;
    }
    
    public void setGeometry(String geometry) {
        this.geometry = geometry;
    }
    
    public List<Maneuver> getManeuvers() {
        return maneuvers;
    }
    
    public void setManeuvers(List<Maneuver> maneuvers) {
        this.maneuvers = maneuvers;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getSummary() {
        return summary;
    }
    
    public void setSummary(String summary) {
        this.summary = summary;
    }
}