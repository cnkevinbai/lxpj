package com.daod.iov.modules.ota.api.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * OTA 任务创建请求
 */
public class OtaTaskCreateRequest {
    
    /** 固件 ID */
    @NotBlank(message = "固件ID不能为空")
    private String firmwareId;
    
    /** 设备 ID 列表 */
    @NotNull(message = "设备列表不能为空")
    private List<String> deviceIds;
    
    /** 租户 ID */
    @NotBlank(message = "租户ID不能为空")
    private String tenantId;
    
    /** 升级策略 (immediate/scheduled) */
    private String strategy;
    
    /** 计划时间 */
    private Long scheduledTime;
    
    /** 最大并发数 */
    private int maxConcurrency = 10;
    
    /** 超时时间 (分钟) */
    private int timeoutMinutes = 30;
    
    /** 是否自动重试 */
    private boolean autoRetry = true;
    
    /** 重试次数 */
    private int retryCount = 3;
    
    // Getters and Setters
    public String getFirmwareId() { return firmwareId; }
    public void setFirmwareId(String firmwareId) { this.firmwareId = firmwareId; }
    
    public List<String> getDeviceIds() { return deviceIds; }
    public void setDeviceIds(List<String> deviceIds) { this.deviceIds = deviceIds; }
    
    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    
    public String getStrategy() { return strategy; }
    public void setStrategy(String strategy) { this.strategy = strategy; }
    
    public Long getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(Long scheduledTime) { this.scheduledTime = scheduledTime; }
    
    public int getMaxConcurrency() { return maxConcurrency; }
    public void setMaxConcurrency(int maxConcurrency) { this.maxConcurrency = maxConcurrency; }
    
    public int getTimeoutMinutes() { return timeoutMinutes; }
    public void setTimeoutMinutes(int timeoutMinutes) { this.timeoutMinutes = timeoutMinutes; }
    
    public boolean isAutoRetry() { return autoRetry; }
    public void setAutoRetry(boolean autoRetry) { this.autoRetry = autoRetry; }
    
    public int getRetryCount() { return retryCount; }
    public void setRetryCount(int retryCount) { this.retryCount = retryCount; }
}