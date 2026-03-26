package com.daod.iov.modules.edgeproxy;

/**
 * 指令执行事件
 */
public class CommandExecuteEvent {
    
    private String commandId;
    private String nodeId;
    private String commandType;
    private String commandData;
    private long executeTime;
    private boolean success;
    private String result;
    private String errorMessage;
    
    // Getters and Setters
    public String getCommandId() { return commandId; }
    public void setCommandId(String commandId) { this.commandId = commandId; }

    public String getNodeId() { return nodeId; }
    public void setNodeId(String nodeId) { this.nodeId = nodeId; }

    public String getCommandType() { return commandType; }
    public void setCommandType(String commandType) { this.commandType = commandType; }

    public String getCommandData() { return commandData; }
    public void setCommandData(String commandData) { this.commandData = commandData; }

    public long getExecuteTime() { return executeTime; }
    public void setExecuteTime(long executeTime) { this.executeTime = executeTime; }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}
