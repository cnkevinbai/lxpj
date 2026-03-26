package com.daod.iov.modules.vehicleaccess.api.dto;

import java.time.Instant;

/**
 * 心跳结果
 * 
 * 心跳处理的返回结果
 */
public class HeartbeatResult {
    
    /** 是否成功 */
    private boolean success;
    
    /** 服务器时间 */
    private Instant serverTime;
    
    /** 下次心跳间隔 (秒) */
    private int nextHeartbeatInterval;
    
    /** 参数更新标记 */
    private boolean paramsNeedUpdate;
    
    /** 固件更新标记 */
    private boolean firmwareNeedUpdate;
    
    /** 消息 */
    private String message;
    
    // 构造函数
    public HeartbeatResult() {
        this.serverTime = Instant.now();
        this.nextHeartbeatInterval = 30; // 默认30秒
    }
    
    public static HeartbeatResult success() {
        HeartbeatResult result = new HeartbeatResult();
        result.setSuccess(true);
        return result;
    }
    
    public static HeartbeatResult failure(String message) {
        HeartbeatResult result = new HeartbeatResult();
        result.setSuccess(false);
        result.setMessage(message);
        return result;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public Instant getServerTime() {
        return serverTime;
    }
    
    public void setServerTime(Instant serverTime) {
        this.serverTime = serverTime;
    }
    
    public int getNextHeartbeatInterval() {
        return nextHeartbeatInterval;
    }
    
    public void setNextHeartbeatInterval(int nextHeartbeatInterval) {
        this.nextHeartbeatInterval = nextHeartbeatInterval;
    }
    
    public boolean isParamsNeedUpdate() {
        return paramsNeedUpdate;
    }
    
    public void setParamsNeedUpdate(boolean paramsNeedUpdate) {
        this.paramsNeedUpdate = paramsNeedUpdate;
    }
    
    public boolean isFirmwareNeedUpdate() {
        return firmwareNeedUpdate;
    }
    
    public void setFirmwareNeedUpdate(boolean firmwareNeedUpdate) {
        this.firmwareNeedUpdate = firmwareNeedUpdate;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}