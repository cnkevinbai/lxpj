package com.daod.iov.modules.edgeproxy;

/**
 * 数据同步事件
 */
public class DataSyncEvent {
    
    private String nodeId;
    private String eventType;
    private long timestamp;
    private int recordsTotal;
    private int recordsSynced;
    private int recordsFailed;
    private boolean successful;
    private String errorMessage;
    
    // Getters and Setters
    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public int getRecordsTotal() { return recordsTotal; }
    public void setRecordsTotal(int recordsTotal) { this.recordsTotal = recordsTotal; }

    public int getRecordsSynced() { return recordsSynced; }
    public void setRecordsSynced(int recordsSynced) { this.recordsSynced = recordsSynced; }

    public int getRecordsFailed() { return recordsFailed; }
    public void setRecordsFailed(int recordsFailed) { this.recordsFailed = recordsFailed; }

    public boolean isSuccessful() { return successful; }
    public void setSuccessful(boolean successful) { this.successful = successful; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
