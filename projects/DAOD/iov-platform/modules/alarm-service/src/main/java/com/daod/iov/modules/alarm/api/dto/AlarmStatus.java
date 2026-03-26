package com.daod.iov.modules.alarm.api.dto;

/**
 * 告警状态枚举
 */
public enum AlarmStatus {
    PENDING("待处理"),
    PROCESSING("处理中"),
    RESOLVED("已解决"),
    IGNORED("已忽略");
    
    private final String description;
    
    AlarmStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() { return description; }
}