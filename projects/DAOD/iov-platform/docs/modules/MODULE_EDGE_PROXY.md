# 边缘代理模块设计文档

**模块名称**: edge-proxy  
**版本**: 1.0.0  
**优先级**: 🟡 中  
**最后更新**: 2026-03-18

---

## 1. 模块概述

边缘代理模块实现了云边协同通信，负责边缘节点与云端平台之间的数据传输和指令转发。

### 1.1 核心功能

| 功能 | 说明 |
|------|------|
| 云边通信 | MQTT/WebSocket双向通信 |
| 节点管理 | 边缘节点注册、心跳、状态监控 |
| 数据上行 | 车辆数据上报到云端 |
| 指令下行 | 云端指令下发到边缘 |
| 离线缓存 | 网络断开时本地缓存数据 |
| 断点续传 | 恢复连接后继续传输 |

### 1.2 云边协同架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Cloud Platform                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │Vehicle  │  │Monitor  │  │  OTA    │  │ Remote  │        │
│  │ Service │  │ Service │  │ Service │  │Control  │        │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │            │              │
│       └────────────┴─────┬──────┴────────────┘              │
│                          │                                   │
│                    ┌─────┴─────┐                            │
│                    │Cloud Gateway│                           │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │ MQTT/WebSocket
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  Edge Node 1  │  │  Edge Node 2  │  │  Edge Node N  │
│  ┌─────────┐  │  │  ┌─────────┐  │  │  ┌─────────┐  │
│  │EdgeProxy│  │  │  │EdgeProxy│  │  │  │EdgeProxy│  │
│  └────┬────┘  │  │  └────┬────┘  │  │  └────┬────┘  │
│       │       │  │       │       │  │       │       │
│  ┌────┴────┐  │  │  ┌────┴────┐  │  │  ┌────┴────┐  │
│  │Vehicles │  │  │  │Vehicles │  │  │  │Vehicles │  │
│  └─────────┘  │  │  └─────────┘  │  │  └─────────┘  │
└───────────────┘  └───────────────┘  └───────────────┘
```

---

## 2. 架构设计

### 2.1 模块架构

```
┌─────────────────────────────────────────────────────────────┐
│                      EdgeProxyService                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ EdgeClient  │  │ Heartbeat   │  │ Command     │         │
│  │ (云边通信)   │  │ Manager     │  │ Dispatcher  │         │
│  │             │  │ (心跳管理)   │  │ (指令分发)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ DataSync    │  │ Offline     │  │ Breakpoint  │         │
│  │ Manager     │  │ Cache       │  │ Resume      │         │
│  │ (数据同步)   │  │ (离线缓存)   │  │ (断点续传)   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │ Data        │  │ NodeHealth  │                          │
│  │ Compressor  │  │ Monitor     │                          │
│  │ (数据压缩)   │  │ (健康监控)   │                          │
│  └─────────────┘  └─────────────┘                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 数据流向

```
车载终端                    边缘代理                     云平台
   │                         │                           │
   │─── 车辆数据 ───────────▶│                           │
   │                         │── 缓存 ──                 │
   │                         │                          │
   │                         │─── 数据上报 ────────────▶│
   │                         │   (压缩/加密)             │
   │                         │                          │
   │                         │◀─── 云端指令 ────────────│
   │                         │                          │
   │◀── 指令转发 ────────────│                          │
   │                         │                          │
   │─── 执行结果 ───────────▶│                          │
   │                         │─── 结果上报 ────────────▶│
```

---

## 3. 核心组件

### 3.1 边缘客户端

```java
public class EdgeClient {
    private String edgeNodeId;      // 边缘节点ID
    private String cloudEndpoint;   // 云端地址
    private MqttClient mqttClient;  // MQTT客户端
    private WebSocketClient wsClient;// WebSocket客户端
    
    /**
     * 连接云端
     */
    public void connect();
    
    /**
     * 断开连接
     */
    public void disconnect();
    
    /**
     * 发送数据
     */
    public void sendData(String topic, byte[] data);
    
    /**
     * 订阅主题
     */
    public void subscribe(String topic, MessageHandler handler);
    
    /**
     * 检查连接状态
     */
    public boolean isConnected();
}
```

### 3.2 数据同步管理器

```java
public class DataSyncManager {
    
    /**
     * 同步车辆数据
     */
    public void syncVehicleData(VehicleData data);
    
    /**
     * 同步位置数据
     */
    public void syncPositionData(PositionData data);
    
    /**
     * 同步告警数据
     */
    public void syncAlarmData(AlarmData data);
    
    /**
     * 批量同步
     */
    public void syncBatch(List<VehicleData> dataList);
}
```

### 3.3 离线缓存管理器

```java
public class OfflineCacheManager {
    private int maxCacheSize = 10000;   // 最大缓存数
    private Queue<CacheItem> cache;      // 缓存队列
    
    /**
     * 添加到缓存
     */
    public void addToCache(String topic, byte[] data);
    
    /**
     * 获取缓存大小
     */
    public int getCacheSize();
    
    /**
     * 清空缓存
     */
    public void clearCache();
    
    /**
     * 获取所有缓存数据
     */
    public List<CacheItem> getAllCachedData();
}
```

---

## 4. 消息协议

### 4.1 上行消息

| Topic | 消息类型 | 说明 |
|-------|---------|------|
| edge/{nodeId}/vehicle/data | VehicleData | 车辆实时数据 |
| edge/{nodeId}/vehicle/position | PositionData | 位置数据 |
| edge/{nodeId}/vehicle/alarm | AlarmData | 告警数据 |
| edge/{nodeId}/heartbeat | Heartbeat | 心跳 |
| edge/{nodeId}/status | NodeStatus | 节点状态 |

### 4.2 下行消息

| Topic | 消息类型 | 说明 |
|-------|---------|------|
| cloud/{nodeId}/command | Command | 控制指令 |
| cloud/{nodeId}/config | ConfigUpdate | 配置更新 |
| cloud/{nodeId}/ota | OtaCommand | OTA指令 |

### 4.3 消息格式

```json
{
  "messageId": "msg_123456",
  "timestamp": 1710748800000,
  "edgeNodeId": "edge_001",
  "type": "VEHICLE_DATA",
  "data": {
    "vehicleId": "VEH_001",
    "speed": 30.5,
    "battery": 85,
    "status": "RUNNING"
  },
  "compress": false,
  "encrypt": false
}
```

---

## 5. 离线处理

### 5.1 离线缓存策略

```
网络正常 ────▶ 实时发送数据
    │
    │ 网络断开
    ▼
缓存队列 ────▶ 本地持久化
    │
    │ 网络恢复
    ▼
断点续传 ────▶ 批量发送缓存数据
```

### 5.2 断点续传

```java
public class BreakpointResumeManager {
    
    /**
     * 记录发送位置
     */
    public void recordProgress(String messageId, boolean success);
    
    /**
     * 获取未发送的消息
     */
    public List<CacheItem> getUnsentMessages();
    
    /**
     * 从断点继续发送
     */
    public void resumeFromBreakpoint();
}
```

---

## 6. 配置项

```yaml
edgeProxy:
  mqttBroker: "tcp://localhost:1883"  # MQTT Broker地址
  edgeNodeId: "edge_001"              # 边缘节点ID
  cloudEndpoint: "https://cloud.daod.com" # 云端地址
  syncInterval: 60000                 # 数据同步间隔(ms)
  offlineCacheSize: 10000             # 离线缓存大小
  enableCompression: true             # 启用压缩
  compressionThreshold: 1024          # 压缩阈值(字节)
  enableEncryption: true              # 启用加密
  encryptionKey: "${ENCRYPTION_KEY}"  # 加密密钥
  heartbeatInterval: 30000            # 心跳间隔(ms)
  reconnectInterval: 5000             # 重连间隔(ms)
  maxReconnectAttempts: 10            # 最大重连次数
```

---

## 7. 扩展点

| 扩展点 | 接口 | 说明 |
|--------|------|------|
| 边缘协议 | EdgeProtocol | 自定义通信协议 |
| 数据同步处理器 | DataSyncHandler | 自定义同步逻辑 |

---

## 8. 性能指标

| 指标 | 目标值 |
|------|--------|
| 数据吞吐量 | 5000条/秒 |
| 离线缓存容量 | 10000条 |
| 网络恢复后同步延迟 | <5秒 |
| 内存占用 | <512MB |

---

_文档维护：渔晓白_