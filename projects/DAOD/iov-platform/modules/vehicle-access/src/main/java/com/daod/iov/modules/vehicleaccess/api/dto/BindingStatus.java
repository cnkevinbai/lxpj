package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 设备绑定状态枚举
 * 
 * 定义设备与车辆绑定关系的各种状态
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
public enum BindingStatus {
    
    /**
     * 待确认 - 设备发起绑定请求，等待平台确认
     */
    PENDING("PENDING", "待确认"),
    
    /**
     * 已绑定 - 绑定关系建立成功
     */
    BOUND("BOUND", "已绑定"),
    
    /**
     * 已解绑 - 绑定关系已解除
     */
    UNBOUND("UNBOUND", "已解绑"),
    
    /**
     * 已过期 - 绑定关系超时失效
     */
    EXPIRED("EXPIRED", "已过期"),
    
    /**
     * 待恢复 - 设备断线等待重连
     */
    PENDING_RECOVER("PENDING_RECOVER", "待恢复"),
    
    /**
     * 异常 - 绑定过程中出现异常
     */
    ERROR("ERROR", "异常");
    
    private final String code;
    private final String description;
    
    BindingStatus(String code, String description) {
        this.code = code;
        this.description = description;
    }
    
    public String getCode() {
        return code;
    }
    
    public String getDescription() {
        return description;
    }
    
    /**
     * 根据代码获取状态
     */
    public static BindingStatus fromCode(String code) {
        for (BindingStatus status : values()) {
            if (status.code.equals(code)) {
                return status;
            }
        }
        return null;
    }
    
    /**
     * 判断是否为活跃状态
     */
    public boolean isActive() {
        return this == BOUND || this == PENDING_RECOVER;
    }
    
    /**
     * 判断是否需要恢复
     */
    public boolean needsRecovery() {
        return this == PENDING_RECOVER || this == ERROR;
    }
}