package com.daod.iov.modules.edgeproxy.handler;

import com.daod.iov.modules.edgeproxy.CommandDispatcher;

/**
 * 开锁指令处理器
 */
public class UnlockVehicleHandler implements CommandDispatcher.CommandHandler {
    
    @Override
    public void handle(String message) throws Exception {
        System.out.println("处理开锁指令: " + message);
        // TODO: 实现开锁逻辑
    }
}
