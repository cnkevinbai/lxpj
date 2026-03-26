package com.daod.iov.modules.planning;

import com.daod.iov.plugin.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 规划服务模块单元测试
 */
@DisplayName("规划服务模块测试")
class PlanningModuleTest {
    
    private PlanningModule module;
    
    @BeforeEach
    void setUp() {
        module = new PlanningModule();
    }
    
    @AfterEach
    void tearDown() throws Exception {
        if (module.getState() != ModuleState.DESTROYED) {
            module.stop();
            module.destroy();
        }
    }
    
    @Test
    @DisplayName("测试模块元数据")
    void testMetadata() {
        ModuleMetadata metadata = module.getMetadata();
        
        assertNotNull(metadata);
        assertEquals("planning-service", metadata.getName());
        assertEquals("1.0.0", metadata.getVersion());
        assertEquals("business", metadata.getType());
        assertEquals(50, metadata.getPriority());
    }
    
    @Test
    @DisplayName("测试初始状态")
    void testInitialState() {
        assertEquals(ModuleState.UNINITIALIZED, module.getState());
        assertEquals(HealthStatus.UNKNOWN, module.getHealthStatus());
    }
    
    @Test
    @DisplayName("测试健康检查 - 未初始化")
    void testHealthCheckBeforeInit() {
        HealthCheckResult result = module.healthCheck();
        assertFalse(result.isHealthy());
    }
    
    @Test
    @DisplayName("测试完整生命周期")
    void testLifecycle() throws ModuleException {
        // 初始化
        module.initialize(new ModuleContext());
        assertEquals(ModuleState.INITIALIZED, module.getState());
        
        // 启动
        module.start();
        assertEquals(ModuleState.RUNNING, module.getState());
        assertEquals(HealthStatus.HEALTHY, module.getHealthStatus());
        
        // 健康检查
        HealthCheckResult result = module.healthCheck();
        assertTrue(result.isHealthy());
        
        // 停止
        module.stop();
        assertEquals(ModuleState.STOPPED, module.getState());
        assertEquals(HealthStatus.OFFLINE, module.getHealthStatus());
        
        // 销毁
        module.destroy();
        assertEquals(ModuleState.DESTROYED, module.getState());
    }
    
    @Test
    @DisplayName("测试监控指标")
    void testMetrics() throws ModuleException {
        module.initialize(new ModuleContext());
        module.start();
        
        var metrics = module.getMetrics();
        assertNotNull(metrics);
        assertFalse(metrics.isEmpty());
        
        // 检查指标名称
        assertTrue(metrics.stream().anyMatch(m -> m.getName().contains("planning")));
    }
    
    @Test
    @DisplayName("测试 API 依赖")
    void testApiDependencies() {
        var deps = module.getApiDependencies();
        assertNotNull(deps);
        assertFalse(deps.isEmpty());
    }
    
    @Test
    @DisplayName("测试权限需求")
    void testRequiredPermissions() {
        var permissions = module.getRequiredPermissions();
        assertNotNull(permissions);
        assertTrue(permissions.contains(Permission.NETWORK_CONNECT));
    }
    
    @Test
    @DisplayName("测试资源需求")
    void testResourceRequirements() {
        var requirements = module.getResourceRequirements();
        assertNotNull(requirements);
        assertEquals("500m", requirements.getCpu());
        assertEquals("1Gi", requirements.getMemory());
    }
}