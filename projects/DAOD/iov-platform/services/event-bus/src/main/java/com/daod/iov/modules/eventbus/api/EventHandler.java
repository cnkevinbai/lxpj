package com.daod.iov.modules.eventbus.api;

/**
 * 事件处理器接口
 * 
 * 处理特定类型的事件
 */
public interface EventHandler<T> {
    
    /**
     * 处理事件
     * 
     * @param event 事件对象
     */
    void handle(T event);
    
    /**
     * 获取支持的事件类型
     */
    String getEventType();
    
    /**
     * 获取处理器优先级 (数字越小优先级越高)
     */
    default int getPriority() {
        return 100;
    }
    
    /**
     * 是否异步执行
     */
    default boolean isAsync() {
        return true;
    }
}