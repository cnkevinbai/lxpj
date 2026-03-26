package com.daod.iov.plugin.sandbox;

import com.daod.iov.plugin.Permission;
import com.daod.iov.plugin.ResourceRequirements;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.DisplayName;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 沙箱管理器单元测试
 */
@DisplayName("沙箱管理器单元测试")
class SandboxManagerTest {
    
    private DefaultSandboxManager sandboxManager;
    
    @BeforeEach
    void setUp() {
        sandboxManager = new DefaultSandboxManager();
    }
    
    @AfterEach
    void tearDown() {
        // 清理所有沙箱
        for (String sandboxId : sandboxManager.listSandboxes()) {
            sandboxManager.destroySandbox(sandboxId);
        }
    }
    
    @Test
    @DisplayName("创建沙箱")
    void testCreateSandbox() throws SandboxException {
        SandboxConfig config = new SandboxConfig("test-1", "TestModule")
            .allowPermission(Permission.FILE_READ)
            .resourceRequirements(ResourceRequirements.defaults());
        
        ModuleSandbox sandbox = sandboxManager.createSandbox(config);
        
        assertNotNull(sandbox);
        assertEquals("sandbox-test-1", sandbox.getId());
        assertEquals(SandboxStatus.ACTIVE, sandbox.getStatus());
    }
    
    @Test
    @DisplayName("重复创建沙箱抛出异常")
    void testCreateDuplicateSandbox() throws SandboxException {
        SandboxConfig config = new SandboxConfig("dup-test", "DupModule");
        sandboxManager.createSandbox(config);
        
        assertThrows(SandboxException.class, () -> 
            sandboxManager.createSandbox(config));
    }
    
    @Test
    @DisplayName("权限检查 - 允许")
    void testPermissionAllowed() throws SandboxException {
        SandboxConfig config = new SandboxConfig("perm-test", "PermModule")
            .allowPermission(Permission.FILE_READ)
            .allowPermission(Permission.NETWORK_CONNECT)
            .denyPermission(Permission.FILE_DELETE);
        
        sandboxManager.createSandbox(config);
        
        assertTrue(sandboxManager.checkPermission("sandbox-perm-test", Permission.FILE_READ));
        assertTrue(sandboxManager.checkPermission("sandbox-perm-test", Permission.NETWORK_CONNECT));
    }
    
    @Test
    @DisplayName("权限检查 - 拒绝")
    void testPermissionDenied() throws SandboxException {
        SandboxConfig config = new SandboxConfig("deny-test", "DenyModule")
            .denyPermission(Permission.FILE_DELETE)
            .denyPermission(Permission.NATIVE_CODE);
        
        sandboxManager.createSandbox(config);
        
        assertFalse(sandboxManager.checkPermission("sandbox-deny-test", Permission.FILE_DELETE));
        assertFalse(sandboxManager.checkPermission("sandbox-deny-test", Permission.NATIVE_CODE));
        assertFalse(sandboxManager.checkPermission("sandbox-deny-test", Permission.FILE_READ));
    }
    
    @Test
    @DisplayName("在沙箱中执行操作")
    void testExecuteInSandbox() throws SandboxException {
        SandboxConfig config = new SandboxConfig("exec-test", "ExecModule");
        sandboxManager.createSandbox(config);
        
        String result = sandboxManager.executeInSandbox("sandbox-exec-test", () -> "success");
        
        assertEquals("success", result);
        
        // 检查资源使用
        ResourceUsage usage = sandboxManager.getResourceUsage("sandbox-exec-test");
        assertNotNull(usage);
        assertEquals(1, usage.getTotalExecutions());
        assertEquals(1, usage.getSuccessExecutions());
    }
    
    @Test
    @DisplayName("沙箱不存在时执行抛出异常")
    void testExecuteNonExistentSandbox() {
        assertThrows(SandboxException.class, () -> 
            sandboxManager.executeInSandbox("non-existent", () -> "test"));
    }
    
    @Test
    @DisplayName("暂停沙箱")
    void testPauseSandbox() throws SandboxException {
        SandboxConfig config = new SandboxConfig("pause-test", "PauseModule");
        sandboxManager.createSandbox(config);
        
        sandboxManager.pauseSandbox("sandbox-pause-test");
        
        ModuleSandbox sandbox = sandboxManager.getSandbox("sandbox-pause-test");
        assertEquals(SandboxStatus.PAUSED, sandbox.getStatus());
        assertFalse(sandbox.isActive());
        
        // 暂停状态执行应该失败
        assertThrows(SandboxException.class, () ->
            sandboxManager.executeInSandbox("sandbox-pause-test", () -> "test"));
    }
    
    @Test
    @DisplayName("恢复沙箱")
    void testResumeSandbox() throws SandboxException {
        SandboxConfig config = new SandboxConfig("resume-test", "ResumeModule");
        sandboxManager.createSandbox(config);
        
        sandboxManager.pauseSandbox("sandbox-resume-test");
        assertEquals(SandboxStatus.PAUSED, sandboxManager.getSandboxStatus("sandbox-resume-test"));
        
        sandboxManager.resumeSandbox("sandbox-resume-test");
        assertEquals(SandboxStatus.ACTIVE, sandboxManager.getSandboxStatus("sandbox-resume-test"));
        assertTrue(sandboxManager.getSandbox("sandbox-resume-test").isActive());
    }
    
    @Test
    @DisplayName("销毁沙箱")
    void testDestroySandbox() throws SandboxException {
        SandboxConfig config = new SandboxConfig("destroy-test", "DestroyModule");
        sandboxManager.createSandbox(config);
        
        assertTrue(sandboxManager.listSandboxes().contains("sandbox-destroy-test"));
        
        sandboxManager.destroySandbox("sandbox-destroy-test");
        
        assertFalse(sandboxManager.listSandboxes().contains("sandbox-destroy-test"));
        assertNull(sandboxManager.getSandbox("sandbox-destroy-test"));
    }
    
    @Test
    @DisplayName("资源使用统计")
    void testResourceUsage() throws SandboxException {
        SandboxConfig config = new SandboxConfig("usage-test", "UsageModule");
        sandboxManager.createSandbox(config);
        
        // 执行多次操作
        for (int i = 0; i < 10; i++) {
            sandboxManager.executeInSandbox("sandbox-usage-test", () -> {
                Thread.sleep(10);
                return null;
            });
        }
        
        ResourceUsage usage = sandboxManager.getResourceUsage("sandbox-usage-test");
        
        assertEquals(10, usage.getTotalExecutions());
        assertEquals(10, usage.getSuccessExecutions());
        assertEquals(0, usage.getFailedExecutions());
        assertTrue(usage.getAvgExecutionTime() >= 10);
    }
    
    @Test
    @DisplayName("审计日志")
    void testAuditLog() throws SandboxException {
        sandboxManager.setAuditEnabled(true);
        
        SandboxConfig config = new SandboxConfig("audit-test", "AuditModule");
        sandboxManager.createSandbox(config);
        sandboxManager.executeInSandbox("sandbox-audit-test", () -> "test");
        sandboxManager.pauseSandbox("sandbox-audit-test");
        sandboxManager.destroySandbox("sandbox-audit-test");
        
        List<DefaultSandboxManager.AuditRecord> logs = sandboxManager.getAuditLogs(100);
        
        assertFalse(logs.isEmpty());
        assertTrue(logs.stream().anyMatch(l -> l.action().equals("SANDBOX_CREATED")));
        assertTrue(logs.stream().anyMatch(l -> l.action().equals("SANDBOX_PAUSED")));
        assertTrue(logs.stream().anyMatch(l -> l.action().equals("SANDBOX_DESTROYED")));
    }
    
    @Test
    @DisplayName("隔离级别测试")
    void testIsolationLevels() throws SandboxException {
        SandboxConfig minimalConfig = new SandboxConfig("minimal", "MinimalModule")
            .isolationLevel(SandboxConfig.IsolationLevel.MINIMAL);
        
        SandboxConfig strictConfig = new SandboxConfig("strict", "StrictModule")
            .isolationLevel(SandboxConfig.IsolationLevel.STRICT);
        
        sandboxManager.createSandbox(minimalConfig);
        sandboxManager.createSandbox(strictConfig);
        
        assertEquals(SandboxConfig.IsolationLevel.MINIMAL, 
            sandboxManager.getSandbox("sandbox-minimal").getConfig().getIsolationLevel());
        assertEquals(SandboxConfig.IsolationLevel.STRICT, 
            sandboxManager.getSandbox("sandbox-strict").getConfig().getIsolationLevel());
    }
    
    @Test
    @DisplayName("资源配额限制")
    void testResourceQuota() throws SandboxException {
        ResourceRequirements requirements = ResourceRequirements.defaults()
            .maxConnections(5)
            .maxThreads(10);
        
        SandboxConfig config = new SandboxConfig("quota-test", "QuotaModule")
            .resourceRequirements(requirements);
        
        sandboxManager.createSandbox(config);
        
        ModuleSandbox sandbox = sandboxManager.getSandbox("sandbox-quota-test");
        ResourceRequirements sandboxReqs = sandbox.getConfig().getResourceRequirements();
        
        assertEquals(5, sandboxReqs.getMaxConnections());
        assertEquals(10, sandboxReqs.getMaxThreads());
    }
}