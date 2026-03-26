package com.daod.iov.plugin;

import com.daod.iov.plugin.impl.DefaultModuleManager;

/**
 * 模块管理器工厂类
 * 用于创建和管理模块管理器实例
 */
public class ModuleManagerFactory {
    
    private static volatile ModuleManager instance;
    
    /**
     * 获取模块管理器单例实例
     * 
     * @return 模块管理器实例
     */
    public static ModuleManager getInstance() {
        if (instance == null) {
            synchronized (ModuleManagerFactory.class) {
                if (instance == null) {
                    instance = new DefaultModuleManager();
                }
            }
        }
        return instance;
    }
    
    /**
     * 创建新的模块管理器实例
     * 
     * @return 新的模块管理器实例
     */
    public static ModuleManager createNewInstance() {
        return new DefaultModuleManager();
    }
    
    /**
     * 初始化模块管理器
     * 
     * @throws ModuleException 初始化异常
     */
    public static void initialize() throws ModuleException {
        ModuleManager manager = getInstance();
        manager.initialize();
    }
    
    /**
     * 关闭模块管理器
     */
    public static void shutdown() {
        if (instance != null) {
            instance.shutdown();
            instance = null;
        }
    }
}