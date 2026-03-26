# MQTT 协议适配器设计文档

**模块名称**: mqtt-adapter  
**版本**: 1.0.0  
**优先级**: 🟡 中  
**最后更新**: 2026-03-26

---

## 1. 模块概述

MQTT 协议适配器提供轻量级消息队列方式的终端接入能力，支持：
- 终端设备 MQTT 方式连接认证
- 实时数据上报与订阅
- 双向指令通信
- 设备影子状态同步

### 1.1 核心功能

| 功能 | 说明 |
|------|------|
| 连接认证 | 基于 Token 的 MQTT 连接认证 |
| 数据上报 | 终端上报实时数据、位置、状态 |
| 指令下发 | 平台向终端下发控制指令 |
| 遗嘱消息 | 设备异常断开时自动发布离线状态 |
| 设备影子 | 设备状态缓存与同步 |

### 1.2 适用场景

| 场景 | 说明 |
|------|------|
| IoT 智能设备 | 支持 MQTT 协议的物联网设备 |
| 轻量级终端 | 资源受限设备，需要低功耗通信 |
| 实时监控 | 需要高实时性的状态推送 |
| 双向通信 | 需要平台主动下发指令的场景 |

---

## 2. 架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          MQTT 适配器架构                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MQTT Broker (EMQX)                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
│  │  Connection     │  │  Subscription   │  │  Retained       │                 │
│  │  Manager        │  │  Manager        │  │  Messages       │                 │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │ Webhook           │ ACL               │ Shared Subscription
                    ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           MQTT Adapter Service                                  │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐       │
│  │ DeviceAuth    │ │ MessageHandler│ │ ShadowService │ │ WillHandler   │       │
│  │ Handler       │ │               │ │               │ │               │       │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           业务服务层                                            │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐       │
│  │ vehicle-access│ │monitor-service│ │ alarm-service │ │remote-control │       │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.mqtt.api;

/**
 * MQTT 消息处理器接口
 */
public interface MqttMessageHandler {
    
    /**
     * 处理上行消息
     */
    void handleUpstream(String terminalId, String topic, MqttMessage message);
    
    /**
     * 发布下行消息
     */
    void publishDownstream(String terminalId, String topic, Object payload);
}

/**
 * 设备认证处理器接口
 */
public interface DeviceAuthHandler {
    
    /**
     * 处理设备认证
     */
    DeviceAuthResult handleAuth(DeviceAuthRequest request);
    
    /**
     * 设备连接成功回调
     */
    void onDeviceConnected(String clientId, String terminalId);
    
    /**
     * 设备断开连接回调
     */
    void onDeviceDisconnected(String clientId, String terminalId);
}

/**
 * 设备影子服务接口
 */
public interface DeviceShadowService {
    
    /**
     * 获取设备影子
     */
    DeviceShadow getShadow(String terminalId);
    
    /**
     * 更新报告状态 (设备上报)
     */
    void updateReported(String terminalId, Map<String, Object> state);
    
    /**
     * 更新期望状态 (平台下发)
     */
    void updateDesired(String terminalId, Map<String, Object> state);
    
    /**
     * 同步期望状态到设备
     */
    void syncDesiredToDevice(String terminalId);
}
```

### 2.3 消息模型

```java
/**
 * MQTT 消息
 */
@Data
public class MqttMessage {
    
    /** 消息 ID */
    private String messageId;
    
    /** 主题 */
    private String topic;
    
    /** 载荷 */
    private byte[] payload;
    
    /** QoS 级别 */
    private int qos;
    
    /** 是否保留 */
    private boolean retained;
    
    /** 时间戳 */
    private long timestamp;
}

/**
 * 设备认证请求
 */
@Data
public class DeviceAuthRequest {
    
    /** 客户端 ID (terminal_{序列号}) */
    private String clientId;
    
    /** 用户名 */
    private String username;
    
    /** 密码/Token */
    private String password;
    
    /** 设备型号 */
    private String deviceModel;
    
    /** 固件版本 */
    private String firmwareVersion;
    
    /** 扩展属性 */
    private Map<String, String> attributes;
}

/**
 * 设备认证结果
 */
@Data
public class DeviceAuthResult {
    
    /** 是否成功 */
    private boolean success;
    
    /** 终端 ID */
    private String terminalId;
    
    /** 车辆 VIN */
    private String vin;
    
    /** 错误信息 */
    private String errorMessage;
    
    /** 权限列表 */
    private List<String> permissions;
}

/**
 * 设备影子
 */
@Data
public class DeviceShadow {
    
    /** 终端 ID */
    private String terminalId;
    
    /** 是否在线 */
    private boolean connected;
    
    /** 连接时间 */
    private LocalDateTime connectTime;
    
    /** 断开时间 */
    private LocalDateTime disconnectTime;
    
    /** 协议类型 */
    private ProtocolType protocol;
    
    /** 设备型号 */
    private String deviceModel;
    
    /** 固件版本 */
    private String firmwareVersion;
    
    /** 报告状态 (设备上报) */
    private Map<String, Object> reported;
    private int reportedVersion;
    
    /** 期望状态 (平台下发) */
    private Map<String, Object> desired;
    private int desiredVersion;
    
    /** 最后更新时间 */
    private LocalDateTime lastReportTime;
}
```

---

## 3. 主题设计

### 3.1 主题规范

| 主题模式 | 方向 | QoS | 说明 |
|---------|------|-----|------|
| `terminal/{id}/status` | 上行 | 1 | 设备状态上报 |
| `terminal/{id}/position` | 上行 | 1 | 位置数据上报 |
| `terminal/{id}/data` | 上行 | 1 | 业务数据上报 |
| `terminal/{id}/event` | 上行 | 1 | 事件上报 |
| `terminal/{id}/command` | 下行 | 1 | 指令下发 |
| `terminal/{id}/config` | 下行 | 1 | 配置下发 |
| `terminal/{id}/desired` | 下行 | 1 | 期望状态同步 |

### 3.2 消息格式

#### 状态上报

```json
{
  "terminalId": "T001",
  "timestamp": 1710748800000,
  "status": "online",
  "vehicleStatus": "RUNNING",
  "batteryLevel": 85,
  "soc": 75,
  "signalStrength": -65,
  "firmwareVersion": "v1.2.3"
}
```

#### 位置上报

```json
{
  "terminalId": "T001",
  "timestamp": 1710748800000,
  "latitude": 30.123456,
  "longitude": 103.845678,
  "altitude": 500,
  "speed": 45.5,
  "direction": 90,
  "accuracy": 10,
  "locationType": "GPS"
}
```

#### 指令下发

```json
{
  "commandId": "cmd_001",
  "commandType": "text",
  "params": {
    "message": "请到指定地点充电",
    "urgency": 1
  },
  "priority": 10,
  "timestamp": 1710748800000,
  "timeout": 300
}
```

---

## 4. 认证机制

### 4.1 Token 认证

```
MQTT CONNECT:
  ClientId: terminal_{序列号}
  Username: {租户ID}
  Password: {JWT Token}
```

**Token 内容**:

```json
{
  "sub": "terminal_13800001111",
  "vin": "LDA1234567890ABCD",
  "tenantId": "T001",
  "iat": 1710748800,
  "exp": 1710835200,
  "scope": ["data:report", "command:receive"]
}
```

### 4.2 遗嘱消息配置

```
Will Topic: terminal/{id}/status
Will Message: {"status":"offline","timestamp":1710748800000}
Will QoS: 1
Will Retain: true
```

---

## 5. 设备影子

### 5.1 影子同步流程

```
设备                                    平台
  │                                       │
  │  1. 上报状态 (reported)               │
  │  ─────────────────────────────────▶  │
  │  Topic: terminal/{id}/status         │
  │                                       │
  │                     2. 更新设备影子    │
  │                     ◀─────────────    │
  │                                       │
  │  3. 期望状态变更                      │
  │  ◀──────────────────────────────────  │
  │  Topic: terminal/{id}/desired        │
  │                                       │
  │  4. 执行并上报结果                    │
  │  ─────────────────────────────────▶  │
  │                                       │
```

### 5.2 影子状态示例

```json
{
  "terminalId": "T001",
  "connected": true,
  "reported": {
    "vehicleStatus": "RUNNING",
    "batteryLevel": 85,
    "soc": 75,
    "speed": 45.5
  },
  "reportedVersion": 10,
  "desired": {
    "lockStatus": "UNLOCKED",
    "maxSpeed": 60
  },
  "desiredVersion": 3,
  "lastReportTime": "2026-03-26T08:00:00"
}
```

---

## 6. 配置项

```yaml
mqtt-adapter:
  enabled: true
  broker:
    url: tcp://emqx:1883
    clientId: iov-platform
    username: platform
    password: ${MQTT_PASSWORD}
  connection:
    keepAlive: 60
    cleanSession: false
    connectionTimeout: 30
    reconnectDelay: 5000
  webhook:
    authUrl: /webhook/mqtt/auth
    aclUrl: /webhook/mqtt/acl
    connectedUrl: /webhook/mqtt/connected
    disconnectedUrl: /webhook/mqtt/disconnected
  shadow:
    enabled: true
    ttl: 604800000  # 7 天
  will:
    enabled: true
    topic: terminal/{id}/status
    qos: 1
    retained: true
```

---

## 7. 性能指标

| 指标 | 目标值 |
|------|--------|
| 并发连接 | 100,000+ |
| 消息吞吐 | 50,000 TPS |
| 消息延迟 | <100ms |
| 内存占用 | <1GB |

---

## 8. 与其他协议对比

| 特性 | JT/T 808 | MQTT | HTTP |
|------|----------|------|------|
| 连接方式 | TCP 长连接 | TCP 长连接 | HTTP 短连接 |
| 实时性 | 高 (秒级) | 高 (秒级) | 低 (轮询) |
| 资源消耗 | 中 | 低 | 高 |
| 双向通信 | 支持 | 支持 | 需轮询 |
| QoS 支持 | 应用层实现 | 原生支持 | 无 |
| 适用设备 | 合规车载终端 | IoT 设备 | 轻量设备/第三方 |

---

## 9. 相关文档

| 文档 | 路径 | 描述 |
|------|------|------|
| 设备绑定可靠性设计 | [../business/DEVICE_BINDING_RELIABILITY.md](../business/DEVICE_BINDING_RELIABILITY.md) | MQTT 设备绑定 Token 认证、遗嘱消息机制详解 |
| 车辆接入服务 | [../business/vehicle-access.md](../business/vehicle-access.md) | 车辆接入服务设计 |
| EMQX 配置指南 | [../../deployment/EMQX_CONFIG.md](../../deployment/EMQX_CONFIG.md) | EMQX Broker 配置说明 |

> 📌 **重要**: MQTT 协议的设备绑定可靠性设计详见 [DEVICE_BINDING_RELIABILITY.md](../business/DEVICE_BINDING_RELIABILITY.md) 第4章，包含：
> - Token 认证与设备影子
> - 遗嘱消息机制
> - 设备影子同步设计
> - 连接状态管理

---

## 10. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-26 | 初始版本 |

---

_文档维护：渔晓白_