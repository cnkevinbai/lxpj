package com.daod.iov.modules.mqtt.api.dto;

/**
 * MQTT 结果
 */
public class MqttResult {
    
    /** 是否成功 */
    private boolean success;
    
    /** 错误码 */
    private String errorCode;
    
    /** 错误消息 */
    private String errorMessage;
    
    /** 响应数据 */
    private byte[] responseData;
    
    // Getters and Setters
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    
    public byte[] getResponseData() { return responseData; }
    public void setResponseData(byte[] responseData) { this.responseData = responseData; }
    
    /**
     * 成功结果
     */
    public static MqttResult success() {
        MqttResult result = new MqttResult();
        result.setSuccess(true);
        return result;
    }
    
    /**
     * 失败结果
     */
    public static MqttResult failure(String errorCode, String errorMessage) {
        MqttResult result = new MqttResult();
        result.setSuccess(false);
        result.setErrorCode(errorCode);
        result.setErrorMessage(errorMessage);
        return result;
    }
}