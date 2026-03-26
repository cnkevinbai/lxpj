package com.daod.iov.plugin.circuitbreaker;

/**
 * 熔断器统计信息
 */
public class CircuitBreakerStats {
    
    private final String name;
    private final CircuitState state;
    private final int totalCalls;
    private final int successCalls;
    private final int failedCalls;
    private final int slowCalls;
    private final double failureRate;
    private final long stateTransitionTime;
    
    public CircuitBreakerStats(String name, CircuitState state, int totalCalls, 
                               int successCalls, int failedCalls, int slowCalls,
                               double failureRate, long stateTransitionTime) {
        this.name = name;
        this.state = state;
        this.totalCalls = totalCalls;
        this.successCalls = successCalls;
        this.failedCalls = failedCalls;
        this.slowCalls = slowCalls;
        this.failureRate = failureRate;
        this.stateTransitionTime = stateTransitionTime;
    }
    
    public String getName() { return name; }
    public CircuitState getState() { return state; }
    public int getTotalCalls() { return totalCalls; }
    public int getSuccessCalls() { return successCalls; }
    public int getFailedCalls() { return failedCalls; }
    public int getSlowCalls() { return slowCalls; }
    public double getFailureRate() { return failureRate; }
    public long getStateTransitionTime() { return stateTransitionTime; }
    
    public double getSuccessRate() {
        if (totalCalls == 0) return 0;
        return (successCalls * 100.0) / totalCalls;
    }
    
    @Override
    public String toString() {
        return String.format("CircuitBreakerStats{name='%s', state=%s, total=%d, success=%d, failed=%d, failureRate=%.2f%%}",
            name, state, totalCalls, successCalls, failedCalls, failureRate);
    }
}