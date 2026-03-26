package com.daod.iov.modules.httpadapter.api.dto;

/**
 * Webhook 处理结果
 */
public class WebhookResult {
    
    /** 是否成功 */
    private boolean success;
    
    /** HTTP 状态码 */
    private int statusCode;
    
    /** 响应数据 */
    private Object data;
    
    /** 错误信息 */
    private String errorMessage;
    
    // 静态工厂
    public static WebhookResult success(Object data) {
        WebhookResult result = new WebhookResult();
        result.setSuccess(true);
        result.setStatusCode(200);
        result.setData(data);
        return result;
    }
    
    public static WebhookResult failure(int statusCode, String message) {
        WebhookResult result = new WebhookResult();
        result.setSuccess(false);
        result.setStatusCode(statusCode);
        result.setErrorMessage(message);
        return result;
    }
    
    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }
    
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}