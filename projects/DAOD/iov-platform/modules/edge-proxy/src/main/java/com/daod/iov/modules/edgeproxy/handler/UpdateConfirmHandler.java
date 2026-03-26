package com.daod.iov.modules.edgeproxy.handler;

import com.daod.iov.modules.edgeproxy.CommandDispatcher;

/**
 * 更新确认处理器
 */
public class UpdateConfirmHandler implements CommandDispatcher.CommandHandler {
    
    @Override
    public void handle(String message) throws Exception {
        System.out.println("处理更新确认指令: " + message);
        // TODO: 实现更新确认逻辑
    }
}
