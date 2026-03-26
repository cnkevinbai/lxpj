package com.daod.iov.modules.edgegateway.api.dto;

/**
 * 边缘网关状态
 */
public class EdgeGatewayStatus {
    
    /** 网关 ID */
    private String gatewayId;
    
    /** 运行状态 */
    private RunState runState;
    
    /** 连接状态 */
    private ConnectionStatus connectionStatus;
    
    /** CPU 使用率 */
    private double cpuUsage;
    
    /** 内存使用率 */
    private double memoryUsage;
    
    /** 已连接设备数 */
    private int connectedDevices;
    
    /** 数据队列大小 */
    private int queueSize;
    
    /** 运行时长 (秒) */
    private long uptime;
    
    // Getters and Setters
    
    public String getGatewayId() { return gatewayId; }
    public void setGatewayId(String gatewayId) { this.gatewayId = gatewayId; }
    
    public RunState getRunState() { return runState; }
    public void setRunState(RunState runState) { this.runState = runState; }
    
    public ConnectionStatus getConnectionStatus() { return connectionStatus; }
    public void setConnectionStatus(ConnectionStatus connectionStatus) { this.connectionStatus = connectionStatus; }
    
    public double getCpuUsage() { return cpuUsage; }
    public void setCpuUsage(double cpuUsage) { this.cpuUsage = cpuUsage; }
    
    public double getMemoryUsage() { return memoryUsage; }
    public void setMemoryUsage(double memoryUsage) { this.memoryUsage = memoryUsage; }
    
    public int getConnectedDevices() { return connectedDevices; }
    public void setConnectedDevices(int connectedDevices) { this.connectedDevices = connectedDevices; }
    
    public int getQueueSize() { return queueSize; }
    public void setQueueSize(int queueSize) { this.queueSize = queueSize; }
    
    public long getUptime() { return uptime; }
    public void setUptime(long uptime) { this.uptime = uptime; }
    
    /**
     * 运行状态枚举
     */
    public enum RunState {
        STARTING,    // 启动中
        RUNNING,     // 运行中
        STOPPING,    // 停止中
        STOPPED,     // 已停止
        ERROR        // 错误
    }
}

/**
 * 连接状态枚举
 */
enum ConnectionStatus {
    CONNECTED,       // 已连接
    DISCONNECTED,    // 已断开
    RECONNECTING,    // 重连中
    ERROR            // 连接错误
}