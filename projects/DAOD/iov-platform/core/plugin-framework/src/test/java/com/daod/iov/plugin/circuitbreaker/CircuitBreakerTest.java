package com.daod.iov.plugin.circuitbreaker;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.DisplayName;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 熔断器单元测试
 */
@DisplayName("熔断器单元测试")
class CircuitBreakerTest {
    
    private CircuitBreaker circuitBreaker;
    
    @BeforeEach
    void setUp() {
        CircuitBreakerConfig config = CircuitBreakerConfig.defaults()
            .failureRateThreshold(50.0)
            .minimumNumberOfCalls(10)
            .waitDurationInOpenState(1000)
            .permittedNumberOfCallsInHalfOpenState(5);
        
        circuitBreaker = new CircuitBreakerImpl("test-breaker", config);
    }
    
    @Test
    @DisplayName("初始状态为关闭")
    void testInitialState() {
        assertEquals(CircuitState.CLOSED, circuitBreaker.getState());
        assertTrue(circuitBreaker.allowRequest());
    }
    
    @Test
    @DisplayName("记录成功不触发熔断")
    void testRecordSuccess() {
        for (int i = 0; i < 20; i++) {
            circuitBreaker.recordSuccess();
        }
        
        assertEquals(CircuitState.CLOSED, circuitBreaker.getState());
        assertTrue(circuitBreaker.allowRequest());
        
        CircuitBreakerStats stats = circuitBreaker.getStats();
        assertEquals(20, stats.getTotalCalls());
        assertEquals(100.0, stats.getSuccessRate());
    }
    
    @Test
    @DisplayName("错误率达到阈值触发熔断")
    void testTripOnHighFailureRate() {
        // 记录 6 次成功, 6 次失败 (50% 错误率)
        for (int i = 0; i < 6; i++) {
            circuitBreaker.recordSuccess();
            circuitBreaker.recordFailure(new RuntimeException("Error"));
        }
        
        assertEquals(CircuitState.OPEN, circuitBreaker.getState());
        assertFalse(circuitBreaker.allowRequest());
    }
    
    @Test
    @DisplayName("熔断后等待超时进入半开状态")
    void testHalfOpenAfterWait() throws InterruptedException {
        // 使用短等待时间
        CircuitBreakerConfig config = CircuitBreakerConfig.defaults()
            .failureRateThreshold(50.0)
            .minimumNumberOfCalls(5)
            .waitDurationInOpenState(100);
        
        circuitBreaker = new CircuitBreakerImpl("fast-test", config);
        
        // 触发熔断
        for (int i = 0; i < 5; i++) {
            circuitBreaker.recordFailure(new RuntimeException());
        }
        assertEquals(CircuitState.OPEN, circuitBreaker.getState());
        
        // 等待超时
        Thread.sleep(150);
        
        // 检查状态 (触发状态检查时会自动转换)
        circuitBreaker.allowRequest(); // 触发状态检查
        assertEquals(CircuitState.HALF_OPEN, circuitBreaker.getState());
    }
    
    @Test
    @DisplayName("半开状态下成功恢复到关闭状态")
    void testRecoveryFromHalfOpen() throws InterruptedException {
        CircuitBreakerConfig config = CircuitBreakerConfig.defaults()
            .failureRateThreshold(50.0)
            .minimumNumberOfCalls(5)
            .waitDurationInOpenState(100)
            .permittedNumberOfCallsInHalfOpenState(3);
        
        circuitBreaker = new CircuitBreakerImpl("recovery-test", config);
        
        // 触发熔断
        for (int i = 0; i < 5; i++) {
            circuitBreaker.recordFailure(new RuntimeException());
        }
        
        // 等待进入半开
        Thread.sleep(150);
        circuitBreaker.allowRequest();
        assertEquals(CircuitState.HALF_OPEN, circuitBreaker.getState());
        
        // 成功请求
        for (int i = 0; i < 3; i++) {
            circuitBreaker.recordSuccess();
        }
        
        assertEquals(CircuitState.CLOSED, circuitBreaker.getState());
    }
    
    @Test
    @DisplayName("半开状态下失败回到打开状态")
    void testHalfOpenFailure() throws InterruptedException {
        CircuitBreakerConfig config = CircuitBreakerConfig.defaults()
            .failureRateThreshold(50.0)
            .minimumNumberOfCalls(5)
            .waitDurationInOpenState(100);
        
        circuitBreaker = new CircuitBreakerImpl("halfopen-fail-test", config);
        
        // 触发熔断
        for (int i = 0; i < 5; i++) {
            circuitBreaker.recordFailure(new RuntimeException());
        }
        
        // 等待进入半开
        Thread.sleep(150);
        circuitBreaker.allowRequest();
        assertEquals(CircuitState.HALF_OPEN, circuitBreaker.getState());
        
        // 失败
        circuitBreaker.recordFailure(new RuntimeException());
        
        assertEquals(CircuitState.OPEN, circuitBreaker.getState());
    }
    
    @Test
    @DisplayName("手动触发熔断")
    void testManualTrip() {
        circuitBreaker.trip();
        assertEquals(CircuitState.FORCED_OPEN, circuitBreaker.getState());
        assertFalse(circuitBreaker.allowRequest());
    }
    
    @Test
    @DisplayName("手动重置")
    void testManualReset() {
        // 触发熔断
        for (int i = 0; i < 10; i++) {
            circuitBreaker.recordFailure(new RuntimeException());
        }
        assertEquals(CircuitState.OPEN, circuitBreaker.getState());
        
        // 重置
        circuitBreaker.reset();
        assertEquals(CircuitState.CLOSED, circuitBreaker.getState());
        assertTrue(circuitBreaker.allowRequest());
    }
    
    @Test
    @DisplayName("状态监听器测试")
    void testStateListener() {
        AtomicBoolean stateChanged = new AtomicBoolean(false);
        AtomicBoolean thresholdExceeded = new AtomicBoolean(false);
        
        circuitBreaker.addListener(new CircuitBreakerListener() {
            @Override
            public void onStateChange(String name, CircuitState oldState, CircuitState newState) {
                stateChanged.set(true);
            }
            
            @Override
            public void onFailureThresholdExceeded(String name, double failureRate, double threshold) {
                thresholdExceeded.set(true);
            }
        });
        
        // 触发熔断
        for (int i = 0; i < 10; i++) {
            circuitBreaker.recordFailure(new RuntimeException());
        }
        
        assertTrue(stateChanged.get());
        assertTrue(thresholdExceeded.get());
    }
    
    @Test
    @DisplayName("统计信息测试")
    void testStats() {
        for (int i = 0; i < 10; i++) {
            if (i < 6) {
                circuitBreaker.recordSuccess();
            } else {
                circuitBreaker.recordFailure(new RuntimeException());
            }
        }
        
        CircuitBreakerStats stats = circuitBreaker.getStats();
        
        assertEquals(10, stats.getTotalCalls());
        assertEquals(6, stats.getSuccessCalls());
        assertEquals(4, stats.getFailedCalls());
        assertEquals(40.0, stats.getFailureRate(), 0.1);
        assertEquals(60.0, stats.getSuccessRate(), 0.1);
    }
    
    @Test
    @DisplayName("配置测试 - 严格模式")
    void testStrictConfig() {
        CircuitBreakerConfig strict = CircuitBreakerConfig.strict();
        
        assertEquals(30.0, strict.getFailureRateThreshold());
        assertEquals(5, strict.getMinimumNumberOfCalls());
        assertEquals(30000, strict.getWaitDurationInOpenState());
    }
    
    @Test
    @DisplayName("配置测试 - 宽松模式")
    void testLenientConfig() {
        CircuitBreakerConfig lenient = CircuitBreakerConfig.lenient();
        
        assertEquals(70.0, lenient.getFailureRateThreshold());
        assertEquals(20, lenient.getMinimumNumberOfCalls());
        assertEquals(120000, lenient.getWaitDurationInOpenState());
    }
}