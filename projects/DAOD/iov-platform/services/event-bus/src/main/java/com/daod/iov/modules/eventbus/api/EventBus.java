package com.daod.iov.modules.eventbus.api;

import java.util.List;
import java.util.function.Consumer;

/**
 * 事件总线接口
 * 
 * 提供事件发布订阅能力
 */
public interface EventBus {
    
    /**
     * 发布事件
     * 
     * @param event 事件对象
     */
    void publish(Event event);
    
    /**
     * 同步发布事件 (阻塞等待所有处理器完成)
     * 
     * @param event 事件对象
     */
    void publishSync(Event event);
    
    /**
     * 订阅事件
     * 
     * @param eventType 事件类型
     * @param handler 处理器
     */
    <T extends Event> void subscribe(String eventType, EventHandler<T> handler);
    
    /**
     * 订阅事件 (使用 Consumer)
     * 
     * @param eventType 事件类型
     * @param consumer 消费者
     */
    <T extends Event> void subscribe(String eventType, Consumer<T> consumer);
    
    /**
     * 取消订阅
     * 
     * @param eventType 事件类型
     * @param handler 处理器
     */
    <T extends Event> void unsubscribe(String eventType, EventHandler<T> handler);
    
    /**
     * 获取事件类型的所有处理器
     * 
     * @param eventType 事件类型
     */
    List<EventHandler<?>> getHandlers(String eventType);
    
    /**
     * 获取事件队列大小
     */
    int getQueueSize();
    
    /**
     * 清空事件队列
     */
    void clearQueue();
}