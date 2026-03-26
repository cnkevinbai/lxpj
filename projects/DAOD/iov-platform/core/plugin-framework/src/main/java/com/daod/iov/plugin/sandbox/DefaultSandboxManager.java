package com.daod.iov.plugin.sandbox;

import com.daod.iov.plugin.Permission;
import com.daod.iov.plugin.ResourceRequirements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.*;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * 默认沙箱管理器实现
 * 
 * 提供模块安全隔离能力：
 * - 权限检查
 * - 资源配额控制
 * - 安全策略执行
 * 
 * @author daod-team
 * @version 1.0.0
 */
public class DefaultSandboxManager implements SandboxManager {
    
    private static final Logger logger = LoggerFactory.getLogger(DefaultSandboxManager.class);
    
    // 沙箱实例存储
    private final Map<String, ModuleSandbox> sandboxes = new ConcurrentHashMap<>();
    
    // 审计日志
    private final BlockingQueue<AuditRecord> auditLog = new LinkedBlockingQueue<>(10000);
    
    // 是否启用审计
    private volatile boolean auditEnabled = true;
    
    @Override
    public ModuleSandbox createSandbox(SandboxConfig config) throws SandboxException {
        String sandboxId = config.getSandboxId();
        
        if (sandboxes.containsKey(sandboxId)) {
            throw new SandboxException("SANDBOX_EXISTS", "沙箱已存在: " + sandboxId);
        }
        
        logger.info("创建模块沙箱: {} (模块: {})", sandboxId, config.getModuleId());
        
        // 创建沙箱实例
        ModuleSandbox sandbox = new ModuleSandboxImpl(config, this);
        sandboxes.put(sandboxId, sandbox);
        
        // 记录审计日志
        recordAudit(sandboxId, "SANDBOX_CREATED", "创建沙箱", null);
        
        return sandbox;
    }
    
    @Override
    public void destroySandbox(String sandboxId) {
        ModuleSandbox sandbox = sandboxes.remove(sandboxId);
        
        if (sandbox != null) {
            sandbox.destroy();
            logger.info("销毁模块沙箱: {}", sandboxId);
            recordAudit(sandboxId, "SANDBOX_DESTROYED", "销毁沙箱", null);
        }
    }
    
    @Override
    public ModuleSandbox getSandbox(String sandboxId) {
        return sandboxes.get(sandboxId);
    }
    
    @Override
    public SandboxStatus getSandboxStatus(String sandboxId) {
        ModuleSandbox sandbox = sandboxes.get(sandboxId);
        return sandbox != null ? sandbox.getStatus() : null;
    }
    
    @Override
    public <T> T executeInSandbox(String sandboxId, Callable<T> action) throws SandboxException {
        ModuleSandbox sandbox = sandboxes.get(sandboxId);
        
        if (sandbox == null) {
            throw new SandboxException("SANDBOX_NOT_FOUND", "沙箱不存在: " + sandboxId);
        }
        
        if (!sandbox.isActive()) {
            throw new SandboxException("SANDBOX_NOT_ACTIVE", "沙箱未激活: " + sandboxId);
        }
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 执行前检查权限
            sandbox.checkExecutionPermission();
            
            // 执行操作
            T result = action.call();
            
            // 记录成功
            sandbox.recordSuccess(System.currentTimeMillis() - startTime);
            
            return result;
        } catch (SecurityException e) {
            sandbox.recordFailure(e);
            recordAudit(sandboxId, "SECURITY_VIOLATION", "安全违规", e.getMessage());
            throw new SandboxException("SECURITY_VIOLATION", "安全违规: " + e.getMessage(), e);
        } catch (Exception e) {
            sandbox.recordFailure(e);
            throw new SandboxException("EXECUTION_FAILED", "执行失败: " + e.getMessage(), e);
        }
    }
    
    @Override
    public boolean checkPermission(String sandboxId, Permission permission) {
        ModuleSandbox sandbox = sandboxes.get(sandboxId);
        
        if (sandbox == null) {
            return false;
        }
        
        boolean allowed = sandbox.isPermissionAllowed(permission);
        
        // 记录权限检查
        if (auditEnabled) {
            recordAudit(sandboxId, "PERMISSION_CHECK", 
                "权限检查: " + permission.getCode(), allowed ? "允许" : "拒绝");
        }
        
        return allowed;
    }
    
    @Override
    public ResourceUsage getResourceUsage(String sandboxId) {
        ModuleSandbox sandbox = sandboxes.get(sandboxId);
        return sandbox != null ? sandbox.getResourceUsage() : null;
    }
    
    @Override
    public List<String> listSandboxes() {
        return List.copyOf(sandboxes.keySet());
    }
    
    @Override
    public void pauseSandbox(String sandboxId) {
        ModuleSandbox sandbox = sandboxes.get(sandboxId);
        if (sandbox != null) {
            sandbox.pause();
            recordAudit(sandboxId, "SANDBOX_PAUSED", "暂停沙箱", null);
        }
    }
    
    @Override
    public void resumeSandbox(String sandboxId) {
        ModuleSandbox sandbox = sandboxes.get(sandboxId);
        if (sandbox != null) {
            sandbox.resume();
            recordAudit(sandboxId, "SANDBOX_RESUMED", "恢复沙箱", null);
        }
    }
    
    /**
     * 设置审计开关
     */
    public void setAuditEnabled(boolean enabled) {
        this.auditEnabled = enabled;
    }
    
    /**
     * 获取审计日志
     */
    public List<AuditRecord> getAuditLogs(int limit) {
        return auditLog.stream().limit(limit).collect(Collectors.toList());
    }
    
    /**
     * 清空审计日志
     */
    public void clearAuditLogs() {
        auditLog.clear();
    }
    
    /**
     * 记录审计日志
     */
    private void recordAudit(String sandboxId, String action, String description, String detail) {
        if (!auditEnabled) return;
        
        AuditRecord record = new AuditRecord(
            sandboxId, action, description, detail, System.currentTimeMillis()
        );
        
        // 如果队列满了，移除最旧的记录
        if (!auditLog.offer(record)) {
            auditLog.poll();
            auditLog.offer(record);
        }
    }
    
    // ==================== 内部类 ====================
    
    /**
     * 沙箱实现
     */
    private static class ModuleSandboxImpl implements ModuleSandbox {
        
        private final SandboxConfig config;
        private final DefaultSandboxManager manager;
        private final AtomicBoolean active = new AtomicBoolean(true);
        private final AtomicBoolean paused = new AtomicBoolean(false);
        
        // 统计
        private final AtomicInteger totalExecutions = new AtomicInteger(0);
        private final AtomicInteger successExecutions = new AtomicInteger(0);
        private final AtomicInteger failedExecutions = new AtomicInteger(0);
        private final AtomicLong totalExecutionTime = new AtomicLong(0);
        
        // 资源使用
        private volatile long memoryUsage = 0;
        private volatile int threadCount = 0;
        private volatile int connectionCount = 0;
        
        public ModuleSandboxImpl(SandboxConfig config, DefaultSandboxManager manager) {
            this.config = config;
            this.manager = manager;
        }
        
        @Override
        public String getId() {
            return config.getSandboxId();
        }
        
        @Override
        public SandboxConfig getConfig() {
            return config;
        }
        
        @Override
        public SandboxStatus getStatus() {
            if (!active.get()) {
                return SandboxStatus.DESTROYED;
            }
            if (paused.get()) {
                return SandboxStatus.PAUSED;
            }
            return SandboxStatus.ACTIVE;
        }
        
        @Override
        public boolean isActive() {
            return active.get() && !paused.get();
        }
        
        @Override
        public boolean isPermissionAllowed(Permission permission) {
            // 先检查拒绝列表
            if (config.getDeniedPermissions().contains(permission)) {
                return false;
            }
            
            // 再检查允许列表
            return config.getAllowedPermissions().contains(permission);
        }
        
        @Override
        public ResourceUsage getResourceUsage() {
            return new ResourceUsage(
                config.getModuleId(),
                memoryUsage,
                threadCount,
                connectionCount,
                totalExecutions.get(),
                successExecutions.get(),
                failedExecutions.get(),
                totalExecutions.get() > 0 ? 
                    totalExecutionTime.get() / totalExecutions.get() : 0
            );
        }
        
        @Override
        public void checkExecutionPermission() {
            // 检查沙箱状态
            if (!active.get()) {
                throw new SecurityException("沙箱已销毁");
            }
            if (paused.get()) {
                throw new SecurityException("沙箱已暂停");
            }
            
            // 检查资源限制
            ResourceRequirements requirements = config.getResourceRequirements();
            if (requirements != null) {
                if (connectionCount >= requirements.getMaxConnections()) {
                    throw new SecurityException("超过最大连接数限制");
                }
            }
        }
        
        @Override
        public void recordSuccess(long executionTimeMs) {
            totalExecutions.incrementAndGet();
            successExecutions.incrementAndGet();
            totalExecutionTime.addAndGet(executionTimeMs);
        }
        
        @Override
        public void recordFailure(Throwable error) {
            totalExecutions.incrementAndGet();
            failedExecutions.incrementAndGet();
        }
        
        @Override
        public void pause() {
            paused.set(true);
        }
        
        @Override
        public void resume() {
            paused.set(false);
        }
        
        @Override
        public void destroy() {
            active.set(false);
        }
    }
    
    // ==================== 审计记录 ====================
    
    /**
     * 审计记录
     */
    public static class AuditRecord {
        private final String sandboxId;
        private final String action;
        private final String description;
        private final String detail;
        private final long timestamp;
        
        public AuditRecord(String sandboxId, String action, String description, String detail, long timestamp) {
            this.sandboxId = sandboxId;
            this.action = action;
            this.description = description;
            this.detail = detail;
            this.timestamp = timestamp;
        }
        
        public String sandboxId() { return sandboxId; }
        public String action() { return action; }
        public String description() { return description; }
        public String detail() { return detail; }
        public long timestamp() { return timestamp; }
    }
}