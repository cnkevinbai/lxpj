package com.daod.iov.plugin;

/**
 * 模块健康状态枚举
 */
public enum HealthStatus {
    /**
     * 健康
     */
    HEALTHY("healthy", "健康"),
    
    /**
     * 不健康
     */
    UNHEALTHY("unhealthy", "不健康"),
    
    /**
     * 未知
     */
    UNKNOWN("unknown", "未知"),
    
    /**
     * 启动中
     */
    STARTING("starting", "启动中"),
    
    /**
     * 关闭
     */
    OFFLINE("offline", "离线");

    private final String code;
    private final String description;

    HealthStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }
    
    public static HealthStatus fromCode(String code) {
        for (HealthStatus status : HealthStatus.values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return null;
    }
}