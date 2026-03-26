package com.daod.iov.modules.edgegateway;

import com.daod.iov.plugin.*;
import com.daod.iov.modules.edgegateway.api.*;
import com.daod.iov.modules.edgegateway.internal.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * 边缘网关模块
 * 
 * 实现 ISFU 标准化功能单元接口
 * 提供边缘计算、协议转换、数据预处理能力
 * 
 * @author daod-team
 * @version 1.0.0
 */
public class EdgeGatewayModule implements ISFU {
    
    private static final Logger log = LoggerFactory.getLogger(EdgeGatewayModule.class);
    
    // ==================== 元数据 ====================
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    // ==================== 服务 ====================
    
    private EdgeGatewayServiceImpl gatewayService;
    
    /**
     * 构造函数
     */
    public EdgeGatewayModule() {
        this.metadata = ModuleMetadata.builder()
            .name("edge-gateway")
            .version("1.0.0")
            .description("边缘网关模块")
            .type("edge")
            .priority(30)
            .build();
    }
    
    // ==================== 生命周期 ====================
    
    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        this.context = context;
        log.info("[EdgeGateway] 初始化中...");
        
        try {
            gatewayService = new EdgeGatewayServiceImpl();
            
            state = ModuleState.INITIALIZED;
            healthStatus = HealthStatus.HEALTHY;
            
            log.info("[EdgeGateway] 初始化完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            healthStatus = HealthStatus.UNHEALTHY;
            throw new ModuleException("INIT_FAILED", "初始化失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void start() throws ModuleException {
        log.info("[EdgeGateway] 启动中...");
        
        try {
            gatewayService.start();
            
            context.getServiceRegistry().register(EdgeGatewayService.class, gatewayService);
            
            state = ModuleState.RUNNING;
            healthStatus = HealthStatus.HEALTHY;
            
            log.info("[EdgeGateway] 启动完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            throw new ModuleException("START_FAILED", "启动失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void stop() throws ModuleException {
        log.info("[EdgeGateway] 停止中...");
        
        try {
            gatewayService.stop();
            
            state = ModuleState.STOPPED;
            healthStatus = HealthStatus.OFFLINE;
            
            log.info("[EdgeGateway] 已停止");
        } catch (Exception e) {
            throw new ModuleException("STOP_FAILED", "停止失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void destroy() throws ModuleException {
        log.info("[EdgeGateway] 销毁中...");
        
        gatewayService = null;
        
        state = ModuleState.DESTROYED;
        
        log.info("[EdgeGateway] 已销毁");
    }
    
    // ==================== 状态查询 ====================
    
    @Override
    public ModuleMetadata getMetadata() {
        return metadata;
    }
    
    @Override
    public ModuleState getState() {
        return state;
    }
    
    @Override
    public HealthStatus getHealthStatus() {
        return healthStatus;
    }
    
    // ==================== 监控指标 ====================
    
    @Override
    public List<Metric> getMetrics() {
        if (gatewayService == null) {
            return List.of();
        }
        
        EdgeGatewayStatus status = gatewayService.getStatus();
        
        return List.of(
            new Metric("edge_connected_devices", status.getConnectedDevices()),
            new Metric("edge_queue_size", status.getQueueSize()),
            new Metric("edge_cpu_usage", status.getCpuUsage()),
            new Metric("edge_memory_usage", status.getMemoryUsage())
        );
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        boolean healthy = healthStatus == HealthStatus.HEALTHY && 
                          state == ModuleState.RUNNING &&
                          gatewayService != null &&
                          gatewayService.getConnectionStatus() == ConnectionStatus.CONNECTED;
        
        return HealthCheckResult.builder()
            .healthy(healthy)
            .message(healthy ? "边缘网关运行正常" : "边缘网关异常")
            .timestamp(System.currentTimeMillis())
            .build();
    }
    
    // ==================== API 规范 ====================
    
    @Override
    public String getApiSpecification() {
        return "/api/edge/openapi.yaml";
    }
    
    @Override
    public List<ApiDependency> getApiDependencies() {
        return List.of();
    }
    
    // ==================== 沙箱配置 ====================
    
    @Override
    public List<Permission> getRequiredPermissions() {
        return List.of(
            Permission.NETWORK_CONNECT,
            Permission.FILE_READ,
            Permission.FILE_WRITE
        );
    }
    
    @Override
    public ResourceRequirements getResourceRequirements() {
        return ResourceRequirements.builder()
            .cpu("300m")
            .memory("512Mi")
            .maxConnections(5000)
            .build();
    }
}