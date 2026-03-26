package com.daod.iov.modules.edgeproxy.model;

/**
 * 指令信息
 */
public class CommandInfo {
    
    private String commandId;
    private String edgeNodeId;
    private String commandType;
    private String commandData;
    private long timestamp;
    private long expireTime;
    private String status;
    private String result;
    private long reportTime;

    // Getters and Setters
    public String getCommandId() { return commandId; }
    public void setCommandId(String commandId) { this.commandId = commandId; }

    public String getEdgeNodeId() { return edgeNodeId; }
    public void setEdgeNodeId(String edgeNodeId) { this.edgeNodeId = edgeNodeId; }

    public String getCommandType() { return commandType; }
    public void setCommandType(String commandType) { this.commandType = commandType; }

    public String getCommandData() { return commandData; }
    public void setCommandData(String commandData) { this.commandData = commandData; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public long getExpireTime() { return expireTime; }
    public void setExpireTime(long expireTime) { this.expireTime = expireTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public long getReportTime() { return reportTime; }
    public void setReportTime(long reportTime) { this.reportTime = reportTime; }
}
