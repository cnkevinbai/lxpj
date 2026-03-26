package com.daod.iov.modules.planning.internal.service;

import com.daod.iov.modules.eventbus.api.EventBus;
import com.daod.iov.modules.planning.api.RoutePlanner;

/**
 * 重规划处理器
 */
public class ReplanHandler {
    
    private final RoutePlanner routePlanner;
    private final EventBus eventBus;
    private volatile boolean running = false;
    
    public ReplanHandler(RoutePlanner routePlanner, EventBus eventBus) {
        this.routePlanner = routePlanner;
        this.eventBus = eventBus;
    }
    
    public void start() {
        running = true;
        // 订阅路况变化事件
        // 实际实现需要监听 eventBus
    }
    
    public void stop() {
        running = false;
    }
    
    public boolean isRunning() {
        return running;
    }
}