package com.daod.iov.plugin.rollback;

/**
 * 回滚异常
 */
public class RollbackException extends Exception {
    
    private final String errorCode;
    
    public RollbackException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }
    
    public RollbackException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }
    
    public String getErrorCode() {
        return errorCode;
    }
    
    // 常见错误码
    public static final String MODULE_NOT_FOUND = "MODULE_NOT_FOUND";
    public static final String BACKUP_NOT_FOUND = "BACKUP_NOT_FOUND";
    public static final String BACKUP_FAILED = "BACKUP_FAILED";
    public static final String ROLLBACK_FAILED = "ROLLBACK_FAILED";
    public static final String NO_BACKUP = "NO_BACKUP";
}