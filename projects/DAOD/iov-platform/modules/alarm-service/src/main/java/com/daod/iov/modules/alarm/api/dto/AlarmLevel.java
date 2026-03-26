package com.daod.iov.modules.alarm.api.dto;

/**
 * 告警级别枚举
 */
public enum AlarmLevel {
    CRITICAL(1, "严重"),
    MAJOR(2, "主要"),
    MINOR(3, "次要"),
    WARNING(4, "警告");
    
    private final int priority;
    private final String description;
    
    AlarmLevel(int priority, String description) {
        this.priority = priority;
        this.description = description;
    }
    
    public int getPriority() { return priority; }
    public String getDescription() { return description; }
}