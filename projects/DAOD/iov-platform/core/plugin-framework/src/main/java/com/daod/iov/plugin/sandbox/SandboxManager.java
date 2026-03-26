package com.daod.iov.plugin.sandbox;

import com.daod.iov.plugin.Permission;
import com.daod.iov.plugin.ResourceRequirements;
import java.util.List;
import java.util.concurrent.Callable;

/**
 * 沙箱管理器接口
 * 
 * 提供模块双向隔离能力：
 * - 权限控制：限制模块可执行的操作
 * - 资源配额：限制模块可使用的资源
 * - 安全隔离：防止恶意模块影响系统
 * 
 * @author daod-team
 * @version 1.0.0
 */
public interface SandboxManager {
    
    /**
     * 创建模块沙箱
     * @param config 沙箱配置
     * @return 沙箱实例
     * @throws SandboxException 创建失败
     */
    ModuleSandbox createSandbox(SandboxConfig config) throws SandboxException;
    
    /**
     * 销毁模块沙箱
     * @param sandboxId 沙箱ID
     */
    void destroySandbox(String sandboxId);
    
    /**
     * 获取沙箱实例
     * @param sandboxId 沙箱ID
     * @return 沙箱实例
     */
    ModuleSandbox getSandbox(String sandboxId);
    
    /**
     * 获取沙箱状态
     * @param sandboxId 沙箱ID
     * @return 沙箱状态
     */
    SandboxStatus getSandboxStatus(String sandboxId);
    
    /**
     * 在沙箱中执行操作
     * @param sandboxId 沙箱ID
     * @param action 要执行的操作
     * @return 操作结果
     * @throws SandboxException 执行失败
     */
    <T> T executeInSandbox(String sandboxId, Callable<T> action) throws SandboxException;
    
    /**
     * 检查权限
     * @param sandboxId 沙箱ID
     * @param permission 权限
     * @return 是否有权限
     */
    boolean checkPermission(String sandboxId, Permission permission);
    
    /**
     * 获取沙箱资源使用情况
     * @param sandboxId 沙箱ID
     * @return 资源使用情况
     */
    ResourceUsage getResourceUsage(String sandboxId);
    
    /**
     * 获取所有沙箱列表
     * @return 沙箱ID列表
     */
    List<String> listSandboxes();
    
    /**
     * 暂停沙箱
     * @param sandboxId 沙箱ID
     */
    void pauseSandbox(String sandboxId);
    
    /**
     * 恢复沙箱
     * @param sandboxId 沙箱ID
     */
    void resumeSandbox(String sandboxId);
}