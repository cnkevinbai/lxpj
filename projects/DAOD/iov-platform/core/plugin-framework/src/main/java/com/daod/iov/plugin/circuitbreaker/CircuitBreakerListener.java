package com.daod.iov.plugin.circuitbreaker;

/**
 * 熔断器状态监听器
 */
public interface CircuitBreakerListener {
    
    /**
     * 状态变化事件
     * @param name 熔断器名称
     * @param oldState 旧状态
     * @param newState 新状态
     */
    void onStateChange(String name, CircuitState oldState, CircuitState newState);
    
    /**
     * 错误率超过阈值事件
     * @param name 熔断器名称
     * @param failureRate 当前错误率
     * @param threshold 阈值
     */
    void onFailureThresholdExceeded(String name, double failureRate, double threshold);
    
    /**
     * 熔断触发事件 (用于触发自动回滚)
     * @param name 熔断器名称
     * @param moduleId 模块ID
     */
    default void onCircuitTripped(String name, String moduleId) {
        // 默认空实现
    }
}