package com.daod.iov.modules.vehicleaccess.api.dto;

/**
 * 在线状态
 * 
 * 表示终端设备的在线状态
 */
public class OnlineStatus {
    
    /** 终端 ID */
    private String terminalId;
    
    /** VIN */
    private String vin;
    
    /** 是否在线 */
    private boolean online;
    
    /** 最后上线时间 */
    private Long lastOnlineTime;
    
    /** 最后离线时间 */
    private Long lastOfflineTime;
    
    /** 离线原因 */
    private String offlineReason;
    
    /** 在线时长 (秒) */
    private Long onlineDuration;
    
    /** 当天累计在线时长 (秒) */
    private Long dailyOnlineDuration;
    
    // 构造函数
    public OnlineStatus() {}
    
    public OnlineStatus(String terminalId, boolean online) {
        this.terminalId = terminalId;
        this.online = online;
    }
    
    // Getters and Setters
    public String getTerminalId() {
        return terminalId;
    }
    
    public void setTerminalId(String terminalId) {
        this.terminalId = terminalId;
    }
    
    public String getVin() {
        return vin;
    }
    
    public void setVin(String vin) {
        this.vin = vin;
    }
    
    public boolean isOnline() {
        return online;
    }
    
    public void setOnline(boolean online) {
        this.online = online;
    }
    
    public Long getLastOnlineTime() {
        return lastOnlineTime;
    }
    
    public void setLastOnlineTime(Long lastOnlineTime) {
        this.lastOnlineTime = lastOnlineTime;
    }
    
    public Long getLastOfflineTime() {
        return lastOfflineTime;
    }
    
    public void setLastOfflineTime(Long lastOfflineTime) {
        this.lastOfflineTime = lastOfflineTime;
    }
    
    public String getOfflineReason() {
        return offlineReason;
    }
    
    public void setOfflineReason(String offlineReason) {
        this.offlineReason = offlineReason;
    }
    
    public Long getOnlineDuration() {
        return onlineDuration;
    }
    
    public void setOnlineDuration(Long onlineDuration) {
        this.onlineDuration = onlineDuration;
    }
    
    public Long getDailyOnlineDuration() {
        return dailyOnlineDuration;
    }
    
    public void setDailyOnlineDuration(Long dailyOnlineDuration) {
        this.dailyOnlineDuration = dailyOnlineDuration;
    }
}