package com.daod.iov.plugin;

import java.util.Map;

/**
 * 模块上下文
 */
public class ModuleContext {
    private String moduleId;           // 模块ID
    private String modulePath;         // 模块路径
    private Map<String, Object> config; // 模块配置
    private ModuleManager moduleManager; // 模块管理器引用
    private ClassLoader classLoader;   // 模块类加载器
    
    public ModuleContext() {}
    
    public ModuleContext(String moduleId, String modulePath, Map<String, Object> config) {
        this.moduleId = moduleId;
        this.modulePath = modulePath;
        this.config = config;
    }
    
    // Getter 和 Setter 方法
    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }
    
    public String getModulePath() { return modulePath; }
    public void setModulePath(String modulePath) { this.modulePath = modulePath; }
    
    public Map<String, Object> getConfig() { return config; }
    public void setConfig(Map<String, Object> config) { this.config = config; }
    
    public ModuleManager getModuleManager() { return moduleManager; }
    public void setModuleManager(ModuleManager moduleManager) { this.moduleManager = moduleManager; }
    
    public ClassLoader getClassLoader() { return classLoader; }
    public void setClassLoader(ClassLoader classLoader) { this.classLoader = classLoader; }
}