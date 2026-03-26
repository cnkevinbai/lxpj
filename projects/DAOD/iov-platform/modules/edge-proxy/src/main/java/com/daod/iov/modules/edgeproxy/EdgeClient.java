package com.daod.iov.modules.edgeproxy;

import com.daod.iov.plugin.ModuleException;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;

/**
 * 边缘客户端
 * 实现云边通信（MQTT/WebSocket）
 */
public class EdgeClient {
    
    public interface ConnectCallback {
        void onConnect();
    }
    
    public interface DisconnectCallback {
        void onDisconnect();
    }
    
    public interface MessageCallback {
        void onMessage(String topic, byte[] payload);
    }

    // MQTT Broker 地址
    private final String mqttBroker;
    
    // Cloud Endpoint
    private final String cloudEndpoint;
    
    // 回调
    private final ConnectCallback connectCallback;
    private final DisconnectCallback disconnectCallback;
    private final MessageCallback messageCallback;
    
    // 连接状态
    private final AtomicBoolean connected;
    
    // 订阅主题
    private final BlockingQueue<String> subscriptions;
    
    // 消息队列
    private final BlockingQueue<Message> messageQueue;
    
    // 线程池
    private ScheduledExecutorService scheduler;
    
    // 消息接收线程
    private volatile Thread receiverThread;
    
    // 消息发送线程
    private volatile Thread senderThread;

    public EdgeClient(String mqttBroker, String cloudEndpoint, 
                     ConnectCallback connectCallback, 
                     DisconnectCallback disconnectCallback, 
                     MessageCallback messageCallback) {
        this.mqttBroker = mqttBroker;
        this.cloudEndpoint = cloudEndpoint;
        this.connectCallback = connectCallback;
        this.disconnectCallback = disconnectCallback;
        this.messageCallback = messageCallback;
        this.connected = new AtomicBoolean(false);
        this.subscriptions = new LinkedBlockingQueue<>();
        this.messageQueue = new LinkedBlockingQueue<>();
    }

    /**
     * 启动客户端
     */
    public synchronized void start() throws ModuleException {
        if (connected.get()) {
            return;
        }
        
        try {
            // 启动线程池
            scheduler = Executors.newScheduledThreadPool(3, r -> {
                Thread t = new Thread(r, "edge-client-" + System.nanoTime());
                t.setDaemon(true);
                return t;
            });
            
            // 连接到 Broker
            connectToBroker();
            
            // 启动消息接收线程
            startReceiver();
            
            // 启动消息发送线程
            startSender();
            
            // 每30秒发送一次保持连接
            scheduler.scheduleAtFixedRate(
                this::heartbeatPing, 
                30, 30, TimeUnit.SECONDS
            );
            
            connected.set(true);
            System.out.println("边缘客户端启动完成: " + mqttBroker);
            
            if (connectCallback != null) {
                connectCallback.onConnect();
            }
            
        } catch (Exception e) {
            throw new ModuleException("CLIENT_START_FAILED", "edge-proxy",
                "边缘客户端启动失败: " + e.getMessage(), e);
        }
    }

    /**
     * 停止客户端
     */
    public synchronized void stop() {
        if (!connected.get()) {
            return;
        }
        
        try {
            connected.set(false);
            
            // 关闭线程
            if (receiverThread != null) {
                receiverThread.interrupt();
            }
            if (senderThread != null) {
                senderThread.interrupt();
            }
            
            // 关闭线程池
            if (scheduler != null) {
                scheduler.shutdown();
                try {
                    if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                        scheduler.shutdownNow();
                    }
                } catch (InterruptedException e) {
                    scheduler.shutdownNow();
                    Thread.currentThread().interrupt();
                }
            }
            
            // 清理队列
            subscriptions.clear();
            messageQueue.clear();
            
            System.out.println("边缘客户端停止");
            
            if (disconnectCallback != null) {
                disconnectCallback.onDisconnect();
            }
            
        } catch (Exception e) {
            System.err.println("边缘客户端停止异常: " + e.getMessage());
        }
    }

    /**
     * 连接到 Broker
     */
    private void connectToBroker() throws Exception {
        // TODO: 实际的 MQTT 连接
        // 这里模拟连接
        System.out.println("连接到 MQTT Broker: " + mqttBroker);
        
        // 模拟连接成功
        Thread.sleep(100);
    }

    /**
     * 启动消息接收线程
     */
    private void startReceiver() {
        receiverThread = new Thread(() -> {
            while (connected.get()) {
                try {
                    // 模拟接收消息
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    if (connected.get()) {
                        Thread.currentThread().interrupt();
                    }
                    break;
                } catch (Exception e) {
                    System.err.println("消息接收异常: " + e.getMessage());
                }
            }
        }, "edge-receiver-" + System.nanoTime());
        
        receiverThread.start();
    }

    /**
     * 启动消息发送线程
     */
    private void startSender() {
        senderThread = new Thread(() -> {
            while (connected.get()) {
                try {
                    Message msg = messageQueue.poll(100, TimeUnit.MILLISECONDS);
                    if (msg != null) {
                        sendMessage(msg);
                    }
                } catch (InterruptedException e) {
                    if (connected.get()) {
                        Thread.currentThread().interrupt();
                    }
                    break;
                } catch (Exception e) {
                    System.err.println("消息发送异常: " + e.getMessage());
                }
            }
        }, "edge-sender-" + System.nanoTime());
        
        senderThread.start();
    }

    /**
     * 发送心跳
     */
    private void heartbeatPing() {
        if (connected.get()) {
            System.out.println("发送心跳: " + System.currentTimeMillis());
        }
    }

    /**
     * 发送消息
     */
    private void sendMessage(Message msg) throws Exception {
        // 构建 MQTT PUBLISH 报文
        String topic = msg.getTopic();
        byte[] payload = msg.getPayload();
        int qos = msg.getQos();
        
        System.out.println("发送消息: topic=" + topic + ", qos=" + qos + ", payloadSize=" + payload.length);
        
        // TODO: 实际发送到 MQTT Broker
        
        // 模拟发送成功
    }

    /**
     * 订阅主题
     */
    public void subscribe(String topic) {
        try {
            subscriptions.offer(topic);
            System.out.println("订阅主题: " + topic);
        } catch (Exception e) {
            System.err.println("订阅异常: " + e.getMessage());
        }
    }

    /**
     * 取消订阅
     */
    public void unsubscribe(String topic) {
        subscriptions.remove(topic);
        System.out.println("取消订阅: " + topic);
    }

    /**
     * 发布消息
     */
    public void publish(String topic, String payload, int qos) {
        try {
            messageQueue.offer(new Message(topic, payload.getBytes(StandardCharsets.UTF_8), qos));
        } catch (Exception e) {
            System.err.println("发布消息异常: " + e.getMessage());
        }
    }

    /**
     * 发布消息
     */
    public void publish(String topic, byte[] payload, int qos) {
        try {
            messageQueue.offer(new Message(topic, payload, qos));
        } catch (Exception e) {
            System.err.println("发布消息异常: " + e.getMessage());
        }
    }

    /**
     * 与云端同步数据
     */
    public boolean syncWithCloud(String endpoint, String data) {
        try {
            URL url = new URL(endpoint);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            
            // 添加认证信息
            String auth = "edge:" + System.currentTimeMillis();
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            conn.setRequestProperty("Authorization", "Basic " + encodedAuth);
            
            // 加密数据
            String encryptedData = encrypt(data, "secret-key");
            
            try (OutputStream os = conn.getOutputStream()) {
                JSONObject json = new JSONObject();
                json.put("data", encryptedData);
                json.put("timestamp", System.currentTimeMillis());
                os.write(json.toString().getBytes(StandardCharsets.UTF_8));
            }
            
            int responseCode = conn.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (InputStream is = conn.getInputStream()) {
                    String response = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    JSONObject json = new JSONObject(response);
                    return json.getBoolean("success");
                }
            }
            
            return false;
            
        } catch (Exception e) {
            System.err.println("云端同步失败: " + e.getMessage());
            return false;
        }
    }

    /**
     * 加密数据
     */
    private String encrypt(String data, String key) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            
            byte[] encrypted = cipher.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            System.err.println("加密失败: " + e.getMessage());
            return data;
        }
    }

    /**
     * 解密数据
     */
    private String decrypt(String encryptedData, String key) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            
            byte[] encrypted = Base64.getDecoder().decode(encryptedData);
            byte[] decrypted = cipher.doFinal(encrypted);
            
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            System.err.println("解密失败: " + e.getMessage());
            return encryptedData;
        }
    }

    /**
     * 销毁
     */
    public void destroy() {
        stop();
    }

    /**
     * 消息内部类
     */
    public static class Message {
        private final String topic;
        private final byte[] payload;
        private final int qos;
        
        public Message(String topic, byte[] payload, int qos) {
            this.topic = topic;
            this.payload = payload;
            this.qos = qos;
        }
        
        public String getTopic() { return topic; }
        public byte[] getPayload() { return payload; }
        public int getQos() { return qos; }
    }
}
