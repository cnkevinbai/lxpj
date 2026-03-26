package com.daod.iov.modules.planning.internal.service;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 规划服务监控指标
 */
public class PlanningMetrics {
    
    private final AtomicLong totalRequests = new AtomicLong(0);
    private final AtomicLong successRequests = new AtomicLong(0);
    private final AtomicLong failedRequests = new AtomicLong(0);
    private final AtomicLong pendingTasks = new AtomicLong(0);
    private final AtomicLong totalPlanningTimeMs = new AtomicLong(0);
    
    public void recordRequest(boolean success, long timeMs) {
        totalRequests.incrementAndGet();
        if (success) {
            successRequests.incrementAndGet();
        } else {
            failedRequests.incrementAndGet();
        }
        totalPlanningTimeMs.addAndGet(timeMs);
    }
    
    public void incrementPending() {
        pendingTasks.incrementAndGet();
    }
    
    public void decrementPending() {
        pendingTasks.decrementAndGet();
    }
    
    public long getPendingTaskCount() {
        return pendingTasks.get();
    }
    
    public List<com.daod.iov.plugin.Metric> collect() {
        List<com.daod.iov.plugin.Metric> metrics = new ArrayList<>();
        
        metrics.add(new com.daod.iov.plugin.Metric("planning_requests_total", totalRequests.get()));
        metrics.add(new com.daod.iov.plugin.Metric("planning_requests_success", successRequests.get()));
        metrics.add(new com.daod.iov.plugin.Metric("planning_requests_failed", failedRequests.get()));
        metrics.add(new com.daod.iov.plugin.Metric("planning_pending_tasks", pendingTasks.get()));
        metrics.add(new com.daod.iov.plugin.Metric("planning_avg_time_ms", 
            totalRequests.get() > 0 ? totalPlanningTimeMs.get() / totalRequests.get() : 0));
        
        return metrics;
    }
}