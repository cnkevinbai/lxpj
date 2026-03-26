package com.daod.iov.plugin.metrics;

import com.daod.iov.plugin.ISFU;
import com.daod.iov.plugin.Metric;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 指标注册表
 * 
 * 管理所有模块的监控指标：
 * - 注册/注销模块指标
 * - Prometheus 格式导出
 * - 指标聚合
 * 
 * @author daod-team
 * @version 1.0.0
 */
public class MetricsRegistry {
    
    private static final Logger logger = LoggerFactory.getLogger(MetricsRegistry.class);
    
    // 模块指标存储
    private final Map<String, ModuleMetrics> moduleMetricsMap = new ConcurrentHashMap<>();
    
    // 全局指标
    private final Map<String, Metric> globalMetrics = new ConcurrentHashMap<>();
    
    // 是否启用
    private volatile boolean enabled = true;
    
    /**
     * 注册模块指标
     * @param moduleId 模块ID
     * @param module 模块实例
     */
    public void registerModule(String moduleId, ISFU module) {
        if (!enabled) return;
        
        ModuleMetrics metrics = new ModuleMetrics(moduleId, module);
        moduleMetricsMap.put(moduleId, metrics);
        
        logger.info("注册模块指标: {}", moduleId);
    }
    
    /**
     * 注销模块指标
     * @param moduleId 模块ID
     */
    public void unregisterModule(String moduleId) {
        moduleMetricsMap.remove(moduleId);
        logger.info("注销模块指标: {}", moduleId);
    }
    
    /**
     * 添加全局指标
     * @param metric 指标
     */
    public void addGlobalMetric(Metric metric) {
        globalMetrics.put(metric.getName(), metric);
    }
    
    /**
     * 移除全局指标
     * @param name 指标名称
     */
    public void removeGlobalMetric(String name) {
        globalMetrics.remove(name);
    }
    
    /**
     * 收集所有指标
     * @return 指标列表
     */
    public List<Metric> collectAllMetrics() {
        List<Metric> allMetrics = new ArrayList<>();
        
        // 添加全局指标
        allMetrics.addAll(globalMetrics.values());
        
        // 添加各模块指标
        for (ModuleMetrics moduleMetrics : moduleMetricsMap.values()) {
            allMetrics.addAll(moduleMetrics.collect());
        }
        
        return allMetrics;
    }
    
    /**
     * 导出 Prometheus 格式指标
     * @return Prometheus 格式字符串
     */
    public String exportPrometheusFormat() {
        StringBuilder sb = new StringBuilder();
        
        // 添加全局指标
        for (Metric metric : globalMetrics.values()) {
            sb.append(metric.toPrometheusFormat());
        }
        
        // 添加各模块指标
        for (ModuleMetrics moduleMetrics : moduleMetricsMap.values()) {
            for (Metric metric : moduleMetrics.collect()) {
                sb.append(metric.toPrometheusFormat());
            }
        }
        
        return sb.toString();
    }
    
    /**
     * 获取模块指标
     * @param moduleId 模块ID
     * @return 模块指标
     */
    public ModuleMetrics getModuleMetrics(String moduleId) {
        return moduleMetricsMap.get(moduleId);
    }
    
    /**
     * 获取所有已注册的模块
     * @return 模块ID列表
     */
    public Set<String> getRegisteredModules() {
        return Set.copyOf(moduleMetricsMap.keySet());
    }
    
    /**
     * 启用/禁用指标收集
     */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
    
    /**
     * 是否启用
     */
    public boolean isEnabled() {
        return enabled;
    }
    
    /**
     * 清空所有指标
     */
    public void clear() {
        moduleMetricsMap.clear();
        globalMetrics.clear();
    }
    
    // ==================== 内部类 ====================
    
    /**
     * 模块指标容器
     */
    public static class ModuleMetrics {
        
        private final String moduleId;
        private final ISFU module;
        private final long registrationTime;
        
        public ModuleMetrics(String moduleId, ISFU module) {
            this.moduleId = moduleId;
            this.module = module;
            this.registrationTime = System.currentTimeMillis();
        }
        
        /**
         * 收集模块指标
         */
        public List<Metric> collect() {
            try {
                return module.getMetrics();
            } catch (Exception e) {
                logger.warn("收集模块指标失败: {}", moduleId, e);
                return List.of();
            }
        }
        
        /**
         * 执行健康检查
         */
        public com.daod.iov.plugin.HealthCheckResult healthCheck() {
            try {
                return module.healthCheck();
            } catch (Exception e) {
                return com.daod.iov.plugin.HealthCheckResult.unhealthy("健康检查失败", e);
            }
        }
        
        public String getModuleId() { return moduleId; }
        public long getRegistrationTime() { return registrationTime; }
        public ISFU getModule() { return module; }
    }
}