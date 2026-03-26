package com.daod.iov.plugin.sandbox;

import com.daod.iov.plugin.Permission;

/**
 * 模块沙箱接口
 */
public interface ModuleSandbox {
    
    /**
     * 获取沙箱ID
     */
    String getId();
    
    /**
     * 获取沙箱配置
     */
    SandboxConfig getConfig();
    
    /**
     * 获取沙箱状态
     */
    SandboxStatus getStatus();
    
    /**
     * 是否激活
     */
    boolean isActive();
    
    /**
     * 检查权限是否允许
     * @param permission 权限
     * @return 是否允许
     */
    boolean isPermissionAllowed(Permission permission);
    
    /**
     * 获取资源使用情况
     */
    ResourceUsage getResourceUsage();
    
    /**
     * 检查执行权限
     * @throws SecurityException 权限不足
     */
    void checkExecutionPermission();
    
    /**
     * 记录成功执行
     * @param executionTimeMs 执行时间
     */
    void recordSuccess(long executionTimeMs);
    
    /**
     * 记录执行失败
     * @param error 错误
     */
    void recordFailure(Throwable error);
    
    /**
     * 暂停沙箱
     */
    void pause();
    
    /**
     * 恢复沙箱
     */
    void resume();
    
    /**
     * 销毁沙箱
     */
    void destroy();
}