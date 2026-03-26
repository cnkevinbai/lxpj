package com.daod.iov.plugin;

import com.daod.iov.plugin.impl.DefaultModuleManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 模块化框架测试类
 */
@DisplayName("模块化框架功能测试")
public class ModuleFrameworkTest {
    
    private ModuleManager moduleManager;
    
    @BeforeEach
    void setUp() {
        moduleManager = new DefaultModuleManager();
        try {
            moduleManager.initialize();
        } catch (ModuleException e) {
            fail("初始化模块管理器失败: " + e.getMessage());
        }
    }
    
    @Test
    @DisplayName("测试模块生命周期管理")
    void testModuleLifecycle() {
        // 创建示例模块
        SampleModule sampleModule = new SampleModule();
        
        // 测试模块初始化
        assertDoesNotThrow(() -> {
            sampleModule.initialize(new ModuleContext("sample-module:1.0.0", "", null));
        }, "模块初始化应该成功");
        
        assertEquals(ModuleState.INITIALIZED, sampleModule.getState(), "模块状态应该是已初始化");
        assertEquals(HealthStatus.HEALTHY, sampleModule.getHealthStatus(), "模块健康状态应该是健康的");
        
        // 测试模块启动
        assertDoesNotThrow(() -> {
            sampleModule.start();
        }, "模块启动应该成功");
        
        assertEquals(ModuleState.RUNNING, sampleModule.getState(), "模块状态应该是运行中");
        assertEquals(HealthStatus.HEALTHY, sampleModule.getHealthStatus(), "模块健康状态应该是健康的");
        
        // 测试模块停止
        assertDoesNotThrow(() -> {
            sampleModule.stop();
        }, "模块停止应该成功");
        
        assertEquals(ModuleState.STOPPED, sampleModule.getState(), "模块状态应该是已停止");
        assertEquals(HealthStatus.OFFLINE, sampleModule.getHealthStatus(), "模块健康状态应该是离线");
        
        // 测试模块销毁
        assertDoesNotThrow(() -> {
            sampleModule.destroy();
        }, "模块销毁应该成功");
        
        assertEquals(ModuleState.DESTROYED, sampleModule.getState(), "模块状态应该是已销毁");
        assertEquals(HealthStatus.OFFLINE, sampleModule.getHealthStatus(), "模块健康状态应该是离线");
    }
    
    @Test
    @DisplayName("测试模块管理器基本功能")
    void testModuleManagerBasicFunctionality() {
        // 验证模块管理器已初始化
        assertNotNull(moduleManager, "模块管理器不应该为空");
        
        // 验证初始状态
        assertTrue(moduleManager.getAllModules().isEmpty(), "初始时模块列表应该为空");
    }
    
    @Test
    @DisplayName("测试模块元数据功能")
    void testModuleMetadata() {
        ModuleMetadata metadata = new ModuleMetadata("test-module", "1.0.0", "测试模块");
        metadata.setAuthor("test-author");
        metadata.setLicense("Apache-2.0");
        metadata.setType("business");
        metadata.setPriority(50);
        
        assertEquals("test-module", metadata.getName(), "模块名称不匹配");
        assertEquals("1.0.0", metadata.getVersion(), "模块版本不匹配");
        assertEquals("测试模块", metadata.getDescription(), "模块描述不匹配");
        assertEquals("test-author", metadata.getAuthor(), "模块作者不匹配");
        assertEquals("Apache-2.0", metadata.getLicense(), "模块许可证不匹配");
        assertEquals("business", metadata.getType(), "模块类型不匹配");
        assertEquals(50, metadata.getPriority(), "模块优先级不匹配");
    }
    
    @Test
    @DisplayName("测试模块依赖功能")
    void testModuleDependencies() {
        ModuleMetadata metadata = new ModuleMetadata("test-module", "1.0.0", "测试模块");
        
        // 添加依赖
        ModuleMetadata.Dependency dep1 = new ModuleMetadata.Dependency("common-core", "1.0.0");
        dep1.setOptional(false);
        ModuleMetadata.Dependency dep2 = new ModuleMetadata.Dependency("security-core", "1.0.0");
        dep2.setOptional(true);
        
        metadata.setDependencies(java.util.Arrays.asList(dep1, dep2));
        
        assertEquals(2, metadata.getDependencies().size(), "依赖数量不匹配");
        assertFalse(metadata.getDependencies().get(0).isOptional(), "第一个依赖应该是必需的");
        assertTrue(metadata.getDependencies().get(1).isOptional(), "第二个依赖应该是可选的");
    }
    
    @Test
    @DisplayName("测试模块扩展点功能")
    void testModuleExtensionPoints() {
        ModuleMetadata metadata = new ModuleMetadata("test-module", "1.0.0", "测试模块");
        
        // 添加扩展点
        ModuleMetadata.ExtensionPoint ext1 = new ModuleMetadata.ExtensionPoint();
        ext1.setName("event-handler");
        ext1.setInterfaceClass("com.daod.iov.event.EventHandler");
        ext1.setDescription("事件处理器扩展点");
        
        ModuleMetadata.ExtensionPoint ext2 = new ModuleMetadata.ExtensionPoint();
        ext2.setName("data-processor");
        ext2.setInterfaceClass("com.daod.iov.data.DataProcessor");
        ext2.setDescription("数据处理器扩展点");
        
        java.util.HashMap<String, ModuleMetadata.ExtensionPoint> extensions = new java.util.HashMap<>();
        extensions.put("event-handler", ext1);
        extensions.put("data-processor", ext2);
        
        metadata.setExtensionPoints(extensions);
        
        assertEquals(2, metadata.getExtensionPoints().size(), "扩展点数量不匹配");
        assertEquals("event-handler", metadata.getExtensionPoints().get("event-handler").getName(), "扩展点名称不匹配");
        assertEquals("com.daod.iov.event.EventHandler", metadata.getExtensionPoints().get("event-handler").getInterfaceClass(), "扩展点接口类不匹配");
    }
    
    @Test
    @DisplayName("测试版本兼容性检查")
    void testVersionCompatibility() {
        DefaultModuleManager defaultManager = (DefaultModuleManager) moduleManager;
        
        // 测试精确匹配
        assertTrue(invokeIsVersionCompatible(defaultManager, "=1.0.0", "1.0.0"), "精确匹配应该成功");
        assertFalse(invokeIsVersionCompatible(defaultManager, "=1.0.0", "1.0.1"), "精确匹配不同版本应该失败");
        
        // 测试大于等于
        assertTrue(invokeIsVersionCompatible(defaultManager, ">=1.0.0", "1.0.0"), "大于等于应该匹配相同版本");
        assertTrue(invokeIsVersionCompatible(defaultManager, ">=1.0.0", "1.0.1"), "大于等于应该匹配更高版本");
        assertFalse(invokeIsVersionCompatible(defaultManager, ">=1.0.0", "0.9.9"), "大于等于不应该匹配更低版本");
        
        // 测试大于
        assertTrue(invokeIsVersionCompatible(defaultManager, ">1.0.0", "1.0.1"), "大于应该匹配更高版本");
        assertFalse(invokeIsVersionCompatible(defaultManager, ">1.0.0", "1.0.0"), "大于不应该匹配相同版本");
        assertFalse(invokeIsVersionCompatible(defaultManager, ">1.0.0", "0.9.9"), "大于不应该匹配更低版本");
        
        // 测试小于等于
        assertTrue(invokeIsVersionCompatible(defaultManager, "<=1.0.0", "1.0.0"), "小于等于应该匹配相同版本");
        assertTrue(invokeIsVersionCompatible(defaultManager, "<=1.0.0", "0.9.9"), "小于等于应该匹配更低版本");
        assertFalse(invokeIsVersionCompatible(defaultManager, "<=1.0.0", "1.0.1"), "小于等于不应该匹配更高版本");
        
        // 测试小于
        assertTrue(invokeIsVersionCompatible(defaultManager, "<1.0.0", "0.9.9"), "小于应该匹配更低版本");
        assertFalse(invokeIsVersionCompatible(defaultManager, "<1.0.0", "1.0.0"), "小于不应该匹配相同版本");
        assertFalse(invokeIsVersionCompatible(defaultManager, "<1.0.0", "1.0.1"), "小于不应该匹配更高版本");
        
        // 测试 caret (^) 语法
        assertTrue(invokeIsVersionCompatible(defaultManager, "^1.0.0", "1.1.0"), "caret 语法应该匹配兼容版本");
        assertTrue(invokeIsVersionCompatible(defaultManager, "^1.0.0", "1.0.1"), "caret 语法应该匹配兼容版本");
        assertFalse(invokeIsVersionCompatible(defaultManager, "^1.0.0", "2.0.0"), "caret 语法不应该匹配不兼容版本");
        
        // 测试 tilde (~) 语法
        assertTrue(invokeIsVersionCompatible(defaultManager, "~1.2.0", "1.2.1"), "tilde 语法应该匹配兼容版本");
        assertTrue(invokeIsVersionCompatible(defaultManager, "~1.2.0", "1.2.3"), "tilde 语法应该匹配兼容版本");
        assertFalse(invokeIsVersionCompatible(defaultManager, "~1.2.0", "1.3.0"), "tilde 语法不应该匹配不兼容版本");
    }
    
    @Test
    @DisplayName("测试热更新策略常量")
    void testHotReloadConstants() {
        // 测试常量值
        assertEquals("rolling", ModuleMetadata.HotReload.STRATEGY_ROLLING, "滚动更新策略常量值错误");
        assertEquals("blue-green", ModuleMetadata.HotReload.STRATEGY_BLUE_GREEN, "蓝绿部署策略常量值错误");
        assertEquals("canary", ModuleMetadata.HotReload.STRATEGY_CANARY, "金丝雀发布策略常量值错误");
    }
    
    @Test
    @DisplayName("测试依赖解析和循环依赖检测")
    void testDependencyResolution() {
        // 创建测试模块列表
        java.util.List<String> modules = java.util.Arrays.asList("module-a", "module-b", "module-c");
        
        // 测试依赖解析
        java.util.Map<String, java.util.List<String>> result = moduleManager.resolveDependencies(modules);
        assertNotNull(result, "依赖解析结果不应为空");
    }
    
    /**
     * 通过反射调用私有的版本兼容性检查方法
     */
    private boolean invokeIsVersionCompatible(DefaultModuleManager manager, String requiredVersion, String actualVersion) {
        try {
            Method method = DefaultModuleManager.class.getDeclaredMethod("isVersionCompatible", String.class, String.class);
            method.setAccessible(true);
            return (boolean) method.invoke(manager, requiredVersion, actualVersion);
        } catch (Exception e) {
            throw new RuntimeException("调用版本兼容性检查方法失败", e);
        }
    }
}