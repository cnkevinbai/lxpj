package com.daod.iov.plugin;

import java.util.Map;

/**
 * 健康检查结果
 */
public class HealthCheckResult {
    
    private boolean healthy;
    private String message;
    private long timestamp;
    private Map<String, Object> details;
    private String errorType;
    private String errorMessage;
    
    public HealthCheckResult() {
        this.timestamp = System.currentTimeMillis();
        this.details = new java.util.HashMap<>();
    }
    
    /**
     * 创建健康结果
     */
    public static HealthCheckResult healthy() {
        HealthCheckResult result = new HealthCheckResult();
        result.setHealthy(true);
        result.setMessage("Service is healthy");
        return result;
    }
    
    /**
     * 创建健康结果 (带消息)
     */
    public static HealthCheckResult healthy(String message) {
        HealthCheckResult result = new HealthCheckResult();
        result.setHealthy(true);
        result.setMessage(message);
        return result;
    }
    
    /**
     * 创建不健康结果
     */
    public static HealthCheckResult unhealthy(String message) {
        HealthCheckResult result = new HealthCheckResult();
        result.setHealthy(false);
        result.setMessage(message);
        return result;
    }
    
    /**
     * 创建不健康结果 (带异常)
     */
    public static HealthCheckResult unhealthy(String message, Throwable error) {
        HealthCheckResult result = new HealthCheckResult();
        result.setHealthy(false);
        result.setMessage(message);
        result.setErrorType(error.getClass().getSimpleName());
        result.setErrorMessage(error.getMessage());
        return result;
    }
    
    /**
     * 添加详情
     */
    public HealthCheckResult withDetail(String key, Object value) {
        this.details.put(key, value);
        return this;
    }
    
    // Getters and Setters
    public boolean isHealthy() { return healthy; }
    public void setHealthy(boolean healthy) { this.healthy = healthy; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
    public String getErrorType() { return errorType; }
    public void setErrorType(String errorType) { this.errorType = errorType; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}