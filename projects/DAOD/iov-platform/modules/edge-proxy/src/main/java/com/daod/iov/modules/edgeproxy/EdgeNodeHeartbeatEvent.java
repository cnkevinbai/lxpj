package com.daod.iov.modules.edgeproxy;

/**
 * 边缘节点心跳事件
 */
public class EdgeNodeHeartbeatEvent {
    
    private String nodeId;
    private long timestamp;
    private long uptime;
    private double cpuUsage;
    private double memoryUsage;
    private int networkLatency;
    private String status;
    
    // Getters and Setters
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public long getUptime() { return uptime; }
    public void setUptime(long uptime) { this.uptime = uptime; }

    public double getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(double cpuUsage) { this.cpuUsage = cpuUsage; }

    public double getMemoryUsage() { return memoryUsage; }
    public void setMemoryUsage(double memoryUsage) { this.memoryUsage = memoryUsage; }

    public int getNetworkLatency() { return networkLatency; }
    public void setNetworkLatency(int networkLatency) { this.networkLatency = networkLatency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
