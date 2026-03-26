# 车辆接入服务模块 (vehicle-access)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | vehicle-access |
| 模块版本 | 1.0.0 |
| 模块类型 | business |
| 优先级 | 60 |
| 负责人 | 后端开发 |
| 开发周期 | Week 12-13 |

### 1.2 功能描述

车辆接入服务模块负责车辆的认证、注册、心跳管理和会话管理，是车辆与平台通信的入口模块。

### 1.3 核心能力

- 车辆认证（VIN验证、设备认证）
- 车辆注册
- 心跳管理
- 会话管理
- 连接状态管理

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          车辆接入服务架构                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              接入层                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ MQTT Gateway    │  │ TCP Gateway     │  │ HTTP Gateway    │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              接入服务层                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      VehicleAccessService                                │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │AuthService  │ │RegisterService│ │HeartbeatService│ │SessionService│   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              数据层                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ PostgreSQL      │  │ Redis Cache     │  │ Kafka MQ        │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.vehicleaccess;

public interface VehicleAuthService {
    
    AuthResult authenticate(AuthRequest request);
    
    AuthResult authenticateByVin(String vin, String deviceKey);
    
    AuthResult authenticateByDevice(String deviceId, String secret);
    
    boolean validateToken(String token);
    
    void invalidateToken(String vin);
    
    AuthSession getSession(String vin);
}

public interface VehicleRegisterService {
    
    Vehicle registerVehicle(VehicleRegisterRequest request);
    
    Vehicle bindDevice(String vin, DeviceBindRequest request);
    
    void unbindDevice(String vin, String deviceId);
    
    Vehicle getVehicleByVin(String vin);
    
    Vehicle getVehicleByDevice(String deviceId);
    
    void updateVehicleInfo(String vin, VehicleInfoUpdateRequest request);
}

public interface VehicleHeartbeatService {
    
    void processHeartbeat(HeartbeatMessage message);
    
    void updateOnlineStatus(String vin, OnlineStatus status);
    
    OnlineStatus getOnlineStatus(String vin);
    
    Map<String, OnlineStatus> batchGetOnlineStatus(List<String> vins);
    
    List<String> getOfflineVehicles(String tenantId, Duration offlineDuration);
}

public interface VehicleSessionService {
    
    VehicleSession createSession(String vin, SessionCreateRequest request);
    
    VehicleSession getSession(String sessionId);
    
    VehicleSession getSessionByVin(String vin);
    
    void updateSession(String sessionId, SessionUpdateRequest request);
    
    void closeSession(String sessionId);
    
    void closeSessionByVin(String vin);
    
    List<VehicleSession> getActiveSessions(String tenantId);
}
```

### 2.3 数据模型

```java
@Data
public class Vehicle {
    private String id;
    private String vin;
    private String tenantId;
    private String plateNumber;
    private String vehicleType;
    private String brand;
    private String model;
    private String color;
    private Integer seatCount;
    private String ownerId;
    private String groupId;
    private List<String> tags;
    private VehicleStatus status;
    private OnlineStatus onlineStatus;
    private LocalDateTime lastOnlineTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
public class DeviceBinding {
    private String id;
    private String vin;
    private String deviceId;
    private String deviceType;
    private String deviceModel;
    private String simCard;
    private String iccid;
    private DeviceStatus status;
    private LocalDateTime bindTime;
    private LocalDateTime activatedAt;
}

@Data
public class VehicleSession {
    private String id;
    private String vin;
    private String tenantId;
    private String deviceId;
    private String protocol;
    private String clientIp;
    private Integer port;
    private SessionStatus status;
    private LocalDateTime loginTime;
    private LocalDateTime lastActiveTime;
    private LocalDateTime logoutTime;
    private Long duration;
}

@Data
public class AuthResult {
    private boolean success;
    private String token;
    private String vin;
    private String deviceId;
    private LocalDateTime expireTime;
    private String errorMessage;
}

@Data
public class HeartbeatMessage {
    private String vin;
    private String deviceId;
    private LocalDateTime timestamp;
    private Double latitude;
    private Double longitude;
    private Integer speed;
    private Integer direction;
    private Integer soc;
    private VehicleStatus vehicleStatus;
}

public enum VehicleStatus {
    NORMAL,
    ALARM,
    OFFLINE,
    MAINTENANCE
}

public enum OnlineStatus {
    ONLINE,
    OFFLINE,
    SLEEP
}

public enum SessionStatus {
    ACTIVE,
    CLOSED,
    TIMEOUT
}
```

### 2.4 数据库设计

```sql
CREATE TABLE vehicles (
    id VARCHAR(32) PRIMARY KEY,
    vin VARCHAR(17) UNIQUE NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    plate_number VARCHAR(20),
    vehicle_type VARCHAR(50),
    brand VARCHAR(50),
    model VARCHAR(100),
    color VARCHAR(20),
    seat_count INT,
    owner_id VARCHAR(32),
    group_id VARCHAR(32),
    tags JSONB,
    status VARCHAR(20) DEFAULT 'NORMAL',
    online_status VARCHAR(20) DEFAULT 'OFFLINE',
    last_online_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE device_bindings (
    id VARCHAR(32) PRIMARY KEY,
    vin VARCHAR(17) NOT NULL,
    device_id VARCHAR(50) NOT NULL,
    device_type VARCHAR(30),
    device_model VARCHAR(50),
    sim_card VARCHAR(20),
    iccid VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    bind_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP,
    FOREIGN KEY (vin) REFERENCES vehicles(vin),
    UNIQUE(vin, device_id)
);

CREATE TABLE vehicle_sessions (
    id VARCHAR(32) PRIMARY KEY,
    vin VARCHAR(17) NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    device_id VARCHAR(50),
    protocol VARCHAR(20),
    client_ip VARCHAR(50),
    port INT,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_time TIMESTAMP,
    logout_time TIMESTAMP,
    duration BIGINT,
    FOREIGN KEY (vin) REFERENCES vehicles(vin)
);

CREATE TABLE vehicle_auth_tokens (
    id VARCHAR(32) PRIMARY KEY,
    vin VARCHAR(17) NOT NULL,
    device_id VARCHAR(50),
    token VARCHAR(500) NOT NULL,
    expire_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vin) REFERENCES vehicles(vin)
);

CREATE INDEX idx_vehicles_tenant ON vehicles(tenant_id);
CREATE INDEX idx_vehicles_vin ON vehicles(vin);
CREATE INDEX idx_vehicles_status ON vehicles(online_status);
CREATE INDEX idx_device_bindings_device ON device_bindings(device_id);
CREATE INDEX idx_sessions_vin ON vehicle_sessions(vin);
CREATE INDEX idx_sessions_status ON vehicle_sessions(status);
```

### 2.5 心跳处理实现

```java
@Service
public class VehicleHeartbeatServiceImpl implements VehicleHeartbeatService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    private static final String ONLINE_KEY_PREFIX = "vehicle:online:";
    private static final Duration ONLINE_TIMEOUT = Duration.ofMinutes(5);
    
    @Override
    public void processHeartbeat(HeartbeatMessage message) {
        String vin = message.getVin();
        
        updateOnlineStatus(vin, OnlineStatus.ONLINE);
        
        String cacheKey = ONLINE_KEY_PREFIX + vin;
        VehicleOnlineInfo onlineInfo = VehicleOnlineInfo.builder()
            .vin(vin)
            .deviceId(message.getDeviceId())
            .lastHeartbeat(LocalDateTime.now())
            .latitude(message.getLatitude())
            .longitude(message.getLongitude())
            .speed(message.getSpeed())
            .soc(message.getSoc())
            .build();
        
        redisTemplate.opsForValue().set(cacheKey, onlineInfo, ONLINE_TIMEOUT);
        
        if (message.getLatitude() != null && message.getLongitude() != null) {
            kafkaTemplate.send("vehicle.heartbeat", vin, message);
        }
        
        vehicleRepository.updateLastOnlineTime(vin, LocalDateTime.now());
    }
    
    @Override
    public void updateOnlineStatus(String vin, OnlineStatus status) {
        vehicleRepository.updateOnlineStatus(vin, status);
        
        if (status == OnlineStatus.OFFLINE) {
            redisTemplate.delete(ONLINE_KEY_PREFIX + vin);
        }
    }
    
    @Override
    public OnlineStatus getOnlineStatus(String vin) {
        String cacheKey = ONLINE_KEY_PREFIX + vin;
        VehicleOnlineInfo info = (VehicleOnlineInfo) redisTemplate.opsForValue().get(cacheKey);
        
        if (info != null) {
            return OnlineStatus.ONLINE;
        }
        
        Vehicle vehicle = vehicleRepository.findByVin(vin);
        return vehicle != null ? vehicle.getOnlineStatus() : OnlineStatus.OFFLINE;
    }
    
    @Scheduled(fixedRate = 60000)
    public void checkOfflineVehicles() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(5);
        List<Vehicle> timeoutVehicles = vehicleRepository.findOnlineVehiclesBefore(threshold);
        
        for (Vehicle vehicle : timeoutVehicles) {
            updateOnlineStatus(vehicle.getVin(), OnlineStatus.OFFLINE);
            log.info("Vehicle {} marked as offline due to heartbeat timeout", vehicle.getVin());
        }
    }
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/vehicle/register | 注册车辆 |
| GET | /api/vehicle/{vin} | 获取车辆信息 |
| PUT | /api/vehicle/{vin} | 更新车辆信息 |
| DELETE | /api/vehicle/{vin} | 删除车辆 |
| POST | /api/vehicle/{vin}/bind | 绑定设备 |
| DELETE | /api/vehicle/{vin}/unbind/{deviceId} | 解绑设备 |
| GET | /api/vehicle/{vin}/online | 获取在线状态 |
| GET | /api/vehicle | 查询车辆列表 |
| POST | /api/vehicle/auth | 车辆认证 |

### 3.2 MQTT主题

| 主题 | 方向 | 描述 |
|-----|------|------|
| vehicle/{vin}/heartbeat | 上行 | 心跳消息 |
| vehicle/{vin}/auth | 上行 | 认证请求 |
| vehicle/{vin}/command | 下行 | 指令下发 |
| vehicle/{vin}/config | 下行 | 配置下发 |

### 3.3 API示例

```json
POST /api/vehicle/register
{
    "vin": "LDA1234567890ABCD",
    "tenantId": "T001",
    "plateNumber": "川A12345",
    "vehicleType": "SIGHTSEEING_BUS",
    "brand": "道达",
    "model": "DD-EV-001",
    "color": "白色",
    "seatCount": 14
}

Response:
{
    "code": 200,
    "message": "Vehicle registered successfully",
    "data": {
        "id": "V001",
        "vin": "LDA1234567890ABCD",
        "plateNumber": "川A12345",
        "status": "NORMAL",
        "onlineStatus": "OFFLINE"
    }
}

POST /api/vehicle/auth
{
    "vin": "LDA1234567890ABCD",
    "deviceKey": "device_secret_key"
}

Response:
{
    "code": 200,
    "message": "Authentication successful",
    "data": {
        "success": true,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "vin": "LDA1234567890ABCD",
        "expireTime": "2026-03-18T10:00:00Z"
    }
}
```

## 4. 配置项

```yaml
vehicle-access:
  enabled: true
  auth:
    token-expire-hours: 24
    max-retry: 3
  heartbeat:
    timeout-minutes: 5
    check-interval-ms: 60000
  session:
    max-sessions-per-vehicle: 1
    cleanup-interval-ms: 300000
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testVehicleRegister | 测试车辆注册 | 注册成功 |
| testVehicleAuth | 测试车辆认证 | 认证成功 |
| testDeviceBind | 测试设备绑定 | 绑定成功 |
| testHeartbeat | 测试心跳处理 | 心跳处理正确 |
| testOnlineStatus | 测试在线状态 | 状态更新正确 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testFullAccessFlow | 测试完整接入流程 | 认证、注册、心跳正常 |
| testMultiDeviceBind | 测试多设备绑定 | 绑定关系正确 |
| testOfflineDetection | 测试离线检测 | 超时后状态更新 |

## 6. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: tenant-service
    version: ">=1.0.0"
  - name: mqtt-client
    version: ">=1.0.0"
```

## 7. 部署说明

### 7.1 资源需求

```yaml
resources:
  cpu: "200m"
  memory: "256Mi"
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
| vehicle_total | Gauge | 车辆总数 |
| vehicle_online | Gauge | 在线车辆数 |
| vehicle_auth_total | Counter | 认证总次数 |
| vehicle_auth_failed | Counter | 认证失败次数 |
| heartbeat_received | Counter | 收到心跳数 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
| 1.1.0 | 2026-03-26 | 添加设备绑定可靠性文档引用 |

---

## 10. 相关文档

| 文档 | 路径 | 描述 |
|------|------|------|
| 设备绑定可靠性设计 | [DEVICE_BINDING_RELIABILITY.md](./DEVICE_BINDING_RELIABILITY.md) | JT/T 808、MQTT、HTTP 三种协议设备绑定可靠性机制 |
| JT/T 808 适配器 | [../adapter/jtt808-adapter.md](../adapter/jtt808-adapter.md) | JT/T 808 协议适配器设计 |
| HTTP 适配器 | [../MODULE_HTTP_ADAPTER.md](../MODULE_HTTP_ADAPTER.md) | HTTP 协议适配器设计 |

> 📌 **重要**: 设备绑定的详细可靠性设计请参阅 [DEVICE_BINDING_RELIABILITY.md](./DEVICE_BINDING_RELIABILITY.md)，包含：
> - 三种协议的绑定流程详解
> - 鉴权码验证、Token认证、签名验证机制
> - 重连重试、遗嘱消息、心跳检测策略
> - 设备影子同步与状态管理
> - 异常处理与故障恢复
> - 监控指标与告警规则
