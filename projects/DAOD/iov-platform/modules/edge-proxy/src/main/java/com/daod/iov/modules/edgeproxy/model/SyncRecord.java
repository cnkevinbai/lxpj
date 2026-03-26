package com.daod.iov.modules.edgeproxy.model;

/**
 * 数据同步记录
 */
public class SyncRecord {
    
    private String recordId;
    private String edgeNodeId;
    private long startTime;
    private long endTime;
    private int totalRecords;
    private int syncedRecords;
    private int failedRecords;
    private boolean successful;
    private String errorMessage;

    // Getters and Setters
    public String getRecordId() { return recordId; }
    public void setRecordId(String recordId) { this.recordId = recordId; }

    public String getEdgeNodeId() { return edgeNodeId; }
    public void setEdgeNodeId(String edgeNodeId) { this.edgeNodeId = edgeNodeId; }

    public long getStartTime() { return startTime; }
    public void setStartTime(long startTime) { this.startTime = startTime; }

    public long getEndTime() { return endTime; }
    public void setEndTime(long endTime) { this.endTime = endTime; }

    public int getTotalRecords() { return totalRecords; }
    public void setTotalRecords(int totalRecords) { this.totalRecords = totalRecords; }

    public int getSyncedRecords() { return syncedRecords; }
    public void setSyncedRecords(int syncedRecords) { this.syncedRecords = syncedRecords; }

    public int getFailedRecords() { return failedRecords; }
    public void setFailedRecords(int failedRecords) { this.failedRecords = failedRecords; }

    public boolean isSuccessful() { return successful; }
    public void setSuccessful(boolean successful) { this.successful = successful; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
