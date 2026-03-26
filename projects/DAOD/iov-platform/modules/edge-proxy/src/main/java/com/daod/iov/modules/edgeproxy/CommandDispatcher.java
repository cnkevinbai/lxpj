package com.daod.iov.modules.edgeproxy;

import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;

import org.json.JSONObject;

/**
 * 指令分发器
 * 实现云端指令的接收和分发
 */
public class CommandDispatcher {
    
    // 指令处理器注册表
    private final ConcurrentHashMap<String, CommandHandler> handlers;
    
    // 指令历史
    private final ConcurrentHashMap<String, String> commandHistory;
    
    // 运行状态
    private volatile boolean running;
    
    public CommandDispatcher() {
        this.handlers = new ConcurrentHashMap<>();
        this.commandHistory = new ConcurrentHashMap<>();
        this.running = false;
    }

    /**
     * 启动分发器
     */
    public void start() {
        running = true;
        System.out.println("指令分发器启动");
    }

    /**
     * 停止分发器
     */
    public void stop() {
        running = false;
        System.out.println("指令分发器停止");
    }

    /**
     * 处理消息
     */
    public void handleMessage(String topic, byte[] payload) {
        if (!running) {
            return;
        }
        
        try {
            String message = new String(payload, "UTF-8");
            
            // 解析消息
            JSONObject json = new JSONObject(message);
            String commandId = json.optString("commandId");
            String commandType = json.optString("commandType");
            
            // 记录指令历史
            commandHistory.put(commandId, message);
            
            // 分发到处理器
            handleCommand(commandType, message);
            
        } catch (Exception e) {
            System.err.println("消息处理异常: " + e.getMessage());
        }
    }

    /**
     * 处理指令
     */
    private void handleCommand(String commandType, String message) {
        CommandHandler handler = handlers.get(commandType);
        if (handler != null) {
            try {
                handler.handle(message);
            } catch (Exception e) {
                System.err.println("指令执行失败: " + e.getMessage());
            }
        } else {
            System.out.println("未知指令类型: " + commandType);
        }
    }

    /**
     * 注册指令处理器
     */
    public void registerHandler(String commandType, CommandHandler handler) {
        handlers.put(commandType, handler);
        System.out.println("注册指令处理器: " + commandType);
    }

    /**
     * 注销指令处理器
     */
    public void unregisterHandler(String commandType) {
        handlers.remove(commandType);
        System.out.println("注销指令处理器: " + commandType);
    }

    /**
     * 响应指令执行结果
     */
    public void respondCommand(String commandId, boolean success, String result) {
        JSONObject json = new JSONObject();
        json.put("commandId", commandId);
        json.put("success", success);
        json.put("result", result);
        json.put("timestamp", System.currentTimeMillis());
        
        System.out.println("响应指令: " + json.toString());
    }

    /**
     * 获取指令历史
     */
    public String getCommandHistory(String commandId) {
        return commandHistory.get(commandId);
    }

    /**
     * 清空指令历史
     */
    public void clearCommandHistory() {
        commandHistory.clear();
    }

    /**
     * 销毁
     */
    public void destroy() {
        stop();
        handlers.clear();
        commandHistory.clear();
    }

    /**
     * 指令处理器接口
     */
    public interface CommandHandler {
        void handle(String message) throws Exception;
    }
}
