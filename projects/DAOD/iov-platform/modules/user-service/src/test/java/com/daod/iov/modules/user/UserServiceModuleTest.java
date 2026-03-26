package com.daod.iov.modules.user;

import com.daod.iov.plugin.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 用户服务模块单元测试
 */
@DisplayName("用户服务模块测试")
class UserServiceModuleTest {
    
    private UserServiceModule module;
    
    @BeforeEach
    void setUp() {
        module = new UserServiceModule();
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
        assertEquals("user-service", metadata.getName());
        assertEquals("1.0.0", metadata.getVersion());
        assertEquals("core", metadata.getType());
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
}