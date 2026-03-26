# 远程控制服务模块 (remote-control)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | remote-control |
| 模块版本 | 1.0.0 |
| 模块类型 | business |
| 优先级 | 60 |
| 负责人 | 后端开发 |
| 开发周期 | Week 18-19 |

### 1.2 功能描述

远程控制服务模块提供车辆远程控制能力，支持远程开关门、远程鸣笛、远程启停、参数设置等功能。

### 1.3 核心能力

- 远程开关门控制
- 远程鸣笛闪灯
- 远程启停控制
- 参数远程设置
- 控制权限管理
- 控制日志记录

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          远程控制服务架构                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              接入层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        控制请求接入                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │权限校验     │ │频率限制     │ │参数验证     │ │审计日志     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              控制层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        控制指令处理                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │指令生成     │ │指令下发     │ │响应处理     │ │超时管理     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              通信层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        通信通道管理                                       │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │MQTT通道     │ │TCP通道      │ │HTTP通道     │ │消息队列     │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.remotecontrol;

public interface RemoteControlService {
    
    ControlResult execute(String vin, ControlCommand command);
    
    ControlResult executeAsync(String vin, ControlCommand command);
    
    ControlResult getControlResult(String commandId);
    
    void cancel(String commandId);
}

public interface DoorControlService {
    
    ControlResult unlockDoor(String vin, DoorType doorType);
    
    ControlResult lockDoor(String vin, DoorType doorType);
    
    ControlResult unlockAllDoors(String vin);
    
    ControlResult lockAllDoors(String vin);
    
    DoorStatus getDoorStatus(String vin);
}

public interface HornControlService {
    
    ControlResult horn(String vin, int duration);
    
    ControlResult hornAndFlash(String vin, int duration);
    
    ControlResult stopHorn(String vin);
}

public interface VehicleControlService {
    
    ControlResult startVehicle(String vin);
    
    ControlResult stopVehicle(String vin);
    
    ControlResult setSpeedLimit(String vin, int speedLimit);
    
    ControlResult setParameter(String vin, String parameterKey, Object value);
    
    ControlResult resetParameter(String vin, String parameterKey);
}

public interface ControlPermissionService {
    
    boolean hasPermission(String accountId, String vin, ControlType controlType);
    
    void grantPermission(String accountId, String vin, ControlType controlType);
    
    void revokePermission(String accountId, String vin, ControlType controlType);
    
    List<ControlType> getPermissions(String accountId, String vin);
}

public interface ControlLogService {
    
    void log(ControlLog log);
    
    PageResult<ControlLog> queryLogs(ControlLogQueryRequest request);
    
    List<ControlLog> getRecentLogs(String vin, int limit);
}
```

### 2.3 数据模型

```java
@Data
public class ControlCommand {
    private String id;
    private String vin;
    private ControlType type;
    private Map<String, Object> parameters;
    private ControlPriority priority;
    private LocalDateTime createdAt;
    private String createdBy;
}

@Data
public class ControlResult {
    private String commandId;
    private String vin;
    private ControlType type;
    private ControlStatus status;
    private String message;
    private Map<String, Object> responseData;
    private LocalDateTime executedAt;
    private LocalDateTime respondedAt;
    private Long duration;
}

@Data
public class ControlLog {
    private String id;
    private String tenantId;
    private String vin;
    private String accountId;
    private String accountName;
    private ControlType controlType;
    private String commandId;
    private ControlStatus status;
    private String requestParams;
    private String responseData;
    private String errorMessage;
    private String clientIp;
    private LocalDateTime createdAt;
}

@Data
public class ControlPermission {
    private String id;
    private String accountId;
    private String vin;
    private ControlType controlType;
    private LocalDateTime grantedAt;
    private String grantedBy;
    private LocalDateTime expireAt;
}

public enum ControlType {
    DOOR_UNLOCK,
    DOOR_LOCK,
    HORN,
    HORN_FLASH,
    VEHICLE_START,
    VEHICLE_STOP,
    SPEED_LIMIT_SET,
    PARAMETER_SET,
    PARAMETER_RESET
}

public enum ControlStatus {
    PENDING,
    SENT,
    EXECUTING,
    SUCCESS,
    FAILED,
    TIMEOUT,
    CANCELLED
}

public enum ControlPriority {
    LOW,
    NORMAL,
    HIGH,
    URGENT
}

public enum DoorType {
    ALL,
    DRIVER,
    PASSENGER,
    REAR_LEFT,
    REAR_RIGHT,
    TRUNK
}
```

### 2.4 数据库设计

```sql
CREATE TABLE control_commands (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    control_type VARCHAR(30) NOT NULL,
    parameters JSONB,
    priority VARCHAR(20) DEFAULT 'NORMAL',
    status VARCHAR(20) DEFAULT 'PENDING',
    message VARCHAR(500),
    response_data JSONB,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    executed_at TIMESTAMP,
    responded_at TIMESTAMP,
    duration BIGINT,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (vin) REFERENCES vehicles(vin)
);

CREATE TABLE control_logs (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    account_id VARCHAR(32),
    account_name VARCHAR(100),
    control_type VARCHAR(30) NOT NULL,
    command_id VARCHAR(32),
    status VARCHAR(20) NOT NULL,
    request_params TEXT,
    response_data TEXT,
    error_message TEXT,
    client_ip VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (vin) REFERENCES vehicles(vin)
);

CREATE TABLE control_permissions (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    account_id VARCHAR(32) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    control_type VARCHAR(30) NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by VARCHAR(50),
    expire_at TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (vin) REFERENCES vehicles(vin),
    UNIQUE(account_id, vin, control_type)
);

CREATE INDEX idx_commands_vin ON control_commands(vin);
CREATE INDEX idx_commands_status ON control_commands(status);
CREATE INDEX idx_logs_vin ON control_logs(vin);
CREATE INDEX idx_logs_time ON control_logs(created_at);
CREATE INDEX idx_permissions_account ON control_permissions(account_id);
```

### 2.5 控制执行实现

```java
@Service
public class RemoteControlServiceImpl implements RemoteControlService {
    
    @Autowired
    private ControlPermissionService permissionService;
    
    @Autowired
    private VehicleAccessService vehicleAccessService;
    
    @Autowired
    private MqttClient mqttClient;
    
    @Autowired
    private ControlLogService logService;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final Duration COMMAND_TIMEOUT = Duration.ofSeconds(30);
    
    @Override
    public ControlResult execute(String vin, ControlCommand command) {
        validateCommand(vin, command);
        
        String commandId = generateCommandId();
        command.setId(commandId);
        
        OnlineStatus status = vehicleAccessService.getOnlineStatus(vin);
        if (status != OnlineStatus.ONLINE) {
            return ControlResult.builder()
                .commandId(commandId)
                .vin(vin)
                .type(command.getType())
                .status(ControlStatus.FAILED)
                .message("Vehicle is offline")
                .build();
        }
        
        String responseKey = "control:response:" + commandId;
        CountDownLatch latch = new CountDownLatch(1);
        AtomicReference<ControlResult> resultRef = new AtomicReference<>();
        
        redisTemplate.opsForValue().set(responseKey, latch, COMMAND_TIMEOUT);
        
        sendCommand(vin, command);
        
        try {
            boolean completed = latch.await(COMMAND_TIMEOUT.toMillis(), TimeUnit.MILLISECONDS);
            if (!completed) {
                return ControlResult.builder()
                    .commandId(commandId)
                    .vin(vin)
                    .type(command.getType())
                    .status(ControlStatus.TIMEOUT)
                    .message("Command execution timeout")
                    .build();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return ControlResult.builder()
                .commandId(commandId)
                .vin(vin)
                .type(command.getType())
                .status(ControlStatus.FAILED)
                .message("Command interrupted")
                .build();
        }
        
        return resultRef.get();
    }
    
    @Override
    public ControlResult executeAsync(String vin, ControlCommand command) {
        validateCommand(vin, command);
        
        String commandId = generateCommandId();
        command.setId(commandId);
        
        OnlineStatus status = vehicleAccessService.getOnlineStatus(vin);
        if (status != OnlineStatus.ONLINE) {
            return ControlResult.builder()
                .commandId(commandId)
                .vin(vin)
                .type(command.getType())
                .status(ControlStatus.FAILED)
                .message("Vehicle is offline")
                .build();
        }
        
        sendCommand(vin, command);
        
        return ControlResult.builder()
            .commandId(commandId)
            .vin(vin)
            .type(command.getType())
            .status(ControlStatus.SENT)
            .message("Command sent successfully")
            .build();
    }
    
    private void validateCommand(String vin, ControlCommand command) {
        String accountId = TenantContextManager.getCurrentAccountId();
        
        if (!permissionService.hasPermission(accountId, vin, command.getType())) {
            throw new ControlPermissionException("No permission to execute this control");
        }
        
        checkRateLimit(accountId, vin);
    }
    
    private void checkRateLimit(String accountId, String vin) {
        String key = "control:rate:" + accountId + ":" + vin;
        Long count = redisTemplate.opsForValue().increment(key);
        
        if (count != null && count == 1) {
            redisTemplate.expire(key, Duration.ofMinutes(1));
        }
        
        if (count != null && count > 10) {
            throw new ControlRateLimitException("Rate limit exceeded");
        }
    }
    
    private void sendCommand(String vin, ControlCommand command) {
        String topic = "vehicle/" + vin + "/command";
        
        Map<String, Object> payload = new HashMap<>();
        payload.put("commandId", command.getId());
        payload.put("type", command.getType().name());
        payload.put("parameters", command.getParameters());
        payload.put("timestamp", System.currentTimeMillis());
        
        mqttClient.publish(topic, JSON.toJSONString(payload).getBytes());
        
        logControl(command);
    }
    
    public void handleResponse(String vin, String commandId, ControlStatus status, 
                               String message, Map<String, Object> data) {
        String responseKey = "control:response:" + commandId;
        CountDownLatch latch = (CountDownLatch) redisTemplate.opsForValue().get(responseKey);
        
        if (latch != null) {
            ControlResult result = ControlResult.builder()
                .commandId(commandId)
                .vin(vin)
                .status(status)
                .message(message)
                .responseData(data)
                .respondedAt(LocalDateTime.now())
                .build();
            
            latch.countDown();
            redisTemplate.delete(responseKey);
        }
        
        updateCommandStatus(commandId, status, message, data);
    }
    
    private void logControl(ControlCommand command) {
        ControlLog log = ControlLog.builder()
            .tenantId(TenantContextManager.getCurrentTenantId())
            .vin(command.getVin())
            .accountId(TenantContextManager.getCurrentAccountId())
            .accountName(TenantContextManager.getCurrentAccountName())
            .controlType(command.getType())
            .commandId(command.getId())
            .status(ControlStatus.SENT)
            .requestParams(JSON.toJSONString(command.getParameters()))
            .clientIp(TenantContextManager.getClientIp())
            .build();
        
        logService.log(log);
    }
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/control/door/unlock | 解锁车门 |
| POST | /api/control/door/lock | 锁定车门 |
| POST | /api/control/horn | 远程鸣笛 |
| POST | /api/control/horn/flash | 鸣笛闪灯 |
| POST | /api/control/vehicle/start | 远程启动 |
| POST | /api/control/vehicle/stop | 远程停止 |
| POST | /api/control/parameter | 设置参数 |
| GET | /api/control/result/{commandId} | 获取控制结果 |
| GET | /api/control/log | 查询控制日志 |
| POST | /api/control/permission | 授权控制权限 |
| DELETE | /api/control/permission | 撤销控制权限 |

### 3.2 API示例

```json
POST /api/control/door/unlock
{
    "vin": "LDA1234567890ABCD",
    "doorType": "ALL"
}

Response:
{
    "code": 200,
    "message": "Command sent successfully",
    "data": {
        "commandId": "CMD001",
        "vin": "LDA1234567890ABCD",
        "type": "DOOR_UNLOCK",
        "status": "SUCCESS",
        "message": "All doors unlocked",
        "executedAt": "2026-03-17T10:30:00Z"
    }
}

POST /api/control/horn
{
    "vin": "LDA1234567890ABCD",
    "duration": 3
}

Response:
{
    "code": 200,
    "message": "Command sent successfully",
    "data": {
        "commandId": "CMD002",
        "vin": "LDA1234567890ABCD",
        "type": "HORN",
        "status": "SUCCESS"
    }
}

POST /api/control/parameter
{
    "vin": "LDA1234567890ABCD",
    "parameterKey": "maxSpeed",
    "value": 30
}

Response:
{
    "code": 200,
    "message": "Parameter set successfully",
    "data": {
        "commandId": "CMD003",
        "vin": "LDA1234567890ABCD",
        "type": "PARAMETER_SET",
        "status": "SUCCESS"
    }
}
```

## 4. 配置项

```yaml
remote-control:
  enabled: true
  command:
    timeout-seconds: 30
    max-retry: 3
  rate-limit:
    enabled: true
    max-per-minute: 10
  permission:
    enabled: true
    default-expire-hours: 24
  log:
    retention-days: 90
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testDoorUnlock | 测试车门解锁 | 解锁成功 |
| testDoorLock | 测试车门锁定 | 锁定成功 |
| testHorn | 测试远程鸣笛 | 鸣笛成功 |
| testPermissionCheck | 测试权限检查 | 权限校验正确 |
| testRateLimit | 测试频率限制 | 限制生效 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testFullControlFlow | 测试完整控制流程 | 控制执行正常 |
| testOfflineVehicle | 测试离线车辆控制 | 返回离线错误 |
| testTimeout | 测试超时处理 | 超时处理正确 |

## 6. 依赖关系

```yaml
dependencies:
  - name: plugin-framework
    version: ">=1.0.0"
  - name: common-core
    version: ">=1.0.0"
  - name: tenant-service
    version: ">=1.0.0"
  - name: vehicle-access
    version: ">=1.0.0"
  - name: role-service
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

## 8. 监控指标

| 指标名 | 类型 | 描述 |
|-------|------|------|
| control_commands_total | Counter | 控制命令总数 |
| control_commands_success | Counter | 成功命令数 |
| control_commands_failed | Counter | 失败命令数 |
| control_commands_timeout | Counter | 超时命令数 |
| control_latency | Histogram | 控制延迟 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
