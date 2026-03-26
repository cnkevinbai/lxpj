package com.daod.iov.modules.edgeproxy;

/**
 * 边缘协议扩展点
 * 实现不同边缘协议的扩展
 */
public interface EdgeProtocol {
    
    /**
     * 获取协议名称
     */
    String getProtocolName();
    
    /**
     * 协议初始化
     */
    void initialize();
    
    /**
     * 协议启动
     */
    void start();
    
    /**
     * 协议停止
     */
    void stop();
    
    /**
     * 协议销毁
     */
    void destroy();
    
    /**
     * 发送消息
     */
    void sendMessage(String topic, byte[] payload, int qos);
    
    /**
     * 接收消息
     */
    byte[] receiveMessage(String topic);
}
