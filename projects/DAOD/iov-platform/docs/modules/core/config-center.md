# 配置中心模块 (config-center)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | config-center |
| 模块版本 | 1.0.0 |
| 模块类型 | core |
| 优先级 | 15 |
| 负责人 | 后端开发 |
| 开发周期 | Week 4 |

### 1.2 功能描述

配置中心模块提供集中化的配置管理能力，支持配置的热更新、版本管理、审计日志等功能。所有模块的配置都通过配置中心进行统一管理。

### 1.3 核心能力

- 配置集中管理
- 配置热更新
- 配置版本管理
- 配置审计日志
- 多环境配置隔离
- 配置加密存储

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          配置中心架构                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API Layer                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ ConfigAPI       │  │ VersionAPI      │  │ AuditAPI        │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Core Service                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        ConfigService                                     │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ConfigManager│ │VersionManager│ │AuditManager │ │EncryptManager│      │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Notification Layer                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    ConfigChangeNotifier                                  │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                       │   │
│  │  │ WebSocket   │ │  MQ Push    │ │ HTTP Callback│                       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              Storage Layer                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ PostgreSQL      │  │ Redis Cache     │  │ File Storage    │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.configcenter;

public interface ConfigService {
    
    ConfigItem getConfig(String namespace, String key);
    
    ConfigItem getConfig(String namespace, String key, String environment);
    
    void setConfig(String namespace, String key, String value);
    
    void setConfig(String namespace, String key, String value, String environment);
    
    void deleteConfig(String namespace, String key);
    
    List<ConfigItem> listConfigs(String namespace);
    
    List<ConfigItem> listConfigs(String namespace, String environment);
    
    void batchUpdate(String namespace, Map<String, String> configs);
}

public interface ConfigVersionService {
    
    ConfigVersion createVersion(String namespace, String version, Map<String, String> configs);
    
    ConfigVersion getVersion(String namespace, String version);
    
    List<ConfigVersion> listVersions(String namespace);
    
    void rollback(String namespace, String targetVersion);
    
    ConfigVersion getCurrentVersion(String namespace);
}

public interface ConfigAuditService {
    
    void logChange(ConfigChangeEvent event);
    
    List<ConfigAuditLog> queryLogs(String namespace, LocalDateTime start, LocalDateTime end);
    
    ConfigAuditLog getLogDetail(String logId);
}

public interface ConfigHotReloadService {
    
    void registerListener(String namespace, String key, ConfigChangeListener listener);
    
    void unregisterListener(String namespace, String key);
    
    void notifyChange(String namespace, String key, String oldValue, String newValue);
    
    void reloadConfig(String namespace, String key);
}

public interface ConfigListener {
    
    void onConfigChange(ConfigChangeEvent event);
}
```

### 2.3 配置数据模型

```java
@Data
public class ConfigItem {
    private String id;
    private String namespace;
    private String key;
    private String value;
    private String environment;
    private String dataType;
    private boolean encrypted;
    private String description;
    private Map<String, String> metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String updatedBy;
}

@Data
public class ConfigVersion {
    private String id;
    private String namespace;
    private String version;
    private Map<String, String> configs;
    private String description;
    private LocalDateTime createdAt;
    private String createdBy;
}

@Data
public class ConfigAuditLog {
    private String id;
    private String namespace;
    private String key;
    private String operation;
    private String oldValue;
    private String newValue;
    private String operator;
    private String operatorIp;
    private LocalDateTime operatedAt;
}

@Data
public class ConfigChangeEvent {
    private String namespace;
    private String key;
    private String oldValue;
    private String newValue;
    private String source;
    private LocalDateTime timestamp;
}
```

### 2.4 数据库设计

```sql
CREATE TABLE config_namespaces (
    id VARCHAR(32) PRIMARY KEY,
    namespace VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500),
    owner VARCHAR(50),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE config_items (
    id VARCHAR(32) PRIMARY KEY,
    namespace VARCHAR(100) NOT NULL,
    config_key VARCHAR(200) NOT NULL,
    config_value TEXT,
    environment VARCHAR(50) DEFAULT 'default',
    data_type VARCHAR(20) DEFAULT 'STRING',
    encrypted BOOLEAN DEFAULT FALSE,
    description VARCHAR(500),
    metadata JSONB,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(50),
    UNIQUE(namespace, config_key, environment)
);

CREATE TABLE config_versions (
    id VARCHAR(32) PRIMARY KEY,
    namespace VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    configs JSONB NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    UNIQUE(namespace, version)
);

CREATE TABLE config_audit_logs (
    id VARCHAR(32) PRIMARY KEY,
    namespace VARCHAR(100) NOT NULL,
    config_key VARCHAR(200),
    operation VARCHAR(20) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    operator VARCHAR(50),
    operator_ip VARCHAR(50),
    operated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_config_items_namespace ON config_items(namespace);
CREATE INDEX idx_config_items_env ON config_items(namespace, environment);
CREATE INDEX idx_config_audit_time ON config_audit_logs(operated_at);
```

### 2.5 配置加密实现

```java
@Service
public class ConfigEncryptService {
    
    @Value("${config.encrypt.secret-key}")
    private String secretKey;
    
    private static final String ALGORITHM = "SM4";
    
    public String encrypt(String plainText) {
        try {
            SM4 sm4 = new SM4(secretKey.getBytes(StandardCharsets.UTF_8));
            byte[] encrypted = sm4.encrypt(plainText.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new ConfigEncryptException("Failed to encrypt config", e);
        }
    }
    
    public String decrypt(String encryptedText) {
        try {
            SM4 sm4 = new SM4(secretKey.getBytes(StandardCharsets.UTF_8));
            byte[] decrypted = sm4.decrypt(Base64.getDecoder().decode(encryptedText));
            return new String(decrypted, StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new ConfigEncryptException("Failed to decrypt config", e);
        }
    }
}
```

### 2.6 配置热更新实现

```java
@Service
public class ConfigHotReloadManager {
    
    private final Map<String, List<ConfigChangeListener>> listeners = new ConcurrentHashMap<>();
    private final RedisTemplate<String, String> redisTemplate;
    private final ApplicationEventPublisher eventPublisher;
    
    public void registerListener(String namespace, String key, ConfigChangeListener listener) {
        String listenerKey = buildListenerKey(namespace, key);
        listeners.computeIfAbsent(listenerKey, k -> new CopyOnWriteArrayList<>()).add(listener);
    }
    
    public void notifyChange(String namespace, String key, String oldValue, String newValue) {
        String listenerKey = buildListenerKey(namespace, key);
        List<ConfigChangeListener> listenerList = listeners.get(listenerKey);
        
        if (listenerList != null && !listenerList.isEmpty()) {
            ConfigChangeEvent event = new ConfigChangeEvent();
            event.setNamespace(namespace);
            event.setKey(key);
            event.setOldValue(oldValue);
            event.setNewValue(newValue);
            event.setTimestamp(LocalDateTime.now());
            
            for (ConfigChangeListener listener : listenerList) {
                try {
                    listener.onConfigChange(event);
                } catch (Exception e) {
                    log.error("Config listener error: {}", e.getMessage());
                }
            }
        }
        
        publishToRedis(namespace, key, newValue);
    }
    
    private void publishToRedis(String namespace, String key, String value) {
        String channel = "config:change:" + namespace;
        ConfigChangeEvent event = new ConfigChangeEvent(namespace, key, null, value, "redis", LocalDateTime.now());
        redisTemplate.convertAndSend(channel, event);
    }
    
    private String buildListenerKey(String namespace, String key) {
        return namespace + ":" + key;
    }
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| GET | /api/config/{namespace} | 获取命名空间下所有配置 |
| GET | /api/config/{namespace}/{key} | 获取指定配置 |
| PUT | /api/config/{namespace}/{key} | 更新配置 |
| DELETE | /api/config/{namespace}/{key} | 删除配置 |
| POST | /api/config/{namespace}/batch | 批量更新配置 |
| GET | /api/config/{namespace}/versions | 获取配置版本列表 |
| POST | /api/config/{namespace}/versions | 创建配置版本 |
| POST | /api/config/{namespace}/rollback/{version} | 回滚到指定版本 |
| GET | /api/config/{namespace}/audit | 获取配置审计日志 |

### 3.2 API示例

```json
GET /api/config/vehicle-access

Response:
{
    "code": 200,
    "data": {
        "namespace": "vehicle-access",
        "configs": [
            {
                "key": "mqtt.broker.url",
                "value": "tcp://emqx:1883",
                "dataType": "STRING",
                "encrypted": false,
                "description": "MQTT Broker地址"
            },
            {
                "key": "mqtt.broker.username",
                "value": "admin",
                "dataType": "STRING",
                "encrypted": false
            },
            {
                "key": "mqtt.broker.password",
                "value": "encrypted:xxxxxx",
                "dataType": "STRING",
                "encrypted": true
            }
        ]
    }
}

PUT /api/config/vehicle-access/mqtt.broker.url
{
    "value": "tcp://emqx-new:1883",
    "description": "MQTT Broker地址(更新)"
}

Response:
{
    "code": 200,
    "message": "Config updated successfully",
    "data": {
        "key": "mqtt.broker.url",
        "oldValue": "tcp://emqx:1883",
        "newValue": "tcp://emqx-new:1883",
        "updatedAt": "2026-03-17T10:00:00Z"
    }
}
```

## 4. 配置项

```yaml
config-center:
  enabled: true
  cache:
    enabled: true
    ttl: 300
  encrypt:
    enabled: true
    algorithm: SM4
  version:
    max-versions: 100
    auto-cleanup: true
  audit:
    enabled: true
    retention-days: 90
  hot-reload:
    enabled: true
    notify-type: redis
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testGetConfig | 测试获取配置 | 返回正确的配置值 |
| testSetConfig | 测试设置配置 | 配置保存成功 |
| testEncryptConfig | 测试配置加密 | 敏感配置加密存储 |
| testConfigVersion | 测试配置版本 | 版本创建和回滚成功 |
| testConfigAudit | 测试配置审计 | 审计日志记录正确 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testHotReload | 测试配置热更新 | 配置变更实时生效 |
| testMultiEnvironment | 测试多环境配置 | 环境隔离正确 |
| testConcurrentAccess | 测试并发访问 | 无数据竞争问题 |

## 6. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: common-cache
    version: ">=1.0.0"
  - name: common-log
    version: ">=1.0.0"
```

## 7. 部署说明

### 7.1 资源需求

```yaml
resources:
  cpu: "100m"
  memory: "128Mi"
```

### 7.2 健康检查

```yaml
healthCheck:
  liveness: /health/live
  readiness: /health/ready
```

## 8. 监控指标

| 指标名 | 类型 | 描述 |
|-------|------|------|
| config_read_total | Counter | 配置读取总次数 |
| config_write_total | Counter | 配置写入总次数 |
| config_cache_hit | Counter | 配置缓存命中次数 |
| config_cache_miss | Counter | 配置缓存未命中次数 |
| config_change_events | Counter | 配置变更事件数 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
