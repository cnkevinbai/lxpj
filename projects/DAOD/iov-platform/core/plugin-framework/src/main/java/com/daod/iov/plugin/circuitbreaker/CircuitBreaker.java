package com.daod.iov.plugin.circuitbreaker;

/**
 * 熔断器接口
 * 
 * 实现熔断模式，防止级联故障：
 * - 监控错误率
 * - 超过阈值自动熔断
 * - 支持自动恢复
 * 
 * @author daod-team
 * @version 1.0.0
 */
public interface CircuitBreaker {
    
    /**
     * 记录成功
     */
    void recordSuccess();
    
    /**
     * 记录失败
     * @param error 错误信息
     */
    void recordFailure(Throwable error);
    
    /**
     * 获取当前熔断状态
     * @return 熔断状态
     */
    CircuitState getState();
    
    /**
     * 检查是否允许调用
     * @return 是否允许
     */
    boolean allowRequest();
    
    /**
     * 强制打开熔断器
     */
    void trip();
    
    /**
     * 强制关闭熔断器
     */
    void reset();
    
    /**
     * 尝试进入半开状态
     */
    void attemptReset();
    
    /**
     * 获取熔断器名称
     * @return 名称
     */
    String getName();
    
    /**
     * 获取熔断器配置
     * @return 配置
     */
    CircuitBreakerConfig getConfig();
    
    /**
     * 获取统计信息
     * @return 统计信息
     */
    CircuitBreakerStats getStats();
    
    /**
     * 添加状态监听器
     * @param listener 监听器
     */
    void addListener(CircuitBreakerListener listener);
    
    /**
     * 移除状态监听器
     * @param listener 监听器
     */
    void removeListener(CircuitBreakerListener listener);
}