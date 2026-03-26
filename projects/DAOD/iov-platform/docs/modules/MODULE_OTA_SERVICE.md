# OTA升级服务模块设计文档

**模块名称**: ota-service  
**版本**: 1.0.0  
**优先级**: 🔴 高  
**最后更新**: 2026-03-18

---

## 1. 模块概述

OTA升级服务负责车载终端固件的远程升级管理，支持全量升级、增量升级和差分升级三种策略。

### 1.1 核心功能

| 功能 | 说明 |
|------|------|
| 固件管理 | 上传、存储、版本控制、校验 |
| 任务调度 | 创建、执行、监控、取消 |
| 升级策略 | 全量、增量、差分 |
| 批量升级 | 分组、分批执行 |
| 进度追踪 | 实时状态、通知推送 |
| 失败处理 | 重试、回滚、告警 |

### 1.2 升级策略对比

| 策略 | 包大小 | 升级时间 | 适用场景 |
|------|--------|----------|----------|
| 全量升级 | 大 | 长 | 大版本更新 |
| 增量升级 | 中 | 中 | 小版本更新 |
| 差分升级 | 小 | 短 | 补丁更新 |

---

## 2. 架构设计

### 2.1 模块架构

```
┌─────────────────────────────────────────────────────────────┐
│                        OtaService                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Firmware   │  │ UpgradeTask │  │  Progress   │         │
│  │   Service   │  │   Service   │  │  Monitor    │         │
│  │  (固件管理)  │  │  (任务调度)  │  │  (进度监控)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Strategy   │  │Notification │  │   Audit     │         │
│  │   Service   │  │   Service   │  │   Service   │         │
│  │  (策略服务)  │  │  (通知服务)  │  │  (审计服务)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 升级流程

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ 上传固件 │───▶│ 创建任务 │───▶│ 执行升级 │───▶│ 监控进度 │
└─────────┘    └─────────┘    └─────────┘    └────┬────┘
                                                  │
                    ┌──────────────┬──────────────┤
                    │              │              │
                    ▼              ▼              ▼
             ┌──────────┐   ┌──────────┐   ┌──────────┐
             │ 升级成功  │   │ 失败重试  │   │ 异常回滚  │
             └──────────┘   └──────────┘   └──────────┘
```

### 2.3 固件版本管理

```
Firmware
├── v1.0.0
│   ├── full.bin        # 全量包
│   └── checksum.md5    # 校验文件
├── v1.1.0
│   ├── full.bin
│   ├── delta_v1.0.0.bin  # 差分包
│   └── checksum.md5
└── v1.2.0
    ├── full.bin
    ├── delta_v1.0.0.bin
    ├── delta_v1.1.0.bin
    └── checksum.md5
```

---

## 3. 数据模型

### 3.1 固件实体

```java
public class Firmware {
    private String id;              // 固件ID
    private String name;            // 固件名称
    private String version;         // 版本号 (SemVer)
    private String deviceModel;     // 适用设备型号
    private String filePath;        // 文件路径
    private long fileSize;          // 文件大小
    private String checksum;        // MD5校验值
    private UpgradeType type;       // 升级类型
    private String description;     // 版本说明
    private boolean forceUpgrade;   // 是否强制升级
    private FirmwareStatus status;  // 状态
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
```

### 3.2 升级任务

```java
public class UpgradeTask {
    private String id;              // 任务ID
    private String firmwareId;      // 固件ID
    private String targetVersion;   // 目标版本
    private List<String> vehicleIds;// 目标车辆列表
    private UpgradeStrategy strategy;// 升级策略
    private TaskStatus status;      // 任务状态
    private int totalCount;         // 总数
    private int successCount;       // 成功数
    private int failedCount;        // 失败数
    private int progress;           // 进度百分比
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Map<String, String> config; // 配置参数
}
```

### 3.3 升级进度

```java
public class UpgradeProgress {
    private String taskId;          // 任务ID
    private String vehicleId;       // 车辆ID
    private UpgradeStatus status;   // 升级状态
    private int progress;           // 进度(0-100)
    private String currentStep;     // 当前步骤
    private String errorMessage;    // 错误信息
    private int retryCount;         // 重试次数
    private LocalDateTime startTime;
    private LocalDateTime updateTime;
}
```

---

## 4. API设计

### 4.1 固件管理API

```java
public class FirmwareService {
    
    /**
     * 上传固件
     */
    public Firmware uploadFirmware(FirmwareUploadRequest request);
    
    /**
     * 获取固件列表
     */
    public List<Firmware> listFirmware(String deviceModel);
    
    /**
     * 获取固件详情
     */
    public Firmware getFirmware(String firmwareId);
    
    /**
     * 删除固件
     */
    public void deleteFirmware(String firmwareId);
    
    /**
     * 校验固件完整性
     */
    public boolean verifyFirmware(String firmwareId);
}
```

### 4.2 任务调度API

```java
public class UpgradeTaskService {
    
    /**
     * 创建升级任务
     */
    public UpgradeTask createTask(TaskCreateRequest request);
    
    /**
     * 执行任务
     */
    public void executeTask(String taskId);
    
    /**
     * 取消任务
     */
    public void cancelTask(String taskId);
    
    /**
     * 查询任务状态
     */
    public UpgradeTask getTaskStatus(String taskId);
    
    /**
     * 查询任务列表
     */
    public PageResponse<UpgradeTask> listTasks(TaskQuery query);
    
    /**
     * 获取任务进度详情
     */
    public List<UpgradeProgress> getTaskProgress(String taskId);
}
```

---

## 5. 升级策略

### 5.1 策略接口

```java
public interface OtaStrategy {
    
    /**
     * 执行升级
     */
    UpgradeResult upgrade(String vehicleId, Firmware firmware, UpgradeConfig config);
    
    /**
     * 计算升级包大小
     */
    long calculateSize(String currentVersion, String targetVersion);
    
    /**
     * 是否支持回滚
     */
    boolean supportRollback();
}
```

### 5.2 策略实现

| 策略 | 实现类 | 说明 |
|------|--------|------|
| 全量升级 | FullUpgradeStrategy | 完整固件包升级 |
| 增量升级 | IncrementalUpgradeStrategy | 版本间增量包 |
| 差分升级 | DifferentialUpgradeStrategy | 二进制差分 |

---

## 6. 配置项

```yaml
ota:
  maxConcurrentUpgrades: 100      # 最大并发升级数
  upgradeTimeout: 600000          # 升级超时(ms)
  retryCount: 3                   # 失败重试次数
  firmwareStoragePath: /data/firmware  # 固件存储路径
  maxFirmwareSize: 1073741824     # 最大固件大小(1GB)
  autoBackup: true                # 升级前自动备份
  retryBackoffMultiplier: 2       # 重试退避倍数
  retryInitialDelay: 60000        # 初始重试延迟(ms)
```

---

## 7. 事件机制

### 7.1 事件类型

| 事件 | 说明 |
|------|------|
| UpgradeStatusChangeEvent | 状态变更 |
| UpgradeProgressEvent | 进度更新 |
| UpgradeCompletionEvent | 升级完成 |
| UpgradeFailureEvent | 升级失败 |

### 7.2 事件订阅

```java
otaService.addListener(event -> {
    if (event instanceof UpgradeCompletionEvent) {
        UpgradeCompletionEvent e = (UpgradeCompletionEvent) event;
        notificationService.sendSuccessNotification(e.getVehicleId());
    }
});
```

---

## 8. 扩展点

| 扩展点 | 接口 | 说明 |
|--------|------|------|
| 升级策略 | OtaStrategy | 自定义升级策略 |
| 固件验证 | FirmwareValidator | 自定义验证逻辑 |
| 升级回调 | UpgradeCallback | 升级完成回调 |

---

## 9. 安全考虑

1. **固件签名**: 使用数字签名验证固件来源
2. **传输加密**: 固件传输使用TLS加密
3. **版本校验**: 升级前验证版本兼容性
4. **回滚保护**: 防止降级攻击
5. **审计日志**: 记录所有升级操作

---

_文档维护：渔晓白_