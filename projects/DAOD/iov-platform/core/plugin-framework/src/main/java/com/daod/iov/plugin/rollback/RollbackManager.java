package com.daod.iov.plugin.rollback;

import java.util.List;

/**
 * 回滚管理器接口
 * 
 * 负责模块的备份和回滚：
 * - 自动备份模块版本
 * - 熔断时自动回滚
 * - 版本历史管理
 * 
 * @author daod-team
 * @version 1.0.0
 */
public interface RollbackManager {
    
    /**
     * 创建备份点
     * @param moduleId 模块ID
     * @return 备份ID
     * @throws RollbackException 备份失败
     */
    String createBackup(String moduleId) throws RollbackException;
    
    /**
     * 回滚到指定备份点
     * @param moduleId 模块ID
     * @param backupId 备份ID
     * @throws RollbackException 回滚失败
     */
    void rollback(String moduleId, String backupId) throws RollbackException;
    
    /**
     * 回滚到上一个版本
     * @param moduleId 模块ID
     * @throws RollbackException 回滚失败
     */
    void rollbackToPrevious(String moduleId) throws RollbackException;
    
    /**
     * 自动回滚 (熔断触发)
     * @param moduleId 模块ID
     * @return 是否成功
     */
    boolean autoRollback(String moduleId);
    
    /**
     * 获取备份列表
     * @param moduleId 模块ID
     * @return 备份信息列表
     */
    List<BackupInfo> listBackups(String moduleId);
    
    /**
     * 获取最新备份
     * @param moduleId 模块ID
     * @return 备份信息
     */
    BackupInfo getLatestBackup(String moduleId);
    
    /**
     * 删除备份
     * @param moduleId 模块ID
     * @param backupId 备份ID
     */
    void deleteBackup(String moduleId, String backupId);
    
    /**
     * 清理过期备份
     * @param moduleId 模块ID
     * @param keepCount 保留数量
     */
    void cleanupOldBackups(String moduleId, int keepCount);
    
    /**
     * 启用/禁用自动回滚
     * @param enabled 是否启用
     */
    void setAutoRollbackEnabled(boolean enabled);
    
    /**
     * 是否启用自动回滚
     * @return 是否启用
     */
    boolean isAutoRollbackEnabled();
}