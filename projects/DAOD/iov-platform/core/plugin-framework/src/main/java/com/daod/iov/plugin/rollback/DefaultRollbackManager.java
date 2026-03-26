package com.daod.iov.plugin.rollback;

import com.daod.iov.plugin.ModuleException;
import com.daod.iov.plugin.ModuleManager;
import com.daod.iov.plugin.ModuleState;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.nio.file.*;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 默认回滚管理器实现
 * 
 * 负责模块备份和回滚：
 * - 自动创建备份
 * - 熔断时自动回滚
 * - 备份历史管理
 * 
 * @author daod-team
 * @version 1.0.0
 */
public class DefaultRollbackManager implements RollbackManager {
    
    private static final Logger logger = LoggerFactory.getLogger(DefaultRollbackManager.class);
    
    // 备份存储
    private final Map<String, List<BackupInfo>> backupStore = new ConcurrentHashMap<>();
    
    // 模块管理器引用
    private final ModuleManager moduleManager;
    
    // 备份根目录
    private final Path backupRootPath;
    
    // 最大备份数
    private int maxBackupCount = 5;
    
    // 是否启用自动回滚
    private volatile boolean autoRollbackEnabled = true;
    
    // 回滚历史
    private final List<RollbackRecord> rollbackHistory = new ArrayList<>();
    
    public DefaultRollbackManager(ModuleManager moduleManager) {
        this(moduleManager, Paths.get("./backups"));
    }
    
    public DefaultRollbackManager(ModuleManager moduleManager, Path backupRootPath) {
        this.moduleManager = moduleManager;
        this.backupRootPath = backupRootPath;
        
        // 确保备份目录存在
        try {
            Files.createDirectories(backupRootPath);
        } catch (IOException e) {
            logger.warn("无法创建备份目录: {}", backupRootPath, e);
        }
    }
    
    @Override
    public String createBackup(String moduleId) throws RollbackException {
        logger.info("创建模块备份: {}", moduleId);
        
        try {
            // 获取模块当前版本
            var module = moduleManager.getModule(moduleId);
            if (module == null) {
                throw new RollbackException("MODULE_NOT_FOUND", "模块不存在: " + moduleId);
            }
            
            String version = module.getMetadata().getVersion();
            String modulePath = getModulePath(moduleId);
            
            // 生成备份ID
            String backupId = generateBackupId(moduleId);
            
            // 创建备份目录
            Path backupPath = backupRootPath.resolve(moduleId).resolve(backupId);
            Files.createDirectories(backupPath);
            
            // 复制模块文件
            Path sourcePath = Paths.get(modulePath);
            if (Files.exists(sourcePath)) {
                copyDirectory(sourcePath, backupPath);
            }
            
            // 创建备份信息
            BackupInfo backupInfo = new BackupInfo(backupId, moduleId, version);
            backupInfo.setModuleName(module.getMetadata().getName());
            backupInfo.setModulePath(modulePath);
            backupInfo.setBackupPath(backupPath.toString());
            backupInfo.setType(BackupInfo.BackupType.AUTO);
            backupInfo.setStatus(BackupInfo.BackupStatus.COMPLETED);
            backupInfo.setCreatedAt(Instant.now());
            backupInfo.setBackupSize(calculateDirectorySize(backupPath));
            
            // 存储备份信息
            backupStore.computeIfAbsent(moduleId, k -> new ArrayList<>()).add(backupInfo);
            
            // 清理旧备份
            cleanupOldBackups(moduleId, maxBackupCount);
            
            logger.info("备份创建成功: {} (版本: {}, 大小: {} bytes)", 
                backupId, version, backupInfo.getBackupSize());
            
            return backupId;
            
        } catch (Exception e) {
            logger.error("创建备份失败: {}", moduleId, e);
            throw new RollbackException("BACKUP_FAILED", "创建备份失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void rollback(String moduleId, String backupId) throws RollbackException {
        logger.info("回滚模块: {} -> {}", moduleId, backupId);
        
        BackupInfo backup = findBackup(moduleId, backupId);
        if (backup == null) {
            throw new RollbackException("BACKUP_NOT_FOUND", "备份不存在: " + backupId);
        }
        
        try {
            // 停止模块
            if (moduleManager.getModuleState(moduleId) == ModuleState.RUNNING) {
                moduleManager.stopModule(moduleId);
            }
            
            // 卸载模块
            moduleManager.unloadModule(moduleId);
            
            // 恢复备份文件
            Path backupPath = Paths.get(backup.getBackupPath());
            Path targetPath = Paths.get(backup.getModulePath());
            
            // 清空目标目录
            deleteDirectory(targetPath);
            
            // 复制备份文件
            copyDirectory(backupPath, targetPath);
            
            // 重新加载模块
            moduleManager.loadModule(targetPath.toString());
            moduleManager.startModule(moduleId);
            
            // 更新备份状态
            backup.setStatus(BackupInfo.BackupStatus.ROLLED_BACK);
            
            // 记录回滚历史
            rollbackHistory.add(new RollbackRecord(
                moduleId, backupId, backup.getVersion(), 
                "手动回滚", Instant.now(), true
            ));
            
            logger.info("回滚成功: {} -> 版本 {}", moduleId, backup.getVersion());
            
        } catch (Exception e) {
            logger.error("回滚失败: {} -> {}", moduleId, backupId, e);
            
            // 记录失败
            rollbackHistory.add(new RollbackRecord(
                moduleId, backupId, backup.getVersion(),
                "回滚失败: " + e.getMessage(), Instant.now(), false
            ));
            
            throw new RollbackException("ROLLBACK_FAILED", "回滚失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public void rollbackToPrevious(String moduleId) throws RollbackException {
        BackupInfo latestBackup = getLatestBackup(moduleId);
        
        if (latestBackup == null) {
            throw new RollbackException("NO_BACKUP", "没有可用的备份: " + moduleId);
        }
        
        rollback(moduleId, latestBackup.getBackupId());
    }
    
    @Override
    public boolean autoRollback(String moduleId) {
        if (!autoRollbackEnabled) {
            logger.info("自动回滚已禁用，跳过: {}", moduleId);
            return false;
        }
        
        logger.warn("触发自动回滚: {}", moduleId);
        
        try {
            rollbackToPrevious(moduleId);
            return true;
        } catch (RollbackException e) {
            logger.error("自动回滚失败: {}", moduleId, e);
            return false;
        }
    }
    
    @Override
    public List<BackupInfo> listBackups(String moduleId) {
        return backupStore.getOrDefault(moduleId, Collections.emptyList())
            .stream()
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .collect(Collectors.toList());
    }
    
    @Override
    public BackupInfo getLatestBackup(String moduleId) {
        List<BackupInfo> backups = listBackups(moduleId);
        return backups.isEmpty() ? null : backups.get(0);
    }
    
    @Override
    public void deleteBackup(String moduleId, String backupId) {
        List<BackupInfo> backups = backupStore.get(moduleId);
        if (backups == null) return;
        
        Iterator<BackupInfo> iterator = backups.iterator();
        while (iterator.hasNext()) {
            BackupInfo backup = iterator.next();
            if (backup.getBackupId().equals(backupId)) {
                // 删除备份文件
                try {
                    Path backupPath = Paths.get(backup.getBackupPath());
                    deleteDirectory(backupPath);
                } catch (IOException e) {
                    logger.warn("删除备份文件失败: {}", backup.getBackupPath(), e);
                }
                
                iterator.remove();
                logger.info("删除备份: {}", backupId);
                break;
            }
        }
    }
    
    @Override
    public void cleanupOldBackups(String moduleId, int keepCount) {
        List<BackupInfo> backups = listBackups(moduleId);
        
        if (backups.size() <= keepCount) return;
        
        // 删除超出数量的旧备份
        for (int i = keepCount; i < backups.size(); i++) {
            BackupInfo oldBackup = backups.get(i);
            deleteBackup(moduleId, oldBackup.getBackupId());
        }
        
        logger.info("清理旧备份: {} (保留 {} 个)", moduleId, keepCount);
    }
    
    @Override
    public void setAutoRollbackEnabled(boolean enabled) {
        this.autoRollbackEnabled = enabled;
        logger.info("自动回滚: {}", enabled ? "启用" : "禁用");
    }
    
    @Override
    public boolean isAutoRollbackEnabled() {
        return autoRollbackEnabled;
    }
    
    /**
     * 获取回滚历史
     */
    public List<RollbackRecord> getRollbackHistory() {
        return List.copyOf(rollbackHistory);
    }
    
    /**
     * 设置最大备份数
     */
    public void setMaxBackupCount(int count) {
        this.maxBackupCount = Math.max(1, count);
    }
    
    // ==================== 私有方法 ====================
    
    private String generateBackupId(String moduleId) {
        String timestamp = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")
            .format(java.time.ZonedDateTime.now());
        return "backup-" + timestamp + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
    
    private String getModulePath(String moduleId) {
        // 从模块管理器获取模块路径
        // 这里简化处理，实际应该从 ModuleContext 获取
        return "./modules/" + moduleId;
    }
    
    private BackupInfo findBackup(String moduleId, String backupId) {
        return backupStore.getOrDefault(moduleId, Collections.emptyList())
            .stream()
            .filter(b -> b.getBackupId().equals(backupId))
            .findFirst()
            .orElse(null);
    }
    
    private void copyDirectory(Path source, Path target) throws IOException {
        Files.walk(source)
            .forEach(sourcePath -> {
                try {
                    Path targetPath = target.resolve(source.relativize(sourcePath));
                    Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
                } catch (IOException e) {
                    throw new UncheckedIOException(e);
                }
            });
    }
    
    private void deleteDirectory(Path path) throws IOException {
        if (Files.exists(path)) {
            Files.walk(path)
                .sorted(Comparator.reverseOrder())
                .forEach(p -> {
                    try {
                        Files.delete(p);
                    } catch (IOException e) {
                        // ignore
                    }
                });
        }
    }
    
    private long calculateDirectorySize(Path path) {
        try {
            return Files.walk(path)
                .filter(p -> Files.isRegularFile(p))
                .mapToLong(p -> {
                    try {
                        return Files.size(p);
                    } catch (IOException e) {
                        return 0;
                    }
                })
                .sum();
        } catch (IOException e) {
            return 0;
        }
    }
}