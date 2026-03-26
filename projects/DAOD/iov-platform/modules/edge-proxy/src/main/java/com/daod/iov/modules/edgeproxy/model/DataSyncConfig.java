package com.daod.iov.modules.edgeproxy.model;

/**
 * 数据同步配置
 */
public class DataSyncConfig {
    
    private String edgeNodeId;
    private boolean enabled;
    private int syncInterval;
    private int cacheSize;
    private boolean enableCompression;
    private boolean enableEncryption;
    private String syncStrategy;
    private String syncEndpoint;
    private boolean autoRetry;
    private int maxRetryCount;
    private long retryInterval;
    private boolean breakPointResume;
    private String backupEndpoint;
    private long backupInterval;

    // Getters and Setters
    public String getEdgeNodeId() { return edgeNodeId; }
    public void setEdgeNodeId(String edgeNodeId) { this.edgeNodeId = edgeNodeId; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public int getSyncInterval() { return syncInterval; }
    public void setSyncInterval(int syncInterval) { this.syncInterval = syncInterval; }

    public int getCacheSize() { return cacheSize; }
    public void setCacheSize(int cacheSize) { this.cacheSize = cacheSize; }

    public boolean isEnableCompression() { return enableCompression; }
    public void setEnableCompression(boolean enableCompression) { this.enableCompression = enableCompression; }

    public boolean isEnableEncryption() { return enableEncryption; }
    public void setEnableEncryption(boolean enableEncryption) { this.enableEncryption = enableEncryption; }

    public String getSyncStrategy() { return syncStrategy; }
    public void setSyncStrategy(String syncStrategy) { this.syncStrategy = syncStrategy; }

    public String getSyncEndpoint() { return syncEndpoint; }
    public void setSyncEndpoint(String syncEndpoint) { this.syncEndpoint = syncEndpoint; }

    public boolean isAutoRetry() { return autoRetry; }
    public void setAutoRetry(boolean autoRetry) { this.autoRetry = autoRetry; }

    public int getMaxRetryCount() { return maxRetryCount; }
    public void setMaxRetryCount(int maxRetryCount) { this.maxRetryCount = maxRetryCount; }

    public long getRetryInterval() { return retryInterval; }
    public void setRetryInterval(long retryInterval) { this.retryInterval = retryInterval; }

    public boolean isBreakPointResume() { return breakPointResume; }
    public void setBreakPointResume(boolean breakPointResume) { this.breakPointResume = breakPointResume; }

    public String getBackupEndpoint() { return backupEndpoint; }
    public void setBackupEndpoint(String backupEndpoint) { this.backupEndpoint = backupEndpoint; }

    public long getBackupInterval() { return backupInterval; }
    public void setBackupInterval(long backupInterval) { this.backupInterval = backupInterval; }
}
