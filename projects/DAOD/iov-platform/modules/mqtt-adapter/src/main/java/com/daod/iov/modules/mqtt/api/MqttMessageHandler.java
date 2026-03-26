package com.daod.iov.modules.mqtt.api;

import com.daod.iov.modules.mqtt.api.dto.*;

/**
 * MQTT 消息处理器接口
 * 
 * 处理特定主题的 MQTT 消息
 */
public interface MqttMessageHandler {
    
    /**
     * 处理消息
     * 
     * @param topic 主题
     * @param payload 消息体
     * @param clientId 客户端 ID
     * @return 处理结果
     */
    MqttResult handleMessage(String topic, byte[] payload, String clientId);
    
    /**
     * 获取支持的主题模式
     * 
     * @return 主题模式列表 (支持通配符)
     */
    String[] getSupportedTopics();
    
    /**
     * 获取处理器优先级
     * 
     * @return 优先级 (数字越小优先级越高)
     */
    default int getPriority() {
        return 100;
    }
}