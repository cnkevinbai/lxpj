package com.daod.iov.plugin;

import com.daod.iov.plugin.circuitbreaker.*;
import com.daod.iov.plugin.rollback.*;
import com.daod.iov.plugin.sandbox.*;
import com.daod.iov.plugin.metrics.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.DisplayName;

import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 微内核核心组件集成测试
 * 
 * 测试场景：
 * 1. 模块加载与沙箱隔离
 * 2. 熔断器状态转换
 * 3. 自动回滚联动
 * 4. 指标收集导出
 * 
 * @author daod-team
 * @version 1.0.0
 */
@DisplayName("微内核核心组件集成测试")
class CoreComponentsIntegrationTest {
    
    private SandboxManager sandboxManager;
    private CircuitBreaker circuitBreaker;
    private RollbackManager rollbackManager;
    private MetricsRegistry metricsRegistry;
    
    @BeforeEach
    void setUp() {
        sandboxManager = new DefaultSandboxManager();
        circuitBreaker = new CircuitBreakerImpl("test-breaker", CircuitBreakerConfig.defaults());
        metricsRegistry = new MetricsRegistry();
        
        // 设置熔断器监听器
        circuitBreaker.addListener(new TestCircuitBreakerListener());
    }
    
    @AfterEach
    void tearDown() {
        metricsRegistry.clear();
    }
    
    // ==================== 沙箱隔离测试 ====================
    
    @Test
    @DisplayName("1.1 创建沙箱并检查权限")
    void testCreateSandbox() throws SandboxException {
        // 创建沙箱配置
        SandboxConfig config = new SandboxConfig("test-module", "TestModule")
            .allowPermission(Permission.FILE_READ)
            .allowPermission(Permission.NETWORK_CONNECT)
            .denyPermission(Permission.FILE_DELETE)
            .resourceRequirements(ResourceRequirements.defaults());
        
        // 创建沙箱
        ModuleSandbox sandbox = sandboxManager.createSandbox(config);
        
        // 验证沙箱状态
        assertNotNull(sandbox);
        assertEquals(SandboxStatus.ACTIVE, sandbox.getStatus());
        assertTrue(sandbox.isActive());
        
        // 验证权限
        assertTrue(sandbox.isPermissionAllowed(Permission.FILE_READ));
        assertTrue(sandbox.isPermissionAllowed(Permission.NETWORK_CONNECT));
        assertFalse(sandbox.isPermissionAllowed(Permission.FILE_DELETE));
        assertFalse(sandbox.isPermissionAllowed(Permission.NATIVE_CODE));
    }
    
    @Test
    @DisplayName("1.2 沙箱执行操作")
    void testExecuteInSandbox() throws SandboxException {
        SandboxConfig config = new SandboxConfig("exec-test", "ExecTest")
            .allowPermission(Permission.FILE_READ);
        
        ModuleSandbox sandbox = sandboxManager.createSandbox(config);
        
        // 执行操作
        String result = sandboxManager.executeInSandbox(sandbox.getId(), () -> "success");
        
        assertEquals("success", result);
        
        // 检查资源使用
        ResourceUsage usage = sandboxManager.getResourceUsage(sandbox.getId());
        assertNotNull(usage);
        assertEquals(1, usage.getTotalExecutions());
        assertEquals(1, usage.getSuccessExecutions());
        assertEquals(0, usage.getFailedExecutions());
    }
    
    @Test
    @DisplayName("1.3 沙箱暂停与恢复")
    void testSandboxPauseResume() throws SandboxException {
        SandboxConfig config = new SandboxConfig("pause-test", "PauseTest");
        ModuleSandbox sandbox = sandboxManager.createSandbox(config);
        
        // 暂停
        sandboxManager.pauseSandbox(sandbox.getId());
        assertEquals(SandboxStatus.PAUSED, sandbox.getStatus());
        assertFalse(sandbox.isActive());
        
        // 尝试执行应该失败
        assertThrows(SandboxException.class, () -> 
            sandboxManager.executeInSandbox(sandbox.getId(), () -> "test"));
        
        // 恢复
        sandboxManager.resumeSandbox(sandbox.getId());
        assertEquals(SandboxStatus.ACTIVE, sandbox.getStatus());
        assertTrue(sandbox.isActive());
    }
    
    @Test
    @DisplayName("1.4 沙箱销毁")
    void testSandboxDestroy() throws SandboxException {
        SandboxConfig config = new SandboxConfig("destroy-test", "DestroyTest");
        ModuleSandbox sandbox = sandboxManager.createSandbox(config);
        
        String sandboxId = sandbox.getId();
        
        // 销毁
        sandboxManager.destroySandbox(sandboxId);
        
        // 验证已销毁
        assertNull(sandboxManager.getSandbox(sandboxId));
        assertNull(sandboxManager.getSandboxStatus(sandboxId));
    }
    
    // ==================== 熔断器测试 ====================
    
    @Test
    @DisplayName("2.1 熔断器初始状态")
    void testCircuitBreakerInitialState() {
        assertEquals(CircuitState.CLOSED, circuitBreaker.getState());
        assertTrue(circuitBreaker.allowRequest());
    }
    
    @Test
    @DisplayName("2.2 熔断器记录成功")
    void testCircuitBreakerSuccess() {
        for (int i = 0; i < 10; i++) {
            circuitBreaker.recordSuccess();
        }
        
        assertEquals(CircuitState.CLOSED, circuitBreaker.getState());
        
        CircuitBreakerStats stats = circuitBreaker.getStats();
        assertEquals(10, stats.getTotalCalls());
        assertEquals(10, stats.getSuccessCalls());
        assertEquals(0, stats.getFailedCalls());
    }
    
    @Test
    @DisplayName("2.3 熔断器触发熔断")
    void testCircuitBreakerTrip() {
        // 使用严格配置 (30% 阈值)
        CircuitBreakerConfig config = CircuitBreakerConfig.strict()
            .minimumNumberOfCalls(5);
        
        CircuitBreaker strictBreaker = new CircuitBreakerImpl("strict", config);
        
        // 记录失败
        for (int i = 0; i < 5; i++) {
            strictBreaker.recordFailure(new RuntimeException("Test error"));
        }
        
        // 应该触发熔断
        assertEquals(CircuitState.OPEN, strictBreaker.getState());
        assertFalse(strictBreaker.allowRequest());
    }
    
    @Test
    @DisplayName("2.4 熔断器恢复")
    void testCircuitBreakerRecovery() throws InterruptedException {
        CircuitBreakerConfig config = CircuitBreakerConfig.defaults()
            .waitDurationInOpenState(100)  // 100ms
            .permittedNumberOfCallsInHalfOpenState(3);
        
        CircuitBreaker fastBreaker = new CircuitBreakerImpl("fast", config);
        
        // 触发熔断
        for (int i = 0; i < 10; i++) {
            fastBreaker.recordFailure(new RuntimeException("Error"));
        }
        assertEquals(CircuitState.OPEN, fastBreaker.getState());
        
        // 等待熔断时间
        Thread.sleep(150);
        
        // 应该进入半开状态
        assertEquals(CircuitState.HALF_OPEN, fastBreaker.getState());
        
        // 成功请求
        for (int i = 0; i < 3; i++) {
            fastBreaker.recordSuccess();
        }
        
        // 应该恢复到关闭状态
        assertEquals(CircuitState.CLOSED, fastBreaker.getState());
    }
    
    @Test
    @DisplayName("2.5 并发熔断测试")
    void testCircuitBreakerConcurrency() throws InterruptedException {
        int threadCount = 100;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failureCount = new AtomicInteger(0);
        
        for (int i = 0; i < threadCount; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    if (circuitBreaker.allowRequest()) {
                        if (index % 3 == 0) {
                            circuitBreaker.recordFailure(new RuntimeException("Error"));
                        } else {
                            circuitBreaker.recordSuccess();
                        }
                        successCount.incrementAndGet();
                    } else {
                        failureCount.incrementAndGet();
                    }
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await();
        executor.shutdown();
        
        // 验证统计
        CircuitBreakerStats stats = circuitBreaker.getStats();
        assertTrue(stats.getTotalCalls() > 0);
    }
    
    // ==================== 指标收集测试 ====================
    
    @Test
    @DisplayName("3.1 注册模块指标")
    void testRegisterModuleMetrics() {
        // 创建测试模块
        TestModule module = new TestModule();
        
        // 注册指标
        metricsRegistry.registerModule("test-module", module);
        
        // 验证注册
        assertTrue(metricsRegistry.getRegisteredModules().contains("test-module"));
        
        // 收集指标
        List<Metric> metrics = metricsRegistry.collectAllMetrics();
        assertFalse(metrics.isEmpty());
        
        // 验证指标内容
        boolean hasModuleState = metrics.stream()
            .anyMatch(m -> m.getName().equals("module_state"));
        assertTrue(hasModuleState);
    }
    
    @Test
    @DisplayName("3.2 Prometheus 格式导出")
    void testPrometheusExport() {
        // 添加全局指标
        metricsRegistry.addGlobalMetric(
            new Metric("system_start_time", Metric.MetricType.GAUGE, System.currentTimeMillis())
                .withLabel("app", "iov-platform")
                .withHelp("系统启动时间")
        );
        
        // 导出
        String prometheus = metricsRegistry.exportPrometheusFormat();
        
        // 验证格式
        assertTrue(prometheus.contains("# TYPE"));
        assertTrue(prometheus.contains("# HELP"));
        assertTrue(prometheus.contains("system_start_time"));
    }
    
    @Test
    @DisplayName("3.3 指标注销")
    void testUnregisterModuleMetrics() {
        TestModule module = new TestModule();
        metricsRegistry.registerModule("unregister-test", module);
        
        // 注销
        metricsRegistry.unregisterModule("unregister-test");
        
        // 验证
        assertFalse(metricsRegistry.getRegisteredModules().contains("unregister-test"));
    }
    
    // ==================== 集成场景测试 ====================
    
    @Test
    @DisplayName("4.1 模块加载 -> 沙箱隔离 -> 指标收集")
    void testFullModuleLifecycle() throws SandboxException {
        String moduleId = "lifecycle-test";
        
        // 1. 创建沙箱
        SandboxConfig config = new SandboxConfig(moduleId, "LifecycleTest")
            .allowPermission(Permission.FILE_READ)
            .resourceRequirements(ResourceRequirements.small());
        
        ModuleSandbox sandbox = sandboxManager.createSandbox(config);
        
        // 2. 注册指标
        TestModule module = new TestModule();
        metricsRegistry.registerModule(moduleId, module);
        
        // 3. 在沙箱中执行操作
        String result = sandboxManager.executeInSandbox(sandbox.getId(), () -> {
            // 模拟模块操作
            module.simulateOperation();
            return "operation-complete";
        });
        
        assertEquals("operation-complete", result);
        
        // 4. 检查资源使用
        ResourceUsage usage = sandbox.getResourceUsage();
        assertEquals(1, usage.getSuccessExecutions());
        
        // 5. 检查指标
        List<Metric> metrics = metricsRegistry.collectAllMetrics();
        assertFalse(metrics.isEmpty());
        
        // 6. 清理
        metricsRegistry.unregisterModule(moduleId);
        sandboxManager.destroySandbox(sandbox.getId());
    }
    
    @Test
    @DisplayName("4.2 熔断触发 -> 自动回滚")
    void testCircuitBreakerTriggerRollback() {
        AtomicInteger rollbackCount = new AtomicInteger(0);
        
        // 创建回滚管理器
        RollbackManager testRollbackManager = new RollbackManager() {
            @Override
            public String createBackup(String moduleId) { return "backup-1"; }
            @Override
            public void rollback(String moduleId, String backupId) { rollbackCount.incrementAndGet(); }
            @Override
            public void rollbackToPrevious(String moduleId) { rollbackCount.incrementAndGet(); }
            @Override
            public boolean autoRollback(String moduleId) { 
                rollbackCount.incrementAndGet();
                return true;
            }
            @Override
            public List<BackupInfo> listBackups(String moduleId) { return List.of(); }
            @Override
            public BackupInfo getLatestBackup(String moduleId) { return null; }
            @Override
            public void deleteBackup(String moduleId, String backupId) {}
            @Override
            public void cleanupOldBackups(String moduleId, int keepCount) {}
            @Override
            public void setAutoRollbackEnabled(boolean enabled) {}
            @Override
            public boolean isAutoRollbackEnabled() { return true; }
        };
        
        // 添加监听器联动回滚
        String testModuleId = "test-rollback-module";
        circuitBreaker.addListener(new CircuitBreakerListener() {
            @Override
            public void onStateChange(String name, CircuitState oldState, CircuitState newState) {
                if (newState == CircuitState.OPEN) {
                    testRollbackManager.autoRollback(testModuleId);
                }
            }
            
            @Override
            public void onFailureThresholdExceeded(String name, double failureRate, double threshold) {
                // 触发回滚
                testRollbackManager.autoRollback(testModuleId);
            }
        });
        
        // 触发熔断
        CircuitBreakerConfig config = CircuitBreakerConfig.strict()
            .minimumNumberOfCalls(3)
            .failureRateThreshold(50);
        
        CircuitBreaker testBreaker = new CircuitBreakerImpl("test", config);
        testBreaker.addListener(new CircuitBreakerListener() {
            @Override
            public void onStateChange(String name, CircuitState oldState, CircuitState newState) {
                if (newState == CircuitState.OPEN) {
                    testRollbackManager.autoRollback(testModuleId);
                }
            }
            
            @Override
            public void onFailureThresholdExceeded(String name, double failureRate, double threshold) {
                testRollbackManager.autoRollback(testModuleId);
            }
        });
        
        // 记录失败
        for (int i = 0; i < 5; i++) {
            testBreaker.recordFailure(new RuntimeException("Test"));
        }
        
        // 验证回滚被触发
        assertTrue(rollbackCount.get() > 0, "回滚应该被触发");
    }
    
    @Test
    @DisplayName("4.3 高并发集成测试")
    void testHighConcurrency() throws InterruptedException {
        int threadCount = 50;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(threadCount);
        
        // 创建多个沙箱
        for (int i = 0; i < 10; i++) {
            try {
                sandboxManager.createSandbox(
                    new SandboxConfig("concurrent-" + i, "ConcurrentTest")
                );
            } catch (SandboxException e) {
                // 忽略
            }
        }
        
        // 并发执行
        AtomicInteger totalOps = new AtomicInteger(0);
        AtomicInteger successOps = new AtomicInteger(0);
        
        for (int i = 0; i < threadCount; i++) {
            final int index = i;
            executor.submit(() -> {
                try {
                    String sandboxId = "sandbox-concurrent-" + (index % 10);
                    
                    // 沙箱操作
                    sandboxManager.executeInSandbox(sandboxId, () -> {
                        totalOps.incrementAndGet();
                        
                        // 熔断器记录
                        if (index % 5 == 0) {
                            circuitBreaker.recordFailure(new RuntimeException());
                        } else {
                            circuitBreaker.recordSuccess();
                        }
                        
                        return null;
                    });
                    
                    successOps.incrementAndGet();
                } catch (Exception e) {
                    // 忽略
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await();
        executor.shutdown();
        
        // 验证
        assertTrue(successOps.get() > 0, "应该有成功的操作");
        System.out.println("总操作: " + totalOps.get() + ", 成功: " + successOps.get());
        System.out.println("熔断器统计: " + circuitBreaker.getStats());
    }
    
    // ==================== 测试辅助类 ====================
    
    static class TestModule implements ISFU {
        private ModuleState state = ModuleState.RUNNING;
        private int operationCount = 0;
        
        @Override
        public ModuleMetadata getMetadata() {
            return new ModuleMetadata("test-module", "1.0.0", "Test Module");
        }
        
        @Override
        public void initialize(ModuleContext context) {}
        
        @Override
        public void start() { state = ModuleState.RUNNING; }
        
        @Override
        public void stop() { state = ModuleState.STOPPED; }
        
        @Override
        public void destroy() { state = ModuleState.DESTROYED; }
        
        @Override
        public ModuleState getState() { return state; }
        
        @Override
        public HealthStatus getHealthStatus() { return HealthStatus.HEALTHY; }
        
        @Override
        public List<Metric> getMetrics() {
            return List.of(
                new Metric("module_state", Metric.MetricType.GAUGE, state.ordinal())
                    .withLabel("module", "test-module"),
                new Metric("module_operations", Metric.MetricType.COUNTER, operationCount)
                    .withLabel("module", "test-module")
            );
        }
        
        @Override
        public HealthCheckResult healthCheck() {
            return HealthCheckResult.healthy();
        }
        
        @Override
        public String getApiSpecification() { return ""; }
        
        @Override
        public List<ApiDependency> getApiDependencies() { return List.of(); }
        
        @Override
        public List<Permission> getRequiredPermissions() { return List.of(); }
        
        @Override
        public ResourceRequirements getResourceRequirements() {
            return ResourceRequirements.defaults();
        }
        
        public void simulateOperation() {
            operationCount++;
        }
    }
    
    static class TestCircuitBreakerListener implements CircuitBreakerListener {
        @Override
        public void onStateChange(String name, CircuitState oldState, CircuitState newState) {
            System.out.println("[Listener] 状态变化: " + oldState + " -> " + newState);
        }
        
        @Override
        public void onFailureThresholdExceeded(String name, double failureRate, double threshold) {
            System.out.println("[Listener] 错误率超标: " + failureRate + "% > " + threshold + "%");
        }
    }
}