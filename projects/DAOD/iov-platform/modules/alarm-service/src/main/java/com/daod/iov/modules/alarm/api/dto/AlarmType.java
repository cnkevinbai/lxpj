package com.daod.iov.modules.alarm.api.dto;

/**
 * 告警类型枚举
 */
public enum AlarmType {
    OVER_SPEED("超速报警"),
    LOW_BATTERY("低电量报警"),
    GEO_FENCE_VIOLATION("围栏越界"),
    DEVICE_FAULT("设备故障"),
    OFFLINE("离线报警"),
    EMERGENCY("紧急报警"),
    CUSTOM("自定义报警");
    
    private final String description;
    
    AlarmType(String description) {
        this.description = description;
    }
    
    public String getDescription() { return description; }
}