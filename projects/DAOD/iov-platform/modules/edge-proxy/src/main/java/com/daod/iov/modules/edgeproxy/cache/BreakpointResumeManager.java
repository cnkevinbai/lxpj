package com.daod.iov.modules.edgeproxy.cache;

import java.nio.charset.StandardCharsets;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 数据断点续传管理器
 */
public class BreakpointResumeManager {
    
    // 传输会话
    private final ConcurrentHashMap<String, TransferSession> sessions;
    
    // 缓存文件块
    private final ConcurrentHashMap<String, byte[]> cache;
    
    // 块大小（默认1MB）
    private static final int BLOCK_SIZE = 1024 * 1024;
    
    // 最大会话数
    private static final int MAX_SESSIONS = 100;

    public BreakpointResumeManager() {
        this.sessions = new ConcurrentHashMap<>();
        this.cache = new ConcurrentHashMap<>();
    }

    /**
     * 创建传输会话
     */
    public TransferSession createSession(String fileId, long totalSize) {
        if (sessions.size() >= MAX_SESSIONS) {
            return null;
        }
        
        TransferSession session = new TransferSession(fileId, totalSize);
        sessions.put(fileId, session);
        return session;
    }

    /**
     * 获取传输会话
     */
    public TransferSession getSession(String fileId) {
        return sessions.get(fileId);
    }

    /**
     * 删除传输会话
     */
    public TransferSession removeSession(String fileId) {
        return sessions.remove(fileId);
    }

    /**
     * 缓存数据块
     */
    public void cacheBlock(String fileId, int blockIndex, byte[] data) {
        String key = fileId + ":" + blockIndex;
        cache.put(key, data);
        
        TransferSession session = sessions.get(fileId);
        if (session != null) {
            session.cachedBlocks.incrementAndGet();
        }
    }

    /**
     * 获取数据块
     */
    public byte[] getCachedBlock(String fileId, int blockIndex) {
        String key = fileId + ":" + blockIndex;
        return cache.get(key);
    }

    /**
     * 获取缓存大小
     */
    public int getCacheSize() {
        return cache.size();
    }

    /**
     * 清空缓存
     */
    public void clearCache() {
        cache.clear();
    }

    /**
     * 传输会话内部类
     */
    public static class TransferSession {
        private String fileId;
        private long totalSize;
        private long currentOffset;
        private AtomicInteger totalBlocks = new AtomicInteger(0);
        private AtomicInteger cachedBlocks = new AtomicInteger(0);
        
        public TransferSession(String fileId, long totalSize) {
            this.fileId = fileId;
            this.totalSize = totalSize;
            this.totalBlocks.set((int) ((totalSize + BLOCK_SIZE - 1) / BLOCK_SIZE));
        }

        public String getFileId() { return fileId; }
        public long getTotalSize() { return totalSize; }
        public long getCurrentOffset() { return currentOffset; }
        public void setCurrentOffset(long offset) { this.currentOffset = offset; }
        public int getTotalBlocks() { return totalBlocks.get(); }
        public int getCachedBlocks() { return cachedBlocks.get(); }
    }
}
