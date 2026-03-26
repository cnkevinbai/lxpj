package com.daod.iov.modules.edgeproxy;

import java.util.Date;

/**
 * 节点健康状态
 */
public class NodeHealthStatus {
    
    private String nodeId;
    private boolean online;
    private long lastHeartbeat;
    private long uptime;
    private double cpuUsage;
    private double memoryUsage;
    private int networkLatency;
    private String status;
    private String lastError;
    
    public NodeHealthStatus() {
        this.online = false;
        this.lastHeartbeat = System.currentTimeMillis();
        this.uptime = 0;
        this.cpuUsage = 0;
        this.memoryUsage = 0;
        this.networkLatency = 0;
        this.status = "unknown";
        this.lastError = null;
    }

    // Getters and Setters
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    public boolean isOnline() { return online; }
    public void setOnline(boolean online) { this.online = online; }

    public long getLastHeartbeat() { return lastHeartbeat; }
    public void setLastHeartbeat(long lastHeartbeat) { this.lastHeartbeat = lastHeartbeat; }

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

    public String getLastError() { return lastError; }
    public void setLastError(String lastError) { this.lastError = lastError; }

    @Override
    public String toString() {
        return String.format(
            "NodeHealthStatus{nodeId='%s', online=%s, lastHeartbeat=%s, uptime=%d, cpuUsage=%.2f, memoryUsage=%.2f, latency=%d, status='%s'}",
            nodeId, online, new Date(lastHeartbeat), uptime, cpuUsage, memoryUsage, networkLatency, status
        );
    }
}
