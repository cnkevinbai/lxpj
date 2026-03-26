package com.daod.iov.modules.planning.internal.service;

/**
 * 规划服务配置
 */
public class PlanningConfig {
    
    // GraphHopper 配置
    private String osmFile = "/data/maps/china-latest.osm.pbf";
    private String graphLocation = "/data/graphhopper/graph";
    private boolean elevationEnabled = true;
    private boolean trafficEnabled = true;
    
    // OR-Tools 配置
    private int timeLimitSeconds = 30;
    private int maxTasks = 1000;
    private int maxVehicles = 100;
    
    // 缓存配置
    private boolean cacheEnabled = true;
    private int cacheTtlMinutes = 5;
    private int cacheMaxSize = 10000;
    
    // 重规划配置
    private boolean replanEnabled = true;
    private int replanMinImprovementPercent = 20;
    private int replanCheckIntervalSeconds = 60;
    
    public static PlanningConfig fromYaml(Object yaml) {
        PlanningConfig config = new PlanningConfig();
        // 解析 YAML 配置
        return config;
    }
    
    // Getters and Setters
    
    public String getOsmFile() {
        return osmFile;
    }
    
    public void setOsmFile(String osmFile) {
        this.osmFile = osmFile;
    }
    
    public String getGraphLocation() {
        return graphLocation;
    }
    
    public void setGraphLocation(String graphLocation) {
        this.graphLocation = graphLocation;
    }
    
    public boolean isElevationEnabled() {
        return elevationEnabled;
    }
    
    public void setElevationEnabled(boolean elevationEnabled) {
        this.elevationEnabled = elevationEnabled;
    }
    
    public boolean isTrafficEnabled() {
        return trafficEnabled;
    }
    
    public void setTrafficEnabled(boolean trafficEnabled) {
        this.trafficEnabled = trafficEnabled;
    }
    
    public int getTimeLimitSeconds() {
        return timeLimitSeconds;
    }
    
    public void setTimeLimitSeconds(int timeLimitSeconds) {
        this.timeLimitSeconds = timeLimitSeconds;
    }
    
    public int getMaxTasks() {
        return maxTasks;
    }
    
    public void setMaxTasks(int maxTasks) {
        this.maxTasks = maxTasks;
    }
    
    public int getMaxVehicles() {
        return maxVehicles;
    }
    
    public void setMaxVehicles(int maxVehicles) {
        this.maxVehicles = maxVehicles;
    }
    
    public boolean isCacheEnabled() {
        return cacheEnabled;
    }
    
    public void setCacheEnabled(boolean cacheEnabled) {
        this.cacheEnabled = cacheEnabled;
    }
    
    public int getCacheTtlMinutes() {
        return cacheTtlMinutes;
    }
    
    public void setCacheTtlMinutes(int cacheTtlMinutes) {
        this.cacheTtlMinutes = cacheTtlMinutes;
    }
    
    public int getCacheMaxSize() {
        return cacheMaxSize;
    }
    
    public void setCacheMaxSize(int cacheMaxSize) {
        this.cacheMaxSize = cacheMaxSize;
    }
    
    public boolean isReplanEnabled() {
        return replanEnabled;
    }
    
    public void setReplanEnabled(boolean replanEnabled) {
        this.replanEnabled = replanEnabled;
    }
    
    public int getReplanMinImprovementPercent() {
        return replanMinImprovementPercent;
    }
    
    public void setReplanMinImprovementPercent(int replanMinImprovementPercent) {
        this.replanMinImprovementPercent = replanMinImprovementPercent;
    }
    
    public int getReplanCheckIntervalSeconds() {
        return replanCheckIntervalSeconds;
    }
    
    public void setReplanCheckIntervalSeconds(int replanCheckIntervalSeconds) {
        this.replanCheckIntervalSeconds = replanCheckIntervalSeconds;
    }
}