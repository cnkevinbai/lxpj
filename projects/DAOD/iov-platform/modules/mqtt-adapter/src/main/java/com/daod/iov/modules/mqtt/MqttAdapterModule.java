package com.daod.iov.modules.mqtt;

import com.daod.iov.plugin.*;
import com.daod.iov.modules.mqtt.api.*;
import com.daod.iov.modules.mqtt.internal.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * MQTT 适配器模块
 * 
 * 实现 ISFU 标准化功能单元接口
 * 提供 MQTT 协议适配能力
 * 
 * @author daod-team
 * @version 1.0.0
 */
public class MqttAdapterModule implements ISFU {
    
    private static final Logger log = LoggerFactory.getLogger(MqttAdapterModule.class);
    
    // ==================== 元数据 ====================
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    // ==================== 服务 ====================
    
    private MqttAdapterService adapterService;
    
    /**
     * 构造函数
     */
    public MqttAdapterModule() {
        this.metadata = ModuleMetadata.builder()
            .name("mqtt-adapter")
            .version("1.0.0")
            .description("MQTT 协议适配器")
            .type("adapter")
            .priority(20)
            .build();
    }
    
    // ==================== 生命周期 ====================
    
    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        this.context = context;
        log.info("[MqttAdapter] 初始化中...");
        
        try {
            // 创建服务
            adapterService = new MqttAdapterServiceImpl();
            
            state = ModuleState.INITIALIZED;
            healthStatus = HealthStatus.HEALTHY;
            
            log.info("[MqttAdapter] 初始化完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            healthStatus = HealthStatus.UNHEALTHY;
            throw new ModuleException("INIT_FAILED", "初始化失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void start() throws ModuleException {
        log.info("[MqttAdapter] 启动中...");
        
        try {
            // 启动 MQTT 服务
            adapterService.start(1883);
            
            // 注册服务
            context.getServiceRegistry().register(MqttAdapterService.class, adapterService);
            
            state = ModuleState.RUNNING;
            healthStatus = HealthStatus.HEALTHY;
            
            log.info("[MqttAdapter] 启动完成，监听端口 1883");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            throw new ModuleException("START_FAILED", "启动失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void stop() throws ModuleException {
        log.info("[MqttAdapter] 停止中...");
        
        try {
            adapterService.stop();
            
            state = ModuleState.STOPPED;
            healthStatus = HealthStatus.OFFLINE;
            
            log.info("[MqttAdapter] 已停止");
        } catch (Exception e) {
            throw new ModuleException("STOP_FAILED", "停止失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void destroy() throws ModuleException {
        log.info("[MqttAdapter] 销毁中...");
        
        adapterService = null;
        
        state = ModuleState.DESTROYED;
        
        log.info("[MqttAdapter] 已销毁");
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
        return List.of(
            new Metric("mqtt_online_clients", 
                adapterService != null ? adapterService.getOnlineClientCount() : 0)
        );
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.builder()
            .healthy(healthStatus == HealthStatus.HEALTHY && state == ModuleState.RUNNING)
            .message("MQTT 适配器运行正常")
            .timestamp(System.currentTimeMillis())
            .build();
    }
    
    // ==================== API 规范 ====================
    
    @Override
    public String getApiSpecification() {
        return "/api/mqtt/openapi.yaml";
    }
    
    @Override
    public List<ApiDependency> getApiDependencies() {
        return List.of(
            new ApiDependency("vehicle-api", "vehicle-access", "^1.0.0")
        );
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
            .cpu("200m")
            .memory("256Mi")
            .maxConnections(10000)
            .build();
    }
}