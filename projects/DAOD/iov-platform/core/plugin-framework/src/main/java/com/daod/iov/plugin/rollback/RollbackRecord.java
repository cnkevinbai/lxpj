package com.daod.iov.plugin.rollback;

import java.time.Instant;

/**
 * 回滚记录
 */
public class RollbackRecord {
    
    private final String moduleId;
    private final String backupId;
    private final String targetVersion;
    private final String message;
    private final Instant timestamp;
    private final boolean success;
    
    public RollbackRecord(String moduleId, String backupId, String targetVersion, String message, Instant timestamp, boolean success) {
        this.moduleId = moduleId;
        this.backupId = backupId;
        this.targetVersion = targetVersion;
        this.message = message;
        this.timestamp = timestamp;
        this.success = success;
    }
    
    public String moduleId() { return moduleId; }
    public String backupId() { return backupId; }
    public String targetVersion() { return targetVersion; }
    public String message() { return message; }
    public Instant timestamp() { return timestamp; }
    public boolean success() { return success; }
}