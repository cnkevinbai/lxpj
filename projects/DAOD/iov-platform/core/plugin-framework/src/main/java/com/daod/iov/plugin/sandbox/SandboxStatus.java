package com.daod.iov.plugin.sandbox;

/**
 * 沙箱状态
 */
public enum SandboxStatus {
    
    /** 创建中 */
    CREATING("创建中"),
    
    /** 活跃状态 */
    ACTIVE("活跃"),
    
    /** 暂停状态 */
    PAUSED("暂停"),
    
    /** 错误状态 */
    ERROR("错误"),
    
    /** 已销毁 */
    DESTROYED("已销毁");
    
    private final String displayName;
    
    SandboxStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}