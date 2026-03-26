package com.daod.iov.modules.httpadapter.api.dto;

/**
 * 连接统计
 */
public class ConnectionStats {
    
    /** 总请求数 */
    private long totalRequests;
    
    /** 今日请求数 */
    private long todayRequests;
    
    /** 当前活跃连接 */
    private int activeConnections;
    
    /** 成功请求数 */
    private long successRequests;
    
    /** 失败请求数 */
    private long failedRequests;
    
    /** 平均响应时间 (ms) */
    private double avgResponseTime;
    
    /** 数据上报统计 */
    private long dataReports;
    
    /** 指令查询统计 */
    private long commandQueries;
    
    /** Webhook 统计 */
    private long webhookCalls;
    
    // Getters and Setters
    public long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(long totalRequests) { this.totalRequests = totalRequests; }
    
    public long getTodayRequests() { return todayRequests; }
    public void setTodayRequests(long todayRequests) { this.todayRequests = todayRequests; }
    
    public int getActiveConnections() { return activeConnections; }
    public void setActiveConnections(int activeConnections) { this.activeConnections = activeConnections; }
    
    public long getSuccessRequests() { return successRequests; }
    public void setSuccessRequests(long successRequests) { this.successRequests = successRequests; }
    
    public long getFailedRequests() { return failedRequests; }
    public void setFailedRequests(long failedRequests) { this.failedRequests = failedRequests; }
    
    public double getAvgResponseTime() { return avgResponseTime; }
    public void setAvgResponseTime(double avgResponseTime) { this.avgResponseTime = avgResponseTime; }
    
    public long getDataReports() { return dataReports; }
    public void setDataReports(long dataReports) { this.dataReports = dataReports; }
    
    public long getCommandQueries() { return commandQueries; }
    public void setCommandQueries(long commandQueries) { this.commandQueries = commandQueries; }
    
    public long getWebhookCalls() { return webhookCalls; }
    public void setWebhookCalls(long webhookCalls) { this.webhookCalls = webhookCalls; }
}