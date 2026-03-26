package com.daod.iov.modules.planning.api.dto;

/**
 * 导航指引
 */
public class Maneuver {
    
    /** 指引类型 */
    private ManeuverType type;
    
    /** 位置坐标 */
    private GeoPoint location;
    
    /** 指引文本 */
    private String instruction;
    
    /** 距离 (米) */
    private double distance;
    
    /** 时间 (秒) */
    private double duration;
    
    /** 方向 (度) */
    private int bearingBefore;
    private int bearingAfter;
    
    /** 出口编号 */
    private String exitNumber;
    
    /** 道路名称 */
    private String roadName;
    
    // Getters and Setters
    
    public ManeuverType getType() {
        return type;
    }
    
    public void setType(ManeuverType type) {
        this.type = type;
    }
    
    public GeoPoint getLocation() {
        return location;
    }
    
    public void setLocation(GeoPoint location) {
        this.location = location;
    }
    
    public String getInstruction() {
        return instruction;
    }
    
    public void setInstruction(String instruction) {
        this.instruction = instruction;
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
    
    public int getBearingBefore() {
        return bearingBefore;
    }
    
    public void setBearingBefore(int bearingBefore) {
        this.bearingBefore = bearingBefore;
    }
    
    public int getBearingAfter() {
        return bearingAfter;
    }
    
    public void setBearingAfter(int bearingAfter) {
        this.bearingAfter = bearingAfter;
    }
    
    public String getExitNumber() {
        return exitNumber;
    }
    
    public void setExitNumber(String exitNumber) {
        this.exitNumber = exitNumber;
    }
    
    public String getRoadName() {
        return roadName;
    }
    
    public void setRoadName(String roadName) {
        this.roadName = roadName;
    }
}