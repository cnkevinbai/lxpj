package com.daod.iov.modules.edgeproxy.handler;

import com.daod.iov.modules.edgeproxy.CommandDispatcher;

/**
 * 日志收集指令处理器
 */
public class LogCollectionHandler implements CommandDispatcher.CommandHandler {
    
    @Override
    public void handle(String message) throws Exception {
        System.out.println("处理日志收集指令: " + message);
        // TODO: 实现日志收集逻辑
    }
}
