package com.daod.iov.modules.edgeproxy.handler;

import com.daod.iov.modules.edgeproxy.CommandDispatcher;

/**
 * 锁车指令处理器
 */
public class LockVehicleHandler implements CommandDispatcher.CommandHandler {
    
    @Override
    public void handle(String message) throws Exception {
        System.out.println("处理锁车指令: " + message);
        // TODO: 实现锁车逻辑
    }
}
