package com.daod.iov.modules.ota;

import java.util.Map;

/**
 * OTA异常类
 */
public class OtaException extends Exception {
    private String errorCode;
    private String errorMessage;
    private Map<String, Object> context;
    
    public OtaException() {
    }
    
    public OtaException(String message) {
        super(message);
        this.errorMessage = message;
    }
    
    public OtaException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.errorMessage = message;
    }
    
    public OtaException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.errorMessage = message;
    }
    
    // Getters and Setters
    public String getErrorCode() {
        return errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
    
    public String getErrorMessage() {
        return errorMessage;
    }
    
    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
    
    public Map<String, Object> getContext() {
        return context;
    }
    
    public void setContext(Map<String, Object> context) {
        this.context = context;
    }
}
