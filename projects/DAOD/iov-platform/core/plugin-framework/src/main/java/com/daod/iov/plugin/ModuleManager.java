package com.daod.iov.plugin;

import java.util.List;
import java.util.Map;

/**
 * 模块管理器接口
 * 负责模块的生命周期管理、依赖管理、热更新等功能
 */
public interface ModuleManager {
    
    /**
     * 初始化模块管理器
     */
    void initialize() throws ModuleException;
    
    /**
     * 加载模块
     * @param modulePath 模块路径
     * @return 模块实例
     */
    IModule loadModule(String modulePath) throws ModuleException;
    
    /**
     * 卸载模块
     * @param moduleId 模块ID
     */
    void unloadModule(String moduleId) throws ModuleException;
    
    /**
     * 启动模块
     * @param moduleId 模块ID
     */
    void startModule(String moduleId) throws ModuleException;
    
    /**
     * 停止模块
     * @param moduleId 模块ID
     */
    void stopModule(String moduleId) throws ModuleException;
    
    /**
     * 更新模块（热更新）
     * @param moduleId 模块ID
     * @param newModulePath 新模块路径
     */
    void updateModule(String moduleId, String newModulePath) throws ModuleException;
    
    /**
     * 获取模块
     * @param moduleId 模块ID
     * @return 模块实例
     */
    IModule getModule(String moduleId);
    
    /**
     * 获取所有模块
     * @return 模块列表
     */
    List<IModule> getAllModules();
    
    /**
     * 获取模块状态
     * @param moduleId 模块ID
     * @return 模块状态
     */
    ModuleState getModuleState(String moduleId);
    
    /**
     * 获取模块健康状态
     * @param moduleId 模块ID
     * @return 健康状态
     */
    HealthStatus getModuleHealth(String moduleId);
    
    /**
     * 检查模块依赖
     * @param moduleId 模块ID
     * @return 依赖检查结果
     */
    boolean checkDependencies(String moduleId);
    
    /**
     * 解析模块依赖关系
     * @param modules 模块列表
     * @return 依赖关系图
     */
    Map<String, List<String>> resolveDependencies(List<String> modules);
    
    /**
     * 注册模块监听器
     * @param listener 监听器
     */
    void registerModuleListener(ModuleListener listener);
    
    /**
     * 移除模块监听器
     * @param listener 监听器
     */
    void unregisterModuleListener(ModuleListener listener);
    
    /**
     * 关闭模块管理器
     */
    void shutdown();
}