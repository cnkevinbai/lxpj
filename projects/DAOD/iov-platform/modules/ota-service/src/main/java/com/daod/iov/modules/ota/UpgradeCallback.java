package com.daod.iov.modules.ota;

/**
 * OTA升级回调接口
 */
public interface UpgradeCallback {
    
    /**
     * 升级进度更新
     */
    void onProgress(String taskId, int progress);
    
    /**
     * 升级状态变更
     */
    void onStatusChange(String taskId, String status);
    
    /**
     * 升级完成
     */
    void onComplete(String taskId, boolean success, String message);
    
    /**
     * 升级失败
     */
    void onFailure(String taskId, String reason);
    
    /**
     * 回滚开始
     */
    void onRollbackStart(String taskId);
    
    /**
     * 回滚完成
     */
    void onRollbackComplete(String taskId, boolean success, String message);
}
