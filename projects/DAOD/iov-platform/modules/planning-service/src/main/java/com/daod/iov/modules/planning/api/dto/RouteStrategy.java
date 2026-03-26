package com.daod.iov.modules.planning.api.dto;

/**
 * 规划策略枚举
 */
public enum RouteStrategy {
    
    /** 最快路径 (时间最短) */
    FASTEST("fastest", "最快路径"),
    
    /** 最短路径 (距离最短) */
    SHORTEST("shortest", "最短路径"),
    
    /** 均衡路径 (时间+距离平衡) */
    BALANCED("balanced", "均衡路径"),
    
    /** 避开高速 */
    AVOID_HIGHWAY("avoid_highway", "避开高速"),
    
    /** 避开收费路段 */
    AVOID_TOLL("avoid_toll", "避开收费"),
    
    /** 经济路线 (省油) */
    ECO_FRIENDLY("eco", "经济路线"),
    
    /** 实时路况 */
    REAL_TIME("realtime", "实时路况");
    
    private final String code;
    private final String description;
    
    RouteStrategy(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
    
    public static RouteStrategy fromCode(String code) {
        for (RouteStrategy strategy : values()) {
            if (strategy.code.equals(code)) {
                return strategy;
            }
        }
        return FASTEST;
    }
}