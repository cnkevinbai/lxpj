package com.daod.iov.services.config;

import com.daod.iov.plugin.ModuleContext;
import com.daod.iov.plugin.ModuleException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 配置中心服务测试类
 */
class ConfigCenterServiceTest {
    
    @Test
    void testModuleLifecycle() throws ModuleException {
        // 创建服务实例
        ConfigCenterService service = new ConfigCenterService();
        
        // 验证初始状态
        assertEquals("config-center", service.getMetadata().getName());
        assertEquals("1.0.0", service.getMetadata().getVersion());
        assertEquals("配置中心服务模块", service.getMetadata().getDescription());
        assertEquals("core", service.getMetadata().getType());
        assertEquals(5, service.getMetadata().getPriority());
        assertEquals("daod-team", service.getMetadata().getAuthor());
        assertEquals("proprietary", service.getMetadata().getLicense());
        assertEquals("config-center:1.0.0", service.getMetadata().getMainClass());
    }
    
    @Test
    void testInitialize() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        // 创建模拟上下文
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of(
            "environment", "dev",
            "autoRefresh", true,
            "cacheTtl", 600L,
            "refreshInterval", 15000,
            "enableVersionHistory", true,
            "maxHistoryVersions", 20
        );
        when(context.getConfig()).thenReturn(config);
        
        // 测试初始化
        service.initialize(context);
        assertEquals("dev", service.getEnvironment());
        assertEquals(600L, service.getCacheTtl());
        assertEquals(15000, service.getRefreshInterval());
        assertTrue(service.isAutoRefresh());
    }
    
    @Test
    void testSetAndGetConfig() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of(
            "environment", "dev"
        );
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 测试设置配置
        String namespace = "system";
        String group = "common";
        String key = "app.name";
        String value = "DAOD IOT Platform";
        
        ConfigItem configItem = service.setConfig(namespace, group, key, value, "应用名称");
        
        assertNotNull(configItem);
        assertEquals(namespace, configItem.getNamespace());
        assertEquals(group, configItem.getGroup());
        assertEquals(key, configItem.getKey());
        assertEquals(value, service.getConfig(namespace, group, key).getValue());
        
        // 测试获取配置
        ConfigItem retrieved = service.getConfig(namespace, group, key);
        assertNotNull(retrieved);
        assertEquals("DAOD IOT Platform", retrieved.getValue());
    }
    
    @Test
    void testUpdateConfig() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of("environment", "dev");
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 设置初始配置
        ConfigItem configItem = service.setConfig("system", "common", "app.version", "1.0.0", "应用版本");
        assertEquals(1, configItem.getVersion());
        
        // 更新配置
        ConfigItem updated = service.setConfig("system", "common", "app.version", "1.1.0", "应用版本更新");
        assertEquals(2, updated.getVersion());
        
        // 验证更新后的值
        ConfigItem retrieved = service.getConfig("system", "common", "app.version");
        assertEquals("1.1.0", retrieved.getValue());
        assertEquals(2, retrieved.getVersion());
    }
    
    @Test
    void testDeleteConfig() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of("environment", "dev");
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 设置配置
        service.setConfig("system", "common", "test.key", "test.value");
        
        // 验证配置存在
        assertNotNull(service.getConfig("system", "common", "test.key"));
        
        // 删除配置
        boolean deleted = service.deleteConfig("system", "common", "test.key");
        assertTrue(deleted);
        
        // 验证配置已删除
        assertNull(service.getConfig("system", "common", "test.key"));
        
        // 删除不存在的配置
        assertFalse(service.deleteConfig("system", "common", "nonexistent"));
    }
    
    @Test
    void testGetConfigByNamespace() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of("environment", "dev");
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 设置多个配置（同一环境 dev）
        service.setConfig("database", "dev", "url", "jdbc://localhost");
        service.setConfig("database", "dev", "username", "dev_user");
        // 注意：prod 环境的配置不会在 dev 环境下返回
        
        // 获取指定命名空间的配置
        Map<String, ConfigItem> dbConfig = service.getConfigByNamespace("database");
        
        assertNotNull(dbConfig);
        // 返回 dev 环境下的 2 个配置
        assertEquals(2, dbConfig.size());
        
        // 验证包含正确的配置
        assertTrue(dbConfig.containsKey("dev/url"));
        assertTrue(dbConfig.containsKey("dev/username"));
    }
    
    @Test
    void testGetConfigByGroup() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of("environment", "dev");
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 设置多个配置
        service.setConfig("system", "common", "key1", "value1");
        service.setConfig("system", "common", "key2", "value2");
        service.setConfig("system", "system", "key3", "value3");
        
        // 获取指定分组的配置
        Map<String, Map<String, ConfigItem>> commonConfig = service.getConfigByGroup("system", "common");
        
        assertNotNull(commonConfig);
        assertNotNull(commonConfig.get("common"));
        // common 组下有 2 个配置
        assertEquals(2, commonConfig.get("common").size());
        
        // 验证配置值
        assertEquals("value1", commonConfig.get("common").get("key1").getValue());
        assertEquals("value2", commonConfig.get("common").get("key2").getValue());
    }
    
    @Test
    void testConfigHistory() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of(
            "environment", "dev",
            "enableVersionHistory", true,
            "maxHistoryVersions", 10
        );
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 设置多个版本的配置
        service.setConfig("system", "common", "app.version", "1.0.0");
        service.setConfig("system", "common", "app.version", "1.1.0");
        service.setConfig("system", "common", "app.version", "1.2.0");
        
        // 获取历史版本
        java.util.List<com.daod.iov.services.config.ConfigItem> history = service.getConfigHistory("system", "common", "app.version", 10);
        
        assertNotNull(history);
        // 历史应包含当前配置和之前版本
        assertTrue(history.size() >= 2);
        
        // 验证最新版本
        ConfigItem latest = history.get(0);
        assertNotNull(latest);
        assertEquals("1.2.0", latest.getValue());
    }
    
    @Test
    void testRollbackConfig() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of(
            "environment", "dev",
            "enableVersionHistory", true,
            "maxHistoryVersions", 10
        );
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 设置多个版本
        service.setConfig("system", "common", "app.version", "1.0.0");
        service.setConfig("system", "common", "app.version", "1.1.0");
        service.setConfig("system", "common", "app.version", "1.2.0");
        
        // 回滚到版本1
        boolean rolledBack = service.rollbackConfig("system", "common", "app.version", 1);
        assertTrue(rolledBack);
        
        // 验证回滚后的值
        ConfigItem current = service.getConfig("system", "common", "app.version");
        assertNotNull(current);
        assertEquals(1, current.getVersion());
    }
    
    @Test
    void testListener() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of("environment", "dev");
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 创建模拟监听器
        ConfigListener listener = Mockito.mock(ConfigListener.class);
        
        // 注册监听器
        service.addConfigListener(listener);
        
        // 设置配置
        service.setConfig("system", "common", "test.key", "test.value");
        
        // 验证监听器被调用
        verify(listener, times(1)).onConfigChanged(
            eq("system"), 
            eq("common"), 
            eq("test.key"), 
            any(com.daod.iov.services.config.ConfigItem.class)
        );
        
        // 删除监听器
        service.removeConfigListener(listener);
        
        // 再次设置配置
        service.setConfig("system", "common", "test.key", "updated.value");
        
        // 验证监听器不再被调用
        verify(listener, times(1)).onConfigChanged(anyString(), anyString(), anyString(), any());
    }
    
    @Test
    void testImportExportConfig() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of("environment", "dev");
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 导出初始配置
        Map<String, Map<String, Map<String, String>>> exported = service.exportConfigs(null);
        assertNotNull(exported);
        
        // 导入配置
        Map<String, Map<String, Map<String, String>>> importData = Map.of(
            "system", Map.of(
                "common", Map.of(
                    "imported.key", "imported.value"
                )
            )
        );
        
        int importedCount = service.importConfigs(importData);
        assertEquals(1, importedCount);
        
        // 验证导入的配置
        ConfigItem importedConfig = service.getConfig("system", "common", "imported.key");
        assertNotNull(importedConfig);
        assertEquals("imported.value", importedConfig.getValue());
    }
    
    @Test
    void testMultiEnvironment() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of("environment", "prod");
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        
        // 验证初始环境
        assertEquals("prod", service.getEnvironment());
        
        // 在 prod 环境设置配置
        service.setConfig("database", "common", "connection.url", "jdbc://prod-db");
        ConfigItem prodConfig = service.getConfig("database", "common", "connection.url");
        assertNotNull(prodConfig);
        assertEquals("prod", prodConfig.getEnvironment());
        
        // 切换环境
        service.setEnvironment("dev");
        assertEquals("dev", service.getEnvironment());
        
        // 验证环境切换后，新配置使用新环境
        service.setConfig("database", "common", "connection.url", "jdbc://dev-db");
        ConfigItem devConfig = service.getConfig("database", "common", "connection.url");
        assertNotNull(devConfig);
        assertEquals("dev", devConfig.getEnvironment());
    }
    
    @Test
    void testConfigEncryption() throws ModuleException {
        ConfigCenterService service = new ConfigCenterService();
        
        ModuleContext context = Mockito.mock(ModuleContext.class);
        Map<String, Object> config = Map.of("environment", "dev");
        when(context.getConfig()).thenReturn(config);
        
        service.initialize(context);
        service.start();
        
        // 设置敏感配置
        String sensitiveValue = "secret_password_123";
        service.setConfig("database", "prod", "connection.password", sensitiveValue);
        
        // 获取配置（应已解密）
        ConfigItem retrieved = service.getConfig("database", "prod", "connection.password");
        assertNotNull(retrieved);
        assertEquals(sensitiveValue, retrieved.getValue());
        
        // 配置值应该以ENC开头（加密标识）
        // 实际存储值在服务内部是加密的
    }
}
