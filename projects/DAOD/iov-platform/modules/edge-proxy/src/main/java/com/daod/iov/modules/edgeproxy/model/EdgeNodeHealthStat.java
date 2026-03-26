package com.daod.iov.modules.edgeproxy.model;

/**
 * 边缘节点健康统计
 */
public class EdgeNodeHealthStat {
    
    private String nodeId;
    private long timestamp;
    private int totalHeartbeats;
    private int failedHeartbeats;
    private double avgCpuUsage;
    private double maxCpuUsage;
    private double avgMemoryUsage;
    private double maxMemoryUsage;
    private int avgNetworkLatency;
    private int maxNetworkLatency;
    private int uptime;
    private String status;
    private String lastError;

    // Getters and Setters
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public int getTotalHeartbeats() { return totalHeartbeats; }
    public void setTotalHeartbeats(int totalHeartbeats) { this.totalHeartbeats = totalHeartbeats; }

    public int getFailedHeartbeats() { return failedHeartbeats; }
    public void setFailedHeartbeats(int failedHeartbeats) { this.failedHeartbeats = failedHeartbeats; }

    public double getAvgCpuUsage() { return avgCpuUsage; }
    public void setAvgCpuUsage(double avgCpuUsage) { this.avgCpuUsage = avgCpuUsage; }

    public double getMaxCpuUsage() { return maxCpuUsage; }
    public void setMaxCpuUsage(double maxCpuUsage) { this.maxCpuUsage = maxCpuUsage; }

    public double getAvgMemoryUsage() { return avgMemoryUsage; }
    public void setAvgMemoryUsage(double avgMemoryUsage) { this.avgMemoryUsage = avgMemoryUsage; }

    public double getMaxMemoryUsage() { return maxMemoryUsage; }
    public void setMaxMemoryUsage(double maxMemoryUsage) { this.maxMemoryUsage = maxMemoryUsage; }

    public int getAvgNetworkLatency() { return avgNetworkLatency; }
    public void setAvgNetworkLatency(int avgNetworkLatency) { this.avgNetworkLatency = avgNetworkLatency; }

    public int getMaxNetworkLatency() { return maxNetworkLatency; }
    public void setMaxNetworkLatency(int maxNetworkLatency) { this.maxNetworkLatency = maxNetworkLatency; }

    public int getUptime() { return uptime; }
    public void setUptime(int uptime) { this.uptime = uptime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }
}
