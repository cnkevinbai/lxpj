package com.daod.iov.modules.httpadapter.api.dto;

/**
 * 数据上报结果
 */
public class DataReportResult {
    
    /** 是否成功 */
    private boolean success;
    
    /** 消息 ID */
    private String messageId;
    
    /** 服务器时间 */
    private long serverTime;
    
    /** 待执行指令数 */
    private int pendingCommands;
    
    /** 错误码 */
    private String errorCode;
    
    /** 错误信息 */
    private String errorMessage;
    
    // 静态工厂
    public static DataReportResult success(String messageId) {
        DataReportResult result = new DataReportResult();
        result.setSuccess(true);
        result.setMessageId(messageId);
        result.setServerTime(System.currentTimeMillis());
        return result;
    }
    
    public static DataReportResult failure(String errorCode, String message) {
        DataReportResult result = new DataReportResult();
        result.setSuccess(false);
        result.setErrorCode(errorCode);
        result.setErrorMessage(message);
        return result;
    }
    
    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }
    
    public long getServerTime() { return serverTime; }
    public void setServerTime(long serverTime) { this.serverTime = serverTime; }
    
    public int getPendingCommands() { return pendingCommands; }
    public void setPendingCommands(int pendingCommands) { this.pendingCommands = pendingCommands; }
    
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}