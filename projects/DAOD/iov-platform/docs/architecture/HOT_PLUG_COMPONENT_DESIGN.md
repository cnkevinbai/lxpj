# 热插拔功能组件设计文档

**版本**: 1.0.0  
**日期**: 2026-03-24  
**作者**: 渔晓白

---

## 1. 概述

### 1.1 设计目标

热插拔功能组件是 iov-platform 的核心基础设施，实现"像 USB 设备一样即插即用"的模块化架构。

| 目标 | 描述 |
|------|------|
| **动态性** | 运行时加载/卸载模块，无需重启 |
| **安全性** | 沙箱隔离，权限控制，资源配额 |
| **可靠性** | 熔断保护，自动回滚，健康检查 |
| **可观测性** | 完整的监控指标和事件通知 |

### 1.2 核心组件清单

| 组件 | 代码量 | 状态 | 职责 |
|------|--------|------|------|
| **ModuleManager** | 105 行 | ✅ | 模块生命周期管理 |
| **DefaultModuleManager** | 963 行 | ✅ | 模块管理器实现 |
| **HotReloadEngine** | 165 行 | ✅ | 热更新引擎 |
| **SandboxManager** | 9 文件 | ✅ | 沙箱管理器 |
| **CircuitBreaker** | 6 文件 | ✅ | 熔断器 |
| **RollbackManager** | 5 文件 | ✅ | 回滚管理器 |
| **MetricsRegistry** | 2 文件 | ✅ | 指标注册表 |

---

## 2. 核心组件设计

### 2.1 ModuleManager (模块管理器)

#### 接口定义

```java
package com.daod.iov.plugin;

/**
 * 模块管理器接口
 * 
 * 职责：
 * - 模块生命周期管理 (加载/卸载/启动/停止)
 * - 模块依赖管理
 * - 模块状态监控
 * - 事件通知
 */
public interface ModuleManager {
    
    // ==================== 生命周期管理 ====================
    
    /**
     * 初始化模块管理器
     */
    void initialize() throws ModuleException;
    
    /**
     * 加载模块
     * @param modulePath 模块路径 (目录/JAR 文件)
     * @return 加载的模块实例
     */
    IModule loadModule(String modulePath) throws ModuleException;
    
    /**
     * 卸载模块
     * @param moduleId 模块ID (name:version)
     */
    void unloadModule(String moduleId) throws ModuleException;
    
    /**
     * 启动模块
     * @param moduleId 模块ID
     */
    void startModule(String moduleId) throws ModuleException;
    
    /**
     * 停止模块
     * @param moduleId 模块ID
     */
    void stopModule(String moduleId) throws ModuleException;
    
    /**
     * 热更新模块 (原子操作)
     * @param moduleId 要更新的模块ID
     * @param newModulePath 新模块路径
     */
    void updateModule(String moduleId, String newModulePath) throws ModuleException;
    
    // ==================== 查询接口 ====================
    
    /**
     * 获取模块实例
     */
    IModule getModule(String moduleId);
    
    /**
     * 获取所有模块
     */
    List<IModule> getAllModules();
    
    /**
     * 获取模块状态
     */
    ModuleState getModuleState(String moduleId);
    
    /**
     * 获取模块健康状态
     */
    HealthStatus getModuleHealth(String moduleId);
    
    // ==================== 依赖管理 ====================
    
    /**
     * 检查模块依赖是否满足
     */
    boolean checkDependencies(String moduleId);
    
    /**
     * 解析依赖关系图 (拓扑排序)
     */
    Map<String, List<String>> resolveDependencies(List<String> modules);
    
    // ==================== 事件监听 ====================
    
    /**
     * 注册模块监听器
     */
    void registerModuleListener(ModuleListener listener);
    
    /**
     * 移除模块监听器
     */
    void unregisterModuleListener(ModuleListener listener);
    
    /**
     * 关闭模块管理器
     */
    void shutdown();
}
```

#### 核心实现 (DefaultModuleManager)

```java
package com.daod.iov.plugin.impl;

/**
 * 默认模块管理器实现
 * 
 * 核心特性：
 * - 支持 JAR 包和目录两种模块形式
 * - 支持 module.yaml 配置解析
 * - 支持语义化版本兼容检查
 * - 支持循环依赖检测
 * - 支持独立的类加载器隔离
 */
public class DefaultModuleManager implements ModuleManager {
    
    // 模块注册表
    private final Map<String, IModule> modules = new ConcurrentHashMap<>();
    
    // 模块状态表
    private final Map<String, ModuleState> moduleStates = new ConcurrentHashMap<>();
    
    // 模块类加载器
    private final Map<String, ClassLoader> moduleClassLoaders = new ConcurrentHashMap<>();
    
    // 监听器列表
    private final List<ModuleListener> listeners = new CopyOnWriteArrayList<>();
    
    // 初始化标志
    private volatile boolean initialized = false;
    
    // ==================== 核心方法实现 ====================
    
    @Override
    public IModule loadModule(String modulePath) throws ModuleException {
        // 1. 解析模块元数据
        ModuleMetadata metadata = parseModuleMetadata(modulePath);
        String moduleId = metadata.getName() + ":" + metadata.getVersion();
        
        // 2. 检查是否已加载
        if (modules.containsKey(moduleId)) {
            throw new ModuleException("MODULE_ALREADY_LOADED", "模块已加载: " + moduleId);
        }
        
        // 3. 检查依赖
        if (!checkDependencies(moduleId)) {
            throw new ModuleException("DEPENDENCY_NOT_SATISFIED", "依赖未满足: " + moduleId);
        }
        
        // 4. 创建独立的类加载器
        ClassLoader classLoader = createModuleClassLoader(modulePath);
        
        // 5. 加载模块主类
        String mainClass = metadata.getMainClass();
        IModule module;
        try {
            Class<?> clazz = classLoader.loadClass(mainClass);
            module = (IModule) clazz.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new ModuleException("MODULE_LOAD_FAILED", "加载模块主类失败: " + mainClass, e);
        }
        
        // 6. 注册模块
        modules.put(moduleId, module);
        moduleStates.put(moduleId, ModuleState.UNINITIALIZED);
        moduleClassLoaders.put(moduleId, classLoader);
        
        // 7. 通知监听器
        notifyModuleLoaded(moduleId, metadata);
        
        return module;
    }
    
    @Override
    public void updateModule(String moduleId, String newModulePath) throws ModuleException {
        IModule oldModule = modules.get(moduleId);
        if (oldModule == null) {
            throw new ModuleException("MODULE_NOT_FOUND", "模块不存在: " + moduleId);
        }
        
        ModuleMetadata oldMetadata = oldModule.getMetadata();
        
        try {
            // 1. 停止旧模块
            if (moduleStates.get(moduleId) == ModuleState.RUNNING) {
                stopModule(moduleId);
            }
            
            // 2. 卸载旧模块
            unloadModule(moduleId);
            
            // 3. 加载新模块
            IModule newModule = loadModule(newModulePath);
            ModuleMetadata newMetadata = newModule.getMetadata();
            
            // 4. 启动新模块
            String newModuleId = newMetadata.getName() + ":" + newMetadata.getVersion();
            startModule(newModuleId);
            
            // 5. 通知监听器
            notifyModuleUpdated(moduleId, oldMetadata.getVersion(), newMetadata.getVersion());
            
        } catch (Exception e) {
            // 自动回滚
            rollbackModule(moduleId, oldMetadata);
            throw new ModuleException("MODULE_UPDATE_FAILED", "模块更新失败: " + e.getMessage(), e);
        }
    }
    
    // ==================== 版本兼容性检查 ====================
    
    /**
     * 检查版本兼容性
     * 支持 ^, ~, >=, <=, >, <, = 操作符
     */
    private boolean isVersionCompatible(String requiredVersion, String actualVersion) {
        if (requiredVersion.startsWith("^")) {
            // ^1.0.0 → 兼容 1.x.x
            return isCompatibleWithCaret(actualVersion, requiredVersion.substring(1));
        } else if (requiredVersion.startsWith("~")) {
            // ~1.2.0 → 兼容 1.2.x
            return isCompatibleWithTilde(actualVersion, requiredVersion.substring(1));
        } else if (requiredVersion.startsWith(">=")) {
            return compareVersions(actualVersion, requiredVersion.substring(2)) >= 0;
        } else if (requiredVersion.startsWith("<=")) {
            return compareVersions(actualVersion, requiredVersion.substring(2)) <= 0;
        } else if (requiredVersion.startsWith(">")) {
            return compareVersions(actualVersion, requiredVersion.substring(1)) > 0;
        } else if (requiredVersion.startsWith("<")) {
            return compareVersions(actualVersion, requiredVersion.substring(1)) < 0;
        } else {
            // 精确匹配
            return actualVersion.equals(requiredVersion);
        }
    }
    
    // ==================== 循环依赖检测 ====================
    
    /**
     * 检测循环依赖 (DFS)
     */
    private boolean hasCircularDependency(Map<String, List<String>> dependencyGraph) {
        Set<String> visited = new HashSet<>();
        Set<String> recursionStack = new HashSet<>();
        
        for (String node : dependencyGraph.keySet()) {
            if (detectCycle(node, dependencyGraph, visited, recursionStack)) {
                return true;
            }
        }
        return false;
    }
    
    private boolean detectCycle(String node, Map<String, List<String>> graph, 
                                 Set<String> visited, Set<String> stack) {
        if (stack.contains(node)) return true;
        if (visited.contains(node)) return false;
        
        visited.add(node);
        stack.add(node);
        
        List<String> dependencies = graph.get(node);
        if (dependencies != null) {
            for (String dep : dependencies) {
                if (detectCycle(dep, graph, visited, stack)) {
                    return true;
                }
            }
        }
        
        stack.remove(node);
        return false;
    }
}
```

---

### 2.2 SandboxManager (沙箱管理器)

#### 接口定义

```java
package com.daod.iov.plugin.sandbox;

/**
 * 沙箱管理器接口
 * 
 * 职责：
 * - 模块隔离 (权限控制、资源配额)
 * - 安全执行环境
 * - 资源使用监控
 */
public interface SandboxManager {
    
    /**
     * 创建沙箱
     */
    ModuleSandbox createSandbox(SandboxConfig config) throws SandboxException;
    
    /**
     * 销毁沙箱
     */
    void destroySandbox(String sandboxId);
    
    /**
     * 在沙箱中执行操作
     */
    <T> T executeInSandbox(String sandboxId, Callable<T> action) throws SandboxException;
    
    /**
     * 检查权限
     */
    boolean checkPermission(String sandboxId, Permission permission);
    
    /**
     * 获取资源使用情况
     */
    ResourceUsage getResourceUsage(String sandboxId);
    
    /**
     * 暂停/恢复沙箱
     */
    void pauseSandbox(String sandboxId);
    void resumeSandbox(String sandboxId);
}
```

#### 沙箱配置

```java
/**
 * 沙箱配置
 */
public class SandboxConfig {
    private String sandboxId;
    private String moduleId;
    
    // 权限配置
    private List<Permission> allowedPermissions;
    private List<Permission> deniedPermissions;
    
    // 资源配额
    private ResourceQuota resourceQuota;
    
    // 文件系统策略
    private FileSystemPolicy fileSystemPolicy;
    
    // 网络策略
    private NetworkPolicy networkPolicy;
}

/**
 * 资源配额
 */
public class ResourceQuota {
    private long maxMemoryMB;        // 最大内存 (MB)
    private int maxThreads;          // 最大线程数
    private long maxCpuTimeMs;       // 最大 CPU 时间 (ms)
    private long maxFileSizeMB;      // 最大文件大小 (MB)
    private int maxOpenFiles;        // 最大打开文件数
    private int maxNetworkConnections; // 最大网络连接数
}

/**
 * 权限定义
 */
public enum Permission {
    // 文件权限
    FILE_READ,
    FILE_WRITE,
    FILE_DELETE,
    
    // 网络权限
    NETWORK_CONNECT,
    NETWORK_LISTEN,
    NETWORK_ACCEPT,
    
    // 系统权限
    SYSTEM_PROCESS,
    SYSTEM_ENVIRONMENT,
    SYSTEM_PROPERTY,
    
    // 模块权限
    MODULE_LOAD,
    MODULE_UNLOAD,
    
    // 全部权限
    ALL
}
```

---

### 2.3 CircuitBreaker (熔断器)

#### 接口定义

```java
package com.daod.iov.plugin.circuitbreaker;

/**
 * 熔断器接口
 * 
 * 状态机:
 * CLOSED → OPEN → HALF_OPEN → CLOSED/OPEN
 * 
 * 触发条件:
 * - 错误率超过阈值
 * - 慢调用比例过高
 * - 连续失败次数过多
 */
public interface CircuitBreaker {
    
    /**
     * 记录成功
     */
    void recordSuccess();
    
    /**
     * 记录失败
     */
    void recordFailure(Throwable error);
    
    /**
     * 获取当前状态
     */
    CircuitState getState();
    
    /**
     * 是否允许请求
     */
    boolean allowRequest();
    
    /**
     * 强制熔断
     */
    void trip();
    
    /**
     * 重置熔断器
     */
    void reset();
    
    /**
     * 尝试恢复 (进入半开状态)
     */
    void attemptReset();
    
    /**
     * 获取统计信息
     */
    CircuitBreakerStats getStats();
    
    /**
     * 添加状态监听器
     */
    void addListener(CircuitBreakerListener listener);
}

/**
 * 熔断器状态
 */
public enum CircuitState {
    CLOSED,      // 关闭 (正常)
    OPEN,        // 打开 (熔断)
    HALF_OPEN    // 半开 (尝试恢复)
}

/**
 * 熔断器配置
 */
public class CircuitBreakerConfig {
    private String name;
    
    // 熔断阈值
    private double failureRateThreshold = 50.0;     // 失败率阈值 (%)
    private int minimumNumberOfCalls = 100;          // 最小调用次数
    private double slowCallRateThreshold = 100.0;   // 慢调用率阈值 (%)
    private long slowCallDurationThreshold = 2000;  // 慢调用时间阈值 (ms)
    
    // 等待时间
    private long waitDurationInOpenState = 60000;   // 熔断等待时间 (ms)
    private int permittedNumberOfCallsInHalfOpenState = 10; // 半开状态允许调用数
    
    // 自动恢复
    private boolean automaticTransitionFromOpenToHalfOpen = true;
}
```

#### 状态机实现

```java
/**
 * 熔断器状态机
 * 
 * 状态转换：
 * CLOSED → OPEN: 错误率超过阈值
 * OPEN → HALF_OPEN: 等待时间结束
 * HALF_OPEN → CLOSED: 测试调用成功
 * HALF_OPEN → OPEN: 测试调用失败
 */
public class CircuitBreakerImpl implements CircuitBreaker {
    
    private final CircuitBreakerConfig config;
    private final AtomicReference<CircuitState> state = new AtomicReference<>(CircuitState.CLOSED);
    
    // 统计窗口
    private final SlidingWindow slidingWindow;
    
    // 监听器
    private final List<CircuitBreakerListener> listeners = new CopyOnWriteArrayList<>();
    
    @Override
    public void recordFailure(Throwable error) {
        slidingWindow.recordFailure();
        
        if (state.get() == CircuitState.HALF_OPEN) {
            // 半开状态失败，立即熔断
            trip();
        } else if (shouldTrip()) {
            trip();
        }
    }
    
    @Override
    public boolean allowRequest() {
        CircuitState currentState = state.get();
        
        switch (currentState) {
            case CLOSED:
                return true;
                
            case OPEN:
                // 检查是否可以进入半开状态
                if (shouldAttemptReset()) {
                    attemptReset();
                    return true;
                }
                return false;
                
            case HALF_OPEN:
                // 半开状态允许少量请求
                return slidingWindow.getHalfOpenCalls() < config.getPermittedNumberOfCallsInHalfOpenState();
                
            default:
                return false;
        }
    }
    
    private boolean shouldTrip() {
        CircuitBreakerStats stats = slidingWindow.getStats();
        
        // 检查失败率
        if (stats.getTotalCalls() >= config.getMinimumNumberOfCalls()) {
            double failureRate = stats.getFailureRate();
            if (failureRate >= config.getFailureRateThreshold()) {
                return true;
            }
        }
        
        // 检查慢调用率
        double slowCallRate = stats.getSlowCallRate();
        if (slowCallRate >= config.getSlowCallRateThreshold()) {
            return true;
        }
        
        return false;
    }
}
```

---

### 2.4 RollbackManager (回滚管理器)

#### 接口定义

```java
package com.daod.iov.plugin.rollback;

/**
 * 回滚管理器接口
 * 
 * 职责：
 * - 模块版本备份
 * - 自动/手动回滚
 * - 备份历史管理
 */
public interface RollbackManager {
    
    /**
     * 创建备份点
     */
    String createBackup(String moduleId) throws RollbackException;
    
    /**
     * 回滚到指定备份
     */
    void rollback(String moduleId, String backupId) throws RollbackException;
    
    /**
     * 回滚到上一版本
     */
    void rollbackToPrevious(String moduleId) throws RollbackException;
    
    /**
     * 自动回滚 (熔断触发)
     */
    boolean autoRollback(String moduleId);
    
    /**
     * 获取备份列表
     */
    List<BackupInfo> listBackups(String moduleId);
    
    /**
     * 清理过期备份
     */
    void cleanupOldBackups(String moduleId, int keepCount);
    
    /**
     * 启用/禁用自动回滚
     */
    void setAutoRollbackEnabled(boolean enabled);
}
```

#### 备份信息

```java
/**
 * 备份信息
 */
public class BackupInfo {
    private String backupId;
    private String moduleId;
    private String moduleVersion;
    private String modulePath;
    private LocalDateTime createdAt;
    private long sizeBytes;
    private String checksum;
    private String description;
}

/**
 * 回滚记录
 */
public class RollbackRecord {
    private String recordId;
    private String moduleId;
    private String fromVersion;
    private String toVersion;
    private RollbackReason reason;
    private RollbackStatus status;
    private LocalDateTime executedAt;
    private long durationMs;
}

public enum RollbackReason {
    MANUAL,           // 手动回滚
    CIRCUIT_BREAKER,  // 熔断触发
    HEALTH_CHECK,     // 健康检查失败
    UPDATE_FAILURE    // 更新失败
}

public enum RollbackStatus {
    SUCCESS,
    FAILED,
    IN_PROGRESS
}
```

---

## 3. API 接口设计

### 3.1 REST API

```yaml
# 模块管理 API
openapi: 3.0.0
info:
  title: Module Management API
  version: 1.0.0

paths:
  /api/v1/modules:
    get:
      summary: 获取模块列表
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [running, stopped, error]
        - name: type
          in: query
          schema:
            type: string
            enum: [core, business, adapter, extension]
      responses:
        200:
          description: 模块列表
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Module'

  /api/v1/modules/{moduleId}:
    get:
      summary: 获取模块详情
      parameters:
        - name: moduleId
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: 模块详情
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ModuleDetail'

  /api/v1/modules/{moduleId}/start:
    post:
      summary: 启动模块
      parameters:
        - name: moduleId
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: 启动成功
        400:
          description: 启动失败

  /api/v1/modules/{moduleId}/stop:
    post:
      summary: 停止模块
      parameters:
        - name: moduleId
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: 停止成功

  /api/v1/modules/{moduleId}/update:
    post:
      summary: 热更新模块
      parameters:
        - name: moduleId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
                strategy:
                  type: string
                  enum: [rolling, blue-green, canary]
      responses:
        200:
          description: 更新成功
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UpdateResult'

  /api/v1/modules/upload:
    post:
      summary: 上传并加载模块
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file:
                  type: string
                  format: binary
      responses:
        200:
          description: 加载成功

  /api/v1/modules/{moduleId}/rollback:
    post:
      summary: 回滚模块
      parameters:
        - name: moduleId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                backupId:
                  type: string
      responses:
        200:
          description: 回滚成功

  /api/v1/modules/{moduleId}/backups:
    get:
      summary: 获取备份列表
      parameters:
        - name: moduleId
          in: path
          required: true
          schema:
            type: string
      responses:
        200:
          description: 备份列表

  /api/v1/modules/{moduleId}/health:
    get:
      summary: 获取模块健康状态
      responses:
        200:
          description: 健康状态

  /api/v1/modules/{moduleId}/metrics:
    get:
      summary: 获取模块监控指标
      responses:
        200:
          description: Prometheus 格式指标

components:
  schemas:
    Module:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        version:
          type: string
        type:
          type: string
        state:
          type: string
          enum: [uninitialized, initialized, running, stopped, error, destroyed]
        healthStatus:
          type: string
          enum: [healthy, unhealthy, unknown, offline]
        priority:
          type: integer
        description:
          type: string

    ModuleDetail:
      allOf:
        - $ref: '#/components/schemas/Module'
        - type: object
          properties:
            dependencies:
              type: array
              items:
                type: object
                properties:
                  name:
                    type: string
                  version:
                    type: string
                  satisfied:
                    type: boolean
            extensionPoints:
              type: array
              items:
                type: string
            permissions:
              type: array
              items:
                type: string
            resources:
              type: object
              properties:
                cpu:
                  type: string
                memory:
                  type: string
            metrics:
              type: array
              items:
                $ref: '#/components/schemas/Metric'

    UpdateResult:
      type: object
      properties:
        success:
          type: boolean
        oldVersion:
          type: string
        newVersion:
          type: string
        backupId:
          type: string
        rolledBack:
          type: boolean
        message:
          type: string

    Metric:
      type: object
      properties:
        name:
          type: string
        type:
          type: string
          enum: [gauge, counter, histogram]
        value:
          type: number
        labels:
          type: object
          additionalProperties:
            type: string
```

---

## 4. 前端管理界面设计

### 4.1 模块管理页面

```typescript
// src/pages/modules/Modules.tsx

/**
 * 模块管理页面
 * 
 * 功能：
 * - 模块列表展示
 * - 模块状态监控
 * - 模块操作 (启动/停止/更新/回滚)
 * - 模块详情查看
 */

interface Module {
  id: string;
  name: string;
  version: string;
  type: 'core' | 'business' | 'adapter' | 'extension';
  state: ModuleState;
  healthStatus: HealthStatus;
  priority: number;
  description: string;
}

export default function Modules() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  
  const { data: modules, isLoading, refetch } = useQuery({
    queryKey: ['modules'],
    queryFn: () => getModules(),
    refetchInterval: 10000, // 10秒刷新
  });
  
  const columns: ColumnsType<Module> = [
    {
      title: '模块名称',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <Space>
          <ModuleTypeIcon type={record.type} />
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (v) => <Tag>{v}</Tag>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'core' ? 'blue' : type === 'business' ? 'green' : 'default'}>
          {type}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render: (state) => <ModuleStateBadge state={state} />,
    },
    {
      title: '健康状态',
      dataIndex: 'healthStatus',
      key: 'healthStatus',
      render: (status) => <HealthStatusBadge status={status} />,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => a.priority - b.priority,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          {record.state === 'running' && (
            <Button type="link" size="small" danger onClick={() => handleStop(record)}>
              停止
            </Button>
          )}
          {record.state === 'stopped' && (
            <Button type="link" size="small" onClick={() => handleStart(record)}>
              启动
            </Button>
          )}
          <Button type="link" size="small" onClick={() => handleUpdate(record)}>
            更新
          </Button>
          <Button type="link" size="small" onClick={() => handleRollback(record)}>
            回滚
          </Button>
          <Button type="link" size="small" onClick={() => setSelectedModule(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ];
  
  return (
    <div>
      <Card className="daoda-card" title="模块管理" extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            刷新
          </Button>
          <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalOpen(true)}>
            上传模块
          </Button>
        </Space>
      }>
        <Table columns={columns} dataSource={modules} loading={isLoading} rowKey="id" />
      </Card>
      
      {/* 模块详情抽屉 */}
      <ModuleDetailDrawer 
        module={selectedModule} 
        onClose={() => setSelectedModule(null)} 
      />
      
      {/* 上传模块弹窗 */}
      <ModuleUploadModal 
        open={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
        onSuccess={refetch}
      />
      
      {/* 更新模块弹窗 */}
      <ModuleUpdateModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}

// 模块状态徽章
function ModuleStateBadge({ state }: { state: ModuleState }) {
  const colorMap: Record<ModuleState, string> = {
    running: 'success',
    stopped: 'default',
    initialized: 'processing',
    uninitialized: 'default',
    error: 'error',
    destroyed: 'default',
  };
  
  const textMap: Record<ModuleState, string> = {
    running: '运行中',
    stopped: '已停止',
    initialized: '已初始化',
    uninitialized: '未初始化',
    error: '错误',
    destroyed: '已销毁',
  };
  
  return <Badge status={colorMap[state] as any} text={textMap[state]} />;
}

// 健康状态徽章
function HealthStatusBadge({ status }: { status: HealthStatus }) {
  const colorMap: Record<HealthStatus, string> = {
    healthy: 'success',
    unhealthy: 'error',
    unknown: 'default',
    offline: 'default',
  };
  
  const textMap: Record<HealthStatus, string> = {
    healthy: '健康',
    unhealthy: '不健康',
    unknown: '未知',
    offline: '离线',
  };
  
  return <Badge status={colorMap[status] as any} text={textMap[status]} />;
}
```

### 4.2 模块详情抽屉

```typescript
// src/pages/modules/ModuleDetailDrawer.tsx

/**
 * 模块详情抽屉
 */

interface ModuleDetailDrawerProps {
  module: Module | null;
  onClose: () => void;
}

export function ModuleDetailDrawer({ module, onClose }: ModuleDetailDrawerProps) {
  const { data: detail } = useQuery({
    queryKey: ['module', module?.id],
    queryFn: () => getModuleDetail(module!.id),
    enabled: !!module,
  });
  
  if (!module || !detail) return null;
  
  return (
    <Drawer
      title={`模块详情: ${module.name}`}
      width={720}
      open={!!module}
      onClose={onClose}
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="模块ID">{detail.id}</Descriptions.Item>
        <Descriptions.Item label="版本">{detail.version}</Descriptions.Item>
        <Descriptions.Item label="类型">{detail.type}</Descriptions.Item>
        <Descriptions.Item label="优先级">{detail.priority}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <ModuleStateBadge state={detail.state} />
        </Descriptions.Item>
        <Descriptions.Item label="健康状态">
          <HealthStatusBadge status={detail.healthStatus} />
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          {detail.description}
        </Descriptions.Item>
      </Descriptions>
      
      {/* 依赖关系 */}
      <Card title="依赖关系" size="small" style={{ marginTop: 16 }}>
        <List
          dataSource={detail.dependencies}
          renderItem={(dep) => (
            <List.Item>
              <Space>
                <Tag color={dep.satisfied ? 'green' : 'red'}>
                  {dep.name}
                </Tag>
                <span>{dep.version}</span>
                {dep.satisfied ? (
                  <CheckCircleOutlined style={{ color: 'green' }} />
                ) : (
                  <CloseCircleOutlined style={{ color: 'red' }} />
                )}
              </Space>
            </List.Item>
          )}
        />
      </Card>
      
      {/* 权限配置 */}
      <Card title="权限配置" size="small" style={{ marginTop: 16 }}>
        <Space wrap>
          {detail.permissions.map((p) => (
            <Tag key={p} color="blue">{p}</Tag>
          ))}
        </Space>
      </Card>
      
      {/* 监控指标 */}
      <Card title="监控指标" size="small" style={{ marginTop: 16 }}>
        <List
          dataSource={detail.metrics}
          renderItem={(metric) => (
            <List.Item>
              <Descriptions column={2} size="small">
                <Descriptions.Item label={metric.name}>
                  {metric.value}
                </Descriptions.Item>
                <Descriptions.Item>
                  <Tag>{metric.type}</Tag>
                </Descriptions.Item>
              </Descriptions>
            </List.Item>
          )}
        />
      </Card>
      
      {/* 操作按钮 */}
      <div style={{ marginTop: 24 }}>
        <Space>
          {detail.state === 'running' && (
            <Button danger onClick={() => handleStop(detail)}>停止模块</Button>
          )}
          {detail.state === 'stopped' && (
            <Button type="primary" onClick={() => handleStart(detail)}>启动模块</Button>
          )}
          <Button onClick={() => handleRollback(detail)}>回滚模块</Button>
        </Space>
      </div>
    </Drawer>
  );
}
```

### 4.3 模块更新弹窗

```typescript
// src/pages/modules/ModuleUpdateModal.tsx

/**
 * 模块更新弹窗
 */

interface ModuleUpdateModalProps {
  open: boolean;
  module?: Module;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModuleUpdateModal({ open, module, onClose, onSuccess }: ModuleUpdateModalProps) {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  
  const updateMutation = useMutation({
    mutationFn: (data: FormData) => updateModule(module!.id, data),
    onSuccess: () => {
      message.success('模块更新成功');
      onSuccess();
      onClose();
    },
    onError: (error) => {
      message.error(`更新失败: ${error.message}`);
    },
  });
  
  const handleSubmit = async () => {
    const values = await form.validateFields();
    const formData = new FormData();
    formData.append('file', values.file.file);
    formData.append('strategy', values.strategy);
    
    setUploading(true);
    updateMutation.mutate(formData);
  };
  
  return (
    <Modal
      title={`更新模块: ${module?.name}`}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={uploading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="file" label="模块文件" rules={[{ required: true }]}>
          <Upload.Dragger accept=".jar">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽 JAR 文件到此区域</p>
          </Upload.Dragger>
        </Form.Item>
        
        <Form.Item name="strategy" label="更新策略" initialValue="rolling">
          <Radio.Group>
            <Radio.Button value="rolling">滚动更新</Radio.Button>
            <Radio.Button value="blue-green">蓝绿部署</Radio.Button>
            <Radio.Button value="canary">金丝雀发布</Radio.Button>
          </Radio.Group>
        </Form.Item>
        
        <Alert
          message="注意事项"
          description={
            <ul>
              <li>更新过程中服务可能短暂中断</li>
              <li>系统会自动创建备份，支持一键回滚</li>
              <li>如健康检查失败将自动回滚</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </Form>
    </Modal>
  );
}
```

---

## 5. 使用示例

### 5.1 后端使用

```java
// 创建模块管理器
ModuleManager manager = ModuleManagerFactory.createManager();

// 初始化
manager.initialize();

// 加载模块
IModule module = manager.loadModule("/path/to/module.jar");

// 启动模块
String moduleId = module.getMetadata().getName() + ":" + module.getMetadata().getVersion();
manager.startModule(moduleId);

// 热更新模块
manager.updateModule(moduleId, "/path/to/new-module.jar");

// 停止模块
manager.stopModule(moduleId);

// 卸载模块
manager.unloadModule(moduleId);
```

### 5.2 监听事件

```java
// 注册监听器
manager.registerModuleListener(new ModuleListener() {
    @Override
    public void onModuleLoaded(String moduleId, ModuleMetadata metadata) {
        System.out.println("模块加载: " + moduleId);
    }
    
    @Override
    public void onModuleStarted(String moduleId) {
        System.out.println("模块启动: " + moduleId);
    }
    
    @Override
    public void onModuleStopped(String moduleId) {
        System.out.println("模块停止: " + moduleId);
    }
    
    @Override
    public void onModuleUpdated(String moduleId, String oldVersion, String newVersion) {
        System.out.println("模块更新: " + moduleId + " " + oldVersion + " -> " + newVersion);
    }
    
    @Override
    public void onModuleError(String moduleId, Throwable error) {
        System.err.println("模块错误: " + moduleId + " - " + error.getMessage());
    }
});
```

### 5.3 前端调用

```typescript
// 获取模块列表
const modules = await getModules();

// 启动模块
await startModule('vehicle-access:1.0.0');

// 停止模块
await stopModule('vehicle-access:1.0.0');

// 上传模块
const formData = new FormData();
formData.append('file', file);
await uploadModule(formData);

// 热更新模块
await updateModule('vehicle-access:1.0.0', {
  file: newModuleFile,
  strategy: 'rolling'
});

// 回滚模块
await rollbackModule('vehicle-access:1.0.0', 'backup-123');
```

---

## 6. 最佳实践

### 6.1 模块开发规范

```yaml
# module.yaml 示例
apiVersion: iov.daod.com/v1
kind: Module
metadata:
  name: vehicle-access
  version: 1.0.0
  description: 车辆接入服务模块
  author: daod-team

spec:
  type: business
  priority: 60
  mainClass: com.daod.iov.modules.vehicleaccess.VehicleAccessModule
  
  dependencies:
    - name: plugin-framework
      version: "^1.0.0"
    - name: config-center
      version: ">=1.0.0"
  
  permissions:
    - NETWORK_CONNECT
    - FILE_READ
  
  resources:
    cpu: "200m"
    memory: "256Mi"
  
  hotReload:
    enabled: true
    strategy: rolling
    rollbackOnFailure: true
  
  healthCheck:
    liveness: /health/live
    readiness: /health/ready
```

### 6.2 热更新流程最佳实践

1. **更新前检查**
   - 验证模块签名
   - 检查版本兼容性
   - 确认依赖满足

2. **更新执行**
   - 创建备份点
   - 优雅停机 (等待现有请求完成)
   - 加载新模块
   - 健康检查

3. **失败处理**
   - 自动回滚
   - 记录错误日志
   - 通知管理员

4. **更新后验证**
   - 监控错误率
   - 验证功能正确性
   - 性能对比

---

## 7. 总结

### 7.1 设计完成度

| 组件 | 设计 | 实现 | 测试 | 文档 |
|------|------|------|------|------|
| ModuleManager | ✅ | ✅ | ✅ | ✅ |
| SandboxManager | ✅ | ✅ | ✅ | ✅ |
| CircuitBreaker | ✅ | ✅ | ✅ | ✅ |
| RollbackManager | ✅ | ✅ | ✅ | ✅ |
| MetricsRegistry | ✅ | ✅ | ✅ | ✅ |
| REST API | ✅ | ⚠️ | ❌ | ✅ |
| 前端界面 | ✅ | ❌ | ❌ | ✅ |

### 7.2 下一步工作

| 任务 | 优先级 | 工作量 |
|------|--------|--------|
| REST API 实现 | P0 | 2 天 |
| 前端管理页面 | P1 | 3 天 |
| 集成测试 | P1 | 1 天 |
| 性能优化 | P2 | 2 天 |

---

_文档维护：渔晓白_