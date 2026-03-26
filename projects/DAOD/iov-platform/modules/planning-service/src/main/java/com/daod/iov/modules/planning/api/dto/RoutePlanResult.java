package com.daod.iov.modules.planning.api.dto;

import java.util.List;

/**
 * 路径规划结果
 */
public class RoutePlanResult {
    
    /** 规划ID */
    private String planId;
    
    /** 路线列表 (主路线 + 备选) */
    private List<Route> routes;
    
    /** 推荐路线索引 */
    private int recommendedIndex = 0;
    
    /** 规划耗时 (ms) */
    private long planningTimeMs;
    
    /** 地图版本 */
    private String mapVersion;
    
    /** 是否来自缓存 */
    private boolean fromCache;
    
    // Getters and Setters
    
    public String getPlanId() {
        return planId;
    }
    
    public void setPlanId(String planId) {
        this.planId = planId;
    }
    
    public List<Route> getRoutes() {
        return routes;
    }
    
    public void setRoutes(List<Route> routes) {
        this.routes = routes;
    }
    
    public int getRecommendedIndex() {
        return recommendedIndex;
    }
    
    public void setRecommendedIndex(int recommendedIndex) {
        this.recommendedIndex = recommendedIndex;
    }
    
    public long getPlanningTimeMs() {
        return planningTimeMs;
    }
    
    public void setPlanningTimeMs(long planningTimeMs) {
        this.planningTimeMs = planningTimeMs;
    }
    
    public String getMapVersion() {
        return mapVersion;
    }
    
    public void setMapVersion(String mapVersion) {
        this.mapVersion = mapVersion;
    }
    
    public boolean isFromCache() {
        return fromCache;
    }
    
    public void setFromCache(boolean fromCache) {
        this.fromCache = fromCache;
    }
    
    /**
     * 获取推荐路线
     */
    public Route getRecommendedRoute() {
        if (routes != null && !routes.isEmpty() && recommendedIndex < routes.size()) {
            return routes.get(recommendedIndex);
        }
        return null;
    }
}