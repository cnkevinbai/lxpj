package com.daod.iov.modules.edgeproxy;

/**
 * 边缘代理模块异常
 */
public class EdgeProxyException extends Exception {
    
    private String errorCode;
    private String errorMessage;
    
    public EdgeProxyException() {
        super();
    }
    
    public EdgeProxyException(String message) {
        super(message);
        this.errorMessage = message;
    }
    
    public EdgeProxyException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.errorMessage = message;
    }
    
    public EdgeProxyException(String message, Throwable cause) {
        super(message, cause);
        this.errorMessage = message;
    }
    
    public EdgeProxyException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.errorMessage = message;
    }
    
    public String getErrorCode() { return errorCode; }
    public void setErrorCode(String errorCode) { this.errorCode = errorCode; }
    
    @Override
    public String getMessage() { return errorMessage; }
}
