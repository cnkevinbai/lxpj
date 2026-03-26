package com.daod.iov.plugin;

import java.util.List;
import java.util.Map;

/**
 * 模块元数据
 */
public class ModuleMetadata {
    private String name;           // 模块名称
    private String version;        // 模块版本
    private String description;    // 模块描述
    private String author;         // 作者
    private String license;        // 许可证
    
    private String type;           // 模块类型: core|business|extension|adapter
    private int priority;          // 模块优先级
    private List<Dependency> dependencies;  // 依赖模块
    private Map<String, ExtensionPoint> extensionPoints;  // 提供的扩展点
    private Map<String, String> uses;       // 使用的扩展点
    private Map<String, Object> configSchema;  // 配置项定义
    private Resources resources;   // 资源需求
    private HealthCheck healthCheck;  // 健康检查
    private HotReload hotReload;   // 热更新策略
    private String mainClass;      // 模块主类
    
    // 构造函数
    public ModuleMetadata() {}
    
    public ModuleMetadata(String name, String version, String description) {
        this.name = name;
        this.version = version;
        this.description = description;
    }
    
    // Getter 和 Setter 方法
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getLicense() { return license; }
    public void setLicense(String license) { this.license = license; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }
    
    public List<Dependency> getDependencies() { return dependencies; }
    public void setDependencies(List<Dependency> dependencies) { this.dependencies = dependencies; }
    
    public Map<String, ExtensionPoint> getExtensionPoints() { return extensionPoints; }
    public void setExtensionPoints(Map<String, ExtensionPoint> extensionPoints) { this.extensionPoints = extensionPoints; }
    
    public Map<String, String> getUses() { return uses; }
    public void setUses(Map<String, String> uses) { this.uses = uses; }
    
    public Map<String, Object> getConfigSchema() { return configSchema; }
    public void setConfigSchema(Map<String, Object> configSchema) { this.configSchema = configSchema; }
    
    public Resources getResources() { return resources; }
    public void setResources(Resources resources) { this.resources = resources; }
    
    public HealthCheck getHealthCheck() { return healthCheck; }
    public void setHealthCheck(HealthCheck healthCheck) { this.healthCheck = healthCheck; }
    
    public HotReload getHotReload() { return hotReload; }
    public void setHotReload(HotReload hotReload) { this.hotReload = hotReload; }
    
    public String getMainClass() { return mainClass; }
    public void setMainClass(String mainClass) { this.mainClass = mainClass; }
    
    /**
     * 依赖信息
     */
    public static class Dependency {
        private String name;
        private String version;
        private boolean optional;
        
        public Dependency() {}
        
        public Dependency(String name, String version) {
            this.name = name;
            this.version = version;
        }
        
        // Getter 和 Setter
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getVersion() { return version; }
        public void setVersion(String version) { this.version = version; }
        
        public boolean isOptional() { return optional; }
        public void setOptional(boolean optional) { this.optional = optional; }
    }
    
    /**
     * 扩展点定义
     */
    public static class ExtensionPoint {
        private String name;
        private String interfaceClass;
        private String description;
        
        public ExtensionPoint() {}
        
        public ExtensionPoint(String name, String interfaceClass, String description) {
            this.name = name;
            this.interfaceClass = interfaceClass;
            this.description = description;
        }
        
        // Getter 和 Setter
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getInterfaceClass() { return interfaceClass; }
        public void setInterfaceClass(String interfaceClass) { this.interfaceClass = interfaceClass; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
    
    /**
     * 资源需求
     */
    public static class Resources {
        private String cpu;
        private String memory;
        
        // Getter 和 Setter
        public String getCpu() { return cpu; }
        public void setCpu(String cpu) { this.cpu = cpu; }
        
        public String getMemory() { return memory; }
        public void setMemory(String memory) { this.memory = memory; }
    }
    
    /**
     * 健康检查
     */
    public static class HealthCheck {
        private String liveness;   // 存活探针
        private String readiness;  // 就绪探针
        
        // Getter 和 Setter
        public String getLiveness() { return liveness; }
        public void setLiveness(String liveness) { this.liveness = liveness; }
        
        public String getReadiness() { return readiness; }
        public void setReadiness(String readiness) { this.readiness = readiness; }
    }
    
    /**
     * 热更新策略
     */
    public static class HotReload {
        public static final String STRATEGY_ROLLING = "rolling";
        public static final String STRATEGY_BLUE_GREEN = "blue-green";
        public static final String STRATEGY_CANARY = "canary";
        
        private boolean enabled;
        private String strategy;  // rolling|blue-green|canary
        private int maxUnavailable;
        
        // Getter 和 Setter
        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        
        public String getStrategy() { return strategy; }
        public void setStrategy(String strategy) { this.strategy = strategy; }
        
        public int getMaxUnavailable() { return maxUnavailable; }
        public void setMaxUnavailable(int maxUnavailable) { this.maxUnavailable = maxUnavailable; }
    }
}