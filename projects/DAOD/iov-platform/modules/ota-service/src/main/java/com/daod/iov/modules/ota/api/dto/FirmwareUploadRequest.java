package com.daod.iov.modules.ota.api.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * 固件上传请求
 */
public class FirmwareUploadRequest {
    
    /** 固件版本 */
    @NotBlank(message = "固件版本不能为空")
    @Size(max = 50, message = "版本号长度不能超过50")
    private String version;
    
    /** 固件名称 */
    @NotBlank(message = "固件名称不能为空")
    @Size(max = 100, message = "名称长度不能超过100")
    private String name;
    
    /** 设备型号 */
    @NotBlank(message = "设备型号不能为空")
    @Size(max = 50, message = "设备型号长度不能超过50")
    private String deviceModel;
    
    /** 文件路径 */
    private String filePath;
    
    /** 文件大小 */
    private long fileSize;
    
    /** 校验和 */
    private String checksum;
    
    /** 描述 */
    @Size(max = 500, message = "描述长度不能超过500")
    private String description;
    
    /** 是否激活 */
    private boolean active = true;
    
    // Getters and Setters
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDeviceModel() { return deviceModel; }
    public void setDeviceModel(String deviceModel) { this.deviceModel = deviceModel; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }
    
    public String getChecksum() { return checksum; }
    public void setChecksum(String checksum) { this.checksum = checksum; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}