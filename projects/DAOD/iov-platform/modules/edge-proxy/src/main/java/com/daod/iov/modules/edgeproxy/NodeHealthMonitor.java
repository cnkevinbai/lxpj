package com.daod.iov.modules.edgeproxy;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 边缘节点健康监控器
 * 实现边缘节点健康状态监控和告警
 */
public class NodeHealthMonitor {
    
    private final EdgeProxyService service;
    
    private final NodeHealthStatus status;
    
    // 监控周期
    private static final long MONITOR_INTERVAL = 30000; // 30秒
    
    // 最大内存使用阈值（百分比）
    private static final double MAX_MEMORY_USAGE = 90.0;
    
    // 最大 CPU 使用阈值（百分比）
    private static final double MAX_CPU_USAGE = 85.0;
    
    // 网络延迟阈值（毫秒）
    private static final int MAX_NETWORK_LATENCY = 500;
    
    // 运行状态
    private volatile boolean running;
    
    // 线程池
    private ScheduledExecutorService scheduler;
    
    // 心跳次数计数器
    private final AtomicLong heartbeatCount;
    
    // 上次监控时间
    private volatile long lastMonitorTime;

    public NodeHealthMonitor(EdgeProxyService service) {
        this.service = service;
        this.status = new NodeHealthStatus();
        this.heartbeatCount = new AtomicLong(0);
        this.lastMonitorTime = 0;
        this.running = false;
    }

    /**
     * 启动监控
     */
    public synchronized void start() {
        if (running) {
            return;
        }
        
        running = true;
        lastMonitorTime = System.currentTimeMillis();
        
        scheduler = Executors.newScheduledThreadPool(1, r -> {
            Thread t = new Thread(r, "health-monitor-" + System.nanoTime());
            t.setDaemon(true);
            return t;
        });
        
        scheduler.scheduleWithFixedDelay(
            this::monitor,
            0, MONITOR_INTERVAL, TimeUnit.MILLISECONDS
        );
        
        System.out.println("健康监控器启动");
    }

    /**
     * 停止监控
     */
    public synchronized void stop() {
        if (!running) {
            return;
        }
        
        running = false;
        
        if (scheduler != null) {
            scheduler.shutdown();
            try {
                if (!scheduler.awaitTermination(3, TimeUnit.SECONDS)) {
                    scheduler.shutdownNow();
                }
            } catch (InterruptedException e) {
                scheduler.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
        
        System.out.println("健康监控器停止");
    }

    /**
     * 执行监控
     */
    private void monitor() {
        try {
            long now = System.currentTimeMillis();
            
            // 检查心跳
            checkHeartbeat(now);
            
            // 检查资源使用
            checkResourceUsage();
            
            // 检查网络状态
            checkNetworkState();
            
            // 更新最后监控时间
            lastMonitorTime = now;
            
        } catch (Exception e) {
            System.err.println("健康监控异常: " + e.getMessage());
        }
    }

    /**
     * 检查心跳
     */
    private void checkHeartbeat(long now) {
        NodeHealthStatus info = service.getNodeHealthStatus();
        
        if (info != null) {
            status.setLastHeartbeat(info.getLastHeartbeat());
            status.setUptime(now - info.getLastHeartbeat());
            heartbeatCount.incrementAndGet();
        }
        
        // 检查是否在线
        boolean online = service.isConnected();
        status.setOnline(online);
        
        if (online) {
            status.setStatus("healthy");
        } else {
            status.setStatus("offline");
        }
    }

    /**
     * 检查资源使用
     */
    private void checkResourceUsage() {
        // 获取系统资源使用情况（模拟）
        double cpuUsage = getCurrentCpuUsage();
        double memoryUsage = getCurrentMemoryUsage();
        
        status.setCpuUsage(cpuUsage);
        status.setMemoryUsage(memoryUsage);
        
        // 检查是否超限
        if (cpuUsage > MAX_CPU_USAGE || memoryUsage > MAX_MEMORY_USAGE) {
            if (status.getStatus().equals("healthy")) {
                status.setStatus("warning");
            }
        }
    }

    /**
     * 获取当前 CPU 使用率（模拟）
     */
    private double getCurrentCpuUsage() {
        // TODO: 实际获取 CPU 使用率
        // 这里返回模拟值
        return Math.random() * 50;
    }

    /**
     * 获取当前内存使用率（模拟）
     */
    private double getCurrentMemoryUsage() {
        // TODO: 实际获取内存使用率
        // 这里返回模拟值
        return Math.random() * 60;
    }

    /**
     * 检查网络状态
     */
    private void checkNetworkState() {
        int latency = getNetworkLatency();
        status.setNetworkLatency(latency);
        
        if (latency > MAX_NETWORK_LATENCY) {
            if (status.getStatus().equals("healthy")) {
                status.setStatus("warning");
            }
        }
    }

    /**
     * 获取网络延迟（模拟）
     */
    private int getNetworkLatency() {
        // TODO: 实际测量网络延迟
        // 这里返回模拟值
        return (int) (Math.random() * 200);
    }

    /**
     * 获取健康状态
     */
    public NodeHealthStatus getStatus() {
        return status;
    }

    /**
     * 销毁
     */
    public void destroy() {
        stop();
    }
}
