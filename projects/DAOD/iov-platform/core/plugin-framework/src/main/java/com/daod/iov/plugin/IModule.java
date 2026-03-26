package com.daod.iov.plugin;

/**
 * 模块基础接口 - 所有模块必须实现
 */
public interface IModule {
    
    /**
     * 获取模块元数据
     */
    ModuleMetadata getMetadata();
    
    /**
     * 模块初始化
     * @param context 模块上下文
     */
    void initialize(ModuleContext context) throws ModuleException;
    
    /**
     * 模块启动
     */
    void start() throws ModuleException;
    
    /**
     * 模块停止
     */
    void stop() throws ModuleException;
    
    /**
     * 模块销毁
     */
    void destroy() throws ModuleException;
    
    /**
     * 获取模块状态
     */
    ModuleState getState();
    
    /**
     * 获取模块健康状态
     */
    HealthStatus getHealthStatus();
}