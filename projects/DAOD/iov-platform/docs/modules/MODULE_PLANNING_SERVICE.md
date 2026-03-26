# 规划服务模块设计文档

**模块名称**: planning-service  
**版本**: 1.0.0  
**优先级**: 50  
**类型**: business  
**最后更新**: 2026-03-25

---

## 1. 模块概述

### 1.1 模块定位

规划服务模块是车联网管理平台的核心业务模块之一，提供智能化的路径规划、调度优化、行程规划和资源推荐能力。本模块遵循 **标准化功能单元 (SFU)** 规范，实现 `ISFU` 接口。

| 属性 | 值 |
|------|------|
| **名称** | planning-service |
| **版本** | 1.0.0 |
| **类型** | business |
| **优先级** | 50 |
| **主类** | com.daod.iov.modules.planning.PlanningModule |

### 1.2 核心能力

| 能力 | 描述 | 适用场景 |
|------|------|----------|
| **智能路径规划** | 多策略路径规划 (最短/最快/避开拥堵/避开高速) | 导航、配送 |
| **多途经点优化** | TSP 问题求解，智能排序途经点 | 物流配送、巡检 |
| **车队调度优化** | VRP 问题求解，任务最优分配 | 车队管理、调度中心 |
| **实时重规划** | 基于实时路况动态调整路径 | 拥堵避让、事故绕行 |
| **资源点推荐** | 充电站/加油站/服务区智能推荐 | 能源补给、休息规划 |

### 1.3 技术选型

| 技术 | 版本 | 用途 |
|------|------|------|
| **GraphHopper** | 8.0 | 路径规划引擎 |
| **OSM** | - | 地图数据源 |
| **OR-Tools** | 9.8 | 运筹优化求解器 |
| **Redis** | 7.x | 路况缓存 |
| **PostGIS** | 15 | 空间数据存储 |

---

## 2. 模块结构规范

### 2.1 标准目录结构

```
planning-service/
├── module.yaml                          # 模块配置文件 (必需)
├── pom.xml                              # Maven 构建配置
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/daod/iov/modules/planning/
│   │   │       ├── PlanningModule.java          # 模块主类 (必需，实现 ISFU)
│   │   │       │
│   │   │       ├── api/                         # 对外接口 (public API)
│   │   │       │   ├── RoutePlanner.java        # 路径规划服务接口
│   │   │       │   ├── TripPlanner.java         # 行程规划服务接口
│   │   │       │   ├── FleetScheduler.java      # 车队调度服务接口
│   │   │       │   ├── ResourceRecommender.java # 资源推荐服务接口
│   │   │       │   ├── dto/                     # 数据传输对象
│   │   │       │   │   ├── RoutePlanRequest.java
│   │   │       │   │   ├── RoutePlanResult.java
│   │   │       │   │   ├── TripPlanRequest.java
│   │   │       │   │   ├── TripPlanResult.java
│   │   │       │   │   ├── FleetScheduleRequest.java
│   │   │       │   │   └── FleetScheduleResult.java
│   │   │       │   └── event/                   # 事件定义
│   │   │       │       ├── RoutePlannedEvent.java
│   │   │       │       └── ReplanTriggeredEvent.java
│   │   │       │
│   │   │       ├── internal/                    # 内部实现 (不对外暴露)
│   │   │       │   ├── service/                 # 服务实现
│   │   │       │   │   ├── RoutePlannerImpl.java
│   │   │       │   │   ├── TripPlannerImpl.java
│   │   │       │   │   ├── FleetSchedulerImpl.java
│   │   │       │   │   ├── ResourceRecommenderImpl.java
│   │   │       │   │   └── ReplanHandlerImpl.java
│   │   │       │   ├── engine/                  # 规划引擎
│   │   │       │   │   ├── GraphHopperEngine.java
│   │   │       │   │   └── OrToolsSolver.java
│   │   │       │   ├── repository/              # 数据访问
│   │   │       │   │   ├── PlanningTaskRepository.java
│   │   │       │   │   ├── PlanningHistoryRepository.java
│   │   │       │   │   └── ResourcePointRepository.java
│   │   │       │   └── util/                    # 工具类
│   │   │       │       ├── GeoUtils.java
│   │   │       │       └── MatrixBuilder.java
│   │   │       │
│   │   │       ├── config/                      # 配置类
│   │   │       │   ├── PlanningConfig.java
│   │   │       │   └── GraphHopperConfig.java
│   │   │       │
│   │   │       └── extension/                   # 扩展点实现
│   │   │           ├── CustomRoutePlanner.java
│   │   │           └── TrafficProviderImpl.java
│   │   │
│   │   └── resources/
│   │       ├── application.yml                 # 应用配置
│   │       └── openapi.yaml                    # API 文档
│   │
│   └── test/
│       └── java/
│           └── com/daod/iov/modules/planning/
│               ├── PlanningModuleTest.java      # 模块测试
│               ├── RoutePlannerTest.java       # 服务测试
│               └── TripPlannerTest.java
│
└── docs/
    └── README.md                               # 模块文档
```

### 2.2 模块主类 (实现 ISFU 接口)

```java
package com.daod.iov.modules.planning;

import com.daod.iov.plugin.*;
import com.daod.iov.modules.planning.api.*;
import com.daod.iov.modules.planning.internal.service.*;
import com.daod.iov.modules.planning.internal.repository.*;
import com.daod.iov.modules.planning.config.PlanningConfig;

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
    
    // ==================== 数据访问 ====================
    
    private PlanningTaskRepository taskRepository;
    private PlanningHistoryRepository historyRepository;
    private ResourcePointRepository resourceRepository;
    
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
        logInfo("规划服务模块初始化中...");
        
        try {
            // 1. 加载配置
            PlanningConfig config = loadConfig(context.getConfig());
            
            // 2. 初始化数据访问层
            taskRepository = new PlanningTaskRepository(context.getDataSource());
            historyRepository = new PlanningHistoryRepository(context.getDataSource());
            resourceRepository = new ResourcePointRepository(context.getDataSource());
            
            // 3. 初始化规划引擎
            GraphHopperEngine graphHopper = new GraphHopperEngine(config.getGraphHopper());
            OrToolsSolver orToolsSolver = new OrToolsSolver(config.getOrTools());
            
            // 4. 初始化对外服务
            routePlanner = new RoutePlannerImpl(graphHopper, config);
            tripPlanner = new TripPlannerImpl(orToolsSolver, routePlanner);
            fleetScheduler = new FleetSchedulerImpl(orToolsSolver, routePlanner);
            resourceRecommender = new ResourceRecommenderImpl(resourceRepository, routePlanner);
            
            // 5. 初始化内部服务
            replanHandler = new ReplanHandlerImpl(routePlanner, context.getEventBus());
            historyService = new PlanningHistoryService(historyRepository);
            
            // 6. 初始化监控指标
            metrics = new PlanningMetrics();
            
            state = ModuleState.INITIALIZED;
            healthStatus = HealthStatus.HEALTHY;
            
            logInfo("规划服务模块初始化完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            healthStatus = HealthStatus.UNHEALTHY;
            throw new ModuleException("INIT_FAILED", "初始化失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void start() throws ModuleException {
        logInfo("规划服务模块启动中...");
        
        try {
            // 1. 启动规划引擎
            ((RoutePlannerImpl) routePlanner).start();
            
            // 2. 启动重规划监听
            replanHandler.start();
            
            // 3. 注册到服务注册中心
            registerServices();
            
            state = ModuleState.RUNNING;
            healthStatus = HealthStatus.HEALTHY;
            
            logInfo("规划服务模块启动完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            throw new ModuleException("START_FAILED", "启动失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void stop() throws ModuleException {
        logInfo("规划服务模块停止中...");
        
        try {
            // 1. 停止接收新请求
            ((RoutePlannerImpl) routePlanner).stop();
            
            // 2. 等待进行中的任务完成
            waitForPendingTasks();
            
            // 3. 停止重规划监听
            replanHandler.stop();
            
            state = ModuleState.STOPPED;
            healthStatus = HealthStatus.OFFLINE;
            
            logInfo("规划服务模块已停止");
        } catch (Exception e) {
            throw new ModuleException("STOP_FAILED", "停止失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void destroy() throws ModuleException {
        logInfo("规划服务模块销毁中...");
        
        // 释放资源
        routePlanner = null;
        tripPlanner = null;
        fleetScheduler = null;
        resourceRecommender = null;
        replanHandler = null;
        historyService = null;
        taskRepository = null;
        historyRepository = null;
        resourceRepository = null;
        metrics = null;
        
        state = ModuleState.DESTROYED;
        
        logInfo("规划服务模块已销毁");
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
            .details(Map.of(
                "routePlannerReady", routePlanner != null && routePlanner.isReady(),
                "tripPlannerReady", tripPlanner != null,
                "fleetSchedulerReady", fleetScheduler != null,
                "pendingTasks", metrics.getPendingTaskCount()
            ))
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
    
    /**
     * 获取路径规划服务
     */
    public RoutePlanner getRoutePlanner() {
        return routePlanner;
    }
    
    /**
     * 获取行程规划服务
     */
    public TripPlanner getTripPlanner() {
        return tripPlanner;
    }
    
    /**
     * 获取车队调度服务
     */
    public FleetScheduler getFleetScheduler() {
        return fleetScheduler;
    }
    
    /**
     * 获取资源推荐服务
     */
    public ResourceRecommender getResourceRecommender() {
        return resourceRecommender;
    }
    
    // ==================== 私有方法 ====================
    
    private PlanningConfig loadConfig(ModuleConfig config) {
        return PlanningConfig.fromYaml(config.getYaml("planning"));
    }
    
    private void registerServices() {
        context.getServiceRegistry().register(RoutePlanner.class, routePlanner);
        context.getServiceRegistry().register(TripPlanner.class, tripPlanner);
        context.getServiceRegistry().register(FleetScheduler.class, fleetScheduler);
        context.getServiceRegistry().register(ResourceRecommender.class, resourceRecommender);
    }
    
    private void waitForPendingTasks() {
        // 等待进行中的规划任务完成，最多等待 30 秒
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
    
    private void logInfo(String message) {
        System.out.println("[INFO] [PlanningService] " + message);
    }
}
```

---

## 3. 对外接口定义 (api/)

### 3.1 路径规划服务接口

```java
package com.daod.iov.modules.planning.api;

/**
 * 路径规划服务接口
 * 
 * 对外暴露的路径规划能力，遵循接口优先原则
 */
public interface RoutePlanner {
    
    /**
     * 规划单条路径
     * 
     * @param request 规划请求
     * @return 规划结果
     * @throws PlanningException 规划失败
     */
    RoutePlanResult plan(RoutePlanRequest request) throws PlanningException;
    
    /**
     * 批量规划路径
     * 
     * @param requests 规划请求列表
     * @return 规划结果列表
     */
    List<RoutePlanResult> batchPlan(List<RoutePlanRequest> requests);
    
    /**
     * 计算距离矩阵
     * 
     * @param points 点位列表
     * @return 距离矩阵 (单位: 米)
     */
    long[][] computeDistanceMatrix(List<GeoPoint> points);
    
    /**
     * 检查服务是否就绪
     */
    boolean isReady();
    
    /**
     * 获取支持的规划策略
     */
    List<RouteStrategy> getSupportedStrategies();
}
```

### 3.2 行程规划服务接口

```java
package com.daod.iov.modules.planning.api;

/**
 * 行程规划服务接口
 * 
 * 多途经点行程规划，解决 TSP 问题
 */
public interface TripPlanner {
    
    /**
     * 规划行程
     * 
     * @param request 行程规划请求
     * @return 行程规划结果
     * @throws PlanningException 规划失败
     */
    TripPlanResult plan(TripPlanRequest request) throws PlanningException;
    
    /**
     * 批量规划行程
     */
    List<TripPlanResult> batchPlan(List<TripPlanRequest> requests);
    
    /**
     * 估算行程时长
     */
    TripDurationEstimation estimateDuration(TripPlanRequest request);
}
```

### 3.3 车队调度服务接口

```java
package com.daod.iov.modules.planning.api;

/**
 * 车队调度服务接口
 * 
 * 解决 VRP 问题，将任务最优分配给车辆
 */
public interface FleetScheduler {
    
    /**
     * 执行车队调度
     * 
     * @param request 调度请求
     * @return 调度结果
     * @throws PlanningException 调度失败
     */
    FleetScheduleResult schedule(FleetScheduleRequest request) throws PlanningException;
    
    /**
     * 重新调度
     */
    FleetScheduleResult reschedule(String scheduleId, RescheduleOptions options);
    
    /**
     * 获取调度方案
     */
    FleetScheduleResult getSchedule(String scheduleId);
}
```

### 3.4 资源推荐服务接口

```java
package com.daod.iov.modules.planning.api;

/**
 * 资源推荐服务接口
 * 
 * 智能推荐充电站、加油站、服务区等资源点
 */
public interface ResourceRecommender {
    
    /**
     * 推荐资源点
     * 
     * @param request 推荐请求
     * @return 推荐结果
     */
    ResourceRecommendResult recommend(ResourceRecommendRequest request);
    
    /**
     * 搜索资源点
     */
    List<ResourcePoint> search(ResourceSearchRequest request);
    
    /**
     * 获取资源点详情
     */
    ResourcePoint getDetail(String resourceId);
}
```

---

## 4. 模块配置 (module.yaml)

```yaml
# API 版本
apiVersion: iov.daod.com/v1

# 资源类型
kind: Module

# 元数据
metadata:
  name: planning-service
  version: 1.0.0
  description: 智能规划服务模块 - 路径规划/行程规划/车队调度/资源推荐
  author: daod-team
  license: Apache-2.0
  labels:
    tier: business
    domain: planning

# 规格定义
spec:
  # 模块类型
  type: business
  
  # 加载优先级
  priority: 50
  
  # 主类
  mainClass: com.daod.iov.modules.planning.PlanningModule
  
  # 依赖声明
  dependencies:
    - name: plugin-framework
      version: ">=1.0.0"
      optional: false
    - name: common-core
      version: "^1.0.0"
      optional: false
    - name: vehicle-access
      version: "^1.0.0"
      optional: false
    - name: monitor-service
      version: "^1.0.0"
      optional: false
    - name: tenant-service
      version: "^1.0.0"
      optional: false
    - name: config-center
      version: "^1.0.0"
      optional: true
  
  # 提供的 API
  provides:
    - name: planning-api
      version: "1.0.0"
      openapi: /openapi.yaml
      endpoints:
        - path: /api/v1/planning/route
          method: POST
          description: 路径规划
        - path: /api/v1/planning/trip
          method: POST
          description: 行程规划
        - path: /api/v1/planning/fleet
          method: POST
          description: 车队调度
        - path: /api/v1/planning/resource/recommend
          method: POST
          description: 资源推荐
  
  # 消费的 API
  consumes:
    - name: vehicle-api
      version: "^1.0.0"
      from: vehicle-access
    - name: monitor-api
      version: "^1.0.0"
      from: monitor-service
    - name: tenant-api
      version: "^1.0.0"
      from: tenant-service
  
  # 提供的扩展点
  extensionPoints:
    - name: route-planner
      interface: com.daod.iov.modules.planning.api.RoutePlanner
      description: 路径规划器扩展点
      multiple: false
    - name: traffic-provider
      interface: com.daod.iov.modules.planning.spi.TrafficProvider
      description: 路况数据提供者扩展点
      multiple: true
    - name: resource-provider
      interface: com.daod.iov.modules.planning.spi.ResourceProvider
      description: 资源点数据提供者扩展点
      multiple: true
  
  # 使用的扩展点
  uses:
    - name: event-publisher
      from: event-bus
    - name: config-watcher
      from: config-center
  
  # 权限需求
  permissions:
    - NETWORK_CONNECT
    - FILE_READ
    - FILE_WRITE
  
  # 资源需求
  resources:
    cpu: "500m"
    memory: "1Gi"
    maxConnections: 500
    maxFileDescriptors: 200
  
  # 健康检查
  healthCheck:
    liveness: /health/live
    readiness: /health/ready
    interval: 30s
    timeout: 5s
    failureThreshold: 3
    successThreshold: 1
  
  # 热更新配置
  hotReload:
    enabled: true
    strategy: rolling
    maxUnavailable: 1
    maxSurge: 1
    healthCheckTimeout: 60s
    rollbackOnFailure: true
    backupCount: 5
  
  # 监控配置
  observability:
    metrics:
      enabled: true
      path: /metrics
      port: 8080
    tracing:
      enabled: true
      samplingRate: 0.1
    logging:
      level: INFO
      format: json
```

---

## 5. 架构设计

### 5.1 模块架构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PlanningService                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  RoutePlanner   │  │  TripPlanner    │  │  FleetScheduler │              │
│  │   (路径规划)     │  │   (行程规划)     │  │   (车队调度)     │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                    │                        │
│           ▼                    ▼                    ▼                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        PlanningEngine                                │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │    │
│  │  │ GraphHopper │  │   OR-Tools  │  │ TrafficAware│  │  Elevation│  │    │
│  │  │  (路网引擎)  │  │  (优化求解)  │  │  (路况感知)  │  │  (高程数据)│  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │ ResourceRecomm  │  │ ReplanHandler   │  │  PlanHistory    │              │
│  │  (资源推荐)      │  │  (重规划处理)    │  │  (历史记录)      │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 数据流架构

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   请求接入    │────▶│  规则校验    │────▶│  引擎选择    │
│ (API/WebSocket)│     │ (参数/权限)  │     │ (策略匹配)   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   结果返回    │◀────│  后处理      │◀────│  规划计算    │
│ (JSON/事件)   │     │ (排序/过滤)  │     │ (路径/调度)  │
└──────────────┘     └──────────────┘     └──────────────┘
       │
       ▼
┌──────────────┐
│   持久化      │
│ (历史记录)    │
└──────────────┘
```

### 2.3 与其他模块的依赖关系

```
                    ┌─────────────────┐
                    │  auth-service   │ (认证鉴权)
                    └────────┬────────┘
                             │
┌────────────────┐    ┌──────▼──────┐    ┌────────────────┐
│ monitor-service│◀───│  planning   │───▶│  alarm-service │
│   (实时位置)    │    │   -service  │    │   (异常告警)   │
└────────────────┘    └──────┬──────┘    └────────────────┘
                             │
┌────────────────┐    ┌──────▼──────┐    ┌────────────────┐
│ vehicle-access │◀───│   车辆数据   │───▶│ config-center  │
│   (车辆信息)    │    │   依赖      │    │   (地图配置)   │
└────────────────┘    └─────────────┘    └────────────────┘
```

---

## 6. 内部实现 (internal/)

### 3.1 路径规划服务 (RoutePlanner)

#### 3.1.1 功能描述

提供从起点到终点的路径规划能力，支持多种优化策略。

#### 3.1.2 规划策略

| 策略 | 说明 | 权重因子 |
|------|------|----------|
| **FASTEST** | 最快路径 (时间最短) | 时间权重 1.0 |
| **SHORTEST** | 最短路径 (距离最短) | 距离权重 1.0 |
| **BALANCED** | 均衡路径 (时间+距离) | 时间 0.6 + 距离 0.4 |
| **AVOID_HIGHWAY** | 避开高速 | 高速惩罚因子 10.0 |
| **AVOID_TOLL** | 避开收费路段 | 收费惩罚因子 10.0 |
| **ECO_FRIENDLY** | 经济路线 (省油) | 油耗权重 0.8 |
| **REAL_TIME** | 实时路况 | 动态权重 |

#### 3.1.3 API 设计

```java
/**
 * 路径规划请求
 */
public class RoutePlanRequest {
    /** 起点 (经纬度) */
    private GeoPoint origin;
    
    /** 终点 (经纬度) */
    private GeoPoint destination;
    
    /** 途经点列表 */
    private List<GeoPoint> waypoints;
    
    /** 规划策略 */
    private RouteStrategy strategy;
    
    /** 车辆类型 */
    private VehicleType vehicleType;
    
    /** 是否启用实时路况 */
    private boolean enableTraffic;
    
    /** 是否返回备选路线 */
    private int alternativeCount;
    
    /** 排除条件 */
    private List<AvoidType> avoidList;
}

/**
 * 路径规划结果
 */
public class RoutePlanResult {
    /** 规划ID */
    private String planId;
    
    /** 路线列表 (主路线 + 备选) */
    private List<Route> routes;
    
    /** 推荐路线索引 */
    private int recommendedIndex;
    
    /** 规划耗时 (ms) */
    private long planningTimeMs;
    
    /** 地图版本 */
    private String mapVersion;
}

/**
 * 路线详情
 */
public class Route {
    /** 路线ID */
    private String routeId;
    
    /** 总距离 (米) */
    private double distance;
    
    /** 总时间 (秒) */
    private double duration;
    
    /** 通行费 (元) */
    private double tollCost;
    
    /** 路段列表 */
    private List<RouteLeg> legs;
    
    /** 路线几何 (GeoJSON) */
    private String geometry;
    
    /** 路线指引 */
    private List<Maneuver> maneuvers;
}
```

#### 3.1.4 核心实现

```java
package com.daod.iov.modules.planning.service;

import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.routing.util.EncodingManager;

/**
 * 路径规划服务实现
 */
@Service
public class RoutePlannerImpl implements RoutePlanner {
    
    private final GraphHopper graphHopper;
    private final TrafficService trafficService;
    private final RouteCacheService cacheService;
    
    /**
     * 规划路径
     */
    @Override
    public RoutePlanResult plan(RoutePlanRequest request) {
        // 1. 参数校验
        validateRequest(request);
        
        // 2. 检查缓存
        String cacheKey = buildCacheKey(request);
        RoutePlanResult cached = cacheService.get(cacheKey);
        if (cached != null) {
            return cached;
        }
        
        // 3. 构建请求
        GHRequest ghRequest = buildGHRequest(request);
        
        // 4. 实时路况处理
        if (request.isEnableTraffic()) {
            applyTrafficData(ghRequest);
        }
        
        // 5. 执行规划
        GHResponse response = graphHopper.route(ghRequest);
        
        // 6. 处理结果
        RoutePlanResult result = processResponse(response, request);
        
        // 7. 缓存结果
        cacheService.put(cacheKey, result, Duration.ofMinutes(5));
        
        return result;
    }
    
    /**
     * 应用实时路况
     */
    private void applyTrafficData(GHRequest request) {
        Map<String, Double> trafficWeights = trafficService.getRealTimeWeights();
        // 根据实时路况调整权重
        request.getHints().put("traffic_weights", trafficWeights);
    }
    
    /**
     * 构建缓存键
     */
    private String buildCacheKey(RoutePlanRequest request) {
        return DigestUtils.md5Hex(
            request.getOrigin() + "-" +
            request.getDestination() + "-" +
            request.getStrategy() + "-" +
            request.getVehicleType()
        );
    }
}
```

---

### 3.2 行程规划服务 (TripPlanner)

#### 3.2.1 功能描述

多途经点行程规划，解决 TSP (Traveling Salesman Problem) 问题，智能排序途经点以优化总行程。

#### 3.2.2 业务场景

| 场景 | 说明 | 优化目标 |
|------|------|----------|
| **物流配送** | 多点配送路线优化 | 总距离/时间最短 |
| **巡检任务** | 多站点巡检规划 | 完成时间最短 |
| **网约车拼车** | 多乘客上下车规划 | 乘客等待时间最短 |
| **旅游行程** | 多景点游览规划 | 游览体验最优 |

#### 3.2.3 API 设计

```java
/**
 * 行程规划请求
 */
public class TripPlanRequest {
    /** 起点终点 (可相同) */
    private GeoPoint origin;
    private GeoPoint destination;
    
    /** 途经点列表 */
    private List<TripWaypoint> waypoints;
    
    /** 优化目标 */
    private OptimizeObjective objective; // MIN_DISTANCE, MIN_TIME, BALANCED
    
    /** 时间窗口约束 */
    private List<TimeWindow> timeWindows;
    
    /** 是否返回原点 */
    private boolean returnToOrigin;
    
    /** 车辆约束 */
    private VehicleConstraint constraint;
}

/**
 * 途经点
 */
public class TripWaypoint {
    private String id;
    private GeoPoint location;
    private int priority;           // 优先级 (数字越小越优先)
    private int stayDuration;       // 停留时长 (秒)
    private TimeWindow timeWindow;  // 时间窗口
    private String type;            // 类型: DELIVERY, PICKUP, VISIT
}

/**
 * 行程规划结果
 */
public class TripPlanResult {
    private String tripId;
    private List<TripStop> orderedStops;  // 排序后的停靠点
    private double totalDistance;
    private double totalDuration;
    private double totalStayDuration;
    private String geometry;              // GeoJSON
    private List<Warning> warnings;       // 警告信息
}
```

#### 3.2.4 核心实现

```java
package com.daod.iov.modules.planning.service;

import com.google.ortools.constraintsolver.*;

/**
 * 行程规划服务实现
 * 
 * 使用 OR-Tools 解决 TSP 问题
 */
@Service
public class TripPlannerImpl implements TripPlanner {
    
    static {
        System.loadLibrary("jniortools");
    }
    
    /**
     * 规划行程
     */
    @Override
    public TripPlanResult plan(TripPlanRequest request) {
        int nodeCount = request.getWaypoints().size() + 2; // +起点终点
        
        // 1. 构建距离矩阵
        long[][] distanceMatrix = buildDistanceMatrix(request);
        
        // 2. 创建路由模型
        RoutingIndexManager manager = new RoutingIndexManager(
            nodeCount, 
            1,  // 车辆数量
            0   // 起点
        );
        RoutingModel routing = new RoutingModel(manager);
        
        // 3. 设置距离回调
        final int transitCallbackIndex = routing.registerTransitCallback(
            (long fromIndex, long toIndex) -> {
                int fromNode = manager.indexToNode(fromIndex);
                int toNode = manager.indexToNode(toIndex);
                return distanceMatrix[fromNode][toNode];
            }
        );
        
        // 4. 设置目标函数
        routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);
        
        // 5. 添加时间窗口约束 (如果有)
        if (request.getTimeWindows() != null) {
            addTimeWindowConstraints(routing, manager, request);
        }
        
        // 6. 求解
        RoutingSearchParameters searchParameters = 
            main.defaultRoutingSearchParameters()
                .toBuilder()
                .setFirstSolutionStrategy(FirstSolutionStrategy.Value.PATH_CHEAPEST_ARC)
                .setLocalSearchMetaheuristic(LocalSearchMetaheuristic.Value.GUIDED_LOCAL_SEARCH)
                .setTimeLimit(Duration.ofSeconds(30).toMillis())
                .build();
        
        Assignment solution = routing.solveWithParameters(searchParameters);
        
        // 7. 提取结果
        return extractResult(solution, routing, manager, request);
    }
    
    /**
     * 构建距离矩阵
     */
    private long[][] buildDistanceMatrix(TripPlanRequest request) {
        List<GeoPoint> allPoints = new ArrayList<>();
        allPoints.add(request.getOrigin());
        allPoints.addAll(request.getWaypoints().stream()
            .map(TripWaypoint::getLocation)
            .collect(Collectors.toList()));
        if (request.getDestination() != null) {
            allPoints.add(request.getDestination());
        }
        
        int n = allPoints.size();
        long[][] matrix = new long[n][n];
        
        // 批量计算距离 (使用 GraphHopper 距离矩阵 API)
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) {
                    matrix[i][j] = 0;
                } else {
                    matrix[i][j] = calculateDistance(allPoints.get(i), allPoints.get(j));
                }
            }
        }
        
        return matrix;
    }
}
```

---

### 3.3 车队调度服务 (FleetScheduler)

#### 3.3.1 功能描述

解决 VRP (Vehicle Routing Problem) 问题，将多个任务最优分配给车队中的车辆。

#### 3.3.2 调度策略

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| **MIN_VEHICLES** | 最少车辆数 | 降低运营成本 |
| **MIN_DISTANCE** | 最短总距离 | 节省燃油 |
| **MIN_TIME** | 最短完成时间 | 提高效率 |
| **BALANCED** | 均衡负载 | 车辆寿命均衡 |

#### 3.3.3 API 设计

```java
/**
 * 车队调度请求
 */
public class FleetScheduleRequest {
    /** 车队列表 */
    private List<VehicleInfo> vehicles;
    
    /** 任务列表 */
    private List<ScheduleTask> tasks;
    
    /** 调度策略 */
    private ScheduleStrategy strategy;
    
    /** 时间范围 */
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    
    /** 约束条件 */
    private ScheduleConstraint constraint;
}

/**
 * 车辆信息
 */
public class VehicleInfo {
    private String vehicleId;
    private GeoPoint startLocation;    // 起点
    private GeoPoint endLocation;      // 终点 (可为空)
    private double capacity;           // 载重能力
    private List<String> skills;       // 技能标签
    private TimeWindow availableTime;  // 可用时间
    private VehicleType type;          // 车辆类型
}

/**
 * 调度任务
 */
public class ScheduleTask {
    private String taskId;
    private GeoPoint location;
    private double demand;             // 需求量
    private int serviceDuration;       // 服务时长 (秒)
    private TimeWindow timeWindow;     // 时间窗口
    private List<String> requiredSkills; // 所需技能
    private TaskPriority priority;     // 优先级
}

/**
 * 调度结果
 */
public class FleetScheduleResult {
    private String scheduleId;
    private List<VehicleSchedule> vehicleSchedules;
    private int totalTasks;
    private int assignedTasks;
    private int unassignedTasks;
    private double totalDistance;
    private double totalDuration;
    private LocalDateTime generatedAt;
}

/**
 * 单车调度计划
 */
public class VehicleSchedule {
    private String vehicleId;
    private List<TaskStop> stops;
    private double totalDistance;
    private double totalDuration;
    private double totalLoad;
    private double utilization;        // 利用率
}
```

#### 3.3.4 核心实现

```java
package com.daod.iov.modules.planning.service;

/**
 * 车队调度服务实现
 * 
 * 使用 OR-Tools 解决 VRP 问题
 */
@Service
public class FleetSchedulerImpl implements FleetScheduler {
    
    /**
     * 调度车队
     */
    @Override
    public FleetScheduleResult schedule(FleetScheduleRequest request) {
        int vehicleCount = request.getVehicles().size();
        int taskCount = request.getTasks().size();
        
        // 1. 构建节点列表 (起点 + 任务点 + 终点)
        List<GeoPoint> nodes = buildNodes(request);
        
        // 2. 构建距离矩阵
        long[][] distanceMatrix = buildDistanceMatrix(nodes);
        
        // 3. 创建路由模型
        RoutingIndexManager manager = new RoutingIndexManager(
            nodes.size(),
            vehicleCount,
            getVehicleStarts(request),
            getVehicleEnds(request)
        );
        RoutingModel routing = new RoutingModel(manager);
        
        // 4. 设置距离回调
        int transitCallbackIndex = routing.registerTransitCallback(
            (fromIndex, toIndex) -> {
                int fromNode = manager.indexToNode(fromIndex);
                int toNode = manager.indexToNode(toIndex);
                return distanceMatrix[fromNode][toNode];
            }
        );
        routing.setArcCostEvaluatorOfAllVehicles(transitCallbackIndex);
        
        // 5. 添加容量约束
        addCapacityConstraints(routing, manager, request);
        
        // 6. 添加时间窗口约束
        addTimeWindowConstraints(routing, manager, request);
        
        // 7. 添加技能约束
        addSkillConstraints(routing, manager, request);
        
        // 8. 设置目标函数
        setObjective(routing, request.getStrategy());
        
        // 9. 求解
        Assignment solution = routing.solveWithParameters(buildSearchParams());
        
        // 10. 提取结果
        return extractResult(solution, routing, manager, request);
    }
    
    /**
     * 添加容量约束
     */
    private void addCapacityConstraints(RoutingModel routing, 
                                         RoutingIndexManager manager,
                                         FleetScheduleRequest request) {
        int capacityCallbackIndex = routing.registerUnaryTransitCallback(
            (index) -> {
                int node = manager.indexToNode(index);
                // 任务点的需求量 (起点/终点为 0)
                if (node < request.getTasks().size()) {
                    return (long) request.getTasks().get(node).getDemand();
                }
                return 0L;
            }
        );
        
        routing.addDimensionWithVehicleCapacity(
            capacityCallbackIndex,
            0,  // null slack
            request.getVehicles().stream()
                .mapToLong(v -> (long) v.getCapacity())
                .toArray(),
            false,
            "Capacity"
        );
    }
}
```

---

### 3.4 资源推荐服务 (ResourceRecommender)

#### 3.4.1 功能描述

基于车辆当前位置、电量和行程规划，智能推荐充电站、加油站、服务区等资源点。

#### 3.4.2 推荐策略

| 策略 | 说明 | 权重因子 |
|------|------|----------|
| **NEAREST** | 最近优先 | 距离权重 1.0 |
| **CHEAPEST** | 最便宜优先 | 价格权重 1.0 |
| **FASTEST** | 最快到达 | 时间权重 1.0 |
| **RECOMMENDED** | 综合推荐 | 距离 0.3 + 价格 0.3 + 评分 0.4 |

#### 3.4.3 API 设计

```java
/**
 * 资源推荐请求
 */
public class ResourceRecommendRequest {
    /** 当前位置 */
    private GeoPoint currentLocation;
    
    /** 目标位置 (可选) */
    private GeoPoint destination;
    
    /** 资源类型 */
    private ResourceType resourceType; // CHARGING_STATION, GAS_STATION, SERVICE_AREA
    
    /** 车辆信息 */
    private VehicleState vehicleState;
    
    /** 推荐策略 */
    private RecommendStrategy strategy;
    
    /** 搜索半径 (米) */
    private double searchRadius;
    
    /** 最大返回数量 */
    private int limit;
}

/**
 * 车辆状态
 */
public class VehicleState {
    private double batteryLevel;       // 电量百分比
    private double fuelLevel;          // 油量百分比
    private double remainingRange;     // 剩余续航 (公里)
    private VehicleType vehicleType;   // 车辆类型
}

/**
 * 推荐结果
 */
public class ResourceRecommendResult {
    private List<ResourceCandidate> candidates;
    private int totalFound;
    private double searchRadius;
}

/**
 * 候选资源点
 */
public class ResourceCandidate {
    private String id;
    private String name;
    private GeoPoint location;
    private double distance;           // 距离 (米)
    private double eta;                // 预计到达时间 (秒)
    private ResourceStatus status;     // 实时状态
    private double rating;             // 评分
    private double price;              // 价格
    private String routeGeometry;      // 导航路径
}
```

---

### 3.5 实时重规划服务 (ReplanHandler)

#### 3.5.1 功能描述

监听实时路况和车辆状态变化，在必要时触发路径重规划。

#### 3.5.2 重规划触发条件

| 触发条件 | 说明 | 优先级 |
|----------|------|--------|
| **严重拥堵** | 前方路段拥堵超过阈值 | 高 |
| **道路封闭** | 道路临时封闭 | 高 |
| **事故发生** | 前方发生事故 | 高 |
| **电量不足** | 电量低于安全阈值 | 高 |
| **偏离路线** | 偏离规划路线 | 中 |
| **用户请求** | 用户主动请求重规划 | 中 |

#### 3.5.3 核心实现

```java
package com.daod.iov.modules.planning.service;

/**
 * 实时重规划服务
 */
@Service
public class ReplanHandlerImpl implements ReplanHandler {
    
    private final EventBus eventBus;
    private final RoutePlanner routePlanner;
    private final NotificationService notificationService;
    
    /**
     * 监听路况事件
     */
    @EventListener
    public void onTrafficEvent(TrafficEvent event) {
        // 查找受影响的规划
        List<ActivePlan> affectedPlans = findAffectedPlans(event);
        
        for (ActivePlan plan : affectedPlans) {
            if (shouldReplan(plan, event)) {
                triggerReplan(plan, event);
            }
        }
    }
    
    /**
     * 判断是否需要重规划
     */
    private boolean shouldReplan(ActivePlan plan, TrafficEvent event) {
        // 1. 检查事件严重程度
        if (event.getSeverity() < TrafficSeverity.MODERATE) {
            return false;
        }
        
        // 2. 检查是否在规划路径上
        if (!isOnRoute(plan.getRoute(), event.getLocation())) {
            return false;
        }
        
        // 3. 检查备选路线是否更优
        RoutePlanResult newPlan = routePlanner.plan(buildReplanRequest(plan));
        if (newPlan.getRoutes().get(0).getDuration() < 
            plan.getRoute().getDuration() * 0.8) { // 节省 20% 以上时间
            return true;
        }
        
        return false;
    }
    
    /**
     * 触发重规划
     */
    private void triggerReplan(ActivePlan plan, TrafficEvent event) {
        // 1. 重新规划
        RoutePlanResult newPlan = routePlanner.plan(buildReplanRequest(plan));
        
        // 2. 更新规划
        updateActivePlan(plan, newPlan);
        
        // 3. 推送通知
        notificationService.push(ReplanNotification.builder()
            .vehicleId(plan.getVehicleId())
            .reason(event.getType().getDescription())
            .newRoute(newPlan.getRoutes().get(0))
            .savedTime(plan.getRoute().getDuration() - newPlan.getRoutes().get(0).getDuration())
            .build());
    }
}
```

---

## 7. 数据模型

### 4.1 实体定义

```java
/**
 * 规划任务实体
 */
@Entity
@Table(name = "planning_tasks")
public class PlanningTask {
    @Id
    private String id;
    
    /** 任务类型 */
    @Enumerated(EnumType.STRING)
    private PlanningType type; // ROUTE, TRIP, FLEET, RESOURCE
    
    /** 请求参数 (JSON) */
    @Column(columnDefinition = "jsonb")
    private String requestJson;
    
    /** 规划结果 (JSON) */
    @Column(columnDefinition = "jsonb")
    private String resultJson;
    
    /** 状态 */
    @Enumerated(EnumType.STRING)
    private TaskStatus status; // PENDING, PROCESSING, COMPLETED, FAILED
    
    /** 车辆ID */
    private String vehicleId;
    
    /** 租户ID */
    private String tenantId;
    
    /** 规划耗时 (ms) */
    private long durationMs;
    
    /** 创建时间 */
    private LocalDateTime createdAt;
    
    /** 完成时间 */
    private LocalDateTime completedAt;
}

/**
 * 历史规划记录
 */
@Entity
@Table(name = "planning_history")
public class PlanningHistory {
    @Id
    private String id;
    
    private String vehicleId;
    private String planId;
    private PlanningType type;
    
    /** 起点坐标 */
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point origin;
    
    /** 终点坐标 */
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point destination;
    
    /** 路径几何 */
    @Column(columnDefinition = "geometry(LineString,4326)")
    private LineString geometry;
    
    /** 总距离 (米) */
    private double distance;
    
    /** 总时间 (秒) */
    private double duration;
    
    /** 规划策略 */
    private String strategy;
    
    /** 是否被采用 */
    private boolean adopted;
    
    private LocalDateTime createdAt;
}

/**
 * 资源点实体
 */
@Entity
@Table(name = "resource_points")
public class ResourcePoint {
    @Id
    private String id;
    
    private String name;
    private String address;
    
    /** 资源类型 */
    @Enumerated(EnumType.STRING)
    private ResourceType type;
    
    /** 位置坐标 */
    @Column(columnDefinition = "geometry(Point,4326)")
    private Point location;
    
    /** 实时状态 (JSON) */
    @Column(columnDefinition = "jsonb")
    private String statusJson;
    
    /** 评分 */
    private double rating;
    
    /** 价格信息 */
    @Column(columnDefinition = "jsonb")
    private String priceJson;
    
    /** 设施信息 */
    @Column(columnDefinition = "jsonb")
    private String facilitiesJson;
    
    /** 数据来源 */
    private String dataSource;
    
    /** 最后更新时间 */
    private LocalDateTime updatedAt;
}
```

### 4.2 数据库表结构

```sql
-- 规划任务表
CREATE TABLE planning_tasks (
    id VARCHAR(36) PRIMARY KEY,
    type VARCHAR(20) NOT NULL,
    request_json JSONB,
    result_json JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    vehicle_id VARCHAR(36),
    tenant_id VARCHAR(36) NOT NULL,
    duration_ms BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_tenant_id (tenant_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- 规划历史表
CREATE TABLE planning_history (
    id VARCHAR(36) PRIMARY KEY,
    vehicle_id VARCHAR(36) NOT NULL,
    plan_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL,
    origin GEOMETRY(Point, 4326),
    destination GEOMETRY(Point, 4326),
    geometry GEOMETRY(LineString, 4326),
    distance DOUBLE PRECISION,
    duration DOUBLE PRECISION,
    strategy VARCHAR(30),
    adopted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    INDEX idx_vehicle_id (vehicle_id),
    INDEX idx_created_at (created_at),
    SPATIAL INDEX idx_geometry (geometry)
);

-- 资源点表
CREATE TABLE resource_points (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    type VARCHAR(30) NOT NULL,
    location GEOMETRY(Point, 4326) NOT NULL,
    status_json JSONB,
    rating DOUBLE PRECISION DEFAULT 0,
    price_json JSONB,
    facilities_json JSONB,
    data_source VARCHAR(50),
    updated_at TIMESTAMP,
    
    INDEX idx_type (type),
    SPATIAL INDEX idx_location (location)
);
```

## 8. 扩展点设计

### 8.1 路径规划扩展点

```java
/**
 * 路径规划器扩展点
 * 
 * 允许第三方实现自定义路径规划算法
 */
public interface RoutePlanner {
    
    /**
     * 规划单条路径
     */
    RoutePlanResult plan(RoutePlanRequest request);
    
    /**
     * 规划带途经点的路径
     */
    RoutePlanResult planWithWaypoints(RoutePlanRequest request);
    
    /**
     * 计算距离矩阵
     */
    long[][] computeDistanceMatrix(List<GeoPoint> points);
    
    /**
     * 获取支持的策略
     */
    List<RouteStrategy> getSupportedStrategies();
    
    /**
     * 是否支持该请求
     */
    boolean supports(RoutePlanRequest request);
}
```

### 8.2 路况提供者扩展点

```java
/**
 * 路况数据提供者扩展点
 * 
 * 允许接入第三方路况数据源
 */
public interface TrafficProvider {
    
    /**
     * 获取路况数据
     */
    TrafficData getTrafficData(GeoPoint location, double radius);
    
    /**
     * 获取路径路况
     */
    RouteTraffic getRouteTraffic(String routeId, List<GeoPoint> waypoints);
    
    /**
     * 订阅路况更新
     */
    void subscribeTrafficUpdates(String routeId, Consumer<TrafficUpdate> callback);
    
    /**
     * 获取提供者名称
     */
    String getProviderName();
}
```

### 8.3 资源提供者扩展点

```java
/**
 * 资源点提供者扩展点
 * 
 * 允许接入第三方资源数据源 (充电站、加油站等)
 */
public interface ResourceProvider {
    
    /**
     * 搜索资源点
     */
    List<ResourcePoint> search(ResourceSearchRequest request);
    
    /**
     * 获取资源点详情
     */
    ResourcePoint getDetail(String resourceId);
    
    /**
     * 获取实时状态
     */
    ResourceStatus getRealTimeStatus(String resourceId);
    
    /**
     * 获取支持的资源类型
     */
    List<ResourceType> getSupportedTypes();
}
```

---

## 9. 测试覆盖

### 9.1 单元测试

| 测试类 | 测试内容 |
|--------|----------|
| RoutePlannerTest | 路径规划核心逻辑 |
| TripPlannerTest | 行程规划 (TSP) |
| FleetSchedulerTest | 车队调度 (VRP) |
| ResourceRecommenderTest | 资源推荐 |
| ReplanHandlerTest | 重规划逻辑 |
| DistanceMatrixTest | 距离矩阵计算 |

### 9.2 集成测试

| 测试场景 | 测试内容 |
|----------|----------|
| 规划流程测试 | 完整规划流程 |
| 实时路况集成 | 路况数据接入 |
| 重规划集成 | 触发条件与执行 |
| 多模块协作 | 与车辆接入、监控模块协作 |

### 9.3 性能测试

| 指标 | 目标值 |
|------|--------|
| 简单路径规划 | < 200ms |
| 10 点行程规划 | < 500ms |
| 50 点行程规划 | < 2s |
| 车队调度 (10 车 50 任务) | < 5s |
| 资源推荐 | < 300ms |

---

## 10. 部署架构

### 10.1 独立部署

```
┌─────────────────────────────────────────────────────────────┐
│                    Planning Service                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ API Server  │  │  GraphHopper│  │  OR-Tools   │         │
│  │  :8080      │  │  (内存路网)  │  │  (优化求解)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ PostgreSQL  │    │    Redis    │    │    Kafka    │
│ (规划数据)  │    │  (缓存)     │    │  (事件)     │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 10.2 水平扩展

```
                    ┌─────────────┐
                    │   Nginx     │
                    │  (负载均衡)  │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │ Planning-1  │ │ Planning-2  │ │ Planning-3  │
    └─────────────┘ └─────────────┘ └─────────────┘
           │               │               │
           └───────────────┼───────────────┘
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    │   (主从)    │
                    └─────────────┘
```

---

## 11. 监控指标

### 11.1 Prometheus 指标

```yaml
# 规划请求计数
planning_requests_total{type="route|trip|fleet|resource",status="success|failed"}

# 规划耗时
planning_duration_seconds{type="route|trip|fleet|resource",strategy="fastest|shortest|..."}

# 缓存命中
planning_cache_hits_total
planning_cache_misses_total

# 重规划触发
planning_replan_total{reason="congestion|road_closed|accident|low_battery"}

# OR-Tools 求解统计
planning_ortools_solve_duration_seconds
planning_ortools_solutions_found_total
```

### 11.2 日志规范

```
[INFO] 2026-03-25 10:00:00.000 [planning-service] Route planning started: planId=xxx, vehicleId=xxx, strategy=FASTEST
[INFO] 2026-03-25 10:00:00.150 [planning-service] Route planning completed: planId=xxx, distance=15200m, duration=1800s, timeMs=150
[WARN] 2026-03-25 10:05:00.000 [planning-service] Replan triggered: vehicleId=xxx, reason=CONGESTION_SEVERE, savedTime=600s
[ERROR] 2026-03-25 10:10:00.000 [planning-service] Fleet scheduling failed: taskId=xxx, error="No feasible solution"
```

---

## 12. 最佳实践

### 12.1 规划策略选择

| 场景 | 推荐策略 | 说明 |
|------|----------|------|
| 城市配送 | FASTEST + REAL_TIME | 实时避开拥堵 |
| 长途运输 | SHORTEST + AVOID_TOLL | 节省成本 |
| 紧急救援 | FASTEST | 时间优先 |
| 车队调度 | MIN_TIME | 效率优先 |

### 12.2 性能优化建议

1. **路网数据预热**: 启动时加载路网到内存
2. **距离矩阵缓存**: 对于固定节点集缓存距离矩阵
3. **并行计算**: 多起终点矩阵计算并行化
4. **增量更新**: 路况变化时增量更新而非全量重规划

### 12.3 错误处理

| 错误类型 | 处理方式 |
|----------|----------|
| 无可达路径 | 返回错误码 + 建议 |
| 求解超时 | 返回次优解或降级策略 |
| 数据缺失 | 使用默认值 + 警告日志 |
| 服务降级 | 关闭实时路况，使用静态规划 |

---

## 13. 总结

### 13.1 模块特性

| 特性 | 描述 |
|------|------|
| **智能化** | 多策略路径规划，运筹优化求解 |
| **实时性** | 实时路况感知，动态重规划 |
| **扩展性** | SPI 扩展点支持第三方算法和数据源 |
| **高性能** | 内存路网，并行计算，结果缓存 |
| **可靠性** | 降级策略，熔断保护，自动恢复 |

### 13.2 开发计划

| 阶段 | 内容 | 工期 |
|------|------|------|
| Phase 1 | 基础路径规划 | 2 周 |
| Phase 2 | 行程规划 (TSP) | 1 周 |
| Phase 3 | 车队调度 (VRP) | 2 周 |
| Phase 4 | 资源推荐 | 1 周 |
| Phase 5 | 实时重规划 | 1 周 |
| Phase 6 | 测试与优化 | 1 周 |
| **总计** | | **8 周** |

---

_文档维护：渔晓白_  
_最后更新：2026-03-25___