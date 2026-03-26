package com.daod.iov.modules.ota.api.dto;

/**
 * 固件信息
 */
public class FirmwareInfo {
    private String id;
    private String version;
    private String name;
    private String deviceModel;
    private long fileSize;
    private String checksum;
    private String description;
    private long createTime;
    
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDeviceModel() { return deviceModel; }
    public void setDeviceModel(String deviceModel) { this.deviceModel = deviceModel; }
    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }
    public String getChecksum() { return checksum; }
    public void setChecksum(String checksum) { this.checksum = checksum; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public long getCreateTime() { return createTime; }
    public void setCreateTime(long createTime) { this.createTime = createTime; }
}