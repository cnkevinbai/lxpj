package com.daod.iov.modules.eventbus;

import com.daod.iov.plugin.*;
import com.daod.iov.modules.eventbus.api.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 事件总线模块单元测试
 */
@DisplayName("事件总线模块测试")
class EventBusModuleTest {
    
    private EventBusModule module;
    
    @BeforeEach
    void setUp() {
        module = new EventBusModule();
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
        assertEquals("event-bus", metadata.getName());
        assertEquals("1.0.0", metadata.getVersion());
        assertEquals("core", metadata.getType());
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
        
        // 停止
        module.stop();
        assertEquals(ModuleState.STOPPED, module.getState());
        
        // 销毁
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
        assertNotNull(result.getMessage());
    }
    
    @Test
    @DisplayName("测试获取事件总线")
    void testGetEventBus() throws ModuleException {
        module.initialize(new ModuleContext());
        module.start();
        
        EventBus eventBus = module.getEventBus();
        assertNotNull(eventBus);
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