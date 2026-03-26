package com.daod.iov.modules.mqtt.internal.service;

import com.daod.iov.modules.mqtt.api.*;
import com.daod.iov.modules.mqtt.api.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * MQTT 适配器服务实现
 */
public class MqttAdapterServiceImpl implements MqttAdapterService {
    
    private static final Logger log = LoggerFactory.getLogger(MqttAdapterServiceImpl.class);
    
    /** 在线客户端 */
    private final Map<String, MqttClientSession> clients = new ConcurrentHashMap<>();
    
    /** 订阅关系Map<String, Set<String>> subscriptions = new ConcurrentHashMap<>();
    
    /** 运行状态 */
    private volatile boolean running = false;
    
    /** 服务端口 */
    private int port = 1883;
    
    @Override
    public void start(int port) {
        this.port = port;
        this.running = true;
        
        log.info("MQTT 适配器启动: port={}", port);
        
        // 实际实现需要启动 Netty 服务端
        // 这里是简化实现
    }
    
    @Override
    public void stop() {
        running = false;
        
        // 断开所有客户端
        for (String clientId : clients.keySet()) {
            disconnect(clientId);
        }
        
        log.info("MQTT 适配器停止");
    }
    
    @Override
    public boolean publish(String topic, byte[] payload, int qos) {
        if (!running) {
            log.warn("适配器未运行");
            return false;
        }
        
        log.debug("发布消息: topic={}, qos={}", topic, qos);
        
        // 查找订阅该主题的客户端
        Set<String> subscribers = findSubscribers(topic);
        
        for (String clientId : subscribers) {
            MqttClientSession session = clients.get(clientId);
            if (session != null && session.isConnected()) {
                // 发送消息到客户端
                sendToClient(session, topic, payload, qos);
            }
        }
        
        return true;
    }
    
    @Override
    public int batchPublish(List<MqttMessage> messages) {
        int success = 0;
        for (MqttMessage msg : messages) {
            if (publish(msg.getTopic(), msg.getPayload(), msg.getQos())) {
                success++;
            }
        }
        return success;
    }
    
    @Override
    public void subscribe(String clientId, String topic, int qos) {
        subscriptions.computeIfAbsent(topic, k -> ConcurrentHashMap.newKeySet())
            .add(clientId);
        
        log.info("订阅主题: clientId={}, topic={}", clientId, topic);
    }
    
    @Override
    public void unsubscribe(String clientId, String topic) {
        Set<String> subscribers = subscriptions.get(topic);
        if (subscribers != null) {
            subscribers.remove(clientId);
        }
        
        log.info("取消订阅: clientId={}, topic={}", clientId, topic);
    }
    
    @Override
    public void disconnect(String clientId) {
        MqttClientSession session = clients.remove(clientId);
        if (session != null) {
            session.setConnected(false);
            log.info("客户端断开: clientId={}", clientId);
        }
        
        // 清理订阅
        for (Set<String> subscribers : subscriptions.values()) {
            subscribers.remove(clientId);
        }
    }
    
    @Override
    public int getOnlineClientCount() {
        return (int) clients.values().stream()
            .filter(MqttClientSession::isConnected)
            .count();
    }
    
    @Override
    public List<String> getOnlineClients() {
        List<String> online = new ArrayList<>();
        for (Map.Entry<String, MqttClientSession> entry : clients.entrySet()) {
            if (entry.getValue().isConnected()) {
                online.add(entry.getKey());
            }
        }
        return online;
    }
    
    /**
     * 查找订阅者
     */
    private Set<String> findSubscribers(String topic) {
        Set<String> result = new HashSet<>();
        
        for (Map.Entry<String, Set<String>> entry : subscriptions.entrySet()) {
            if (matchTopic(entry.getKey(), topic)) {
                result.addAll(entry.getValue());
            }
        }
        
        return result;
    }
    
    /**
     * 主题匹配 (支持通配符)
     */
    private boolean matchTopic(String pattern, String topic) {
        // 简化实现
        if (pattern.equals(topic)) {
            return true;
        }
        
        // 支持单级通配符 +
        // 支持多级通配符 #
        String regex = pattern
            .replace("+", "[^/]+")
            .replace("#", ".*");
        
        return topic.matches(regex);
    }
    
    /**
     * 发送消息到客户端
     */
    private void sendToClient(MqttClientSession session, String topic, byte[] payload, int qos) {
        // 实际实现需要通过 Netty Channel 发送
        log.debug("发送到客户端: clientId={}, topic={}", session.getClientId(), topic);
    }
}

/**
 * 客户端会话
 */
class MqttClientSession {
    private String clientId;
    private boolean connected;
    private long connectTime;
    private String username;
    
    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }
    
    public boolean isConnected() { return connected; }
    public void setConnected(boolean connected) { this.connected = connected; }
    
    public long getConnectTime() { return connectTime; }
    public void setConnectTime(long connectTime) { this.connectTime = connectTime; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}