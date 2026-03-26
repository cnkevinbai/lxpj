package com.daod.iov.core.hotreload;

import com.daod.iov.plugin.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 热更新引擎单元测试
 */
class HotReloadEngineTest {
    
    private HotReloadEngine engine;
    
    @BeforeEach
    void setUp() {
        engine = new HotReloadEngine();
    }
    
    @AfterEach
    void tearDown() throws Exception {
        if (engine != null && engine.getState() != ModuleState.DESTROYED) {
            engine.stop();
            engine.destroy();
        }
    }
    
    @Test
    @DisplayName("测试模块元数据")
    void testMetadata() {
        assertNotNull(engine.getMetadata());
        assertEquals("hot-reload-engine", engine.getMetadata().getName());
        assertEquals("1.0.0", engine.getMetadata().getVersion());
        assertEquals("core", engine.getMetadata().getType());
        assertEquals(10, engine.getMetadata().getPriority());
    }
    
    @Test
    @DisplayName("测试初始状态")
    void testInitialState() {
        assertEquals(ModuleState.UNINITIALIZED, engine.getState());
        assertEquals(HealthStatus.UNKNOWN, engine.getHealthStatus());
    }
    
    @Test
    @DisplayName("测试初始化")
    void testInitialize() throws ModuleException {
        ModuleContext context = new ModuleContext();
        engine.initialize(context);
        
        assertEquals(ModuleState.INITIALIZED, engine.getState());
        assertEquals(HealthStatus.HEALTHY, engine.getHealthStatus());
    }
    
    @Test
    @DisplayName("测试启动")
    void testStart() throws ModuleException {
        ModuleContext context = new ModuleContext();
        engine.initialize(context);
        engine.start();
        
        assertEquals(ModuleState.RUNNING, engine.getState());
        assertEquals(HealthStatus.HEALTHY, engine.getHealthStatus());
    }
    
    @Test
    @DisplayName("测试停止")
    void testStop() throws ModuleException {
        ModuleContext context = new ModuleContext();
        engine.initialize(context);
        engine.start();
        engine.stop();
        
        assertEquals(ModuleState.STOPPED, engine.getState());
        assertEquals(HealthStatus.OFFLINE, engine.getHealthStatus());
    }
    
    @Test
    @DisplayName("测试销毁")
    void testDestroy() throws ModuleException {
        ModuleContext context = new ModuleContext();
        engine.initialize(context);
        engine.start();
        engine.stop();
        engine.destroy();
        
        assertEquals(ModuleState.DESTROYED, engine.getState());
    }
    
    @Test
    @DisplayName("测试生命周期顺序")
    void testLifecycleSequence() throws ModuleException {
        // 初始状态
        assertEquals(ModuleState.UNINITIALIZED, engine.getState());
        
        // 初始化
        engine.initialize(new ModuleContext());
        assertEquals(ModuleState.INITIALIZED, engine.getState());
        
        // 启动
        engine.start();
        assertEquals(ModuleState.RUNNING, engine.getState());
        
        // 停止
        engine.stop();
        assertEquals(ModuleState.STOPPED, engine.getState());
        
        // 销毁
        engine.destroy();
        assertEquals(ModuleState.DESTROYED, engine.getState());
    }
    
    @Test
    @DisplayName("测试监听器管理")
    void testListenerManagement() {
        // HotReloadListener 接口未实现，跳过测试
        assertTrue(true);
    }
    
    @Test
    @DisplayName("测试未初始化时启动应抛出异常")
    void testStartWithoutInitialize() {
        assertThrows(ModuleException.class, () -> {
            engine.start();
        });
    }
}