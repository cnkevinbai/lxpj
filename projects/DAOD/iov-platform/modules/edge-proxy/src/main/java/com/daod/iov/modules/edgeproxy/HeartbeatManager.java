package com.daod.iov.modules.edgeproxy;

import com.daod.iov.plugin.ModuleException;

import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 心跳管理器
 * 实现边缘节点心跳管理和在线状态检测
 */
public class HeartbeatManager {
    
    // 心跳间隔（毫秒）
    private static final long HEARTBEAT_INTERVAL = 30000;
    
    // 心跳超时时间（毫秒）
    private static final long HEARTBEAT_TIMEOUT = 90000;
    
    // 节点心跳信息
    private final ConcurrentHashMap<String, HeartbeatInfo> nodeHeartbeats;
    
    // 节点在线状态
    private final ConcurrentHashMap<String, Boolean> nodeOnlineStatus;
    
    // 心跳序列号
    private final AtomicInteger heartbeatSequence;
    
    // 运行状态
    private volatile boolean running;
    
    // 心跳线程
    private volatile Thread heartbeatThread;

    public HeartbeatManager() {
        this.nodeHeartbeats = new ConcurrentHashMap<>();
        this.nodeOnlineStatus = new ConcurrentHashMap<>();
        this.heartbeatSequence = new AtomicInteger(0);
        this.running = false;
    }

    /**
     * 启动心跳管理
     */
    public synchronized void start(String edgeNodeId) {
        if (running) {
            return;
        }
        
        // 注册节点
        nodeHeartbeats.put(edgeNodeId, new HeartbeatInfo());
        nodeOnlineStatus.put(edgeNodeId, false);
        
        running = true;
        
        heartbeatThread = new Thread(this::heartbeatLoop, "heartbeat-" + System.nanoTime());
        heartbeatThread.setDaemon(true);
        heartbeatThread.start();
        
        System.out.println("心跳管理器启动");
    }

    /**
     * 停止心跳管理
     */
    public synchronized void stop() {
        if (!running) {
            return;
        }
        
        running = false;
        
        if (heartbeatThread != null) {
            heartbeatThread.interrupt();
            try {
                heartbeatThread.join(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        nodeHeartbeats.clear();
        nodeOnlineStatus.clear();
        
        System.out.println("心跳管理器停止");
    }

    /**
     * 心跳循环
     */
    private void heartbeatLoop() {
        while (running) {
            try {
                checkHeartbeats();
                Thread.sleep(HEARTBEAT_INTERVAL);
            } catch (InterruptedException e) {
                if (running) {
                    Thread.currentThread().interrupt();
                }
                break;
            } catch (Exception e) {
                System.err.println("心跳检查异常: " + e.getMessage());
            }
        }
    }

    /**
     * 检查所有节点的心跳
     */
    private void checkHeartbeats() {
        long now = System.currentTimeMillis();
        
        nodeHeartbeats.forEach((nodeId, info) -> {
            long lastHeartbeat = info.lastHeartbeat;
            long uptime = now - lastHeartbeat;
            
            if (uptime > HEARTBEAT_TIMEOUT) {
                // 心跳超时，标记为离线
                nodeOnlineStatus.put(nodeId, false);
                System.out.println("节点离线: " + nodeId + ", 超时: " + uptime + "ms");
            }
        });
    }

    /**
     * 接收心跳
     */
    public void receiveHeartbeat(String nodeId) {
        nodeHeartbeats.compute(nodeId, (key, info) -> {
            if (info == null) {
                info = new HeartbeatInfo();
            }
            
            info.lastHeartbeat = System.currentTimeMillis();
            info.heartbeatCount.incrementAndGet();
            
            // 心跳间隔
            if (info.lastHeartbeat > 0) {
                info.heartbeatInterval = info.lastHeartbeat - info.previousHeartbeat;
            }
            info.previousHeartbeat = info.lastHeartbeat;
            
            // 标记为在线
            nodeOnlineStatus.put(nodeId, true);
            
            return info;
        });
    }

    /**
     * 发送心跳
     */
    public String sendHeartbeat(String edgeNodeId) {
        int seq = heartbeatSequence.incrementAndGet();
        
        HeartbeatInfo info = nodeHeartbeats.get(edgeNodeId);
        if (info == null) {
            receiveHeartbeat(edgeNodeId);
            info = nodeHeartbeats.get(edgeNodeId);
        }
        
        // 构建心跳消息
        StringBuilder sb = new StringBuilder();
        sb.append("{\"edgeNodeId\":\"").append(edgeNodeId).append("\",");
        sb.append("\"seq\":").append(seq).append(",");
        sb.append("\"timestamp\":").append(info.lastHeartbeat).append(",");
        sb.append("\"uptime\":").append(info.lastHeartbeat - info.previousHeartbeat).append(",");
        sb.append("\"seqNumber\":").append(info.heartbeatCount.get()).append("}");
        
        return sb.toString();
    }

    /**
     * 检查节点是否在线
     */
    public boolean isNodeOnline(String nodeId) {
        return nodeOnlineStatus.getOrDefault(nodeId, false);
    }

    /**
     * 获取心跳信息
     */
    public HeartbeatInfo getHeartbeatInfo(String nodeId) {
        return nodeHeartbeats.get(nodeId);
    }

    /**
     * 获取在线节点列表
     */
    public String[] getOnlineNodes() {
        return nodeOnlineStatus.entrySet().stream()
            .filter(e -> e.getValue())
            .map(java.util.Map.Entry::getKey)
            .toArray(String[]::new);
    }

    /**
     * 销毁
     */
    public void destroy() {
        stop();
    }

    /**
     * 心跳信息内部类
     */
    public static class HeartbeatInfo {
        public long previousHeartbeat = 0;
        public long lastHeartbeat = 0;
        public long heartbeatInterval = 0;
        public final AtomicInteger heartbeatCount = new AtomicInteger(0);
        public volatile long lastMessageTime = 0;
    }
}
