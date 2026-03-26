package com.daod.iov.modules.edgeproxy.handler;

import com.daod.iov.modules.edgeproxy.CommandDispatcher;

/**
 * 配置更新指令处理器
 */
public class ConfigUpdateHandler implements CommandDispatcher.CommandHandler {
    
    @Override
    public void handle(String message) throws Exception {
        System.out.println("处理配置更新指令: " + message);
        // TODO: 实现配置更新逻辑
    }
}
