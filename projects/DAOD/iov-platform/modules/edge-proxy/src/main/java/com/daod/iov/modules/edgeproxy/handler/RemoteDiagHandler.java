package com.daod.iov.modules.edgeproxy.handler;

import com.daod.iov.modules.edgeproxy.CommandDispatcher;

/**
 * 远程诊断指令处理器
 */
public class RemoteDiagHandler implements CommandDispatcher.CommandHandler {
    
    @Override
    public void handle(String message) throws Exception {
        System.out.println("处理远程诊断指令: " + message);
        // TODO: 实现远程诊断逻辑
    }
}
