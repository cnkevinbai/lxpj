package com.daod.iov.modules.planning;

import com.daod.iov.plugin.*;
import com.daod.iov.modules.planning.api.*;
import com.daod.iov.modules.planning.internal.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * 规划服务模块
 * 
 * 实现 ISFU 标准化功能单元接口
 * 提供路径规划、行程规划、车队调度、资源推荐能力
 * 
 * @author daod-team
 * @version 1.0.0
 */
public class PlanningModule implements ISFU {
    
    private static final Logger log = LoggerFactory.getLogger(PlanningModule.class);
    
    // ==================== 元数据 ====================
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    // ==================== 对外服务接口 ====================
    
    private RoutePlanner routePlanner;
    private TripPlanner tripPlanner;
    private FleetScheduler fleetScheduler;
    private ResourceRecommender resourceRecommender;
    
    // ==================== 内部服务 ====================
    
    private ReplanHandler replanHandler;
    private PlanningHistoryService historyService;
    
    // ==================== 监控指标 ====================
    
    private PlanningMetrics metrics;
    
    /**
     * 构造函数 - 初始化模块元数据
     */
    public PlanningModule() {
        this.metadata = ModuleMetadata.builder()
            .name("planning-service")
            .version("1.0.0")
            .description("智能规划服务模块 - 路径规划/行程规划/车队调度/资源推荐")
            .type("business")
            .priority(50)
            .build();
    }
    
    // ==================== 生命周期实现 ====================
    
    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        this.context = context;
        log.info("[PlanningService] 规划服务模块初始化中...");
        
        try {
            // 1. 加载配置
            PlanningConfig config = loadConfig(context.getConfig());
            
            // 2. 初始化规划引擎
            GraphHopperEngine graphHopperEngine = new GraphHopperEngine(config);
            OrToolsSolver orToolsSolver = new OrToolsSolver(config);
            
            // 3. 初始化对外服务
            routePlanner = new RoutePlannerImpl(graphHopperEngine, config);
            tripPlanner = new TripPlannerImpl(orToolsSolver, routePlanner);
            fleetScheduler = new FleetSchedulerImpl(orToolsSolver, routePlanner);
            resourceRecommender = new ResourceRecommenderImpl(routePlanner);
            
            // 4. 初始化内部服务
            replanHandler = new ReplanHandlerImpl(routePlanner, context.getEventBus());
            historyService = new PlanningHistoryService();
            
            // 5. 初始化监控指标
            metrics = new PlanningMetrics();
            
            state = ModuleState.INITIALIZED;
            healthStatus = HealthStatus.HEALTHY;
            
            log.info("[PlanningService] 规划服务模块初始化完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            healthStatus = HealthStatus.UNHEALTHY;
            throw new ModuleException("INIT_FAILED", "初始化失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void start() throws ModuleException {
        log.info("[PlanningService] 规划服务模块启动中...");
        
        try {
            // 1. 启动规划引擎
            if (routePlanner instanceof RoutePlannerImpl) {
                ((RoutePlannerImpl) routePlanner).start();
            }
            
            // 2. 启动重规划监听
            replanHandler.start();
            
            // 3. 注册到服务注册中心
            context.getServiceRegistry().register(RoutePlanner.class, routePlanner);
            context.getServiceRegistry().register(TripPlanner.class, tripPlanner);
            context.getServiceRegistry().register(FleetScheduler.class, fleetScheduler);
            context.getServiceRegistry().register(ResourceRecommender.class, resourceRecommender);
            
            state = ModuleState.RUNNING;
            healthStatus = HealthStatus.HEALTHY;
            
            log.info("[PlanningService] 规划服务模块启动完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            throw new ModuleException("START_FAILED", "启动失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void stop() throws ModuleException {
        log.info("[PlanningService] 规划服务模块停止中...");
        
        try {
            // 1. 停止接收新请求
            if (routePlanner instanceof RoutePlannerImpl) {
                ((RoutePlannerImpl) routePlanner).stop();
            }
            
            // 2. 等待进行中的任务完成
            waitForPendingTasks();
            
            // 3. 停止重规划监听
            replanHandler.stop();
            
            state = ModuleState.STOPPED;
            healthStatus = HealthStatus.OFFLINE;
            
            log.info("[PlanningService] 规划服务模块已停止");
        } catch (Exception e) {
            throw new ModuleException("STOP_FAILED", "停止失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void destroy() throws ModuleException {
        log.info("[PlanningService] 规划服务模块销毁中...");
        
        // 释放资源
        routePlanner = null;
        tripPlanner = null;
        fleetScheduler = null;
        resourceRecommender = null;
        replanHandler = null;
        historyService = null;
        metrics = null;
        
        state = ModuleState.DESTROYED;
        
        log.info("[PlanningService] 规划服务模块已销毁");
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
        return metrics.collect();
    }
    
    @Override
    public HealthCheckResult healthCheck() {
        return HealthCheckResult.builder()
            .healthy(healthStatus == HealthStatus.HEALTHY && 
                     routePlanner != null && 
                     routePlanner.isReady())
            .message("规划服务运行正常")
            .timestamp(System.currentTimeMillis())
            .build();
    }
    
    // ==================== API 规范 ====================
    
    @Override
    public String getApiSpecification() {
        return "/api/planning/openapi.yaml";
    }
    
    @Override
    public List<ApiDependency> getApiDependencies() {
        return List.of(
            new ApiDependency("vehicle-api", "vehicle-access", "^1.0.0"),
            new ApiDependency("monitor-api", "monitor-service", "^1.0.0"),
            new ApiDependency("tenant-api", "tenant-service", "^1.0.0")
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
            .cpu("500m")
            .memory("1Gi")
            .maxConnections(500)
            .build();
    }
    
    // ==================== 对外服务获取 ====================
    
    public RoutePlanner getRoutePlanner() {
        return routePlanner;
    }
    
    public TripPlanner getTripPlanner() {
        return tripPlanner;
    }
    
    public FleetScheduler getFleetScheduler() {
        return fleetScheduler;
    }
    
    public ResourceRecommender getResourceRecommender() {
        return resourceRecommender;
    }
    
    // ==================== 私有方法 ====================
    
    private PlanningConfig loadConfig(ModuleConfig config) {
        return PlanningConfig.fromYaml(config.getYaml("planning"));
    }
    
    private void waitForPendingTasks() {
        long deadline = System.currentTimeMillis() + 30000;
        while (metrics.getPendingTaskCount() > 0 && System.currentTimeMillis() < deadline) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }
}