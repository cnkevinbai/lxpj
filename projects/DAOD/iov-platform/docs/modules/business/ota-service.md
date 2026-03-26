# OTA升级服务模块 (ota-service)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | ota-service |
| 模块版本 | 1.0.0 |
| 模块类型 | business |
| 优先级 | 60 |
| 负责人 | 后端开发 |
| 开发周期 | Week 20-21 |

### 1.2 功能描述

OTA升级服务模块负责车辆固件、软件的远程升级管理，支持版本管理、升级策略配置、升级任务调度和升级结果监控。

### 1.3 核心能力

- 版本管理
- 升级包管理
- 升级策略配置
- 升级任务调度
- 升级进度监控
- 升级结果统计

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          OTA升级服务架构                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              管理层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        OTA管理服务                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │版本管理     │ │包管理       │ │策略管理     │ │任务管理     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              调度层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        OTA调度服务                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │任务调度     │ │分批推送     │ │进度跟踪     │ │异常处理     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              传输层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        OTA传输服务                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │断点续传     │ │分片下载     │ │校验验证     │ │传输加密     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.ota;

public interface VersionService {
    
    Version createVersion(VersionCreateRequest request);
    
    Version getVersion(String versionId);
    
    Version getVersionByNumber(String componentId, String versionNumber);
    
    List<Version> listVersions(String componentId);
    
    Version getLatestVersion(String componentId);
    
    void publishVersion(String versionId);
    
    void deprecateVersion(String versionId);
}

public interface PackageService {
    
    Package uploadPackage(PackageUploadRequest request);
    
    Package getPackage(String packageId);
    
    InputStream downloadPackage(String packageId);
    
    String getPackageUrl(String packageId);
    
    void deletePackage(String packageId);
    
    PackageInfo getPackageInfo(String packageId);
    
    boolean verifyPackage(String packageId);
}

public interface StrategyService {
    
    Strategy createStrategy(StrategyCreateRequest request);
    
    Strategy getStrategy(String strategyId);
    
    Strategy updateStrategy(String strategyId, StrategyUpdateRequest request);
    
    void deleteStrategy(String strategyId);
    
    List<Strategy> listStrategies(String tenantId);
    
    void enableStrategy(String strategyId);
    
    void disableStrategy(String strategyId);
}

public interface TaskService {
    
    Task createTask(TaskCreateRequest request);
    
    Task getTask(String taskId);
    
    void startTask(String taskId);
    
    void pauseTask(String taskId);
    
    void resumeTask(String taskId);
    
    void cancelTask(String taskId);
    
    PageResult<Task> listTasks(TaskQueryRequest request);
    
    List<Task> getTasksByVehicle(String vin);
    
    TaskStatistics getTaskStatistics(String taskId);
}

public interface UpgradeService {
    
    void pushUpgrade(String vin, UpgradeRequest request);
    
    void cancelUpgrade(String vin, String taskId);
    
    UpgradeProgress getProgress(String vin, String taskId);
    
    void reportProgress(String vin, ProgressReport report);
    
    void reportResult(String vin, ResultReport report);
}
```

### 2.3 数据模型

```java
@Data
public class Version {
    private String id;
    private String tenantId;
    private String componentId;
    private String componentName;
    private String versionNumber;
    private String description;
    private String releaseNote;
    private VersionType type;
    private VersionStatus status;
    private String packageId;
    private Long packageSize;
    private String md5;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
}

@Data
public class Package {
    private String id;
    private String tenantId;
    private String fileName;
    private String filePath;
    private Long fileSize;
    private String md5;
    private String sha256;
    private PackageStatus status;
    private LocalDateTime uploadedAt;
}

@Data
public class Strategy {
    private String id;
    private String tenantId;
    private String name;
    private String description;
    private String versionId;
    private UpgradeMode mode;
    private int batchSize;
    private int batchInterval;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<String> targetVehicles;
    private TargetCondition condition;
    private boolean enabled;
    private LocalDateTime createdAt;
}

@Data
public class Task {
    private String id;
    private String tenantId;
    private String strategyId;
    private String versionId;
    private String vin;
    private TaskStatus status;
    private int progress;
    private String currentStep;
    private LocalDateTime scheduledTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String errorMessage;
    private int retryCount;
}

@Data
public class UpgradeProgress {
    private String taskId;
    private String vin;
    private int progress;
    private UpgradeStep currentStep;
    private long downloadedBytes;
    private long totalBytes;
    private LocalDateTime updateTime;
}

public enum VersionType {
    FIRMWARE,
    SOFTWARE,
    CONFIG
}

public enum VersionStatus {
    DRAFT,
    PUBLISHED,
    DEPRECATED
}

public enum UpgradeMode {
    IMMEDIATE,
    SCHEDULED,
    BATCH
}

public enum TaskStatus {
    PENDING,
    DOWNLOADING,
    DOWNLOAD_COMPLETE,
    INSTALLING,
    SUCCESS,
    FAILED,
    CANCELLED
}

public enum UpgradeStep {
    INITIALIZING,
    DOWNLOADING,
    VERIFYING,
    BACKING_UP,
    INSTALLING,
    VERIFYING_INSTALL,
    COMPLETE
}
```

### 2.4 数据库设计

```sql
CREATE TABLE ota_versions (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    component_id VARCHAR(32) NOT NULL,
    component_name VARCHAR(100),
    version_number VARCHAR(50) NOT NULL,
    description VARCHAR(500),
    release_note TEXT,
    type VARCHAR(20) DEFAULT 'FIRMWARE',
    status VARCHAR(20) DEFAULT 'DRAFT',
    package_id VARCHAR(32),
    package_size BIGINT,
    md5 VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(component_id, version_number)
);

CREATE TABLE ota_packages (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    file_name VARCHAR(200) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    md5 VARCHAR(64),
    sha256 VARCHAR(128),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE ota_strategies (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    version_id VARCHAR(32) NOT NULL,
    mode VARCHAR(20) DEFAULT 'IMMEDIATE',
    batch_size INT DEFAULT 10,
    batch_interval INT DEFAULT 60,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    target_vehicles JSONB,
    condition_expr JSONB,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (version_id) REFERENCES ota_versions(id)
);

CREATE TABLE ota_tasks (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    strategy_id VARCHAR(32),
    version_id VARCHAR(32) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    progress INT DEFAULT 0,
    current_step VARCHAR(30),
    scheduled_time TIMESTAMP,
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (version_id) REFERENCES ota_versions(id),
    FOREIGN KEY (vin) REFERENCES vehicles(vin)
);

CREATE TABLE ota_progress_logs (
    id VARCHAR(32) PRIMARY KEY,
    task_id VARCHAR(32) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    step VARCHAR(30) NOT NULL,
    progress INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES ota_tasks(id)
);

CREATE INDEX idx_versions_component ON ota_versions(component_id);
CREATE INDEX idx_strategies_tenant ON ota_strategies(tenant_id);
CREATE INDEX idx_tasks_vin ON ota_tasks(vin);
CREATE INDEX idx_tasks_status ON ota_tasks(status);
CREATE INDEX idx_progress_task ON ota_progress_logs(task_id);
```

### 2.5 升级任务调度实现

```java
@Service
public class OtaTaskScheduler {
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private UpgradeService upgradeService;
    
    @Autowired
    private VehicleAccessService vehicleAccessService;
    
    @Scheduled(fixedRate = 60000)
    public void schedulePendingTasks() {
        List<Task> pendingTasks = taskService.getPendingTasks();
        
        for (Task task : pendingTasks) {
            try {
                if (shouldStartTask(task)) {
                    startUpgrade(task);
                }
            } catch (Exception e) {
                log.error("Failed to start task {}: {}", task.getId(), e.getMessage());
                taskService.markTaskFailed(task.getId(), e.getMessage());
            }
        }
    }
    
    @Scheduled(fixedRate = 30000)
    public void checkRunningTasks() {
        List<Task> runningTasks = taskService.getRunningTasks();
        
        for (Task task : runningTasks) {
            try {
                UpgradeProgress progress = upgradeService.getProgress(task.getVin(), task.getId());
                
                if (progress != null) {
                    taskService.updateProgress(task.getId(), progress.getProgress(), progress.getCurrentStep());
                    
                    if (progress.getProgress() >= 100) {
                        taskService.markTaskComplete(task.getId());
                    }
                }
            } catch (Exception e) {
                log.error("Failed to check task {}: {}", task.getId(), e.getMessage());
            }
        }
    }
    
    private boolean shouldStartTask(Task task) {
        if (task.getScheduledTime() != null && 
            task.getScheduledTime().isAfter(LocalDateTime.now())) {
            return false;
        }
        
        OnlineStatus status = vehicleAccessService.getOnlineStatus(task.getVin());
        return status == OnlineStatus.ONLINE;
    }
    
    private void startUpgrade(Task task) {
        Version version = versionService.getVersion(task.getVersionId());
        Package pkg = packageService.getPackage(version.getPackageId());
        
        UpgradeRequest request = UpgradeRequest.builder()
            .taskId(task.getId())
            .versionId(task.getVersionId())
            .packageUrl(packageService.getPackageUrl(pkg.getId()))
            .packageSize(pkg.getFileSize())
            .md5(pkg.getMd5())
            .build();
        
        upgradeService.pushUpgrade(task.getVin(), request);
        taskService.markTaskStarted(task.getId());
    }
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/ota/version | 创建版本 |
| GET | /api/ota/version/{id} | 获取版本信息 |
| GET | /api/ota/version | 查询版本列表 |
| POST | /api/ota/version/{id}/publish | 发布版本 |
| POST | /api/ota/package | 上传升级包 |
| GET | /api/ota/package/{id} | 获取包信息 |
| GET | /api/ota/package/{id}/download | 下载升级包 |
| POST | /api/ota/strategy | 创建升级策略 |
| GET | /api/ota/strategy/{id} | 获取策略信息 |
| PUT | /api/ota/strategy/{id} | 更新策略 |
| DELETE | /api/ota/strategy/{id} | 删除策略 |
| POST | /api/ota/task | 创建升级任务 |
| GET | /api/ota/task/{id} | 获取任务信息 |
| POST | /api/ota/task/{id}/start | 启动任务 |
| POST | /api/ota/task/{id}/cancel | 取消任务 |
| GET | /api/ota/task | 查询任务列表 |
| GET | /api/ota/progress/{vin}/{taskId} | 获取升级进度 |

### 3.2 API示例

```json
POST /api/ota/version
{
    "componentId": "MCU-001",
    "componentName": "主控制器固件",
    "versionNumber": "2.1.0",
    "description": "修复电池管理问题，优化充电策略",
    "releaseNote": "1. 修复SOC计算偏差\n2. 优化快充策略\n3. 提升系统稳定性",
    "type": "FIRMWARE",
    "packageId": "PKG001"
}

Response:
{
    "code": 200,
    "message": "Version created successfully",
    "data": {
        "id": "VER001",
        "versionNumber": "2.1.0",
        "status": "DRAFT"
    }
}

POST /api/ota/strategy
{
    "name": "景区车辆批量升级策略",
    "description": "对景区A的所有车辆进行固件升级",
    "versionId": "VER001",
    "mode": "BATCH",
    "batchSize": 5,
    "batchInterval": 300,
    "condition": {
        "groupId": "GROUP001",
        "currentVersion": "2.0.0"
    }
}

Response:
{
    "code": 200,
    "message": "Strategy created successfully",
    "data": {
        "id": "STR001",
        "name": "景区车辆批量升级策略",
        "enabled": true
    }
}

GET /api/ota/progress/LDA1234567890ABCD/TASK001

Response:
{
    "code": 200,
    "data": {
        "taskId": "TASK001",
        "vin": "LDA1234567890ABCD",
        "progress": 65,
        "currentStep": "INSTALLING",
        "downloadedBytes": 15728640,
        "totalBytes": 20971520,
        "updateTime": "2026-03-17T10:30:00Z"
    }
}
```

## 4. 配置项

```yaml
ota:
  enabled: true
  storage:
    type: minio
    endpoint: ${MINIO_ENDPOINT:http://minio:9000}
    bucket: ota-packages
  task:
    max-retry: 3
    timeout-minutes: 60
  batch:
    default-size: 10
    default-interval: 300
  package:
    max-size-mb: 500
    allowed-types: [".bin", ".zip", ".tar.gz"]
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testVersionCreate | 测试版本创建 | 版本创建成功 |
| testPackageUpload | 测试包上传 | 上传成功 |
| testStrategyCreate | 测试策略创建 | 策略创建成功 |
| testTaskCreate | 测试任务创建 | 任务创建成功 |
| testProgressTrack | 测试进度跟踪 | 进度更新正确 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testFullUpgradeFlow | 测试完整升级流程 | 升级成功 |
| testBatchUpgrade | 测试批量升级 | 批量升级正常 |
| testRollback | 测试回滚机制 | 回滚成功 |

## 6. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: tenant-service
    version: ">=1.0.0"
  - name: vehicle-access
    version: ">=1.0.0"
  - name: mqtt-client
    version: ">=1.0.0"
```

## 7. 部署说明

### 7.1 资源需求

```yaml
resources:
  cpu: "200m"
  memory: "256Mi"
```

## 8. 监控指标

| 指标名 | 类型 | 描述 |
|-------|------|------|
| ota_tasks_total | Counter | 任务总数 |
| ota_tasks_success | Counter | 成功任务数 |
| ota_tasks_failed | Counter | 失败任务数 |
| ota_tasks_running | Gauge | 运行中任务数 |
| ota_package_downloads | Counter | 包下载次数 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
