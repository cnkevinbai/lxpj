package com.daod.iov.plugin.sandbox;

/**
 * 审计记录
 */
public class AuditRecord {
    
    private final String sandboxId;
    private final String action;
    private final String description;
    private final String detail;
    private final long timestamp;
    
    public AuditRecord(String sandboxId, String action, String description, String detail, long timestamp) {
        this.sandboxId = sandboxId;
        this.action = action;
        this.description = description;
        this.detail = detail;
        this.timestamp = timestamp;
    }
    
    public String sandboxId() { return sandboxId; }
    public String action() { return action; }
    public String description() { return description; }
    public String detail() { return detail; }
    public long timestamp() { return timestamp; }
}