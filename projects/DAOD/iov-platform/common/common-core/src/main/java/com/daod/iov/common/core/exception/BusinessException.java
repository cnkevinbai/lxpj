package com.daod.iov.common.core.exception;

import lombok.Getter;

/**
 * 业务异常
 * 
 * 用于业务逻辑中抛出的可预期异常
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Getter
public class BusinessException extends RuntimeException {
    
    /** 错误码 */
    private final String errorCode;
    
    /** HTTP 状态码 */
    private final int httpStatus;
    
    /**
     * 创建业务异常
     * 
     * @param message 错误信息
     */
    public BusinessException(String message) {
        super(message);
        this.errorCode = "BUSINESS_ERROR";
        this.httpStatus = 400;
    }
    
    /**
     * 创建业务异常 (带错误码)
     * 
     * @param errorCode 错误码
     * @param message 错误信息
     */
    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = 400;
    }
    
    /**
     * 创建业务异常 (带错误码和 HTTP 状态码)
     * 
     * @param errorCode 错误码
     * @param message 错误信息
     * @param httpStatus HTTP 状态码
     */
    public BusinessException(String errorCode, String message, int httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
    
    /**
     * 创建业务异常 (带原因)
     * 
     * @param errorCode 错误码
     * @param message 错误信息
     * @param cause 原因
     */
    public BusinessException(String errorCode, String message, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.httpStatus = 400;
    }
    
    // ==================== 静态工厂方法 ====================
    
    /**
     * 设备已绑定
     */
    public static BusinessException deviceAlreadyBound(String deviceId) {
        return new BusinessException("DEVICE_ALREADY_BOUND", "设备已绑定: " + deviceId);
    }
    
    /**
     * 设备未绑定
     */
    public static BusinessException deviceNotBound(String deviceId) {
        return new BusinessException("DEVICE_NOT_BOUND", "设备未绑定: " + deviceId, 404);
    }
    
    /**
     * 车辆已绑定其他设备
     */
    public static BusinessException vehicleAlreadyBound(String vin) {
        return new BusinessException("VEHICLE_ALREADY_BOUND", "车辆已绑定其他设备: " + vin);
    }
    
    /**
     * 绑定不存在
     */
    public static BusinessException bindingNotFound(String bindingId) {
        return new BusinessException("BINDING_NOT_FOUND", "绑定不存在: " + bindingId, 404);
    }
    
    /**
     * 鉴权码无效
     */
    public static BusinessException invalidAuthCode() {
        return new BusinessException("INVALID_AUTH_CODE", "鉴权码无效或已过期", 401);
    }
    
    /**
     * Token 无效
     */
    public static BusinessException invalidToken() {
        return new BusinessException("INVALID_TOKEN", "Token无效或已过期", 401);
    }
    
    /**
     * 签名验证失败
     */
    public static BusinessException invalidSignature() {
        return new BusinessException("INVALID_SIGNATURE", "签名验证失败", 401);
    }
    
    /**
     * 请求已过期
     */
    public static BusinessException requestExpired() {
        return new BusinessException("REQUEST_EXPIRED", "请求已过期", 401);
    }
    
    /**
     * 重复请求
     */
    public static BusinessException duplicateRequest() {
        return new BusinessException("DUPLICATE_REQUEST", "重复请求");
    }
    
    /**
     * 权限不足
     */
    public static BusinessException forbidden(String message) {
        return new BusinessException("FORBIDDEN", message, 403);
    }
    
    /**
     * 资源未找到
     */
    public static BusinessException notFound(String resource) {
        return new BusinessException("NOT_FOUND", resource + " 不存在", 404);
    }
    
    /**
     * 参数错误
     */
    public static BusinessException badRequest(String message) {
        return new BusinessException("BAD_REQUEST", message, 400);
    }
}