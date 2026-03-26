# 热更新引擎模块 (hot-reload-engine)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | hot-reload-engine |
| 模块版本 | 1.0.0 |
| 模块类型 | core |
| 优先级 | 10 |
| 负责人 | 架构师 |
| 开发周期 | Week 3 |

### 1.2 功能描述

热更新引擎模块是平台的核心基础设施模块，负责管理模块的热插拔、热更新和热修改功能。支持在不停止系统运行的情况下，动态加载、更新、卸载模块。

### 1.3 核心能力

- 模块动态加载/卸载
- 模块热更新（滚动更新、蓝绿部署、金丝雀发布）
- 版本管理与回滚
- 更新状态监控
- 更新失败自动回滚

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          热更新引擎架构                                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API Layer                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ HotReloadAPI    │  │ VersionAPI      │  │ RollbackAPI     │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Core Engine                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        HotReloadManager                                  │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ LoadManager │ │UpdateManager│ │VersionManager│ │RollbackManager│     │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Strategy Layer                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ RollingUpdate   │  │ BlueGreenDeploy │  │ CanaryRelease   │               │
│  │ Strategy        │  │ Strategy        │  │ Strategy        │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Storage Layer                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ VersionStore    │  │ HistoryStore    │  │ BackupStore     │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.hotreload;

public interface HotReloadManager {
    
    ModuleLoadResult loadModule(String modulePath);
    
    ModuleUnloadResult unloadModule(String moduleId);
    
    ModuleUpdateResult updateModule(String moduleId, String newVersion, UpdateStrategy strategy);
    
    RollbackResult rollbackModule(String moduleId, String targetVersion);
    
    ModuleStatus getModuleStatus(String moduleId);
    
    List<ModuleVersion> getModuleVersions(String moduleId);
}

public interface UpdateStrategy {
    
    UpdateResult execute(ModuleContext context, ModuleUpdateRequest request);
    
    String getName();
    
    boolean supportsRollback();
}

public interface VersionManager {
    
    VersionInfo createVersion(String moduleId, String version, byte[] moduleData);
    
    VersionInfo getVersion(String moduleId, String version);
    
    List<VersionInfo> listVersions(String moduleId);
    
    boolean deleteVersion(String moduleId, String version);
    
    VersionInfo getLatestVersion(String moduleId);
}

public interface RollbackManager {
    
    RollbackResult rollback(String moduleId, String targetVersion);
    
    RollbackResult rollbackToPrevious(String moduleId);
    
    List<RollbackPoint> listRollbackPoints(String moduleId);
}
```

### 2.3 更新策略实现

#### 2.3.1 滚动更新策略

```java
public class RollingUpdateStrategy implements UpdateStrategy {
    
    @Override
    public UpdateResult execute(ModuleContext context, ModuleUpdateRequest request) {
        String moduleId = request.getModuleId();
        String newVersion = request.getNewVersion();
        int maxUnavailable = request.getMaxUnavailable();
        
        List<IModule> instances = context.getModuleInstances(moduleId);
        int totalInstances = instances.size();
        int updatedCount = 0;
        List<String> failedInstances = new ArrayList<>();
        
        for (IModule instance : instances) {
            if (updatedCount >= maxUnavailable) {
                break;
            }
            
            try {
                instance.stop();
                IModule newInstance = context.loadNewVersion(moduleId, newVersion);
                newInstance.start();
                updatedCount++;
            } catch (Exception e) {
                failedInstances.add(instance.getMetadata().getId());
            }
        }
        
        return new UpdateResult(
            moduleId, 
            newVersion, 
            updatedCount, 
            totalInstances, 
            failedInstances
        );
    }
    
    @Override
    public String getName() {
        return "rolling";
    }
    
    @Override
    public boolean supportsRollback() {
        return true;
    }
}
```

#### 2.3.2 蓝绿部署策略

```java
public class BlueGreenDeployStrategy implements UpdateStrategy {
    
    @Override
    public UpdateResult execute(ModuleContext context, ModuleUpdateRequest request) {
        String moduleId = request.getModuleId();
        String newVersion = request.getNewVersion();
        
        IModule blueInstance = context.getActiveInstance(moduleId);
        IModule greenInstance = null;
        
        try {
            greenInstance = context.loadNewVersion(moduleId, newVersion);
            greenInstance.initialize(context);
            greenInstance.start();
            
            if (healthCheck(greenInstance)) {
                context.switchActiveInstance(moduleId, greenInstance);
                blueInstance.stop();
                return UpdateResult.success(moduleId, newVersion);
            } else {
                greenInstance.stop();
                greenInstance.destroy();
                return UpdateResult.failure(moduleId, newVersion, "Health check failed");
            }
        } catch (Exception e) {
            if (greenInstance != null) {
                greenInstance.stop();
                greenInstance.destroy();
            }
            return UpdateResult.failure(moduleId, newVersion, e.getMessage());
        }
    }
    
    @Override
    public String getName() {
        return "blue-green";
    }
    
    @Override
    public boolean supportsRollback() {
        return true;
    }
    
    private boolean healthCheck(IModule module) {
        return module.getHealthStatus() == HealthStatus.HEALTHY;
    }
}
```

#### 2.3.3 金丝雀发布策略

```java
public class CanaryReleaseStrategy implements UpdateStrategy {
    
    @Override
    public UpdateResult execute(ModuleContext context, ModuleUpdateRequest request) {
        String moduleId = request.getModuleId();
        String newVersion = request.getNewVersion();
        double canaryPercentage = request.getCanaryPercentage();
        
        List<IModule> allInstances = context.getModuleInstances(moduleId);
        int canaryCount = (int) Math.ceil(allInstances.size() * canaryPercentage / 100);
        
        List<IModule> canaryInstances = allInstances.subList(0, canaryCount);
        List<IModule> stableInstances = allInstances.subList(canaryCount, allInstances.size());
        
        List<IModule> updatedCanaries = new ArrayList<>();
        
        for (IModule instance : canaryInstances) {
            try {
                instance.stop();
                IModule newInstance = context.loadNewVersion(moduleId, newVersion);
                newInstance.start();
                updatedCanaries.add(newInstance);
            } catch (Exception e) {
                rollbackCanaries(updatedCanaries, stableInstances);
                return UpdateResult.failure(moduleId, newVersion, e.getMessage());
            }
        }
        
        if (monitorCanaries(updatedCanaries, request.getMonitorDuration())) {
            updateRemainingInstances(stableInstances, moduleId, newVersion);
            return UpdateResult.success(moduleId, newVersion);
        } else {
            rollbackCanaries(updatedCanaries, stableInstances);
            return UpdateResult.failure(moduleId, newVersion, "Canary monitoring failed");
        }
    }
    
    @Override
    public String getName() {
        return "canary";
    }
    
    @Override
    public boolean supportsRollback() {
        return true;
    }
}
```

### 2.4 数据模型

```sql
CREATE TABLE module_versions (
    id VARCHAR(32) PRIMARY KEY,
    module_id VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    module_path VARCHAR(500) NOT NULL,
    module_hash VARCHAR(64) NOT NULL,
    file_size BIGINT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    UNIQUE(module_id, version)
);

CREATE TABLE update_history (
    id VARCHAR(32) PRIMARY KEY,
    module_id VARCHAR(100) NOT NULL,
    from_version VARCHAR(50),
    to_version VARCHAR(50) NOT NULL,
    strategy VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration_ms BIGINT,
    error_message TEXT,
    rollback_point BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rollback_points (
    id VARCHAR(32) PRIMARY KEY,
    module_id VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    module_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'AVAILABLE'
);
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/hot-reload/load | 加载模块 |
| POST | /api/hot-reload/unload | 卸载模块 |
| POST | /api/hot-reload/update | 更新模块 |
| POST | /api/hot-reload/rollback | 回滚模块 |
| GET | /api/hot-reload/status/{moduleId} | 获取模块状态 |
| GET | /api/hot-reload/versions/{moduleId} | 获取模块版本列表 |
| GET | /api/hot-reload/history/{moduleId} | 获取更新历史 |

### 3.2 API示例

```json
POST /api/hot-reload/update
{
    "moduleId": "vehicle-access:1.0.0",
    "newVersion": "1.1.0",
    "strategy": "rolling",
    "maxUnavailable": 1,
    "autoRollback": true,
    "healthCheckInterval": 5000,
    "healthCheckTimeout": 60000
}

Response:
{
    "code": 200,
    "message": "Update started",
    "data": {
        "taskId": "task-001",
        "moduleId": "vehicle-access",
        "fromVersion": "1.0.0",
        "toVersion": "1.1.0",
        "strategy": "rolling",
        "status": "RUNNING",
        "progress": 0,
        "startTime": "2026-03-17T10:00:00Z"
    }
}
```

## 4. 配置项

```yaml
hot-reload:
  enabled: true
  scan-interval: 5000
  max-modules: 100
  backup-enabled: true
  backup-path: /data/module-backups
  auto-rollback: true
  health-check:
    interval: 5000
    timeout: 60000
    retries: 3
  strategies:
    rolling:
      max-unavailable: 1
    blue-green:
      health-check-wait: 30
    canary:
      default-percentage: 10
      monitor-duration: 300
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testLoadModule | 测试模块加载 | 模块成功加载，状态为RUNNING |
| testUnloadModule | 测试模块卸载 | 模块成功卸载，状态为DESTROYED |
| testRollingUpdate | 测试滚动更新 | 模块逐步更新成功 |
| testBlueGreenDeploy | 测试蓝绿部署 | 蓝绿切换成功 |
| testCanaryRelease | 测试金丝雀发布 | 金丝雀发布成功 |
| testAutoRollback | 测试自动回滚 | 更新失败自动回滚 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testHotUpdateWithDependency | 测试带依赖的热更新 | 依赖模块正常工作 |
| testConcurrentUpdate | 测试并发更新 | 更新操作串行执行 |
| testUpdateDuringHighLoad | 测试高负载下更新 | 服务不中断 |

## 6. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: common-log
    version: ">=1.0.0"
```

## 7. 部署说明

### 7.1 资源需求

```yaml
resources:
  cpu: "200m"
  memory: "256Mi"
```

### 7.2 健康检查

```yaml
healthCheck:
  liveness: /health/live
  readiness: /health/ready
```

## 8. 监控指标

| 指标名 | 类型 | 描述 |
|-------|------|------|
| hot_reload_total | Counter | 热更新总次数 |
| hot_reload_success | Counter | 热更新成功次数 |
| hot_reload_failure | Counter | 热更新失败次数 |
| hot_reload_duration | Histogram | 热更新耗时 |
| module_load_time | Histogram | 模块加载耗时 |
| active_modules | Gauge | 活跃模块数量 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
