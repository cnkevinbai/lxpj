package com.daod.iov.modules.ota;

import com.daod.iov.plugin.*;
import com.daod.iov.modules.ota.entity.*;
import com.daod.iov.modules.ota.service.*;
import com.daod.iov.modules.ota.event.*;

import java.util.*;
import java.util.concurrent.*;
import java.nio.file.*;

/**
 * OTA升级服务模块
 * 实现车载终端远程固件版本管理、升级任务调度、进度追踪等功能
 */
public class OtaService implements IModule {
    
    // 内部服务组件
    private FirmwareService firmwareService;
    private UpgradeTaskService upgradeTaskService;
    private ProgressMonitorService progressMonitorService;
    private StrategyService strategyService;
    private NotificationService notificationService;
    private AuditService auditService;
    private ModuleMetadata metadata;
    private ModuleState state;
    private HealthStatus healthStatus;
    private ModuleContext context;
    
    // 配置属性
    private int maxConcurrentUpgrades;
    private long upgradeTimeout;
    private int retryCount;
    private String firmwareStoragePath;
    private long maxFirmwareSize;
    private boolean autoBackup;
    
    // 线程池
    private ThreadPoolExecutor upgradeExecutor;
    private ScheduledExecutorService scheduler;
    
    public OtaService() {
        // 初始化模块元数据
        this.metadata = new ModuleMetadata(
            "ota-service",                    // 模块名称
            "1.0.0",                          // 模块版本
            "OTA升级服务模块 - 车载终端远程固件升级管理"  // 模块描述
        );
        
        // 设置模块类型和属性
        this.metadata.setType("business");
        this.metadata.setPriority(30);
        
        // 设置初始状态
        this.state = ModuleState.UNINITIALIZED;
        this.healthStatus = HealthStatus.UNKNOWN;
    }

    @Override
    public ModuleMetadata getMetadata() {
        return metadata;
    }

    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        this.context = context;
        System.out.println("OTA升级服务模块初始化: " + metadata.getName());
        
        try {
            // 加载配置
            loadConfiguration();
            
            // 初始化固件存储目录
            initFirmwareStorage();
            
            // 初始化服务组件
            firmwareService = new FirmwareService(firmwareStoragePath, maxFirmwareSize, autoBackup);
            upgradeTaskService = new UpgradeTaskService(firmwareService, retryCount, upgradeTimeout);
            progressMonitorService = new ProgressMonitorService();
            strategyService = new StrategyService();
            notificationService = new NotificationService(context);
            auditService = new AuditService();
            
            // 初始化线程池
            upgradeExecutor = new ThreadPoolExecutor(
                maxConcurrentUpgrades, maxConcurrentUpgrades,
                0L, TimeUnit.MILLISECONDS,
                new LinkedBlockingQueue<>(),
                r -> new Thread(r, "ota-upgrade-" + UUID.randomUUID()));
            scheduler = Executors.newScheduledThreadPool(2, 
                r -> new Thread(r, "ota-scheduler-" + UUID.randomUUID()));
            
            // 注册事件监听器
            registerEventListeners();
            
            System.out.println("OTA升级服务模块初始化完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("INITIALIZATION_FAILED", "ota-service",
                
                "OTA服务模块初始化失败: " + e.getMessage(), e);
        }
        
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
    }

    @Override
    public void start() throws ModuleException {
        System.out.println("OTA升级服务模块启动: " + metadata.getName());
        
        try {
            // 启动升级任务调度器
            scheduler.scheduleAtFixedRate(this::processPendingUpgrades, 0, 5, TimeUnit.SECONDS);
            
            // 启动进度监控
            progressMonitorService.start();
            
            System.out.println("OTA升级服务模块启动完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("START_FAILED", "ota-service",
                "OTA服务模块启动失败: " + e.getMessage(), e);
        }
        
        state = ModuleState.RUNNING;
        healthStatus = HealthStatus.HEALTHY;
    }

    @Override
    public void stop() throws ModuleException {
        System.out.println("OTA升级服务模块停止: " + metadata.getName());
        
        try {
            // 停止进度监控
            progressMonitorService.stop();
            
            // 关闭线程池
            scheduler.shutdown();
            upgradeExecutor.shutdown();
            
            // 等待任务完成
            if (!scheduler.awaitTermination(10, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
            if (!upgradeExecutor.awaitTermination(10, TimeUnit.SECONDS)) {
                upgradeExecutor.shutdownNow();
            }
            
            System.out.println("OTA升级服务模块停止完成");
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("STOP_INTERRUPTED", "ota-service", "OTA服务模块停止被中断");
        }
        
        state = ModuleState.STOPPED;
        healthStatus = HealthStatus.OFFLINE;
    }

    @Override
    public void destroy() throws ModuleException {
        System.out.println("OTA升级服务模块销毁: " + metadata.getName());
        
        try {
            // 清理资源
            firmwareService = null;
            upgradeTaskService = null;
            progressMonitorService = null;
            strategyService = null;
            notificationService = null;
            auditService = null;
            
            System.out.println("OTA升级服务模块销毁完成");
            
        } catch (Exception e) {
            Thread.currentThread().interrupt();
            throw new ModuleException("DESTROY_FAILED", "ota-service",
                "OTA服务模块销毁失败: " + e.getMessage(), e);
        }
        
        state = ModuleState.DESTROYED;
    }

    @Override
    public ModuleState getState() {
        return state;
    }

    @Override
    public HealthStatus getHealthStatus() {
        return healthStatus;
    }

    /**
     * 加载配置
     */
    private void loadConfiguration() {
        Map<String, Object> config = context.getConfig();
        
        this.maxConcurrentUpgrades = Optional.ofNullable(config.get("maxConcurrentUpgrades"))
            .map(v -> ((Number) v).intValue())
            .orElse(100);
            
        this.upgradeTimeout = Optional.ofNullable(config.get("upgradeTimeout"))
            .map(v -> ((Number) v).longValue())
            .orElse(600000L);
            
        this.retryCount = Optional.ofNullable(config.get("retryCount"))
            .map(v -> ((Number) v).intValue())
            .orElse(3);
            
        this.firmwareStoragePath = Optional.ofNullable(config.get("firmwareStoragePath"))
            .map(Object::toString)
            .orElse("/data/firmware");
            
        this.maxFirmwareSize = Optional.ofNullable(config.get("maxFirmwareSize"))
            .map(v -> ((Number) v).longValue())
            .orElse(1073741824L);
            
        this.autoBackup = Optional.ofNullable(config.get("autoBackup"))
            .map(v -> (Boolean) v)
            .orElse(true);
    }

    /**
     * 初始化固件存储目录
     */
    private void initFirmwareStorage() throws ModuleException {
        try {
            Path path = Paths.get(firmwareStoragePath);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }
            System.out.println("固件存储目录: " + firmwareStoragePath);
        } catch (Exception e) {
            throw new ModuleException("STORAGE_INIT_FAILED", "ota-service",
                "固件存储目录初始化失败: " + e.getMessage(), e);
        }
    }

    /**
     * 注册事件监听器
     */
    private void registerEventListeners() {
        // 注册升级状态变化监听器
        upgradeTaskService.addStatusChangeListener((taskId, oldStatus, newStatus) -> {
            // 记录审计日志
            auditService.logAudit("OTA Upgrade", taskId, 
                "Status changed from " + oldStatus + " to " + newStatus);
        });
        
        // 注册升级进度监听器
        progressMonitorService.addProgressListener(progress -> {
            // 更新升级任务进度
            upgradeTaskService.updateProgress(progress.getTaskId(), progress.getProgress());
        });
        
        // 注册升级完成监听器
        upgradeTaskService.addCompletionListener((taskId, status, message) -> {
            // 记录审计日志
            auditService.logAudit("OTA Upgrade", taskId, 
                "Upgrade completed with status: " + status);
        });
        
        // 注册升级失败监听器
        upgradeTaskService.addFailureListener((taskId, reason, retryCountParam) -> {
            // 记录审计日志
            auditService.logAudit("OTA Upgrade", taskId, 
                "Upgrade failed: " + reason);
            
            // 尝试重试
            if (retryCountParam < retryCount) {
                upgradeTaskService.scheduleRetry(taskId);
            }
        });
    }

    /**
     * 处理待处理的升级任务
     */
    private void processPendingUpgrades() {
        if (state != ModuleState.RUNNING) {
            return;
        }
        
        try {
            // 获取待处理的任务
            List<UpgradeTask> pendingTasks = upgradeTaskService.findPendingTasks();
            
            for (UpgradeTask task : pendingTasks) {
                if (upgradeExecutor.getActiveCount() < maxConcurrentUpgrades) {
                    // 提交升级任务
                    upgradeExecutor.submit(() -> {
                        try {
                            upgradeTaskService.executeUpgrade(task);
                        } catch (Exception e) {
                            upgradeTaskService.handleFailure(task.getId(), e.getMessage());
                        }
                    });
                }
            }
        } catch (Exception e) {
            System.err.println("处理待处理升级任务失败: " + e.getMessage());
        }
    }

    // ==================== 对外API ====================

    /**
     * 上传固件
     */
    public Firmware uploadFirmware(byte[] firmwareData, FirmwareInfo info) throws OtaException {
        return firmwareService.uploadFirmware(firmwareData, info);
    }

    /**
     * 查询固件版本
     */
    public Firmware getFirmwareVersion(String firmwareId) throws OtaException {
        return firmwareService.getFirmware(firmwareId);
    }

    /**
     * 删除固件版本
     */
    public void deleteFirmwareVersion(String firmwareId) throws OtaException {
        firmwareService.deleteFirmware(firmwareId);
    }

    /**
     * 创建升级任务
     */
    public UpgradeTask createUpgradeTask(UpgradeTaskDto dto) throws OtaException {
        return upgradeTaskService.createUpgradeTask(dto);
    }

    /**
     * 查询升级任务
     */
    public UpgradeTask getUpgradeTask(String taskId) throws OtaException {
        return upgradeTaskService.getTask(taskId);
    }

    /**
     * 查询升级任务列表
     */
    public List<UpgradeTask> listUpgradeTasks(TaskQuery query) throws OtaException {
        return upgradeTaskService.queryTasks(query);
    }

    /**
     * 取消升级任务
     */
    public void cancelUpgradeTask(String taskId) throws OtaException {
        upgradeTaskService.cancelTask(taskId);
    }

    /**
     * 查询升级进度
     */
    public UpgradeProgress getUpgradeProgress(String taskId) throws OtaException {
        return progressMonitorService.getProgress(taskId);
    }

    /**
     * 获取升级策略
     */
    public OtaStrategy getStrategy(String strategyType) {
        return strategyService.getStrategy(strategyType);
    }

    /**
     * 注册升级策略
     */
    public void registerStrategy(OtaStrategy strategy) {
        strategyService.registerStrategy(strategy);
    }

    /**
     * 查询审计日志
     */
    public List<AuditLog> queryAuditLogs(AuditQuery query) throws OtaException {
        return auditService.queryLogs(query);
    }
}
