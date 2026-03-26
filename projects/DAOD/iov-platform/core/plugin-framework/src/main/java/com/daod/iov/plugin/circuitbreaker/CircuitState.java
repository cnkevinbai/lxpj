package com.daod.iov.plugin.circuitbreaker;

/**
 * 熔断器状态
 */
public enum CircuitState {
    
    /**
     * 关闭状态 (正常)
     * 允许所有请求通过
     */
    CLOSED("关闭", "正常状态，允许所有请求通过"),
    
    /**
     * 打开状态 (熔断)
     * 拒绝所有请求，快速失败
     */
    OPEN("打开", "熔断状态，拒绝所有请求"),
    
    /**
     * 半开状态 (探测)
     * 允许部分请求通过，用于检测服务是否恢复
     */
    HALF_OPEN("半开", "探测状态，允许部分请求通过"),
    
    /**
     * 强制打开状态
     * 手动触发，拒绝所有请求
     */
    FORCED_OPEN("强制打开", "手动熔断，拒绝所有请求");
    
    private final String displayName;
    private final String description;
    
    CircuitState(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }
    
    public String getDisplayName() { return displayName; }
    public String getDescription() { return description; }
    
    /**
     * 是否允许请求
     */
    public boolean allowsRequests() {
        return this == CLOSED || this == HALF_OPEN;
    }
}