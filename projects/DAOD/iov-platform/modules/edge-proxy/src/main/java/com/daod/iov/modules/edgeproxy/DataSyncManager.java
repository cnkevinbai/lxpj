package com.daod.iov.modules.edgeproxy;

import com.daod.iov.plugin.ModuleException;

import java.nio.ByteBuffer;
import java.util.Base64;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

/**
 * 数据同步管理器
 * 实现数据上行同步、离线缓存和断点续传
 */
public class DataSyncManager {
    
    // 同步间隔
    private final long syncInterval;
    
    // 离线缓存大小限制
    private final int maxCacheSize;
    
    // 是否启用压缩
    private final boolean enableCompression;
    
    // 离线缓存队列
    private final ConcurrentLinkedQueue<String> offlineCache;
    
    // 最后同步时间戳
    private volatile long lastSyncTime;
    
    // 同步状态
    private volatile boolean running;
    
    // 任务句柄
    private volatile Thread syncThread;

    public DataSyncManager(long syncInterval, int maxCacheSize, boolean enableCompression) {
        this.syncInterval = syncInterval;
        this.maxCacheSize = maxCacheSize;
        this.enableCompression = enableCompression;
        this.offlineCache = new ConcurrentLinkedQueue<>();
        this.lastSyncTime = 0;
        this.running = false;
    }

    /**
     * 启动数据同步
     */
    public synchronized void start() {
        if (running) {
            return;
        }
        
        running = true;
        lastSyncTime = System.currentTimeMillis();
        
        syncThread = new Thread(this::syncLoop, "data-sync-" + System.nanoTime());
        syncThread.setDaemon(true);
        syncThread.start();
        
        System.out.println("数据同步管理器启动");
    }

    /**
     * 停止数据同步
     */
    public synchronized void stop() {
        if (!running) {
            return;
        }
        
        running = false;
        
        if (syncThread != null) {
            syncThread.interrupt();
            try {
                syncThread.join(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        
        System.out.println("数据同步管理器停止");
    }

    /**
     * 同步循环
     */
    private void syncLoop() {
        while (running) {
            try {
                long now = System.currentTimeMillis();
                
                // 检查是否需要同步
                if (now - lastSyncTime >= syncInterval) {
                    syncData();
                    lastSyncTime = now;
                }
                
                // 等待下次同步
                Thread.sleep(1000);
                
            } catch (InterruptedException e) {
                if (running) {
                    Thread.currentThread().interrupt();
                }
                break;
            } catch (Exception e) {
                System.err.println("数据同步异常: " + e.getMessage());
            }
        }
    }

    /**
     * 执行数据同步
     */
    private void syncData() {
        if (offlineCache.isEmpty()) {
            return;
        }
        
        System.out.println("开始同步离线数据, 缓存大小: " + offlineCache.size());
        
        // TODO: 实际同步到云端
        // 这里模拟同步过程
        
        int synced = 0;
        String data;
        while ((data = offlineCache.poll()) != null) {
            synced++;
            if (synced >= 100) { // 限制每次同步数量
                break;
            }
        }
        
        System.out.println("同步完成: " + synced + " 条数据");
    }

    /**
     * 缓存数据
     */
    public void cacheData(String data) {
        // 压缩数据（如果启用）
        if (enableCompression) {
            data = compress(data);
        }
        
        // Base64编码
        data = Base64.getEncoder().encodeToString(data.getBytes());
        
        // 添加到缓存
        if (offlineCache.size() >= maxCacheSize) {
            // 移除最旧的数据
            offlineCache.poll();
        }
        
        offlineCache.offer(data);
    }

    /**
     * 获取缓存数据
     */
    public String getCachedData() {
        String data = offlineCache.poll();
        if (data == null) {
            return null;
        }
        
        // Base64解码
        byte[] bytes = Base64.getDecoder().decode(data);
        
        // 解压缩（如果启用）
        if (enableCompression) {
            bytes = decompress(bytes);
        }
        
        return new String(bytes);
    }

    /**
     * 清理过期数据
     */
    public void cleanup() {
        System.out.println("清理离线缓存");
        
        // 可以根据需要清理过期数据
        // 这里只是简单清理
    }

    /**
     * 获取缓存大小
     */
    public int getCacheSize() {
        return offlineCache.size();
    }

    /**
     * 压缩数据
     */
    private String compress(String data) {
        try {
            byte[] bytes = data.getBytes("UTF-8");
            Deflater deflater = new Deflater();
            deflater.setInput(bytes);
            deflater.finish();
            
            byte[] buffer = new byte[1024];
            int compressedSize = deflater.deflate(buffer);
            
            return new String(buffer, 0, compressedSize, "UTF-8");
        } catch (Exception e) {
            System.err.println("数据压缩失败: " + e.getMessage());
            return data;
        }
    }

    /**
     * 解压缩数据
     */
    private byte[] decompress(byte[] data) {
        try {
            Inflater inflater = new Inflater();
            inflater.setInput(data);
            
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer.array());
                buffer.position(buffer.position() + count);
            }
            
            return buffer.array();
        } catch (Exception e) {
            System.err.println("数据解压缩失败: " + e.getMessage());
            return data;
        }
    }

    /**
     * 销毁
     */
    public void destroy() {
        stop();
        offlineCache.clear();
    }
}
