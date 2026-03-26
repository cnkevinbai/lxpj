package com.daod.iov.plugin.sandbox;

/**
 * 沙箱异常
 */
public class SandboxException extends Exception {
    
    private final String errorCode;
    
    public SandboxException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public SandboxException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    // 常见错误码
    public static final String SANDBOX_EXISTS = "SANDBOX_EXISTS";
    public static final String SANDBOX_NOT_FOUND = "SANDBOX_NOT_FOUND";
    public static final String SANDBOX_NOT_ACTIVE = "SANDBOX_NOT_ACTIVE";
    public static final String SECURITY_VIOLATION = "SECURITY_VIOLATION";
    public static final String EXECUTION_FAILED = "EXECUTION_FAILED";
    public static final String RESOURCE_LIMIT_EXCEEDED = "RESOURCE_LIMIT_EXCEEDED";
}