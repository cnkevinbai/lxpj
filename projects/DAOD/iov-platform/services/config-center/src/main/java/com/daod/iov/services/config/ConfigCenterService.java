package com.daod.iov.services.config;

import cn.hutool.core.util.IdUtil;
import com.daod.iov.plugin.*;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 配置中心服务类
 * 实现统一配置管理功能
 */
@Slf4j
public class ConfigCenterService implements IModule, ConfigProvider {

    // 模块元数据
    private ModuleMetadata metadata;
    
    // 模块状态
    private ModuleState state = ModuleState.UNINITIALIZED;
    
    // 健康状态
    private HealthStatus healthStatus = HealthStatus.UNKNOWN;
    
    // 模块上下文
    private ModuleContext context;
    
    // 环境配置
    private String environment;
    
    // 配置存储 - 使用嵌套Map: namespace -> group -> key -> ConfigItem
    private final Map<String, Map<String, Map<String, ConfigItem>>> configStorage = new ConcurrentHashMap<>();
    
    // 配置版本历史 - namespace -> group -> key -> List<ConfigItem>
    private final Map<String, Map<String, Map<String, List<ConfigItem>>>> versionHistory = new ConcurrentHashMap<>();
    
    // 配置监听器列表
    private final List<ConfigListener> configListeners = new java.util.concurrent.CopyOnWriteArrayList<>();
    
    // 缓存管理
    private final Map<String, ConfigCacheEntry> configCache = new ConcurrentHashMap<>();
    private long cacheTtlSeconds = 300;
    
    // 刷新线程
    private Thread refreshThread;
    private boolean autoRefresh = true;
    private int refreshInterval = 30000;
    
    // 版本历史配置
    private boolean enableVersionHistory = true;
    private int maxHistoryVersions = 10;
    
    // 加密密钥
    private static final String ENCRYPTION_KEY = "config-center-encryption-key-2024";
    
    // 是否已初始化默认配置
    private boolean defaultConfigInitialized = false;
    
    // ==================== IModule 接口实现 ====================
    
    public ConfigCenterService() {
        // 初始化模块元数据
        this.metadata = new ModuleMetadata(
            "config-center",
            "1.0.0",
            "配置中心服务模块"
        );
        
        this.metadata.setType("core");
        this.metadata.setPriority(5);
        this.metadata.setAuthor("daod-team");
        this.metadata.setLicense("proprietary");
        this.metadata.setMainClass("config-center:1.0.0");
        
        // 设置扩展点
        Map<String, ModuleMetadata.ExtensionPoint> extensionPoints = new HashMap<>();
        extensionPoints.put("config-provider", new ModuleMetadata.ExtensionPoint(
            "config-provider",
            "com.daod.iov.services.config.ConfigProvider",
            "配置提供者扩展点"
        ));
        extensionPoints.put("config-listener", new ModuleMetadata.ExtensionPoint(
            "config-listener",
            "com.daod.iov.services.config.ConfigListener",
            "配置变更监听器"
        ));
        this.metadata.setExtensionPoints(extensionPoints);
        
        // 设置依赖
        List<ModuleMetadata.Dependency> dependencies = new ArrayList<>();
        dependencies.add(new ModuleMetadata.Dependency("plugin-framework", "^1.0.0"));
        this.metadata.setDependencies(dependencies);
    }
    
    @Override
    public ModuleMetadata getMetadata() {
        return metadata;
    }
    
    @Override
    public void initialize(ModuleContext context) throws ModuleException {
        log.info("配置中心服务初始化: {}", metadata.getName());
        
        this.context = context;
        
        // 从配置中读取参数
        if (context.getConfig() != null) {
            this.environment = context.getConfig().getOrDefault("environment", "dev").toString();
            this.autoRefresh = Boolean.TRUE.equals(context.getConfig().getOrDefault("autoRefresh", true));
            this.enableVersionHistory = Boolean.TRUE.equals(context.getConfig().getOrDefault("enableVersionHistory", true));
            
            Object cacheTtlObj = context.getConfig().get("cacheTtl");
            this.cacheTtlSeconds = cacheTtlObj instanceof Number ? ((Number) cacheTtlObj).longValue() : 300L;
            
            Object refreshIntervalObj = context.getConfig().get("refreshInterval");
            this.refreshInterval = refreshIntervalObj instanceof Number ? ((Number) refreshIntervalObj).intValue() : 30000;
            
            Object maxHistoryObj = context.getConfig().get("maxHistoryVersions");
            this.maxHistoryVersions = maxHistoryObj instanceof Number ? ((Number) maxHistoryObj).intValue() : 10;
        } else {
            this.environment = "dev";
        }
        
        state = ModuleState.INITIALIZED;
        healthStatus = HealthStatus.HEALTHY;
        
        log.info("配置中心服务初始化完成: environment={}", environment);
    }
    
    @Override
    public void start() throws ModuleException {
        log.info("配置中心服务启动: {}", metadata.getName());
        
        // 启动自动刷新线程
        if (autoRefresh) {
            startRefreshThread();
        }
        
        state = ModuleState.RUNNING;
        healthStatus = HealthStatus.HEALTHY;
        
        log.info("配置中心服务启动完成");
    }
    
    @Override
    public void stop() throws ModuleException {
        log.info("配置中心服务停止: {}", metadata.getName());
        
        if (refreshThread != null) {
            refreshThread.interrupt();
            try {
                refreshThread.join(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            refreshThread = null;
        }
        
        state = ModuleState.STOPPED;
        healthStatus = HealthStatus.OFFLINE;
        
        log.info("配置中心服务停止完成");
    }
    
    @Override
    public void destroy() throws ModuleException {
        log.info("配置中心服务销毁: {}", metadata.getName());
        
        configStorage.clear();
        versionHistory.clear();
        configListeners.clear();
        configCache.clear();
        
        state = ModuleState.DESTROYED;
        healthStatus = HealthStatus.UNKNOWN;
        
        log.info("配置中心服务销毁完成");
    }
    
    @Override
    public ModuleState getState() {
        return state;
    }
    
    @Override
    public HealthStatus getHealthStatus() {
        return healthStatus;
    }
    
    // ==================== ConfigProvider 接口实现 ====================
    
    @Override
    public ConfigItem getConfig(String namespace, String group, String key) {
        String cacheKey = buildCacheKey(namespace, group, key);
        
        // 尝试从缓存获取
        ConfigCacheEntry cacheEntry = configCache.get(cacheKey);
        if (cacheEntry != null && !isCacheExpired(cacheEntry)) {
            return decryptConfigItem(cacheEntry.getConfigItem());
        }
        
        // 从存储获取
        ConfigItem config = getFromStorage(namespace, group, key);
        if (config != null) {
            // 更新缓存
            configCache.put(cacheKey, new ConfigCacheEntry(config, LocalDateTime.now(), cacheTtlSeconds));
            return decryptConfigItem(config);
        }
        
        return null;
    }
    
    @Override
    public Map<String, ConfigItem> getConfigByNamespace(String namespace) {
        Map<String, ConfigItem> result = new LinkedHashMap<>();
        Map<String, Map<String, ConfigItem>> groupMap = configStorage.get(namespace);
        
        if (groupMap != null) {
            groupMap.forEach((group, keyMap) -> {
                keyMap.forEach((key, config) -> {
                    // 只返回当前环境的配置
                    if (environment.equals(config.getEnvironment())) {
                        result.put(buildCompositeKey(group, key), decryptConfigItem(config));
                    }
                });
            });
        }
        
        return result;
    }
    
    @Override
    public Map<String, Map<String, ConfigItem>> getConfigByGroup(String namespace, String group) {
        Map<String, Map<String, ConfigItem>> result = new LinkedHashMap<>();
        Map<String, Map<String, ConfigItem>> groupMap = configStorage.get(namespace);
        
        if (groupMap != null) {
            Map<String, ConfigItem> keyMap = groupMap.get(group);
            if (keyMap != null) {
                Map<String, ConfigItem> decryptedMap = new LinkedHashMap<>();
                keyMap.forEach((key, config) -> {
                    if (environment.equals(config.getEnvironment())) {
                        decryptedMap.put(key, decryptConfigItem(config));
                    }
                });
                result.put(group, decryptedMap);
            }
        }
        
        return result;
    }
    
    @Override
    public List<ConfigItem> getConfigHistory(String namespace, String group, String key, int limit) {
        List<ConfigItem> result = new ArrayList<>();
        
        // 获取当前配置
        ConfigItem current = getRawFromStorage(namespace, group, key);
        
        // 从版本历史获取
        Map<String, Map<String, List<ConfigItem>>> groupMap = versionHistory.get(namespace);
        if (groupMap != null) {
            Map<String, List<ConfigItem>> keyHistoryMap = groupMap.get(group);
            if (keyHistoryMap != null) {
                List<ConfigItem> keyHistory = keyHistoryMap.get(key);
                if (keyHistory != null) {
                    // 从最新的开始取（但不包括当前版本）
                    for (int i = keyHistory.size() - 1; i >= 0 && result.size() < limit - 1; i--) {
                        ConfigItem histItem = keyHistory.get(i);
                        // 跳过与当前配置相同版本的
                        if (current == null || histItem.getVersion() != current.getVersion()) {
                            result.add(decryptConfigItem(histItem));
                        }
                    }
                }
            }
        }
        
        // 添加当前配置到列表开头
        if (current != null && environment.equals(current.getEnvironment()) && result.size() < limit) {
            result.add(0, decryptConfigItem(current));
        }
        
        return result;
    }
    
    @Override
    public void addConfigListener(ConfigListener listener) {
        configListeners.add(listener);
        log.info("配置监听器注册: {}", listener.getClass().getName());
    }
    
    @Override
    public void removeConfigListener(ConfigListener listener) {
        configListeners.remove(listener);
        log.info("配置监听器注销: {}", listener.getClass().getName());
    }
    
    // ==================== 配置管理方法 ====================
    
    /**
     * 新增或更新配置
     */
    public ConfigItem setConfig(String namespace, String group, String key, String value) {
        return setConfig(namespace, group, key, value, null);
    }
    
    /**
     * 新增或更新配置（带描述）
     */
    public ConfigItem setConfig(String namespace, String group, String key, String value, String description) {
        // 获取当前配置（用于保存历史）
        ConfigItem existingConfig = getRawFromStorage(namespace, group, key);
        
        // 如果存在旧配置，先保存到历史
        if (existingConfig != null && enableVersionHistory) {
            saveToVersionHistory(namespace, group, key, existingConfig);
        }
        
        // 获取下一个版本号
        int nextVersion = existingConfig != null && existingConfig.getVersion() != null 
            ? existingConfig.getVersion() + 1 : 1;
        
        // 创建配置项
        ConfigItem configItem = new ConfigItem();
        configItem.setId(String.valueOf(IdUtil.getSnowflakeNextId()));
        configItem.setNamespace(namespace);
        configItem.setGroup(group);
        configItem.setKey(key);
        configItem.setValue(encryptConfig(value));
        configItem.setDescription(description);
        configItem.setVersion(nextVersion);
        configItem.setCreatedTime(existingConfig != null ? existingConfig.getCreatedTime() : LocalDateTime.now());
        configItem.setUpdatedTime(LocalDateTime.now());
        configItem.setEnvironment(environment);
        configItem.setVersionHistoryEnabled(enableVersionHistory);
        
        // 保存到存储
        configStorage.computeIfAbsent(namespace, k -> new ConcurrentHashMap<>())
            .computeIfAbsent(group, k -> new ConcurrentHashMap<>())
            .put(key, configItem);
        
        // 清除缓存
        configCache.remove(buildCacheKey(namespace, group, key));
        
        // 通知监听器
        notifyConfigChanged(namespace, group, key, configItem);
        
        log.debug("配置设置完成: namespace={}, group={}, key={}, version={}", 
            namespace, group, key, configItem.getVersion());
        
        return configItem;
    }
    
    /**
     * 获取原始配置（不解密）
     */
    private ConfigItem getRawFromStorage(String namespace, String group, String key) {
        Map<String, Map<String, ConfigItem>> groupMap = configStorage.get(namespace);
        if (groupMap != null) {
            Map<String, ConfigItem> keyMap = groupMap.get(group);
            if (keyMap != null) {
                return keyMap.get(key);
            }
        }
        return null;
    }
    
    /**
     * 删除配置
     */
    public boolean deleteConfig(String namespace, String group, String key) {
        Map<String, Map<String, ConfigItem>> groupMap = configStorage.get(namespace);
        
        if (groupMap != null) {
            Map<String, ConfigItem> keyMap = groupMap.get(group);
            if (keyMap != null && keyMap.remove(key) != null) {
                configCache.remove(buildCacheKey(namespace, group, key));
                notifyConfigDeleted(namespace, group, key);
                log.info("配置删除完成: namespace={}, group={}, key={}", namespace, group, key);
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * 批量导入配置
     */
    public int importConfigs(Map<String, Map<String, Map<String, String>>> configs) {
        final int[] imported = {0};
        
        configs.forEach((namespace, groupMap) -> {
            groupMap.forEach((group, keyMap) -> {
                keyMap.forEach((key, value) -> {
                    try {
                        setConfig(namespace, group, key, value);
                        imported[0]++;
                    } catch (Exception e) {
                        log.error("导入配置失败: namespace={}, group={}, key={}", namespace, group, key, e);
                    }
                });
            });
        });
        
        log.info("配置导入完成: 共导入 {} 条配置", imported[0]);
        return imported[0];
    }
    
    /**
     * 导出配置
     */
    public Map<String, Map<String, Map<String, String>>> exportConfigs(String namespace) {
        Map<String, Map<String, Map<String, String>>> result = new LinkedHashMap<>();
        
        if (namespace != null) {
            Map<String, Map<String, ConfigItem>> groupMap = configStorage.get(namespace);
            if (groupMap != null) {
                Map<String, Map<String, String>> groupResult = new LinkedHashMap<>();
                groupMap.forEach((group, keyMap) -> {
                    Map<String, String> keyResult = new LinkedHashMap<>();
                    keyMap.forEach((key, config) -> {
                        if (environment.equals(config.getEnvironment())) {
                            keyResult.put(key, decryptConfigValue(config.getValue()));
                        }
                    });
                    if (!keyResult.isEmpty()) {
                        groupResult.put(group, keyResult);
                    }
                });
                result.put(namespace, groupResult);
            }
        } else {
            configStorage.forEach((ns, gs) -> {
                Map<String, Map<String, String>> groupResult = new LinkedHashMap<>();
                gs.forEach((group, keyMap) -> {
                    Map<String, String> keyResult = new LinkedHashMap<>();
                    keyMap.forEach((key, config) -> {
                        if (environment.equals(config.getEnvironment())) {
                            keyResult.put(key, decryptConfigValue(config.getValue()));
                        }
                    });
                    if (!keyResult.isEmpty()) {
                        groupResult.put(group, keyResult);
                    }
                });
                if (!groupResult.isEmpty()) {
                    result.put(ns, groupResult);
                }
            });
        }
        
        return result;
    }
    
    /**
     * 回滚配置到指定版本
     */
    public boolean rollbackConfig(String namespace, String group, String key, int version) {
        List<ConfigItem> history = getConfigHistory(namespace, group, key, Integer.MAX_VALUE);
        
        for (ConfigItem configItem : history) {
            if (configItem.getVersion() == version) {
                // 创建新的配置项，保持原始版本号
                ConfigItem rolledBackConfig = new ConfigItem();
                rolledBackConfig.setId(String.valueOf(IdUtil.getSnowflakeNextId()));
                rolledBackConfig.setNamespace(namespace);
                rolledBackConfig.setGroup(group);
                rolledBackConfig.setKey(key);
                rolledBackConfig.setValue(encryptConfig(configItem.getValue()));  // 使用解密后的值再加密
                rolledBackConfig.setVersion(version);  // 保持原始版本号
                rolledBackConfig.setCreatedTime(configItem.getCreatedTime());
                rolledBackConfig.setUpdatedTime(LocalDateTime.now());
                rolledBackConfig.setEnvironment(environment);
                rolledBackConfig.setVersionHistoryEnabled(enableVersionHistory);
                
                // 保存到存储（直接覆盖）
                configStorage.computeIfAbsent(namespace, k -> new ConcurrentHashMap<>())
                    .computeIfAbsent(group, k -> new ConcurrentHashMap<>())
                    .put(key, rolledBackConfig);
                
                // 清除缓存
                configCache.remove(buildCacheKey(namespace, group, key));
                
                // 通知监听器
                notifyConfigChanged(namespace, group, key, rolledBackConfig);
                
                log.info("配置回滚完成: namespace={}, group={}, key={}, toVersion={}", 
                    namespace, group, key, version);
                
                return true;
            }
        }
        
        log.warn("版本回滚失败: 找不到版本 {}，namespace={}, group={}, key={}", 
            version, namespace, group, key);
        return false;
    }
    
    // ==================== 辅助方法 ====================
    
    private ConfigItem getFromStorage(String namespace, String group, String key) {
        Map<String, Map<String, ConfigItem>> groupMap = configStorage.get(namespace);
        if (groupMap != null) {
            Map<String, ConfigItem> keyMap = groupMap.get(group);
            if (keyMap != null) {
                ConfigItem config = keyMap.get(key);
                // 只返回当前环境的配置
                if (config != null && environment.equals(config.getEnvironment())) {
                    return config;
                }
            }
        }
        return null;
    }
    
    private void saveToVersionHistory(String namespace, String group, String key, ConfigItem configItem) {
        if (!enableVersionHistory || !configItem.isVersionHistoryEnabled()) {
            return;
        }
        
        versionHistory.computeIfAbsent(namespace, k -> new ConcurrentHashMap<>())
            .computeIfAbsent(group, k -> new ConcurrentHashMap<>())
            .computeIfAbsent(key, k -> new java.util.concurrent.CopyOnWriteArrayList<>())
            .add(configItem);
        
        // 限制历史版本数量
        Map<String, Map<String, List<ConfigItem>>> nsMap = versionHistory.get(namespace);
        if (nsMap != null) {
            Map<String, List<ConfigItem>> groupHistoryMap = nsMap.get(group);
            if (groupHistoryMap != null) {
                List<ConfigItem> history = groupHistoryMap.get(key);
                if (history != null && history.size() > maxHistoryVersions) {
                    history.subList(0, history.size() - maxHistoryVersions).clear();
                }
            }
        }
    }
    
    private String encryptConfig(String value) {
        if (value == null) {
            return null;
        }
        return "ENC(" + Base64.getEncoder().encodeToString((value + ENCRYPTION_KEY).getBytes()) + ")";
    }
    
    private String decryptConfigValue(String encryptedValue) {
        if (encryptedValue == null || !encryptedValue.startsWith("ENC(")) {
            return encryptedValue;
        }
        try {
            String base64 = encryptedValue.substring(4, encryptedValue.length() - 1);
            byte[] decoded = Base64.getDecoder().decode(base64);
            String decrypted = new String(decoded);
            if (decrypted.endsWith(ENCRYPTION_KEY)) {
                return decrypted.substring(0, decrypted.length() - ENCRYPTION_KEY.length());
            }
            return decrypted;
        } catch (Exception e) {
            log.error("配置解密失败", e);
            return encryptedValue;
        }
    }
    
    private ConfigItem decryptConfigItem(ConfigItem configItem) {
        if (configItem == null) {
            return null;
        }
        ConfigItem decrypted = new ConfigItem();
        decrypted.setId(configItem.getId());
        decrypted.setNamespace(configItem.getNamespace());
        decrypted.setGroup(configItem.getGroup());
        decrypted.setKey(configItem.getKey());
        decrypted.setValue(decryptConfigValue(configItem.getValue()));
        decrypted.setDescription(configItem.getDescription());
        decrypted.setVersion(configItem.getVersion());
        decrypted.setCreatedTime(configItem.getCreatedTime());
        decrypted.setUpdatedTime(configItem.getUpdatedTime());
        decrypted.setEnvironment(configItem.getEnvironment());
        decrypted.setVersionHistoryEnabled(configItem.isVersionHistoryEnabled());
        return decrypted;
    }
    
    private void notifyConfigChanged(String namespace, String group, String key, ConfigItem newConfig) {
        for (ConfigListener listener : configListeners) {
            try {
                listener.onConfigChanged(namespace, group, key, decryptConfigItem(newConfig));
            } catch (Exception e) {
                log.error("配置变更通知失败: listener={}", listener.getClass().getName(), e);
            }
        }
    }
    
    private void notifyConfigDeleted(String namespace, String group, String key) {
        for (ConfigListener listener : configListeners) {
            try {
                listener.onConfigDeleted(namespace, group, key);
            } catch (Exception e) {
                log.error("配置删除通知失败: listener={}", listener.getClass().getName(), e);
            }
        }
    }
    
    private void startRefreshThread() {
        refreshThread = new Thread(() -> {
            log.debug("配置刷新线程启动: interval={}ms", refreshInterval);
            while (!Thread.interrupted()) {
                try {
                    Thread.sleep(refreshInterval);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                } catch (Exception e) {
                    log.error("配置刷新异常", e);
                }
            }
        });
        refreshThread.setName("config-refresh-thread");
        refreshThread.setDaemon(true);
        refreshThread.start();
    }
    
    private boolean isCacheExpired(ConfigCacheEntry entry) {
        return LocalDateTime.now().isAfter(entry.getExpiredTime());
    }
    
    private String buildCacheKey(String namespace, String group, String key) {
        return String.format("%s:%s:%s", namespace, group, key);
    }
    
    private String buildCompositeKey(String group, String key) {
        return String.format("%s/%s", group, key);
    }
    
    private int getNextVersion(String namespace, String group, String key) {
        Map<String, Map<String, ConfigItem>> groupMap = configStorage.get(namespace);
        if (groupMap != null) {
            Map<String, ConfigItem> keyMap = groupMap.get(group);
            if (keyMap != null) {
                ConfigItem existing = keyMap.get(key);
                if (existing != null && existing.getVersion() != null) {
                    return existing.getVersion() + 1;
                }
            }
        }
        return 1;
    }
    
    // ==================== 缓存相关 ====================
    
    @Data
    private static class ConfigCacheEntry {
        private final ConfigItem configItem;
        private final LocalDateTime createdTime;
        private final LocalDateTime expiredTime;
        
        public ConfigCacheEntry(ConfigItem configItem, LocalDateTime createdTime, long ttlSeconds) {
            this.configItem = configItem;
            this.createdTime = createdTime;
            this.expiredTime = createdTime.plusSeconds(ttlSeconds);
        }
    }
    
    // ==================== Getter/Setter ====================
    
    public String getEnvironment() {
        return environment;
    }
    
    public void setEnvironment(String environment) {
        this.environment = environment;
    }
    
    public long getCacheTtl() {
        return cacheTtlSeconds;
    }
    
    public void setCacheTtl(long cacheTtl) {
        this.cacheTtlSeconds = cacheTtl;
    }
    
    public int getRefreshInterval() {
        return refreshInterval;
    }
    
    public void setRefreshInterval(int refreshInterval) {
        this.refreshInterval = refreshInterval;
    }
    
    public boolean isAutoRefresh() {
        return autoRefresh;
    }
    
    public void setAutoRefresh(boolean autoRefresh) {
        this.autoRefresh = autoRefresh;
    }
}