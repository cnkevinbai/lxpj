package com.daod.iov.plugin;

import java.util.ArrayList;
import java.util.List;

/**
 * API 定义
 */
public class ApiDefinition {
    
    private String name;           // API 名称
    private String version;        // API 版本
    private List<ApiEndpoint> endpoints;  // 端点列表
    private String openapiPath;    // OpenAPI 文档路径
    
    public ApiDefinition() {
        this.endpoints = new ArrayList<>();
    }
    
    public ApiDefinition(String name, String version) {
        this();
        this.name = name;
        this.version = version;
    }
    
    public ApiDefinition(String name, String version, List<ApiEndpoint> endpoints) {
        this.name = name;
        this.version = version;
        this.endpoints = endpoints != null ? endpoints : new ArrayList<>();
    }
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public List<ApiEndpoint> getEndpoints() { return endpoints; }
    public void setEndpoints(List<ApiEndpoint> endpoints) { this.endpoints = endpoints; }
    
    public String getOpenapiPath() { return openapiPath; }
    public void setOpenapiPath(String openapiPath) { this.openapiPath = openapiPath; }
    
    /**
     * API 端点
     */
    public static class ApiEndpoint {
        
        private String path;        // 路径
        private String method;      // HTTP 方法
        private String description; // 描述
        private boolean deprecated; // 是否废弃
        
        public ApiEndpoint() {}
        
        public ApiEndpoint(String path, String method, String description) {
            this.path = path;
            this.method = method;
            this.description = description;
            this.deprecated = false;
        }
        
        // Getters and Setters
        public String getPath() { return path; }
        public void setPath(String path) { this.path = path; }
        
        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public boolean isDeprecated() { return deprecated; }
        public void setDeprecated(boolean deprecated) { this.deprecated = deprecated; }
    }
}