package com.daod.iov.modules.edgeproxy;

/**
 * 车辆控制指令处理器实现
 */
public class VehicleControlHandlerImpl implements CommandDispatcher.CommandHandler {
    
    @Override
    public void handle(String message) throws Exception {
        System.out.println("处理车辆控制指令: " + message);
        // TODO: 实现车辆控制逻辑
    }
}
