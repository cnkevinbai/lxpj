package com.daod.iov.modules.monitor;

import com.daod.iov.plugin.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 监控服务模块单元测试
 */
@DisplayName("监控服务模块测试")
class MonitorServiceModuleTest {
    
    private MonitorServiceModule module;
    
    @BeforeEach
    void setUp() {
        module = new MonitorServiceModule();
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
        assertEquals("monitor-service", metadata.getName());
        assertEquals("1.0.0", metadata.getVersion());
        assertEquals("business", metadata.getType());
    }
    
    @Test
    @DisplayName("测试完整生命周期")
    void testLifecycle() throws ModuleException {
        module.initialize(new ModuleContext());
        assertEquals(ModuleState.INITIALIZED, module.getState());
        
        module.start();
        assertEquals(ModuleState.RUNNING, module.getState());
        
        module.stop();
        assertEquals(ModuleState.STOPPED, module.getState());
        
        module.destroy();
        assertEquals(ModuleState.DESTROYED, module.getState());
    }
    
    @Test
    @DisplayName("测试健康检查")
    void testHealthCheck() throws ModuleException {
        module.initialize(new ModuleContext());
        module.start();
        
        HealthCheckResult result = module.healthCheck();
        assertTrue(result.isHealthy());
    }
    
    @Test
    @DisplayName("测试监控指标")
    void testMetrics() throws ModuleException {
        module.initialize(new ModuleContext());
        module.start();
        
        var metrics = module.getMetrics();
        assertNotNull(metrics);
        assertFalse(metrics.isEmpty());
    }
}