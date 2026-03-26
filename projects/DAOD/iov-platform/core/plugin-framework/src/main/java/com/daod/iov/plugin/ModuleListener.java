package com.daod.iov.plugin;

/**
 * 模块监听器接口
 * 用于监听模块的生命周期事件
 */
public interface ModuleListener {
    
    /**
     * 模块加载事件
     * @param module 模块实例
     */
    void onModuleLoaded(IModule module);
    
    /**
     * 模块卸载事件
     * @param moduleId 模块ID
     */
    void onModuleUnloaded(String moduleId);
    
    /**
     * 模块启动事件
     * @param module 模块实例
     */
    void onModuleStarted(IModule module);
    
    /**
     * 模块停止事件
     * @param module 模块实例
     */
    void onModuleStopped(IModule module);
    
    /**
     * 模块更新事件
     * @param moduleId 模块ID
     * @param oldVersion 旧版本
     * @param newVersion 新版本
     */
    void onModuleUpdated(String moduleId, String oldVersion, String newVersion);
    
    /**
     * 模块错误事件
     * @param moduleId 模块ID
     * @param error 错误信息
     */
    void onModuleError(String moduleId, Throwable error);
    
    /**
     * 模块状态变更事件
     * @param moduleId 模块ID
     * @param oldState 旧状态
     * @param newState 新状态
     */
    void onModuleStateChanged(String moduleId, ModuleState oldState, ModuleState newState);
}