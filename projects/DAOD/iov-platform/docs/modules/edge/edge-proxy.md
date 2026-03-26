# 边缘代理模块 (edge-proxy)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | edge-proxy |
| 模块版本 | 1.0.0 |
| 模块类型 | edge |
| 优先级 | 80 |
| 负责人 | 后端开发 |
| 开发周期 | Week 35-36 |

### 1.2 功能描述

边缘代理模块部署在边缘节点，负责云边通信、数据缓存、协议转换和本地服务代理等功能。

### 1.3 核心能力

- 云边通信代理
- 数据上行下发
- 断网缓存
- 协议转换
- 本地服务代理

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          边缘代理架构                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              云端                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ IoT Hub         │  │ Cloud Service   │  │ Data Platform   │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ MQTT/HTTP
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              边缘代理                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        EdgeProxy                                         │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │CloudClient  │ │LocalServer  │ │DataCache    │ │ProtocolConv │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ TCP/MQTT
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              终端设备                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ 车载终端        │  │ 传感器          │  │ 控制器          │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.edgeproxy;

public interface CloudConnectionService {
    
    void connect();
    
    void disconnect();
    
    boolean isConnected();
    
    void publish(String topic, byte[] payload);
    
    void subscribe(String topic, MessageHandler handler);
    
    void unsubscribe(String topic);
}

public interface EdgeDataService {
    
    void uploadData(EdgeData data);
    
    void uploadBatch(List<EdgeData> dataList);
    
    EdgeData downloadData(String dataId);
    
    void syncConfig(String configKey);
}

public interface EdgeCacheService {
    
    void cache(String key, Object value, Duration ttl);
    
    <T> T get(String key, Class<T> type);
    
    void remove(String key);
    
    void clear();
    
    List<CachedData> getPendingUpload();
    
    void markUploaded(String key);
}

public interface LocalProxyService {
    
    void startLocalServer(int port);
    
    void stopLocalServer();
    
    void registerLocalService(String serviceId, String endpoint);
    
    void unregisterLocalService(String serviceId);
    
    List<LocalService> listLocalServices();
}

public interface ProtocolConverter {
    
    byte[] convertToCloud(Object localData);
    
    Object convertFromCloud(byte[] cloudData);
    
    String getSupportedProtocol();
}
```

### 2.3 数据模型

```java
@Data
public class EdgeConfig {
    private String edgeId;
    private String edgeName;
    private String cloudEndpoint;
    private String accessKey;
    private String secretKey;
    private int heartbeatInterval;
    private int uploadInterval;
    private int cacheSize;
    private List<String> subscribedTopics;
}

@Data
public class EdgeData {
    private String id;
    private String edgeId;
    private String vin;
    private String dataType;
    private byte[] payload;
    private LocalDateTime timestamp;
    private DataStatus status;
    private int retryCount;
}

@Data
public class CachedData {
    private String key;
    private Object value;
    private LocalDateTime cachedAt;
    private LocalDateTime expireAt;
    private boolean uploaded;
}

@Data
public class LocalService {
    private String serviceId;
    private String serviceName;
    private String endpoint;
    private ServiceStatus status;
    private LocalDateTime registeredAt;
}

public enum DataStatus {
    PENDING,
    UPLOADING,
    UPLOADED,
    FAILED
}
```

### 2.4 云边通信实现

```java
@Service
public class CloudConnectionServiceImpl implements CloudConnectionService {
    
    @Value("${edge.cloud.endpoint}")
    private String cloudEndpoint;
    
    @Value("${edge.access-key}")
    private String accessKey;
    
    @Value("${edge.secret-key}")
    private String secretKey;
    
    private MqttAsyncClient mqttClient;
    private final Map<String, MessageHandler> handlers = new ConcurrentHashMap<>();
    
    @Override
    public void connect() {
        try {
            String clientId = "edge-" + UUID.randomUUID().toString().substring(0, 8);
            mqttClient = new MqttAsyncClient(cloudEndpoint, clientId, new MemoryPersistence());
            
            MqttConnectOptions options = new MqttConnectOptions();
            options.setUserName(accessKey);
            options.setPassword(secretKey.toCharArray());
            options.setAutomaticReconnect(true);
            options.setCleanSession(true);
            options.setKeepAlive(60);
            
            mqttClient.setCallback(new MqttCallback() {
                @Override
                public void connectionLost(Throwable cause) {
                    log.warn("Cloud connection lost: {}", cause.getMessage());
                    handleDisconnect();
                }
                
                @Override
                public void messageArrived(String topic, MqttMessage message) {
                    handleMessage(topic, message);
                }
                
                @Override
                public void deliveryComplete(IMqttDeliveryToken token) {
                    log.debug("Message delivery complete");
                }
            });
            
            mqttClient.connect(options).waitForCompletion();
            log.info("Connected to cloud: {}", cloudEndpoint);
            
            resubscribeAll();
        } catch (Exception e) {
            log.error("Failed to connect to cloud: {}", e.getMessage());
            throw new EdgeProxyException("Cloud connection failed", e);
        }
    }
    
    @Override
    public void publish(String topic, byte[] payload) {
        if (!isConnected()) {
            throw new EdgeProxyException("Not connected to cloud");
        }
        
        try {
            MqttMessage message = new MqttMessage(payload);
            message.setQos(1);
            mqttClient.publish(topic, message);
        } catch (Exception e) {
            log.error("Failed to publish message: {}", e.getMessage());
            throw new EdgeProxyException("Publish failed", e);
        }
    }
    
    @Override
    public void subscribe(String topic, MessageHandler handler) {
        if (!isConnected()) {
            throw new EdgeProxyException("Not connected to cloud");
        }
        
        try {
            mqttClient.subscribe(topic, 1);
            handlers.put(topic, handler);
        } catch (Exception e) {
            log.error("Failed to subscribe topic {}: {}", topic, e.getMessage());
            throw new EdgeProxyException("Subscribe failed", e);
        }
    }
    
    private void handleMessage(String topic, MqttMessage message) {
        MessageHandler handler = handlers.get(topic);
        if (handler != null) {
            try {
                handler.handle(topic, message.getPayload());
            } catch (Exception e) {
                log.error("Error handling message from topic {}: {}", topic, e.getMessage());
            }
        }
    }
    
    private void resubscribeAll() {
        for (Map.Entry<String, MessageHandler> entry : handlers.entrySet()) {
            try {
                mqttClient.subscribe(entry.getKey(), 1);
            } catch (Exception e) {
                log.error("Failed to resubscribe topic {}", entry.getKey());
            }
        }
    }
}
```

### 2.5 断网缓存实现

```java
@Service
public class EdgeCacheServiceImpl implements EdgeCacheService {
    
    @Value("${edge.cache.path:/data/edge-cache}")
    private String cachePath;
    
    @Value("${edge.cache.max-size:1024}")
    private int maxCacheSizeMB;
    
    private RocksDB cacheDb;
    private final Queue<String> pendingQueue = new ConcurrentLinkedQueue<>();
    
    @PostConstruct
    public void init() {
        try {
            RocksDB.loadLibrary();
            Options options = new Options().setCreateIfMissing(true);
            cacheDb = RocksDB.open(options, cachePath);
            loadPendingQueue();
        } catch (Exception e) {
            throw new EdgeProxyException("Failed to initialize cache", e);
        }
    }
    
    @Override
    public void cache(String key, Object value, Duration ttl) {
        try {
            CachedData cachedData = new CachedData();
            cachedData.setKey(key);
            cachedData.setValue(value);
            cachedData.setCachedAt(LocalDateTime.now());
            cachedData.setExpireAt(LocalDateTime.now().plus(ttl));
            cachedData.setUploaded(false);
            
            byte[] data = serialize(cachedData);
            cacheDb.put(key.getBytes(), data);
            
            pendingQueue.add(key);
        } catch (Exception e) {
            log.error("Failed to cache data: {}", e.getMessage());
        }
    }
    
    @Override
    public List<CachedData> getPendingUpload() {
        List<CachedData> result = new ArrayList<>();
        String key;
        while ((key = pendingQueue.poll()) != null) {
            try {
                byte[] data = cacheDb.get(key.getBytes());
                if (data != null) {
                    CachedData cachedData = deserialize(data, CachedData.class);
                    if (!cachedData.isUploaded() && !isExpired(cachedData)) {
                        result.add(cachedData);
                    }
                }
            } catch (Exception e) {
                log.error("Failed to get cached data: {}", e.getMessage());
            }
        }
        return result;
    }
    
    @Override
    public void markUploaded(String key) {
        try {
            byte[] data = cacheDb.get(key.getBytes());
            if (data != null) {
                CachedData cachedData = deserialize(data, CachedData.class);
                cachedData.setUploaded(true);
                cacheDb.put(key.getBytes(), serialize(cachedData));
            }
        } catch (Exception e) {
            log.error("Failed to mark uploaded: {}", e.getMessage());
        }
    }
    
    @Scheduled(fixedRate = 60000)
    public void cleanupExpired() {
        try (RocksIterator iterator = cacheDb.newIterator()) {
            for (iterator.seekToFirst(); iterator.isValid(); iterator.next()) {
                CachedData cachedData = deserialize(iterator.value(), CachedData.class);
                if (isExpired(cachedData)) {
                    cacheDb.delete(iterator.key());
                }
            }
        }
    }
    
    private boolean isExpired(CachedData cachedData) {
        return cachedData.getExpireAt() != null && 
               cachedData.getExpireAt().isBefore(LocalDateTime.now());
    }
}
```

## 3. 配置项

```yaml
edge-proxy:
  enabled: true
  edge-id: ${EDGE_ID:edge-001}
  edge-name: ${EDGE_NAME:Edge Node 001}
  cloud:
    endpoint: ${CLOUD_ENDPOINT:tcp://cloud.example.com:1883}
    access-key: ${ACCESS_KEY:}
    secret-key: ${SECRET_KEY:}
  connection:
    heartbeat-interval: 60
    reconnect-interval: 5000
  cache:
    path: /data/edge-cache
    max-size-mb: 1024
    ttl-hours: 24
  upload:
    interval: 5000
    batch-size: 100
  local-server:
    port: 8080
```

## 4. 测试用例

### 4.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testCloudConnect | 测试云端连接 | 连接成功 |
| testDataUpload | 测试数据上传 | 上传成功 |
| testCacheStore | 测试数据缓存 | 缓存成功 |
| testCacheRetrieve | 测试缓存读取 | 读取正确 |

### 4.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testDisconnectCache | 测试断网缓存 | 数据缓存成功 |
| testReconnectSync | 测试重连同步 | 数据同步成功 |
| testProtocolConvert | 测试协议转换 | 转换正确 |

## 5. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: common-cache
    version: ">=1.0.0"
```

## 6. 部署说明

### 6.1 资源需求

```yaml
resources:
  cpu: "200m"
  memory: "512Mi"
  storage: "1Gi"
```

## 7. 监控指标

| 指标名 | 类型 | 描述 |
|-------|------|------|
| edge_cloud_connected | Gauge | 云端连接状态 |
| edge_data_uploaded | Counter | 上传数据量 |
| edge_data_cached | Gauge | 缓存数据量 |
| edge_latency | Histogram | 云边延迟 |

## 8. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
