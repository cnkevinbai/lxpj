package com.daod.iov.modules.role.event;

import java.time.LocalDateTime;

/**
 * 模块启动事件
 */
public class ModuleStartedEvent {
    private final String moduleName;
    private final LocalDateTime timestamp;
    
    public ModuleStartedEvent(String moduleName) {
        this.moduleName = moduleName;
        this.timestamp = LocalDateTime.now();
    }
    
    public String getModuleName() { return moduleName; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
