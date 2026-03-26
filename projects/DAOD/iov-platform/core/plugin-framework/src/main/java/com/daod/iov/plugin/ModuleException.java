package com.daod.iov.plugin;

/**
 * 模块异常类
 */
public class ModuleException extends Exception {
    private String errorCode;
    private String moduleName;
    
    public ModuleException(String message) {
        super(message);
    }
    
    public ModuleException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public ModuleException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public ModuleException(String errorCode, String moduleName, String message) {
        super(message);
        this.errorCode = errorCode;
        this.moduleName = moduleName;
    }
    
    public ModuleException(String errorCode, String moduleName, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.moduleName = moduleName;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    public String getModuleName() {
        return moduleName;
    }
}