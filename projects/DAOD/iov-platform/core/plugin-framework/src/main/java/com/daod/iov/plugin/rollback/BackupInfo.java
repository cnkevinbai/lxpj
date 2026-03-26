package com.daod.iov.plugin.rollback;

import java.time.Instant;

/**
 * 备份信息
 */
public class BackupInfo {
    
    private String backupId;          // 备份ID
    private String moduleId;          // 模块ID
    private String moduleName;        // 模块名称
    private String version;           // 模块版本
    private String modulePath;        // 模块路径
    private String backupPath;        // 备份路径
    private long backupSize;          // 备份大小 (bytes)
    private Instant createdAt;        // 创建时间
    private String createdBy;         // 创建者
    private String description;       // 备份描述
    private BackupType type;          // 备份类型
    private BackupStatus status;      // 备份状态
    
    public BackupInfo() {
        this.createdAt = Instant.now();
        this.type = BackupType.MANUAL;
        this.status = BackupStatus.COMPLETED;
    }
    
    public BackupInfo(String backupId, String moduleId, String version) {
        this();
        this.backupId = backupId;
        this.moduleId = moduleId;
        this.version = version;
    }
    
    // Getters and Setters
    public String getBackupId() { return backupId; }
    public void setBackupId(String backupId) { this.backupId = backupId; }
    
    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }
    
    public String getModuleName() { return moduleName; }
    public void setModuleName(String moduleName) { this.moduleName = moduleName; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getModulePath() { return modulePath; }
    public void setModulePath(String modulePath) { this.modulePath = modulePath; }
    
    public String getBackupPath() { return backupPath; }
    public void setBackupPath(String backupPath) { this.backupPath = backupPath; }
    
    public long getBackupSize() { return backupSize; }
    public void setBackupSize(long backupSize) { this.backupSize = backupSize; }
    
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    
    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public BackupType getType() { return type; }
    public void setType(BackupType type) { this.type = type; }
    
    public BackupStatus getStatus() { return status; }
    public void setStatus(BackupStatus status) { this.status = status; }
    
    /**
     * 备份类型
     */
    public enum BackupType {
        /** 手动备份 */
        MANUAL,
        /** 自动备份 (更新前) */
        AUTO,
        /** 定时备份 */
        SCHEDULED
    }
    
    /**
     * 备份状态
     */
    public enum BackupStatus {
        /** 创建中 */
        CREATING,
        /** 已完成 */
        COMPLETED,
        /** 回滚中 */
        ROLLING_BACK,
        /** 已回滚 */
        ROLLED_BACK,
        /** 失败 */
        FAILED
    }
}