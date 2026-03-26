package com.daod.iov.plugin.sandbox;

/**
 * 资源使用情况
 */
public class ResourceUsage {
    
    private final String moduleId;
    
    // 资源使用
    private final long memoryUsage;       // 内存使用 (bytes)
    private final int threadCount;        // 线程数
    private final int connectionCount;    // 连接数
    
    // 执行统计
    private final long totalExecutions;   // 总执行次数
    private final long successExecutions; // 成功次数
    private final long failedExecutions;  // 失败次数
    private final long avgExecutionTime;  // 平均执行时间 (ms)
    
    public ResourceUsage(String moduleId, long memoryUsage, int threadCount, 
                         int connectionCount, long totalExecutions,
                         long successExecutions, long failedExecutions,
                         long avgExecutionTime) {
        this.moduleId = moduleId;
        this.memoryUsage = memoryUsage;
        this.threadCount = threadCount;
        this.connectionCount = connectionCount;
        this.totalExecutions = totalExecutions;
        this.successExecutions = successExecutions;
        this.failedExecutions = failedExecutions;
        this.avgExecutionTime = avgExecutionTime;
    }
    
    // Getters
    public String getModuleId() { return moduleId; }
    public long getMemoryUsage() { return memoryUsage; }
    public int getThreadCount() { return threadCount; }
    public int getConnectionCount() { return connectionCount; }
    public long getTotalExecutions() { return totalExecutions; }
    public long getSuccessExecutions() { return successExecutions; }
    public long getFailedExecutions() { return failedExecutions; }
    public long getAvgExecutionTime() { return avgExecutionTime; }
    
    /**
     * 获取成功率
     */
    public double getSuccessRate() {
        if (totalExecutions == 0) return 0;
        return (successExecutions * 100.0) / totalExecutions;
    }
    
    /**
     * 获取失败率
     */
    public double getFailureRate() {
        if (totalExecutions == 0) return 0;
        return (failedExecutions * 100.0) / totalExecutions;
    }
    
    /**
     * 格式化内存使用
     */
    public String getFormattedMemoryUsage() {
        if (memoryUsage < 1024) {
            return memoryUsage + " B";
        } else if (memoryUsage < 1024 * 1024) {
            return String.format("%.2f KB", memoryUsage / 1024.0);
        } else if (memoryUsage < 1024 * 1024 * 1024) {
            return String.format("%.2f MB", memoryUsage / (1024.0 * 1024));
        } else {
            return String.format("%.2f GB", memoryUsage / (1024.0 * 1024 * 1024));
        }
    }
    
    @Override
    public String toString() {
        return String.format("ResourceUsage{module='%s', memory=%s, threads=%d, connections=%d, " +
            "executions=%d, success=%d, failed=%d, avgTime=%dms}",
            moduleId, getFormattedMemoryUsage(), threadCount, connectionCount,
            totalExecutions, successExecutions, failedExecutions, avgExecutionTime);
    }
}