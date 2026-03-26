package com.daod.iov.modules.eventbus;

import com.daod.iov.plugin.*;
import com.daod.iov.modules.eventbus.api.EventBus;
import com.daod.iov.modules.eventbus.internal.EventBusImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * 事件总线模块
 * 
 * 提供模块间异步通信能力
 */
public class EventBusModule implements ISFU {
    
    private static final Logger log = LoggerFactory.getLogger(EventBusModule.class);
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    private EventBusImpl eventBus;
    
    public EventBusModule() {
        this.metadata = ModuleMetadata.builder()
            .name("event-bus")
            .version("1.0.0")
            .description("事件总线模块 - 模块间异步通信")
            .type("core")
            .priority(5)
            .build();
    }
    
    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        this.context = context;
        log.info("事件总线模块初始化中...");
        
        try {
            // 创建事件总线实例
            eventBus = new EventBusImpl();
            
            // 注册到服务注册中心
            context.getServiceRegistry().register(EventBus.class, eventBus);
            
            state = ModuleState.INITIALIZED;
            healthStatus = HealthStatus.HEALTHY;
            
            log.info("事件总线模块初始化完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            healthStatus = HealthStatus.UNHEALTHY;
            throw new ModuleException("INIT_FAILED", "初始化失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void start() throws ModuleException {
        log.info("事件总线模块启动中...");
        
        try {
            eventBus.start();
            
            state = ModuleState.RUNNING;
            healthStatus = HealthStatus.HEALTHY;
            
            log.info("事件总线模块启动完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            throw new ModuleException("START_FAILED", "启动失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void stop() throws ModuleException {
        log.info("事件总线模块停止中...");
        
        try {
            eventBus.stop();
            
            state = ModuleState.STOPPED;
            healthStatus = HealthStatus.OFFLINE;
            
            log.info("事件总线模块已停止");
        } catch (Exception e) {
            throw new ModuleException("STOP_FAILED", "停止失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void destroy() throws ModuleException {
        log.info("事件总线模块销毁中...");
        
        eventBus = null;
        
        state = ModuleState.DESTROYED;
        
        log.info("事件总线模块已销毁");
    }
    
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
    
    @Override
    public List<Metric> getMetrics() {
        return List.of(
            new Metric("event_bus_queue_size", eventBus != null ? eventBus.getQueueSize() : 0)
        );
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.builder()
            .healthy(healthStatus == HealthStatus.HEALTHY && 
                     state == ModuleState.RUNNING &&
                     eventBus != null)
            .message("事件总线运行正常")
            .timestamp(System.currentTimeMillis())
            .build();
    }
    
    @Override
    public String getApiSpecification() {
        return null;
    }
    
    @Override
    public List<ApiDependency> getApiDependencies() {
        return List.of();
    }
    
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
            .cpu("100m")
            .memory("128Mi")
            .maxConnections(500)
            .build();
    }
    
    /**
     * 获取事件总线实例
     */
    public EventBus getEventBus() {
        return eventBus;
    }
}