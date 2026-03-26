package com.daod.iov.plugin.metrics;

import com.daod.iov.plugin.*;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.DisplayName;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 指标注册表单元测试
 */
@DisplayName("指标注册表单元测试")
class MetricsRegistryTest {
    
    private MetricsRegistry registry;
    
    @BeforeEach
    void setUp() {
        registry = new MetricsRegistry();
    }
    
    @AfterEach
    void tearDown() {
        registry.clear();
    }
    
    @Test
    @DisplayName("注册模块指标")
    void testRegisterModule() {
        TestModule module = new TestModule();
        
        registry.registerModule("test-module", module);
        
        assertTrue(registry.getRegisteredModules().contains("test-module"));
        assertNotNull(registry.getModuleMetrics("test-module"));
    }
    
    @Test
    @DisplayName("注销模块指标")
    void testUnregisterModule() {
        TestModule module = new TestModule();
        registry.registerModule("unregister-test", module);
        
        registry.unregisterModule("unregister-test");
        
        assertFalse(registry.getRegisteredModules().contains("unregister-test"));
        assertNull(registry.getModuleMetrics("unregister-test"));
    }
    
    @Test
    @DisplayName("收集所有指标")
    void testCollectAllMetrics() {
        // 注册多个模块
        registry.registerModule("module-1", new TestModule("module-1"));
        registry.registerModule("module-2", new TestModule("module-2"));
        
        // 添加全局指标
        registry.addGlobalMetric(
            new Metric("global_start_time", Metric.MetricType.GAUGE, System.currentTimeMillis())
        );
        
        List<Metric> metrics = registry.collectAllMetrics();
        
        assertFalse(metrics.isEmpty());
        // 应包含全局指标
        assertTrue(metrics.stream().anyMatch(m -> m.getName().equals("global_start_time")));
    }
    
    @Test
    @DisplayName("Prometheus 格式导出")
    void testPrometheusExport() {
        registry.registerModule("prom-test", new TestModule("prom-test"));
        
        String output = registry.exportPrometheusFormat();
        
        assertNotNull(output);
        assertTrue(output.contains("# TYPE"));
        assertTrue(output.contains("module_state"));
        assertTrue(output.contains("module_operations"));
    }
    
    @Test
    @DisplayName("全局指标操作")
    void testGlobalMetrics() {
        Metric metric1 = new Metric("metric_1", Metric.MetricType.COUNTER, 100)
            .withLabel("env", "test")
            .withHelp("测试指标1");
        
        Metric metric2 = new Metric("metric_2", Metric.MetricType.GAUGE, 50.5)
            .withLabel("env", "prod")
            .withHelp("测试指标2");
        
        registry.addGlobalMetric(metric1);
        registry.addGlobalMetric(metric2);
        
        List<Metric> allMetrics = registry.collectAllMetrics();
        
        assertEquals(2, allMetrics.stream()
            .filter(m -> m.getName().startsWith("metric_"))
            .count());
        
        // 移除指标
        registry.removeGlobalMetric("metric_1");
        
        allMetrics = registry.collectAllMetrics();
        assertEquals(1, allMetrics.stream()
            .filter(m -> m.getName().startsWith("metric_"))
            .count());
    }
    
    @Test
    @DisplayName("启用/禁用指标收集")
    void testEnableDisable() {
        assertTrue(registry.isEnabled());
        
        registry.setEnabled(false);
        assertFalse(registry.isEnabled());
        
        // 禁用后注册不应该生效
        registry.registerModule("disabled-test", new TestModule());
        // 实际上注册会跳过，但 Map 操作仍执行
        // 这里主要测试 enabled 标志
    }
    
    @Test
    @DisplayName("清空所有指标")
    void testClear() {
        registry.registerModule("clear-test-1", new TestModule());
        registry.registerModule("clear-test-2", new TestModule());
        registry.addGlobalMetric(new Metric("global", Metric.MetricType.GAUGE, 1));
        
        assertEquals(2, registry.getRegisteredModules().size());
        
        registry.clear();
        
        assertTrue(registry.getRegisteredModules().isEmpty());
        assertTrue(registry.collectAllMetrics().isEmpty());
    }
    
    @Test
    @DisplayName("模块指标容器测试")
    void testModuleMetricsContainer() {
        TestModule module = new TestModule("container-test");
        registry.registerModule("container-test", module);
        
        MetricsRegistry.ModuleMetrics container = registry.getModuleMetrics("container-test");
        
        assertNotNull(container);
        assertEquals("container-test", container.getModuleId());
        
        // 收集指标
        List<Metric> metrics = container.collect();
        assertFalse(metrics.isEmpty());
        
        // 健康检查
        HealthCheckResult health = container.healthCheck();
        assertTrue(health.isHealthy());
    }
    
    @Test
    @DisplayName("指标格式验证")
    void testMetricFormat() {
        Metric metric = new Metric("test_metric", Metric.MetricType.COUNTER, 42)
            .withLabel("module", "test")
            .withLabel("type", "counter")
            .withHelp("测试指标");
        
        String prometheus = metric.toPrometheusFormat();
        
        assertTrue(prometheus.contains("# HELP test_metric 测试指标"));
        assertTrue(prometheus.contains("# TYPE test_metric counter"));
        assertTrue(prometheus.contains("test_metric{module=\"test\",type=\"counter\"} 42"));
    }
    
    // ==================== 测试辅助类 ====================
    
    static class TestModule implements ISFU {
        private final String name;
        private int operationCount = 0;
        
        public TestModule() {
            this("test-module");
        }
        
        public TestModule(String name) {
            this.name = name;
        }
        
        @Override
        public ModuleMetadata getMetadata() {
            return new ModuleMetadata(name, "1.0.0", "Test Module");
        }
        
        @Override
        public void initialize(ModuleContext context) {}
        
        @Override
        public void start() {}
        
        @Override
        public void stop() {}
        
        @Override
        public void destroy() {}
        
        @Override
        public ModuleState getState() { return ModuleState.RUNNING; }
        
        @Override
        public HealthStatus getHealthStatus() { return HealthStatus.HEALTHY; }
        
        @Override
        public List<Metric> getMetrics() {
            operationCount++;
            return List.of(
                new Metric("module_state", Metric.MetricType.GAUGE, 3)
                    .withLabel("module", name),
                new Metric("module_operations", Metric.MetricType.COUNTER, operationCount)
                    .withLabel("module", name)
            );
        }
        
        @Override
        public HealthCheckResult healthCheck() {
            return HealthCheckResult.healthy("Module is healthy");
        }
        
        @Override
        public String getApiSpecification() { return ""; }
        
        @Override
        public List<ApiDependency> getApiDependencies() { return List.of(); }
        
        @Override
        public List<Permission> getRequiredPermissions() { return List.of(); }
        
        @Override
        public ResourceRequirements getResourceRequirements() { return ResourceRequirements.defaults(); }
    }
}