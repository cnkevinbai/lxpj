package com.daod.iov.modules.edgeproxy.handler;

import com.daod.iov.modules.edgeproxy.CommandDispatcher;

/**
 * 诊断指令处理器
 */
public class DiagHandler implements CommandDispatcher.CommandHandler {
    
    @Override
    public void handle(String message) throws Exception {
        System.out.println("处理诊断指令: " + message);
        // TODO: 实现诊断逻辑
    }
}
