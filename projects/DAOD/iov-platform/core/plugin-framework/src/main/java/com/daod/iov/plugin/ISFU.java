package com.daod.iov.plugin;

import java.util.List;
import java.util.Map;

/**
 * 标准化功能单元接口 (SFU - Standardized Functional Unit)
 * 
 * 所有业务模块必须实现此接口，提供：
 * - 标准化的生命周期管理
 * - 可观测性指标
 * - API 规范定义
 * - 沙箱安全配置
 * 
 * @author daod-team
 * @version 2.0.0
 */
public interface ISFU extends IModule {
    
    // ==================== 元数据 ====================
    
    /**
     * 获取模块元数据
     * @return 模块元数据
     */
    ModuleMetadata getMetadata();
    
    // ==================== 生命周期 ====================
    
    /**
     * 初始化模块
     * @param context 模块上下文
     * @throws ModuleException 初始化失败
     */
    void initialize(ModuleContext context) throws ModuleException;
    
    /**
     * 启动模块
     * @throws ModuleException 启动失败
     */
    void start() throws ModuleException;
    
    /**
     * 停止模块 (优雅停机)
     * @throws ModuleException 停止失败
     */
    void stop() throws ModuleException;
    
    /**
     * 销毁模块
     * @throws ModuleException 销毁失败
     */
    void destroy() throws ModuleException;
    
    // ==================== 状态查询 ====================
    
    /**
     * 获取模块状态
     * @return 模块状态
     */
    ModuleState getState();
    
    /**
     * 获取健康状态
     * @return 健康状态
     */
    HealthStatus getHealthStatus();
    
    // ==================== 可观测性 (Observability) ====================
    
    /**
     * 获取监控指标列表
     * 返回 Prometheus 格式的指标数据
     * @return 指标列表
     */
    List<Metric> getMetrics();
    
    /**
     * 执行健康检查
     * @return 健康检查结果
     */
    HealthCheckResult healthCheck();
    
    /**
     * 获取指标端点路径
     * @return Prometheus 指标路径 (如 /metrics)
     */
    default String getMetricsEndpoint() {
        return "/metrics";
    }
    
    // ==================== API 规范 ====================
    
    /**
     * 获取 API 规范文档路径
     * @return OpenAPI 规范文件路径
     */
    String getApiSpecification();
    
    /**
     * 获取 API 依赖列表
     * @return 此模块消费的 API 列表
     */
    List<ApiDependency> getApiDependencies();
    
    /**
     * 获取提供的 API 列表
     * @return 此模块提供的 API 列表
     */
    default List<ApiDefinition> getProvidedApis() {
        return List.of();
    }
    
    // ==================== 沙箱安全配置 ====================
    
    /**
     * 获取所需权限列表
     * @return 权限列表
     */
    List<Permission> getRequiredPermissions();
    
    /**
     * 获取资源需求
     * @return 资源需求配置
     */
    ResourceRequirements getResourceRequirements();
    
    /**
     * 获取网络策略
     * @return 网络策略配置
     */
    default NetworkPolicy getNetworkPolicy() {
        return NetworkPolicy.DEFAULT;
    }
    
    // ==================== 版本与兼容性 ====================
    
    /**
     * 检查与指定版本的兼容性
     * @param version 目标版本
     * @return 是否兼容
     */
    default boolean isCompatible(String version) {
        return true;
    }
    
    /**
     * 获取迁移脚本列表
     * @return 数据迁移脚本路径列表
     */
    default List<String> getMigrationScripts() {
        return List.of();
    }
}