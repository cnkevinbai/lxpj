# HTTP/HTTPS 协议适配器设计文档

**模块名称**: http-adapter  
**版本**: 1.0.0  
**优先级**: 🟡 中  
**最后更新**: 2026-03-25

---

## 1. 模块概述

HTTP/HTTPS 协议适配器提供 RESTful API 方式的终端接入能力，支持：
- 终端设备 HTTP 方式数据上报
- 终端设备 HTTP 方式指令获取
- 第三方平台 Webhook 回调对接

### 1.1 核心功能

| 功能 | 说明 |
|------|------|
| 数据上报 | 终端通过 HTTP POST 上报实时数据 |
| 位置上报 | 终端上报 GPS 位置信息 |
| 指令轮询 | 终端主动拉取待执行指令 |
| 指令响应 | 终端上报指令执行结果 |
| Webhook | 接收第三方平台回调通知 |

### 1.2 适用场景

| 场景 | 说明 |
|------|------|
| 4G/5G 终端 | 部分终端不支持长连接，使用 HTTP 短连接 |
| 第三方平台 | 高德/百度地图回调、支付回调等 |
| 轻量设备 | 资源受限设备，无法运行 MQTT 客户端 |
| 数据同步 | 批量数据导入、历史数据补传 |

---

## 2. API 设计

### 2.1 数据上报 API

```http
POST /api/v1/terminal/{terminalId}/data
Authorization: Bearer {token}
Content-Type: application/json

{
  "timestamp": 1710748800000,
  "vehicleStatus": "RUNNING",
  "speed": 45.5,
  "batteryLevel": 85,
  "mileage": 12345.6,
  "soc": 75,
  "temperature": 35.5,
  "position": {
    "latitude": 30.123456,
    "longitude": 103.845678,
    "altitude": 500,
    "direction": 90,
    "locationType": "GPS"
  },
  "extra": {}
}
```

**响应**:
```json
{
  "success": true,
  "messageId": "msg_123456",
  "serverTime": 1710748801000,
  "pendingCommands": 2
}
```

### 2.2 位置上报 API

```http
POST /api/v1/terminal/{terminalId}/position
Content-Type: application/json

{
  "timestamp": 1710748800000,
  "latitude": 30.123456,
  "longitude": 103.845678,
  "altitude": 500,
  "speed": 45.5,
  "direction": 90,
  "accuracy": 10
}
```

### 2.3 指令获取 API

```http
GET /api/v1/terminal/{terminalId}/commands?limit=10
Authorization: Bearer {token}
```

**响应**:
```json
{
  "success": true,
  "serverTime": 1710748800000,
  "pollInterval": 30000,
  "commands": [
    {
      "commandId": "cmd_001",
      "commandType": "text",
      "params": {
        "message": "请到指定地点充电",
        "urgency": 1
      },
      "priority": 10,
      "createTime": 1710748700000,
      "timeout": 300
    }
  ]
}
```

### 2.4 指令结果上报 API

```http
POST /api/v1/terminal/{terminalId}/command/{commandId}/result
Content-Type: application/json

{
  "success": true,
  "executeTime": 1710748800000,
  "result": "已显示消息",
  "errorCode": null,
  "errorMessage": null
}
```

### 2.5 Webhook API

```http
POST /api/v1/webhook/{source}
X-Signature: {signature}
X-Event-Type: {eventType}
Content-Type: application/json

{
  "event": "geofence_enter",
  "data": { ... }
}
```

---

## 3. 认证机制

### 3.1 Token 认证

```
Authorization: Bearer {token}
```

**Token 格式**: JWT

**Token 内容**:
```json
{
  "sub": "terminal_13800001111",
  "iat": 1710748800,
  "exp": 1710835200,
  "scope": ["data:report", "command:read"]
}
```

### 3.2 API Key 认证

```
X-API-Key: {apiKey}
```

---

## 4. 指令类型

| 类型 | 说明 | 参数 |
|------|------|------|
| text | 文本消息下发 | message, urgency |
| param_set | 参数设置 | params (Map) |
| lock | 锁车 | - |
| unlock | 解锁 | - |
| reboot | 重启设备 | - |
| ota | OTA 升级 | firmwareUrl, version |

---

## 5. 错误码

| 错误码 | 说明 |
|--------|------|
| 1001 | Token 无效 |
| 1002 | Token 已过期 |
| 1003 | 权限不足 |
| 2001 | 终端不存在 |
| 2002 | 终端未绑定 |
| 3001 | 参数错误 |
| 3002 | 数据格式错误 |
| 5001 | 服务器内部错误 |

---

## 6. 配置项

```yaml
httpAdapter:
  httpPort: 8080
  httpsPort: 8443
  enableHttps: true
  sslCertPath: /etc/ssl/server.crt
  sslKeyPath: /etc/ssl/server.key
  maxConnections: 5000
  requestTimeout: 30000
  maxRequestBody: 1048576
  rateLimit:
    enabled: true
    requestsPerMinute: 60
  cors:
    enabled: true
    allowedOrigins: "*"
```

---

## 7. 性能指标

| 指标 | 目标值 |
|------|--------|
| QPS | 5000+ |
| 平均响应时间 | <50ms |
| 最大并发连接 | 5000 |
| 内存占用 | <512MB |

---

## 8. 与其他协议对比

| 特性 | JT/T 808 | MQTT | HTTP |
|------|----------|------|------|
| 连接方式 | TCP 长连接 | TCP 长连接 | HTTP 短连接 |
| 实时性 | 高 | 高 | 低 (需轮询) |
| 穿透性 | 一般 | 一般 | 好 |
| 资源消耗 | 中 | 低 | 高 |
| 适用设备 | 车载终端 | IoT 设备 | 轻量设备/第三方 |

---

## 9. 相关文档

| 文档 | 路径 | 描述 |
|------|------|------|
| 设备绑定可靠性设计 | [business/DEVICE_BINDING_RELIABILITY.md](business/DEVICE_BINDING_RELIABILITY.md) | HTTP 协议设备绑定签名验证、幂等设计详解 |
| 车辆接入服务 | [business/vehicle-access.md](business/vehicle-access.md) | 车辆接入服务设计 |

> 📌 **重要**: HTTP 协议的设备绑定可靠性设计详见 [DEVICE_BINDING_RELIABILITY.md](business/DEVICE_BINDING_RELIABILITY.md) 第5章，包含：
> - 签名验证与防重放机制
> - 幂等设计 (重复注册处理)
> - 心跳检测与绑定保活
> - 数据上报维持绑定状态

---

_文档维护：渔晓白_