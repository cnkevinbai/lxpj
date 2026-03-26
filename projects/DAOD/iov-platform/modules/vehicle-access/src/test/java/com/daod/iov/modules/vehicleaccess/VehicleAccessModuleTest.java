package com.daod.iov.modules.vehicleaccess;

import com.daod.iov.plugin.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 车辆接入模块单元测试
 */
@DisplayName("车辆接入模块测试")
class VehicleAccessModuleTest {
    
    private VehicleAccessModule module;
    
    @BeforeEach
    void setUp() {
        module = new VehicleAccessModule();
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
        assertEquals("vehicle-access", metadata.getName());
        assertEquals("1.0.0", metadata.getVersion());
        assertEquals("business", metadata.getType());
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
        assertNotNull(result);
    }
}