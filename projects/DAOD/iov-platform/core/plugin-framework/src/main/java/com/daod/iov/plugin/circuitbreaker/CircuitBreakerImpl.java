package com.daod.iov.plugin.circuitbreaker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

/**
 * 熔断器默认实现
 */
public class CircuitBreakerImpl implements CircuitBreaker {
    
    private static final Logger logger = LoggerFactory.getLogger(CircuitBreakerImpl.class);
    
    private final String name;
    private final CircuitBreakerConfig config;
    
    // 当前状态
    private final AtomicReference<CircuitState> state = new AtomicReference<>(CircuitState.CLOSED);
    
    // 统计数据
    private final AtomicInteger totalCalls = new AtomicInteger(0);
    private final AtomicInteger successCalls = new AtomicInteger(0);
    private final AtomicInteger failedCalls = new AtomicInteger(0);
    private final AtomicInteger slowCalls = new AtomicInteger(0);
    
    // 半开状态计数
    private final AtomicInteger halfOpenCalls = new AtomicInteger(0);
    private final AtomicInteger halfOpenSuccess = new AtomicInteger(0);
    
    // 状态切换时间
    private final AtomicLong stateTransitionTime = new AtomicLong(System.currentTimeMillis());
    
    // 监听器
    private final CopyOnWriteArrayList<CircuitBreakerListener> listeners = new CopyOnWriteArrayList<>();
    
    public CircuitBreakerImpl(String name, CircuitBreakerConfig config) {
        this.name = name;
        this.config = config != null ? config : CircuitBreakerConfig.defaults();
    }
    
    @Override
    public void recordSuccess() {
        totalCalls.incrementAndGet();
        successCalls.incrementAndGet();
        
        // 半开状态下记录成功
        if (state.get() == CircuitState.HALF_OPEN) {
            int success = halfOpenSuccess.incrementAndGet();
            int permitted = config.getPermittedNumberOfCallsInHalfOpenState();
            
            if (success >= permitted) {
                // 半开状态测试通过，恢复到关闭状态
                transitionTo(CircuitState.CLOSED);
            }
        }
    }
    
    @Override
    public void recordFailure(Throwable error) {
        totalCalls.incrementAndGet();
        failedCalls.incrementAndGet();
        
        logger.warn("熔断器 [{}] 记录失败: {}", name, error.getMessage());
        
        // 半开状态下记录失败
        if (state.get() == CircuitState.HALF_OPEN) {
            // 半开状态测试失败，立即回到打开状态
            transitionTo(CircuitState.OPEN);
            return;
        }
        
        // 检查是否需要熔断
        checkThreshold();
    }
    
    @Override
    public CircuitState getState() {
        CircuitState currentState = state.get();
        
        // 检查是否需要从 OPEN 转换到 HALF_OPEN
        if (currentState == CircuitState.OPEN) {
            long elapsed = System.currentTimeMillis() - stateTransitionTime.get();
            if (elapsed >= config.getWaitDurationInOpenState()) {
                attemptReset();
            }
        }
        
        return state.get();
    }
    
    @Override
    public boolean allowRequest() {
        CircuitState currentState = getState();
        
        switch (currentState) {
            case CLOSED:
                return true;
                
            case OPEN:
            case FORCED_OPEN:
                return false;
                
            case HALF_OPEN:
                // 半开状态限制请求数
                int calls = halfOpenCalls.incrementAndGet();
                return calls <= config.getPermittedNumberOfCallsInHalfOpenState();
                
            default:
                return false;
        }
    }
    
    @Override
    public void trip() {
        transitionTo(CircuitState.FORCED_OPEN);
    }
    
    @Override
    public void reset() {
        resetStats();
        transitionTo(CircuitState.CLOSED);
    }
    
    @Override
    public void attemptReset() {
        if (state.get() == CircuitState.OPEN) {
            transitionTo(CircuitState.HALF_OPEN);
            halfOpenCalls.set(0);
            halfOpenSuccess.set(0);
        }
    }
    
    @Override
    public String getName() {
        return name;
    }
    
    @Override
    public CircuitBreakerConfig getConfig() {
        return config;
    }
    
    @Override
    public CircuitBreakerStats getStats() {
        return new CircuitBreakerStats(
            name,
            state.get(),
            totalCalls.get(),
            successCalls.get(),
            failedCalls.get(),
            slowCalls.get(),
            calculateFailureRate(),
            stateTransitionTime.get()
        );
    }
    
    @Override
    public void addListener(CircuitBreakerListener listener) {
        listeners.add(listener);
    }
    
    @Override
    public void removeListener(CircuitBreakerListener listener) {
        listeners.remove(listener);
    }
    
    // ==================== 私有方法 ====================
    
    private void checkThreshold() {
        int total = totalCalls.get();
        
        // 检查最小调用次数
        if (total < config.getMinimumNumberOfCalls()) {
            return;
        }
        
        // 计算错误率
        double failureRate = calculateFailureRate();
        
        if (failureRate >= config.getFailureRateThreshold()) {
            logger.warn("熔断器 [{}] 错误率达到 {}%，超过阈值 {}%，触发熔断",
                name, failureRate, config.getFailureRateThreshold());
            
            transitionTo(CircuitState.OPEN);
            
            // 通知监听器
            notifyFailureThresholdExceeded(failureRate);
        }
    }
    
    private double calculateFailureRate() {
        int total = totalCalls.get();
        if (total == 0) return 0;
        
        int failed = failedCalls.get();
        return (failed * 100.0) / total;
    }
    
    private void transitionTo(CircuitState newState) {
        CircuitState oldState = state.getAndSet(newState);
        
        if (oldState != newState) {
            stateTransitionTime.set(System.currentTimeMillis());
            logger.info("熔断器 [{}] 状态切换: {} -> {}", name, oldState, newState);
            
            // 通知监听器
            for (CircuitBreakerListener listener : listeners) {
                try {
                    listener.onStateChange(name, oldState, newState);
                } catch (Exception e) {
                    logger.error("熔断器监听器异常", e);
                }
            }
            
            // 重置统计
            if (newState == CircuitState.CLOSED) {
                resetStats();
            }
        }
    }
    
    private void resetStats() {
        totalCalls.set(0);
        successCalls.set(0);
        failedCalls.set(0);
        slowCalls.set(0);
    }
    
    private void notifyFailureThresholdExceeded(double failureRate) {
        for (CircuitBreakerListener listener : listeners) {
            try {
                listener.onFailureThresholdExceeded(name, failureRate, config.getFailureRateThreshold());
            } catch (Exception e) {
                logger.error("熔断器监听器异常", e);
            }
        }
    }
}