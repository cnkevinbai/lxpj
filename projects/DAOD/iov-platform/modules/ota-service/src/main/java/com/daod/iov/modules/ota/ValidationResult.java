package com.daod.iov.modules.ota;

import java.util.Map;
import java.util.HashMap;

/**
 * 验证结果
 */
public class ValidationResult {
    private boolean valid;
    private String message;
    private String errorCode;
    private Map<String, Object> details;
    
    public ValidationResult() {
        this.details = new HashMap<>();
    }
    
    public static ValidationResult success() {
        ValidationResult result = new ValidationResult();
        result.valid = true;
        return result;
    }
    
    public static ValidationResult failure(String errorCode, String message) {
        ValidationResult result = new ValidationResult();
        result.valid = false;
        result.errorCode = errorCode;
        result.message = message;
        return result;
    }
    
    // Getters and Setters
    public boolean isValid() {
        return valid;
    }
    
    public void setValid(boolean valid) {
        this.valid = valid;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }
    
    public Map<String, Object> getDetails() {
        return details;
    }
    
    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }
}
