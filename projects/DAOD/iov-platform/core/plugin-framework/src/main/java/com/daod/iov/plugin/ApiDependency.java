package com.daod.iov.plugin;

/**
 * API 依赖定义
 */
public class ApiDependency {
    
    private String name;           // API 名称
    private String provider;       // 提供者模块
    private String version;        // 版本要求
    private boolean required;      // 是否必需
    
    public ApiDependency() {}
    
    public ApiDependency(String name, String provider, String version) {
        this.name = name;
        this.provider = provider;
        this.version = version;
        this.required = true;
    }
    
    public ApiDependency(String name, String provider, String version, boolean required) {
        this.name = name;
        this.provider = provider;
        this.version = version;
        this.required = required;
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public boolean isRequired() { return required; }
    public void setRequired(boolean required) { this.required = required; }
}