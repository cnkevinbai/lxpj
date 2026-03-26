package com.daod.iov.modules.edgeproxy;

/**
 * 数据同步处理器
 * 实现不同数据同步策略
 */
public interface DataSyncHandler {
    
    /**
     * 同步数据
     */
    void syncData(String edgeNodeId, String data);
    
    /**
     * 处理同步结果
     */
    void handleSyncResult(String edgeNodeId, boolean success, String result);
    
    /**
     * 获取同步状态
     */
    String getSyncStatus(String edgeNodeId);
    
    /**
     * 重试同步
     */
    void retrySync(String edgeNodeId);
}
