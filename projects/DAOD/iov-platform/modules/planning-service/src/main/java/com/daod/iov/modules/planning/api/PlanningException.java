package com.daod.iov.modules.planning.api;

/**
 * 规划异常
 */
public class PlanningException extends Exception {
    
    private final String code;
    
    public PlanningException(String code, String message) {
        super(message);
        this.code = code;
    }
    
    public PlanningException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }
    
    public String getCode() {
        return code;
    }
    
    // 预定义错误码
    public static final String NO_ROUTE = "NO_ROUTE";
    public static final String INVALID_REQUEST = "INVALID_REQUEST";
    public static final String SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE";
    public static final String TIMEOUT = "TIMEOUT";
    public static final String NO_FEASIBLE_SOLUTION = "NO_FEASIBLE_SOLUTION";
}