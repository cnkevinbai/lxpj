package com.daod.iov.modules.mqtt.api.dto;

/**
 * MQTT 消息
 */
public class MqttMessage {
    
    /** 主题 */
    private String topic;
    
    /** 消息体 */
    private byte[] payload;
    
    /** 服务质量 (0, 1, 2) */
    private int qos;
    
    /** 是否保留 */
    private boolean retained;
    
    /** 消息 ID */
    private int messageId;
    
    // Getters and Setters
    
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    
    public byte[] getPayload() { return payload; }
    public void setPayload(byte[] payload) { this.payload = payload; }
    
    public int getQos() { return qos; }
    public void setQos(int qos) { this.qos = qos; }
    
    public boolean isRetained() { return retained; }
    public void setRetained(boolean retained) { this.retained = retained; }
    
    public int getMessageId() { return messageId; }
    public void setMessageId(int messageId) { this.messageId = messageId; }
}