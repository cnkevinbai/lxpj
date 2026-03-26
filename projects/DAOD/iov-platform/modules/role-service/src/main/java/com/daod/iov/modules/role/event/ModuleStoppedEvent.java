package com.daod.iov.modules.role.event;

import java.time.LocalDateTime;

/**
 * 模块停止事件
 */
public class ModuleStoppedEvent {
    private final String moduleName;
    private final LocalDateTime timestamp;
    
    public ModuleStoppedEvent(String moduleName) {
        this.moduleName = moduleName;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getModuleName() { return moduleName; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
