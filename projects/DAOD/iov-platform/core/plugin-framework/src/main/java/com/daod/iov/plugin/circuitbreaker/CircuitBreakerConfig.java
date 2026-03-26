package com.daod.iov.plugin.circuitbreaker;

/**
 * 熔断器配置
 */
public class CircuitBreakerConfig {
    
    // ==================== 熔断触发条件 ====================
    
    /** 错误率阈值百分比 (0-100) */
    private double failureRateThreshold = 50.0;
    
    /** 慢调用率阈值百分比 (0-100) */
    private double slowCallRateThreshold = 80.0;
    
    /** 慢调用时间阈值 (ms) */
    private long slowCallDurationThreshold = 2000;
    
    /** 最小调用次数 (用于计算错误率) */
    private int minimumNumberOfCalls = 10;
    
    /** 滑动窗口大小 (调用次数) */
    private int slidingWindowSize = 100;
    
    /** 滑动窗口类型 */
    private SlidingWindowType slidingWindowType = SlidingWindowType.COUNT_BASED;
    
    // ==================== 熔断等待配置 ====================
    
    /** 熔断等待时间 (ms) - OPEN 状态持续时间 */
    private long waitDurationInOpenState = 60000;
    
    /** 半开状态允许的调用次数 */
    private int permittedNumberOfCallsInHalfOpenState = 10;
    
    // ==================== 自动回滚配置 ====================
    
    /** 是否启用自动回滚 */
    private boolean automaticRollbackEnabled = true;
    
    /** 触发自动回滚的错误类型 */
    private Class<? extends Throwable>[] rollbackOnExceptions;
    
    /** 忽略的错误类型 (不计入错误率) */
    private Class<? extends Throwable>[] ignoreExceptions;
    
    // ==================== 监控配置 ====================
    
    /** 是否记录异常堆栈 */
    private boolean recordExceptions = true;
    
    /** 最大记录异常数 */
    private int maxRecordedExceptions = 10;
    
    public CircuitBreakerConfig() {}
    
    // ==================== Builder 方法 ====================
    
    public CircuitBreakerConfig failureRateThreshold(double threshold) {
        this.failureRateThreshold = Math.max(0, Math.min(100, threshold));
        return this;
    }
    
    public CircuitBreakerConfig slowCallRateThreshold(double threshold) {
        this.slowCallRateThreshold = Math.max(0, Math.min(100, threshold));
        return this;
    }
    
    public CircuitBreakerConfig slowCallDurationThreshold(long thresholdMs) {
        this.slowCallDurationThreshold = Math.max(0, thresholdMs);
        return this;
    }
    
    public CircuitBreakerConfig minimumNumberOfCalls(int calls) {
        this.minimumNumberOfCalls = Math.max(1, calls);
        return this;
    }
    
    public CircuitBreakerConfig slidingWindowSize(int size) {
        this.slidingWindowSize = Math.max(1, size);
        return this;
    }
    
    public CircuitBreakerConfig waitDurationInOpenState(long durationMs) {
        this.waitDurationInOpenState = Math.max(0, durationMs);
        return this;
    }
    
    public CircuitBreakerConfig permittedNumberOfCallsInHalfOpenState(int calls) {
        this.permittedNumberOfCallsInHalfOpenState = Math.max(1, calls);
        return this;
    }
    
    public CircuitBreakerConfig automaticRollbackEnabled(boolean enabled) {
        this.automaticRollbackEnabled = enabled;
        return this;
    }
    
    /**
     * 创建默认配置
     */
    public static CircuitBreakerConfig defaults() {
        return new CircuitBreakerConfig();
    }
    
    /**
     * 创建严格配置 (低容错)
     */
    public static CircuitBreakerConfig strict() {
        return new CircuitBreakerConfig()
            .failureRateThreshold(30.0)
            .minimumNumberOfCalls(5)
            .waitDurationInOpenState(30000);
    }
    
    /**
     * 创建宽松配置 (高容错)
     */
    public static CircuitBreakerConfig lenient() {
        return new CircuitBreakerConfig()
            .failureRateThreshold(70.0)
            .minimumNumberOfCalls(20)
            .waitDurationInOpenState(120000);
    }
    
    // ==================== Getters ====================
    
    public double getFailureRateThreshold() { return failureRateThreshold; }
    public void setFailureRateThreshold(double failureRateThreshold) { this.failureRateThreshold = failureRateThreshold; }
    
    public double getSlowCallRateThreshold() { return slowCallRateThreshold; }
    public void setSlowCallRateThreshold(double slowCallRateThreshold) { this.slowCallRateThreshold = slowCallRateThreshold; }
    
    public long getSlowCallDurationThreshold() { return slowCallDurationThreshold; }
    public void setSlowCallDurationThreshold(long slowCallDurationThreshold) { this.slowCallDurationThreshold = slowCallDurationThreshold; }
    
    public int getMinimumNumberOfCalls() { return minimumNumberOfCalls; }
    public void setMinimumNumberOfCalls(int minimumNumberOfCalls) { this.minimumNumberOfCalls = minimumNumberOfCalls; }
    
    public int getSlidingWindowSize() { return slidingWindowSize; }
    public void setSlidingWindowSize(int slidingWindowSize) { this.slidingWindowSize = slidingWindowSize; }
    
    public SlidingWindowType getSlidingWindowType() { return slidingWindowType; }
    public void setSlidingWindowType(SlidingWindowType slidingWindowType) { this.slidingWindowType = slidingWindowType; }
    
    public long getWaitDurationInOpenState() { return waitDurationInOpenState; }
    public void setWaitDurationInOpenState(long waitDurationInOpenState) { this.waitDurationInOpenState = waitDurationInOpenState; }
    
    public int getPermittedNumberOfCallsInHalfOpenState() { return permittedNumberOfCallsInHalfOpenState; }
    public void setPermittedNumberOfCallsInHalfOpenState(int permittedNumberOfCallsInHalfOpenState) { this.permittedNumberOfCallsInHalfOpenState = permittedNumberOfCallsInHalfOpenState; }
    
    public boolean isAutomaticRollbackEnabled() { return automaticRollbackEnabled; }
    public void setAutomaticRollbackEnabled(boolean automaticRollbackEnabled) { this.automaticRollbackEnabled = automaticRollbackEnabled; }
    
    public Class<? extends Throwable>[] getRollbackOnExceptions() { return rollbackOnExceptions; }
    public void setRollbackOnExceptions(Class<? extends Throwable>[] rollbackOnExceptions) { this.rollbackOnExceptions = rollbackOnExceptions; }
    
    public Class<? extends Throwable>[] getIgnoreExceptions() { return ignoreExceptions; }
    public void setIgnoreExceptions(Class<? extends Throwable>[] ignoreExceptions) { this.ignoreExceptions = ignoreExceptions; }
    
    public boolean isRecordExceptions() { return recordExceptions; }
    public void setRecordExceptions(boolean recordExceptions) { this.recordExceptions = recordExceptions; }
    
    public int getMaxRecordedExceptions() { return maxRecordedExceptions; }
    public void setMaxRecordedExceptions(int maxRecordedExceptions) { this.maxRecordedExceptions = maxRecordedExceptions; }
    
    /**
     * 滑动窗口类型
     */
    public enum SlidingWindowType {
        /** 基于调用次数 */
        COUNT_BASED,
        /** 基于时间 */
        TIME_BASED
    }
}