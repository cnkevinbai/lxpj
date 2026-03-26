package com.daod.iov.modules.edgeproxy.model;

/**
 * 系统健康信息
 */
public class SystemHealthInfo {
    
    private String nodeId;
    private long timestamp;
    private double cpuUsage;
    private double memoryUsage;
    private double diskUsage;
    private int networkLatency;
    private int connectionCount;
    private int activeTasks;
    private String status;
    private String errorMessage;

    // Getters and Setters
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public double getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(double cpuUsage) { this.cpuUsage = cpuUsage; }

    public double getMemoryUsage() { return memoryUsage; }
    public void setMemoryUsage(double memoryUsage) { this.memoryUsage = memoryUsage; }

    public double getDiskUsage() { return diskUsage; }
    public void setDiskUsage(double diskUsage) { this.diskUsage = diskUsage; }

    public int getNetworkLatency() { return networkLatency; }
    public void setNetworkLatency(int networkLatency) { this.networkLatency = networkLatency; }

    public int getConnectionCount() { return connectionCount; }
    public void setConnectionCount(int connectionCount) { this.connectionCount = connectionCount; }

    public int getActiveTasks() { return activeTasks; }
    public void setActiveTasks(int activeTasks) { this.activeTasks = activeTasks; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
