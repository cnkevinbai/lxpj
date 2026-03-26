package com.daod.iov.modules.ota.service;

import com.daod.iov.modules.ota.entity.*;
import com.daod.iov.modules.ota.event.*;
import com.daod.iov.modules.ota.OtaException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.*;

/**
 * 升级任务服务
 */
public class UpgradeTaskService {
    private final FirmwareService firmwareService;
    private final int maxRetryCount;
    private final long defaultTimeout;
    private final Map<String, UpgradeTask> taskStore = new ConcurrentHashMap<>();
    private final Map<String, List<String>> taskVehicleMap = new ConcurrentHashMap<>();
    private final List<UpgradeStatusChangeListener> statusChangeListeners = new CopyOnWriteArrayList<>();
    private final List<UpgradeCompletionListener> completionListeners = new CopyOnWriteArrayList<>();
    private final List<UpgradeFailureListener> failureListeners = new CopyOnWriteArrayList<>();
    
    public UpgradeTaskService(FirmwareService firmwareService, int maxRetryCount, long defaultTimeout) {
        this.firmwareService = firmwareService;
        this.maxRetryCount = maxRetryCount;
        this.defaultTimeout = defaultTimeout;
    }
    
    public UpgradeTask createUpgradeTask(UpgradeTaskDto dto) throws OtaException {
        String firmwareId = dto.getFirmwareId();
        Firmware firmware = firmwareService.getFirmware(firmwareId);
        
        String taskId = UUID.randomUUID().toString();
        
        UpgradeTask task = UpgradeTask.builder()
            .id(taskId)
            .firmwareId(firmwareId)
            .firmwareVersion(firmware.getVersion())
            .strategyType(dto.getStrategyType() != null ? dto.getStrategyType() : "full")
            .vehicleIds(dto.getVehicleIds() != null ? new ArrayList<>(dto.getVehicleIds()) : new ArrayList<>())
            .vehicleGroups(dto.getVehicleGroups() != null ? new HashMap<>(dto.getVehicleGroups()) : new HashMap<>())
            .batchSize(dto.getBatchSize())
            .batchIndex(0)
            .status(UpgradeTask.Status.PENDING)
            .retryCount(0)
            .maxRetryCount(dto.getMaxRetries() != null ? dto.getMaxRetries() : maxRetryCount)
            .timeout(dto.getTimeout() != null ? dto.getTimeout() : defaultTimeout)
            .scheduledAt(null)
            .startedAt(null)
            .completedAt(null)
            .failureReason(null)
            .rolledBackReason(null)
            .rollbackEnabled(dto.isRollbackEnabled())
            .extraParams(dto.getExtraParams() != null ? new HashMap<>(dto.getExtraParams()) : new HashMap<>())
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .createdBy(dto.getCreatedBy())
            .build();
        
        taskStore.put(taskId, task);
        taskVehicleMap.put(taskId, new ArrayList<>(task.getVehicleIds()));
        
        statusChangeListeners.forEach(listener -> listener.onStatusChange(taskId, null, "PENDING"));
        
        return task;
    }
    
    public UpgradeTask getTask(String taskId) throws OtaException {
        UpgradeTask task = taskStore.get(taskId);
        if (task == null) {
            throw new OtaException("TASK_NOT_FOUND", "升级任务不存在: " + taskId);
        }
        return task;
    }
    
    public List<UpgradeTask> queryTasks(TaskQuery query) {
        return taskStore.values().stream()
            .filter(t -> query.getStatus() == null || t.getStatus().name().equals(query.getStatus()))
            .filter(t -> query.getFirmwareId() == null || t.getFirmwareId().equals(query.getFirmwareId()))
            .filter(t -> query.getVehicleId() == null || 
                t.getVehicleIds().contains(query.getVehicleId()) || 
                t.getVehicleGroups().values().stream().anyMatch(v -> v.contains(query.getVehicleId())))
            .filter(t -> query.getCreatedBy() == null || t.getCreatedBy().equals(query.getCreatedBy()))
            .collect(Collectors.toList());
    }
    
    public List<UpgradeTask> findPendingTasks() {
        return taskStore.values().stream()
            .filter(t -> t.getStatus() == UpgradeTask.Status.PENDING)
            .collect(Collectors.toList());
    }
    
    public void executeUpgrade(UpgradeTask task) {
        task.setStatus(UpgradeTask.Status.RUNNING);
        task.setStartedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        updateTask(task);
        
        try {
            executeStrategy(task);
        } catch (Exception e) {
            handleFailure(task.getId(), e.getMessage());
        }
    }
    
    private void executeStrategy(UpgradeTask task) throws Exception {
        String strategyType = task.getStrategyType();
        System.out.println("执行升级策略: " + strategyType + ", 任务ID: " + task.getId());
        
        simulateUpgradeProgress(task);
        
        task.setStatus(UpgradeTask.Status.SUCCESS);
        task.setCompletedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        updateTask(task);
        
        completionListeners.forEach(listener -> listener.onCompletion(task.getId(), "SUCCESS", "升级完成"));
    }
    
    private void simulateUpgradeProgress(UpgradeTask task) throws InterruptedException {
        List<String> vehicles = task.getVehicleIds();
        for (int i = 0; i < vehicles.size(); i++) {
            String vehicleId = vehicles.get(i);
            
            if (task.getBatchSize() != null) {
                int batchIndex = i / task.getBatchSize();
                if (batchIndex > task.getBatchIndex()) {
                    task.setBatchIndex(batchIndex);
                    updateTask(task);
                }
            }
            
            for (int progress = 0; progress <= 100; progress++) {
                Thread.sleep(10);
            }
        }
    }
    
    public void handleFailure(String taskId, String reason) {
        UpgradeTask task = taskStore.get(taskId);
        if (task == null) return;
        
        task.setRetryCount(task.getRetryCount() + 1);
        task.setUpdatedAt(LocalDateTime.now());
        
        if (task.getRetryCount() >= task.getMaxRetryCount()) {
            task.setStatus(UpgradeTask.Status.FAILED);
            task.setFailureReason(reason);
            task.setCompletedAt(LocalDateTime.now());
            
            if (task.isRollbackEnabled()) {
                task.setStatus(UpgradeTask.Status.ROLLBACKING);
                performRollback(task);
            }
            
            updateTask(task);
            failureListeners.forEach(listener -> listener.onFailure(taskId, reason, task.getRetryCount()));
        } else {
            task.setStatus(UpgradeTask.Status.RETRYING);
            updateTask(task);
            
            long delay = (long) Math.pow(2, task.getRetryCount()) * 1000;
            try {
                Thread.sleep(delay);
                task.setStatus(UpgradeTask.Status.PENDING);
                updateTask(task);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }
    
    public void performRollback(UpgradeTask task) {
        System.out.println("执行回滚: 任务ID " + task.getId());
        task.setRolledBackReason("升级失败，执行回滚");
        task.setStatus(UpgradeTask.Status.ROLLED_BACK);
        task.setCompletedAt(LocalDateTime.now());
        updateTask(task);
    }
    
    public void cancelTask(String taskId) throws OtaException {
        UpgradeTask task = getTask(taskId);
        
        if (task.getStatus() == UpgradeTask.Status.SUCCESS || 
            task.getStatus() == UpgradeTask.Status.FAILED ||
            task.getStatus() == UpgradeTask.Status.CANCELLED) {
            throw new OtaException("TASK_NOT_CANCELLABLE", 
                "任务状态不可取消: " + task.getStatus());
        }
        
        task.setStatus(UpgradeTask.Status.CANCELLED);
        task.setCompletedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        updateTask(task);
        
        statusChangeListeners.forEach(listener -> listener.onStatusChange(taskId, task.getStatus().name(), "CANCELLED"));
    }
    
    public void updateProgress(String taskId, int progress) {
        // 更新进度
    }
    
    public void scheduleRetry(String taskId) {
        UpgradeTask task = taskStore.get(taskId);
        if (task != null) {
            task.setStatus(UpgradeTask.Status.PENDING);
            updateTask(task);
        }
    }
    
    private void updateTask(UpgradeTask task) {
        taskStore.put(task.getId(), task);
    }
    
    public void addStatusChangeListener(UpgradeStatusChangeListener listener) {
        statusChangeListeners.add(listener);
    }
    
    public void addCompletionListener(UpgradeCompletionListener listener) {
        completionListeners.add(listener);
    }
    
    public void addFailureListener(UpgradeFailureListener listener) {
        failureListeners.add(listener);
    }
    
    // ==================== 监听器接口 ====================
    
    public interface UpgradeStatusChangeListener {
        void onStatusChange(String taskId, String oldStatus, String newStatus);
    }
    
    public interface UpgradeCompletionListener {
        void onCompletion(String taskId, String status, String message);
    }
    
    public interface UpgradeFailureListener {
        void onFailure(String taskId, String reason, int retryCount);
    }
}
