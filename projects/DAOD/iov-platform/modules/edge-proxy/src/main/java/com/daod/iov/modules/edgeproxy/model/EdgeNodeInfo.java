package com.daod.iov.modules.edgeproxy.model;

/**
 * 边缘节点信息
 */
public class EdgeNodeInfo {
    
    private String nodeId;
    private String name;
    private String description;
    private String location;
    private String hardwareInfo;
    private String softwareVersion;
    private boolean online;
    private long lastHeartbeat;
    private long registerTime;
    private long lastSyncTime;
    
    // Getters and Setters
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getHardwareInfo() { return hardwareInfo; }
    public void setHardwareInfo(String hardwareInfo) { this.hardwareInfo = hardwareInfo; }

    public String getSoftwareVersion() { return softwareVersion; }
    public void setSoftwareVersion(String softwareVersion) { this.softwareVersion = softwareVersion; }

    public boolean isOnline() { return online; }
    public void setOnline(boolean online) { this.online = online; }

    public long getLastHeartbeat() { return lastHeartbeat; }
    public void setLastHeartbeat(long lastHeartbeat) { this.lastHeartbeat = lastHeartbeat; }

    public long getRegisterTime() { return registerTime; }
    public void setRegisterTime(long registerTime) { this.registerTime = registerTime; }

    public long getLastSyncTime() { return lastSyncTime; }
    public void setLastSyncTime(long lastSyncTime) { this.lastSyncTime = lastSyncTime; }
}
