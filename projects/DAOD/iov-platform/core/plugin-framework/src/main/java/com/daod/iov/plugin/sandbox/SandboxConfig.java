package com.daod.iov.plugin.sandbox;

import com.daod.iov.plugin.Permission;
import com.daod.iov.plugin.ResourceRequirements;
import com.daod.iov.plugin.NetworkPolicy;
import java.util.ArrayList;
import java.util.List;

/**
 * 沙箱配置
 */
public class SandboxConfig {
    
    private String sandboxId;             // 沙箱ID
    private String moduleId;              // 模块ID
    private String moduleName;            // 模块名称
    
    // 权限配置
    private List<Permission> allowedPermissions;    // 允许的权限
    private List<Permission> deniedPermissions;     // 拒绝的权限
    
    // 资源配额
    private ResourceRequirements resourceRequirements;
    
    // 网络策略
    private NetworkPolicy networkPolicy;
    
    // 文件系统策略
    private FileSystemPolicy fileSystemPolicy;
    
    // 审计配置
    private boolean auditEnabled = true;          // 是否启用审计
    private boolean auditFileAccess = true;       // 审计文件访问
    private boolean auditNetworkAccess = true;    // 审计网络访问
    private boolean auditSystemCalls = false;     // 审计系统调用
    
    // 安全配置
    private boolean allowReflection = false;      // 允许反射
    private boolean allowNativeCode = false;      // 允许本地代码
    private boolean allowClassloaderCreation = false; // 允许创建类加载器
    
    // 隔离级别
    private IsolationLevel isolationLevel = IsolationLevel.STANDARD;
    
    public SandboxConfig() {
        this.allowedPermissions = new ArrayList<>();
        this.deniedPermissions = new ArrayList<>();
    }
    
    public SandboxConfig(String moduleId, String moduleName) {
        this();
        this.sandboxId = "sandbox-" + moduleId;
        this.moduleId = moduleId;
        this.moduleName = moduleName;
    }
    
    // ==================== Builder 方法 ====================
    
    public SandboxConfig allowPermission(Permission permission) {
        if (!this.allowedPermissions.contains(permission)) {
            this.allowedPermissions.add(permission);
        }
        return this;
    }
    
    public SandboxConfig denyPermission(Permission permission) {
        if (!this.deniedPermissions.contains(permission)) {
            this.deniedPermissions.add(permission);
        }
        return this;
    }
    
    public SandboxConfig resourceRequirements(ResourceRequirements requirements) {
        this.resourceRequirements = requirements;
        return this;
    }
    
    public SandboxConfig networkPolicy(NetworkPolicy policy) {
        this.networkPolicy = policy;
        return this;
    }
    
    public SandboxConfig fileSystemPolicy(FileSystemPolicy policy) {
        this.fileSystemPolicy = policy;
        return this;
    }
    
    public SandboxConfig auditEnabled(boolean enabled) {
        this.auditEnabled = enabled;
        return this;
    }
    
    public SandboxConfig isolationLevel(IsolationLevel level) {
        this.isolationLevel = level;
        return this;
    }
    
    // ==================== Getters and Setters ====================
    
    public String getSandboxId() { return sandboxId; }
    public void setSandboxId(String sandboxId) { this.sandboxId = sandboxId; }
    
    public String getModuleId() { return moduleId; }
    public void setModuleId(String moduleId) { this.moduleId = moduleId; }
    
    public String getModuleName() { return moduleName; }
    public void setModuleName(String moduleName) { this.moduleName = moduleName; }
    
    public List<Permission> getAllowedPermissions() { return allowedPermissions; }
    public void setAllowedPermissions(List<Permission> allowedPermissions) { this.allowedPermissions = allowedPermissions; }
    
    public List<Permission> getDeniedPermissions() { return deniedPermissions; }
    public void setDeniedPermissions(List<Permission> deniedPermissions) { this.deniedPermissions = deniedPermissions; }
    
    public ResourceRequirements getResourceRequirements() { return resourceRequirements; }
    public void setResourceRequirements(ResourceRequirements resourceRequirements) { this.resourceRequirements = resourceRequirements; }
    
    public NetworkPolicy getNetworkPolicy() { return networkPolicy; }
    public void setNetworkPolicy(NetworkPolicy networkPolicy) { this.networkPolicy = networkPolicy; }
    
    public FileSystemPolicy getFileSystemPolicy() { return fileSystemPolicy; }
    public void setFileSystemPolicy(FileSystemPolicy fileSystemPolicy) { this.fileSystemPolicy = fileSystemPolicy; }
    
    public boolean isAuditEnabled() { return auditEnabled; }
    public void setAuditEnabled(boolean auditEnabled) { this.auditEnabled = auditEnabled; }
    
    public boolean isAuditFileAccess() { return auditFileAccess; }
    public void setAuditFileAccess(boolean auditFileAccess) { this.auditFileAccess = auditFileAccess; }
    
    public boolean isAuditNetworkAccess() { return auditNetworkAccess; }
    public void setAuditNetworkAccess(boolean auditNetworkAccess) { this.auditNetworkAccess = auditNetworkAccess; }
    
    public boolean isAuditSystemCalls() { return auditSystemCalls; }
    public void setAuditSystemCalls(boolean auditSystemCalls) { this.auditSystemCalls = auditSystemCalls; }
    
    public boolean isAllowReflection() { return allowReflection; }
    public void setAllowReflection(boolean allowReflection) { this.allowReflection = allowReflection; }
    
    public boolean isAllowNativeCode() { return allowNativeCode; }
    public void setAllowNativeCode(boolean allowNativeCode) { this.allowNativeCode = allowNativeCode; }
    
    public boolean isAllowClassloaderCreation() { return allowClassloaderCreation; }
    public void setAllowClassloaderCreation(boolean allowClassloaderCreation) { this.allowClassloaderCreation = allowClassloaderCreation; }
    
    public IsolationLevel getIsolationLevel() { return isolationLevel; }
    public void setIsolationLevel(IsolationLevel isolationLevel) { this.isolationLevel = isolationLevel; }
    
    /**
     * 隔离级别
     */
    public enum IsolationLevel {
        /** 最小隔离 - 仅基本的权限检查 */
        MINIMAL,
        /** 标准隔离 - 权限 + 资源配额 */
        STANDARD,
        /** 严格隔离 - 完全沙箱隔离 */
        STRICT,
        /** 完全隔离 - 进程级隔离 */
        PROCESS
    }
}