package com.daod.iov.modules.eventbus.api;

/**
 * 事件接口
 * 
 * 所有事件必须实现此接口
 */
public interface Event {
    
    /**
     * 获取事件类型
     */
    String getType();
    
    /**
     * 获取事件来源
     */
    String getSource();
    
    /**
     * 获取事件时间戳
     */
    long getTimestamp();
    
    /**
     * 获取事件数据
     */
    Object getPayload();
    
    /**
     * 获取租户ID
     */
    String getTenantId();
}