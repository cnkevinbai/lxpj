# 模块开发规范 (Module Development Specification)

**版本**: 1.0.0  
**日期**: 2026-03-24

---

## 1. 核心原则

### 1.1 接口优先原则 (Interface First)

> **先写接口文档，再写实现代码。严禁模块间直接调用内部私有方法。**

```
开发流程:
1. 定义接口文档 (OpenAPI / module.yaml)
2. 设计数据模型
3. 编写单元测试
4. 实现业务逻辑
5. 集成测试验证
```

### 1.2 高内聚低耦合原则

```
模块边界:
├── 内部实现 (private) - 只有模块自己能访问
├── 模块接口 (public API) - 对外暴露的服务
├── 扩展点 (extension points) - 允许其他模块扩展
└── 事件 (events) - 模块间异步通信
```

### 1.3 单一职责原则

每个模块只负责一个明确的业务领域：

| 模块类型 | 职责范围 | 示例 |
|---------|---------|------|
| core | 核心框架能力 | plugin-framework, hot-reload-engine |
| business | 业务功能 | vehicle-access, monitor-service |
| adapter | 协议适配 | jtt808-adapter, mqtt-adapter |
| extension | 功能扩展 | custom-report, third-party-integration |

---

## 2. 模块结构规范

### 2.1 标准目录结构

```
module-name/
├── module.yaml                    # 模块配置文件 (必需)
├── pom.xml                        # Maven 构建配置
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/daod/iov/modules/{module}/
│   │   │       ├── {ModuleName}Module.java    # 模块主类 (必需)
│   │   │       ├── api/                        # 对外接口
│   │   │       │   ├── {Module}Service.java    # 服务接口
│   │   │       │   ├── dto/                    # 数据传输对象
│   │   │       │   └── event/                  # 事件定义
│   │   │       ├── internal/                   # 内部实现 (不对外)
│   │   │       │   ├── service/                # 服务实现
│   │   │       │   ├── repository/             # 数据访问
│   │   │       │   └── util/                   # 工具类
│   │   │       ├── config/                     # 配置类
│   │   │       └── extension/                  # 扩展点实现
│   │   └── resources/
│   │       ├── application.yml                 # 应用配置
│   │       └── openapi.yaml                    # API 文档
│   └── test/
│       └── java/
│           └── {ModuleName}ModuleTest.java     # 单元测试
└── docs/
    └── README.md                               # 模块文档
```

### 2.2 模块主类规范

```java
package com.daod.iov.modules.vehicleaccess;

import com.daod.iov.plugin.*;

/**
 * 车辆接入模块
 * 
 * @author daod-team
 * @version 1.0.0
 */
public class VehicleAccessModule implements ISFU {
    
    // ==================== 元数据 ====================
    
    private ModuleMetadata metadata;
    private ModuleState state = ModuleState.UNINITIALIZED;
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    private ModuleContext context;
    
    // ==================== 内部服务 ====================
    
    private VehicleAuthService authService;
    private VehicleRegisterService registerService;
    private VehicleHeartbeatService heartbeatService;
    private VehicleSessionService sessionService;
    
    // ==================== 监控指标 ====================
    
    private ModuleMetrics metrics;
    
    /**
     * 构造函数
     */
    public VehicleAccessModule() {
        this.metadata = ModuleMetadata.builder()
            .name("vehicle-access")
            .version("1.0.0")
            .description("车辆接入服务模块")
            .type("business")
            .priority(60)
            .build();
    }
    
    // ==================== 生命周期 ====================
    
    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        this.context = context;
        logInfo("车辆接入模块初始化中...");
        
        try {
            // 1. 加载配置
            loadConfig(context.getConfig());
            
            // 2. 初始化内部服务
            authService = new VehicleAuthServiceImpl();
            registerService = new VehicleRegisterServiceImpl();
            heartbeatService = new VehicleHeartbeatServiceImpl();
            sessionService = new VehicleSessionServiceImpl();
            
            // 3. 初始化监控指标
            metrics = new VehicleAccessMetrics();
            
            state = ModuleState.INITIALIZED;
            healthStatus = HealthStatus.HEALTHY;
            
            logInfo("车辆接入模块初始化完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            healthStatus = HealthStatus.UNHEALTHY;
            throw new ModuleException("INIT_FAILED", "初始化失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void start() throws ModuleException {
        logInfo("车辆接入模块启动中...");
        
        try {
            // 启动内部服务
            authService.start();
            heartbeatService.start();
            sessionService.start();
            
            state = ModuleState.RUNNING;
            healthStatus = HealthStatus.HEALTHY;
            
            logInfo("车辆接入模块启动完成");
        } catch (Exception e) {
            state = ModuleState.ERROR;
            throw new ModuleException("START_FAILED", "启动失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void stop() throws ModuleException {
        logInfo("车辆接入模块停止中...");
        
        try {
            // 优雅停机
            sessionService.stop();
            heartbeatService.stop();
            authService.stop();
            
            state = ModuleState.STOPPED;
            healthStatus = HealthStatus.OFFLINE;
            
            logInfo("车辆接入模块已停止");
        } catch (Exception e) {
            throw new ModuleException("STOP_FAILED", "停止失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void destroy() throws ModuleException {
        logInfo("车辆接入模块销毁中...");
        
        // 释放资源
        authService = null;
        registerService = null;
        heartbeatService = null;
        sessionService = null;
        metrics = null;
        
        state = ModuleState.DESTROYED;
        
        logInfo("车辆接入模块已销毁");
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
            .healthy(healthStatus == HealthStatus.HEALTHY)
            .message("车辆接入服务运行正常")
            .timestamp(System.currentTimeMillis())
            .build();
    }
    
    // ==================== API 规范 ====================
    
    @Override
    public String getApiSpecification() {
        return "/api/vehicle-access/openapi.yaml";
    }
    
    @Override
    public List<ApiDependency> getApiDependencies() {
        return List.of(
            new ApiDependency("tenant-api", "tenant-service", "^1.0.0"),
            new ApiDependency("auth-api", "auth-service", "^1.0.0")
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
            .maxConnections(1000)
            .build();
    }
    
    // ==================== 工具方法 ====================
    
    private void logInfo(String message) {
        System.out.println("[INFO] [VehicleAccess] " + message);
    }
}
```

---

## 3. 模块配置规范

### 3.1 module.yaml 完整示例

```yaml
# API 版本
apiVersion: iov.daod.com/v1

# 资源类型
kind: Module

# 元数据
metadata:
  name: vehicle-access
  version: 1.0.0
  description: 车辆接入服务模块
  author: daod-team
  license: Apache-2.0
  labels:
    tier: business
    critical: "true"

# 规格定义
spec:
  # 模块类型
  type: business
  
  # 加载优先级 (数字越大越先加载)
  priority: 60
  
  # 主类
  mainClass: com.daod.iov.modules.vehicleaccess.VehicleAccessModule
  
  # 依赖声明
  dependencies:
    - name: plugin-framework
      version: ">=1.0.0"
      optional: false
    - name: common-core
      version: "^1.0.0"
      optional: false
    - name: tenant-service
      version: "^1.0.0"
      optional: false
    - name: mqtt-client
      version: "~1.0.0"
      optional: true
  
  # 提供的 API
  provides:
    - name: vehicle-access-api
      version: "1.0.0"
      openapi: /openapi.yaml
      endpoints:
        - path: /api/v1/vehicles
          method: GET
          description: 获取车辆列表
        - path: /api/v1/vehicles/{vin}
          method: GET
          description: 获取车辆详情
        - path: /api/v1/vehicles/auth
          method: POST
          description: 车辆认证
  
  # 消费的 API
  consumes:
    - name: tenant-api
      version: "^1.0.0"
      from: tenant-service
    - name: auth-api
      version: "^1.0.0"
      from: auth-service
  
  # 提供的扩展点
  extensionPoints:
    - name: vehicle-auth-handler
      interface: com.daod.iov.modules.vehicleaccess.api.VehicleAuthHandler
      description: 车辆认证处理器扩展点
      multiple: true  # 允许多个实现
    - name: vehicle-event-listener
      interface: com.daod.iov.modules.vehicleaccess.api.VehicleEventListener
      description: 车辆事件监听器扩展点
      multiple: true
  
  # 使用的扩展点
  uses:
    - name: tenant-resolver
      from: tenant-service
    - name: event-publisher
      from: event-bus
  
  # 权限需求
  permissions:
    - NETWORK_CONNECT
    - FILE_READ
    - FILE_WRITE
  
  # 资源需求
  resources:
    cpu: "200m"
    memory: "256Mi"
    maxConnections: 1000
    maxFileDescriptors: 100
  
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
    healthCheckTimeout: 30s
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
      fields:
        - timestamp
        - level
        - module
        - message
        - traceId
  
  # 配置项定义
  configSchema:
    type: object
    properties:
      auth:
        type: object
        properties:
          tokenExpireHours:
            type: integer
            default: 24
            description: Token 过期时间 (小时)
          maxRetry:
            type: integer
            default: 3
            description: 最大重试次数
      heartbeat:
        type: object
        properties:
          timeoutMinutes:
            type: integer
            default: 5
            description: 心跳超时时间 (分钟)
```

---

## 4. 版本管理规范

### 4.1 语义化版本控制 (SemVer)

```
版本格式: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]

MAJOR: 主版本号 - 不兼容的 API 变更
MINOR: 次版本号 - 向后兼容的功能新增
PATCH: 修订号 - 向后兼容的问题修复
PRERELEASE: 预发布版本 (alpha, beta, rc)
BUILD: 构建元数据

示例:
- 1.0.0        正式版本
- 1.1.0        新增功能
- 1.1.1        Bug 修复
- 2.0.0        重大变更
- 1.2.0-beta.1 预发布版本
```

### 4.2 依赖版本范围

```
精确版本:     "1.0.0"           必须是 1.0.0
兼容版本:     "^1.0.0"          1.x.x (主版本相同)
近似版本:     "~1.0.0"          1.0.x (主次版本相同)
范围版本:     ">=1.0.0 <2.0.0"  在指定范围内
或版本:       "1.0.0 || 2.0.0"  任一版本
最新版本:     "*" 或 "latest"   最新稳定版
```

---

## 5. 测试规范

### 5.1 测试覆盖要求

| 测试类型 | 覆盖率要求 | 说明 |
|---------|-----------|------|
| 单元测试 | ≥ 80% | 每个公共方法都有测试 |
| 集成测试 | 关键路径 100% | 模块间交互测试 |
| 端到端测试 | 核心场景 | 完整业务流程 |
| 性能测试 | 关键指标 | 响应时间、吞吐量 |

### 5.2 单元测试模板

```java
@DisplayName("车辆接入模块单元测试")
class VehicleAccessModuleTest {
    
    private VehicleAccessModule module;
    private ModuleContext context;
    
    @BeforeEach
    void setUp() {
        module = new VehicleAccessModule();
        context = new ModuleContext();
    }
    
    @AfterEach
    void tearDown() throws Exception {
        if (module.getState() != ModuleState.DESTROYED) {
            module.stop();
            module.destroy();
        }
    }
    
    @Test
    @DisplayName("测试模块元数据")
    void testMetadata() {
        ModuleMetadata metadata = module.getMetadata();
        assertNotNull(metadata);
        assertEquals("vehicle-access", metadata.getName());
        assertEquals("1.0.0", metadata.getVersion());
    }
    
    @Test
    @DisplayName("测试完整生命周期")
    void testLifecycle() throws ModuleException {
        // 初始化
        module.initialize(context);
        assertEquals(ModuleState.INITIALIZED, module.getState());
        
        // 启动
        module.start();
        assertEquals(ModuleState.RUNNING, module.getState());
        
        // 健康检查
        assertEquals(HealthStatus.HEALTHY, module.getHealthStatus());
        
        // 停止
        module.stop();
        assertEquals(ModuleState.STOPPED, module.getState());
        
        // 销毁
        module.destroy();
        assertEquals(ModuleState.DESTROYED, module.getState());
    }
    
    @Test
    @DisplayName("测试健康检查")
    void testHealthCheck() throws ModuleException {
        module.initialize(context);
        module.start();
        
        HealthCheckResult result = module.healthCheck();
        assertTrue(result.isHealthy());
        assertNotNull(result.getMessage());
    }
    
    @Test
    @DisplayName("测试监控指标")
    void testMetrics() throws ModuleException {
        module.initialize(context);
        module.start();
        
        List<Metric> metrics = module.getMetrics();
        assertNotNull(metrics);
        assertFalse(metrics.isEmpty());
    }
}
```

---

## 6. 文档规范

### 6.1 模块文档模板

```markdown
# {模块名称} ({module-name})

## 模块信息

| 属性 | 值 |
|-----|-----|
| 名称 | {module-name} |
| 版本 | {version} |
| 类型 | core/business/adapter/extension |
| 优先级 | {priority} |

## 功能描述

{详细描述模块功能}

## API 接口

### REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| GET | /api/v1/xxx | xxx |

### MQTT 主题

| 主题 | 方向 | 描述 |
|-----|------|------|
| xxx | 上行 | xxx |

## 配置项

| 配置项 | 类型 | 默认值 | 描述 |
|-------|------|--------|------|
| xxx | string | xxx | xxx |

## 依赖关系

### 依赖

- {dependency-name}: {version}

### 被依赖

- {dependent-name}: {version}

## 扩展点

### 提供的扩展点

- {extension-point-name}: {interface}

### 使用的扩展点

- {extension-point-name}: from {module-name}

## 使用示例

{代码示例}

## 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-24 | 初始版本 |
```

---

_文档维护：渔晓白_