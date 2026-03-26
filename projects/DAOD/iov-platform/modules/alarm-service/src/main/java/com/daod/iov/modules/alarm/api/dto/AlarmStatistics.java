package com.daod.iov.modules.alarm.api.dto;

/**
 * 告警统计
 */
public class AlarmStatistics {
    
    /** 总告警数 */
    private long totalAlarms;
    
    /** 待处理数 */
    private long pendingCount;
    
    /** 处理中数 */
    private long processingCount;
    
    /** 已解决数 */
    private long resolvedCount;
    
    /** 已忽略数 */
    private long ignoredCount;
    
    /** 今日新增 */
    private long todayNew;
    
    /** 今日已处理 */
    private long todayHandled;
    
    /** 严重告警数 */
    private long criticalCount;
    
    /** 主要告警数 */
    private long majorCount;
    
    /** 次要告警数 */
    private long minorCount;
    
    /** 警告数 */
    private long warningCount;
    
    // Getters and Setters
    public long getTotalAlarms() { return totalAlarms; }
    public void setTotalAlarms(long totalAlarms) { this.totalAlarms = totalAlarms; }
    
    public long getPendingCount() { return pendingCount; }
    public void setPendingCount(long pendingCount) { this.pendingCount = pendingCount; }
    
    public long getProcessingCount() { return processingCount; }
    public void setProcessingCount(long processingCount) { this.processingCount = processingCount; }
    
    public long getResolvedCount() { return resolvedCount; }
    public void setResolvedCount(long resolvedCount) { this.resolvedCount = resolvedCount; }
    
    public long getIgnoredCount() { return ignoredCount; }
    public void setIgnoredCount(long ignoredCount) { this.ignoredCount = ignoredCount; }
    
    public long getTodayNew() { return todayNew; }
    public void setTodayNew(long todayNew) { this.todayNew = todayNew; }
    
    public long getTodayHandled() { return todayHandled; }
    public void setTodayHandled(long todayHandled) { this.todayHandled = todayHandled; }
    
    public long getCriticalCount() { return criticalCount; }
    public void setCriticalCount(long criticalCount) { this.criticalCount = criticalCount; }
    
    public long getMajorCount() { return majorCount; }
    public void setMajorCount(long majorCount) { this.majorCount = majorCount; }
    
    public long getMinorCount() { return minorCount; }
    public void setMinorCount(long minorCount) { this.minorCount = minorCount; }
    
    public long getWarningCount() { return warningCount; }
    public void setWarningCount(long warningCount) { this.warningCount = warningCount; }
}