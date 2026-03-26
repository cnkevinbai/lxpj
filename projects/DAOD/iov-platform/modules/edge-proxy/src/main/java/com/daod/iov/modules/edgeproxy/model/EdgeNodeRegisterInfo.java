package com.daod.iov.modules.edgeproxy.model;

/**
 * 边缘节点注册信息
 */
public class EdgeNodeRegisterInfo {
    
    private String edgeNodeId;
    private String name;
    private String description;
    private String location;
    private String hardwareInfo;
    private String softwareVersion;
    private String manufacturer;
    private String model;
    private String serialNumber;
    private long registerTime;
    private long lastHeartbeat;
    private boolean online;
    private String status;
    private String errorMessage;

    // Getters and Setters
    public String getEdgeNodeId() { return edgeNodeId; }
    public void setEdgeNodeId(String edgeNodeId) { this.edgeNodeId = edgeNodeId; }

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

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }

    public long getRegisterTime() { return registerTime; }
    public void setRegisterTime(long registerTime) { this.registerTime = registerTime; }

    public long getLastHeartbeat() { return lastHeartbeat; }
    public void setLastHeartbeat(long lastHeartbeat) { this.lastHeartbeat = lastHeartbeat; }

    public boolean isOnline() { return online; }
    public void setOnline(boolean online) { this.online = online; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
