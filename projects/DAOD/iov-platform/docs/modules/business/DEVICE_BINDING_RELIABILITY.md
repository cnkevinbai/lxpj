# 设备绑定可靠性设计文档

**版本**: 1.0.0  
**最后更新**: 2026-03-26  
**维护者**: 渔晓白

---

## 1. 概述

本文档详细描述 **JT/T 808、MQTT、HTTP** 三种协议在设备绑定过程中的可靠性保证机制。设备绑定是车联网平台的核心环节，其可靠性直接影响到车辆数据的采集、监控和控制能力。

### 1.1 设计目标

| 目标 | 描述 |
|------|------|
| **高可靠性** | 设备绑定成功率 > 99.9% |
| **数据一致性** | 设备-车辆绑定关系强一致 |
| **故障恢复** | 异常情况下自动恢复绑定状态 |
| **实时感知** | 绑定状态变更实时通知 |
| **可追溯** | 绑定操作全流程可审计 |

### 1.2 三种协议对比

| 特性 | JT/T 808 | MQTT | HTTP |
|------|----------|------|------|
| **连接方式** | TCP 长连接 | TCP 长连接 | HTTP 短连接 |
| **实时性** | 高 (秒级) | 高 (秒级) | 低 (轮询/分钟级) |
| **穿透性** | 一般 (需固定端口) | 一般 (需固定端口) | 好 (标准 80/443) |
| **资源消耗** | 中等 | 低 | 高 (频繁建连) |
| **适用设备** | 车载终端 (合规设备) | IoT 设备 | 轻量设备/第三方 |
| **绑定触发** | 终端注册/鉴权时 | 连接认证时 | 主动上报时 |
| **可靠性机制** | 鉴权码验证 + 重连重试 | Token 认证 + 遗嘱消息 | 签名验证 + 幂等设计 |

---

## 2. 设备绑定核心流程

### 2.1 整体流程架构

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          设备绑定可靠性架构                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   设备终端      │
                              └────────┬────────┘
                                       │
           ┌───────────────────────────┼───────────────────────────┐
           │                           │                           │
           ▼                           ▼                           ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│   JT/T 808 适配器   │   │    MQTT 适配器      │   │    HTTP 适配器      │
│  (jtt808-adapter)   │   │  (mqtt-adapter)     │   │  (http-adapter)     │
└──────────┬──────────┘   └──────────┬──────────┘   └──────────┬──────────┘
           │                           │                           │
           │ 1. 终端注册 (0x0100)     │ 1. 连接认证              │ 1. 数据上报
           │ 2. 终端鉴权 (0x0102)     │ 2. Token 验证            │ 2. 签名验证
           │ 3. 设备-VIN 映射         │ 3. 设备影子同步          │ 3. 幂等处理
           │                           │                           │
           └───────────────────────────┼───────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         车辆接入服务 (vehicle-access)                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      VehicleRegisterService                              │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ bindDevice  │ │unbindDevice │ │getByDeviceId│ │ syncBinding │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              数据持久层                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ device_bindings │  │ binding_events  │  │ device_shadows  │               │
│  │   (绑定关系)     │  │   (事件日志)     │  │   (设备影子)     │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 绑定状态模型

```java
/**
 * 设备绑定状态
 */
public enum BindingStatus {
    
    /** 待确认 - 设备发起绑定请求，等待平台确认 */
    PENDING,
    
    /** 已绑定 - 绑定关系建立成功 */
    BOUND,
    
    /** 已解绑 - 绑定关系已解除 */
    UNBOUND,
    
    /** 已过期 - 绑定关系超时失效 */
    EXPIRED,
    
    /** 异常 - 绑定过程中出现异常 */
    ERROR
}

/**
 * 设备绑定信息
 */
@Data
public class DeviceBinding {
    
    /** 绑定 ID */
    private String bindingId;
    
    /** 设备序列号 */
    private String deviceId;
    
    /** 车辆识别码 */
    private String vin;
    
    /** 绑定状态 */
    private BindingStatus status;
    
    /** 绑定协议 */
    private ProtocolType protocol;  // JTT808, MQTT, HTTP
    
    /** 绑定时间 */
    private LocalDateTime bindTime;
    
    /** 最后确认时间 */
    private LocalDateTime lastConfirmTime;
    
    /** 过期时间 */
    private LocalDateTime expireTime;
    
    /** 租户 ID */
    private String tenantId;
    
    /** 扩展信息 */
    private Map<String, String> attributes;
}

/**
 * 绑定事件
 */
@Data
public class BindingEvent {
    
    /** 事件 ID */
    private String eventId;
    
    /** 绑定 ID */
    private String bindingId;
    
    /** 事件类型 */
    private BindingEventType eventType;
    
    /** 事件时间 */
    private LocalDateTime eventTime;
    
    /** 协议类型 */
    private ProtocolType protocol;
    
    /** 操作结果 */
    private boolean success;
    
    /** 错误信息 */
    private String errorMessage;
    
    /** 重试次数 */
    private int retryCount;
}

public enum BindingEventType {
    BIND_REQUEST,      // 绑定请求
    BIND_SUCCESS,      // 绑定成功
    BIND_FAILURE,      // 绑定失败
    UNBIND_REQUEST,    // 解绑请求
    UNBIND_SUCCESS,    // 解绑成功
    BIND_RECOVERED,    // 绑定恢复
    BIND_EXPIRED       // 绑定过期
}
```

---

## 3. JT/T 808 协议绑定可靠性

### 3.1 绑定流程

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      JT/T 808 设备绑定流程                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

设备终端                                    平台服务
   │                                           │
   │  1. 终端注册 (0x0100)                     │
   │  ──────────────────────────────────────▶  │
   │  包含: 省域ID, 市域ID, 制造商ID,          │
   │        终端型号, 终端ID, 车牌颜色          │
   │                                           │
   │                     2. 验证终端信息        │
   │                     ◀─────────────────    │
   │                                           │
   │  3. 注册应答 (0x8100)                     │
   │  ◀──────────────────────────────────────  │
   │  包含: 结果, 鉴权码                        │
   │                                           │
   │  4. 终端鉴权 (0x0102)                     │
   │  ──────────────────────────────────────▶  │
   │  包含: 鉴权码                              │
   │                                           │
   │                     5. 验证鉴权码          │
   │                     建立设备-VIN 映射      │
   │                     ◀─────────────────    │
   │                                           │
   │  6. 平台通用应答 (0x8001)                 │
   │  ◀──────────────────────────────────────  │
   │  结果: 成功/失败                           │
   │                                           │
   │  ───────────────────────────────────────  │
   │  7. 绑定关系建立成功                       │
   │                                           │
```

### 3.2 可靠性保证机制

#### 3.2.1 鉴权码验证

```java
/**
 * JT/T 808 鉴权服务
 */
@Service
public class Jtt808AuthService {
    
    /** 鉴权码缓存 (设备ID -> 鉴权码) */
    private final RedisTemplate<String, String> authCodeCache;
    
    /** 鉴权码有效期 (默认 24 小时) */
    private static final Duration AUTH_CODE_TTL = Duration.ofHours(24);
    
    /**
     * 处理终端注册
     */
    public Jtt808RegisterResponse handleRegister(Jtt808RegisterData data) {
        
        // 1. 验证终端信息
        if (!validateTerminalInfo(data)) {
            return Jtt808RegisterResponse.failed("终端信息验证失败");
        }
        
        // 2. 查询或创建车辆绑定
        DeviceBinding binding = bindingService.getByDeviceId(data.getTerminalId());
        
        if (binding == null) {
            // 新设备，创建待确认绑定
            binding = bindingService.createPendingBinding(
                data.getTerminalId(),
                data.getVin(),
                ProtocolType.JTT808
            );
        }
        
        // 3. 生成鉴权码
        String authCode = generateAuthCode(data.getTerminalId());
        
        // 4. 缓存鉴权码
        String cacheKey = "jtt808:auth:" + data.getTerminalId();
        authCodeCache.opsForValue().set(cacheKey, authCode, AUTH_CODE_TTL);
        
        // 5. 记录事件
        eventService.recordEvent(BindingEvent.bindRequest(binding.getBindingId()));
        
        return Jtt808RegisterResponse.success(authCode);
    }
    
    /**
     * 处理终端鉴权
     */
    public Jtt808AuthResult handleAuth(String terminalId, String authCode) {
        
        // 1. 验证鉴权码
        String cacheKey = "jtt808:auth:" + terminalId;
        String expectedCode = authCodeCache.opsForValue().get(cacheKey);
        
        if (expectedCode == null) {
            return Jtt808AuthResult.failed("鉴权码已过期，请重新注册");
        }
        
        if (!expectedCode.equals(authCode)) {
            return Jtt808AuthResult.failed("鉴权码不正确");
        }
        
        // 2. 获取绑定信息
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding == null) {
            return Jtt808AuthResult.failed("设备未注册");
        }
        
        // 3. 确认绑定
        binding = bindingService.confirmBinding(binding.getBindingId());
        
        // 4. 删除鉴权码
        authCodeCache.delete(cacheKey);
        
        // 5. 记录事件
        eventService.recordEvent(BindingEvent.bindSuccess(binding.getBindingId()));
        
        return Jtt808AuthResult.success(binding.getVin());
    }
    
    /**
     * 生成鉴权码
     */
    private String generateAuthCode(String terminalId) {
        // 格式: 时间戳(8位) + 随机数(8位) + 校验位(4位)
        String timestamp = String.valueOf(System.currentTimeMillis() / 1000);
        String random = UUID.randomUUID().toString().substring(0, 8);
        String checksum = DigestUtils.md5Hex(terminalId + timestamp + random).substring(0, 4);
        return timestamp + random + checksum;
    }
}
```

#### 3.2.2 重连重试机制

```java
/**
 * JT/T 808 连接管理器
 */
@Service
public class Jtt808ConnectionManager {
    
    /** 设备连接映射 */
    private final Map<String, Channel> connectionMap = new ConcurrentHashMap<>();
    
    /** 设备会话信息 */
    private final Map<String, DeviceSession> sessionMap = new ConcurrentHashMap<>();
    
    /** 最大重试次数 */
    private static final int MAX_RETRY_COUNT = 3;
    
    /** 重试间隔 */
    private static final Duration RETRY_INTERVAL = Duration.ofSeconds(5);
    
    /**
     * 设备断线处理
     */
    public void handleDisconnect(Channel channel) {
        
        // 1. 查找设备 ID
        String terminalId = findDeviceId(channel);
        if (terminalId == null) {
            return;
        }
        
        // 2. 移除连接
        connectionMap.remove(terminalId);
        
        // 3. 更新会话状态
        DeviceSession session = sessionMap.get(terminalId);
        if (session != null) {
            session.setStatus(SessionStatus.DISCONNECTED);
            session.setDisconnectTime(LocalDateTime.now());
        }
        
        // 4. 通知绑定服务
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        if (binding != null && binding.getStatus() == BindingStatus.BOUND) {
            // 标记为待恢复状态，不立即解绑
            bindingService.markPendingRecover(binding.getBindingId());
        }
        
        log.info("设备断开连接: terminalId={}", terminalId);
    }
    
    /**
     * 设备重连处理
     */
    public void handleReconnect(String terminalId, Channel channel) {
        
        // 1. 检查是否是重连
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding != null && binding.getStatus() == BindingStatus.PENDING_RECOVER) {
            // 恢复绑定
            bindingService.recoverBinding(binding.getBindingId());
            log.info("设备重连恢复绑定: terminalId={}", terminalId);
        }
        
        // 2. 更新连接映射
        connectionMap.put(terminalId, channel);
        
        // 3. 创建/更新会话
        DeviceSession session = sessionMap.computeIfAbsent(terminalId, id -> new DeviceSession(id));
        session.setStatus(SessionStatus.CONNECTED);
        session.setConnectTime(LocalDateTime.now());
        session.setChannel(channel);
    }
    
    /**
     * 定期检查超时设备
     */
    @Scheduled(fixedRate = 60000)
    public void checkTimeoutDevices() {
        
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(30);
        
        for (DeviceSession session : sessionMap.values()) {
            if (session.getStatus() == SessionStatus.DISCONNECTED 
                && session.getDisconnectTime().isBefore(threshold)) {
                
                // 超时未重连，标记绑定过期
                DeviceBinding binding = bindingService.getByDeviceId(session.getTerminalId());
                if (binding != null) {
                    bindingService.expireBinding(binding.getBindingId());
                    log.warn("设备超时未重连，绑定已过期: terminalId={}", session.getTerminalId());
                }
            }
        }
    }
}
```

#### 3.2.3 绑定数据持久化

```sql
-- 设备绑定表
CREATE TABLE device_bindings (
    binding_id VARCHAR(32) PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    protocol VARCHAR(20) NOT NULL,
    bind_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_confirm_time TIMESTAMP,
    expire_time TIMESTAMP,
    attributes JSONB,
    
    -- 唯一约束
    UNIQUE(device_id),
    UNIQUE(vin, protocol),
    
    -- 索引
    INDEX idx_device_bindings_device (device_id),
    INDEX idx_device_bindings_vin (vin),
    INDEX idx_device_bindings_status (status),
    INDEX idx_device_bindings_tenant (tenant_id)
);

-- 绑定事件日志表
CREATE TABLE binding_events (
    event_id VARCHAR(32) PRIMARY KEY,
    binding_id VARCHAR(32) NOT NULL,
    event_type VARCHAR(30) NOT NULL,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    protocol VARCHAR(20) NOT NULL,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    
    FOREIGN KEY (binding_id) REFERENCES device_bindings(binding_id),
    INDEX idx_binding_events_binding (binding_id),
    INDEX idx_binding_events_time (event_time)
);
```

---

## 4. MQTT 协议绑定可靠性

### 4.1 绑定流程

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        MQTT 设备绑定流程                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

设备终端                                    平台服务
   │                                           │
   │  1. MQTT CONNECT                          │
   │  ──────────────────────────────────────▶  │
   │  ClientId: terminal_{序列号}              │
   │  Username: {租户ID}                       │
   │  Password: {Token/签名}                   │
   │  CleanSession: false                      │
   │  Will Topic: device/{id}/status          │
   │  Will Message: {"status":"offline"}      │
   │                                           │
   │                     2. EMQX Webhook       │
   │                     ◀─────────────────    │
   │                                           │
   │                     3. 验证 Token         │
   │                     查询/创建绑定         │
   │                     ◀─────────────────    │
   │                                           │
   │  4. CONNACK                               │
   │  ◀──────────────────────────────────────  │
   │  Return Code: 0 (成功)                    │
   │                                           │
   │  5. 订阅状态主题                          │
   │  ◀─────────────────────────────────────▶  │
   │  Topic: device/{id}/status/set           │
   │                                           │
   │  6. 发布在线状态                          │
   │  ──────────────────────────────────────▶  │
   │  Topic: device/{id}/status               │
   │  Message: {"status":"online"}            │
   │                                           │
   │  ───────────────────────────────────────  │
   │  7. 绑定关系建立成功                       │
   │                                           │
```

### 4.2 可靠性保证机制

#### 4.2.1 Token 认证与设备影子

```java
/**
 * MQTT 设备认证处理器
 */
@Service
public class MqttDeviceAuthHandler implements DeviceAuthHandler {
    
    @Autowired
    private BindingService bindingService;
    
    @Autowired
    private DeviceShadowService shadowService;
    
    @Autowired
    private EventService eventService;
    
    /**
     * 处理设备认证
     */
    @Override
    public DeviceAuthResult handleAuth(DeviceAuthRequest request) {
        
        String clientId = request.getClientId();
        String token = request.getPassword();
        
        // 1. 解析客户端 ID
        if (!clientId.startsWith("terminal_")) {
            return DeviceAuthResult.failed("无效的客户端ID格式");
        }
        
        String terminalId = clientId.substring(9);  // 去掉 "terminal_" 前缀
        
        // 2. 验证 Token
        TokenInfo tokenInfo = tokenService.verifyToken(token);
        
        if (tokenInfo == null || tokenInfo.isExpired()) {
            return DeviceAuthResult.failed("Token无效或已过期");
        }
        
        // 3. 获取或创建绑定
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding == null) {
            // 根据 Token 中的 VIN 创建绑定
            String vin = tokenInfo.getVin();
            if (vin == null) {
                return DeviceAuthResult.failed("Token中缺少VIN信息");
            }
            
            binding = bindingService.createBinding(
                terminalId, 
                vin, 
                ProtocolType.MQTT,
                tokenInfo.getTenantId()
            );
        } else if (binding.getStatus() == BindingStatus.UNBOUND) {
            // 重新绑定
            binding = bindingService.rebind(binding.getBindingId());
        }
        
        // 4. 确认绑定
        binding = bindingService.confirmBinding(binding.getBindingId());
        
        // 5. 创建/更新设备影子
        DeviceShadow shadow = shadowService.getOrCreate(terminalId);
        shadow.setConnected(true);
        shadow.setConnectTime(LocalDateTime.now());
        shadow.setProtocol(ProtocolType.MQTT);
        shadow.setDeviceModel(request.getDeviceModel());
        shadow.setFirmwareVersion(request.getFirmwareVersion());
        shadowService.save(shadow);
        
        // 6. 记录事件
        eventService.recordEvent(BindingEvent.bindSuccess(binding.getBindingId()));
        
        return DeviceAuthResult.success(terminalId, binding.getVin());
    }
    
    /**
     * 设备连接成功回调
     */
    @Override
    public void onDeviceConnected(String clientId, String terminalId) {
        
        // 1. 更新绑定状态
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        if (binding != null) {
            bindingService.updateLastConfirmTime(binding.getBindingId());
        }
        
        // 2. 更新设备影子
        DeviceShadow shadow = shadowService.getByDeviceId(terminalId);
        if (shadow != null) {
            shadow.setConnected(true);
            shadow.setConnectTime(LocalDateTime.now());
            shadowService.save(shadow);
        }
        
        log.info("MQTT 设备连接成功: terminalId={}", terminalId);
    }
    
    /**
     * 设备断开连接回调
     */
    @Override
    public void onDeviceDisconnected(String clientId, String terminalId) {
        
        // 1. 更新设备影子
        DeviceShadow shadow = shadowService.getByDeviceId(terminalId);
        if (shadow != null) {
            shadow.setConnected(false);
            shadow.setDisconnectTime(LocalDateTime.now());
            shadowService.save(shadow);
        }
        
        // 2. 发布离线状态 (通过遗嘱消息自动处理)
        
        log.info("MQTT 设备断开连接: terminalId={}", terminalId);
    }
}
```

#### 4.2.2 遗嘱消息机制

```java
/**
 * MQTT 遗嘱消息配置
 */
@Configuration
public class MqttWillMessageConfig {
    
    /**
     * 配置遗嘱消息
     */
    public MqttWillOptions configureWillMessage(String terminalId) {
        
        return MqttWillOptions.builder()
            .topic("device/" + terminalId + "/status")
            .qos(1)  // 至少一次
            .retained(true)  // 保留消息
            .message(JsonUtils.toJson(Map.of(
                "status", "offline",
                "timestamp", System.currentTimeMillis(),
                "terminalId", terminalId
            )))
            .build();
    }
}

/**
 * 遗嘱消息处理器
 */
@Service
public class WillMessageHandler {
    
    /**
     * 处理遗嘱消息
     */
    public void handleWillMessage(String terminalId, String message) {
        
        DeviceStatusMessage status = JsonUtils.fromJson(message, DeviceStatusMessage.class);
        
        if ("offline".equals(status.getStatus())) {
            // 1. 更新设备影子
            DeviceShadow shadow = shadowService.getByDeviceId(terminalId);
            if (shadow != null) {
                shadow.setConnected(false);
                shadow.setDisconnectTime(LocalDateTime.now());
                shadowService.save(shadow);
            }
            
            // 2. 更新车辆在线状态
            DeviceBinding binding = bindingService.getByDeviceId(terminalId);
            if (binding != null) {
                vehicleService.updateOnlineStatus(binding.getVin(), OnlineStatus.OFFLINE);
            }
            
            log.info("设备离线 (遗嘱消息): terminalId={}", terminalId);
        }
    }
}
```

#### 4.2.3 设备影子同步

```java
/**
 * 设备影子服务
 */
@Service
public class DeviceShadowService {
    
    @Autowired
    private RedisTemplate<String, DeviceShadow> redisTemplate;
    
    private static final String SHADOW_KEY_PREFIX = "device:shadow:";
    private static final Duration SHADOW_TTL = Duration.ofDays(7);
    
    /**
     * 获取或创建设备影子
     */
    public DeviceShadow getOrCreate(String terminalId) {
        String key = SHADOW_KEY_PREFIX + terminalId;
        DeviceShadow shadow = redisTemplate.opsForValue().get(key);
        
        if (shadow == null) {
            shadow = new DeviceShadow();
            shadow.setTerminalId(terminalId);
            shadow.setConnected(false);
            shadow.setCreatedAt(LocalDateTime.now());
        }
        
        return shadow;
    }
    
    /**
     * 保存设备影子
     */
    public void save(DeviceShadow shadow) {
        String key = SHADOW_KEY_PREFIX + shadow.getTerminalId();
        shadow.setUpdatedAt(LocalDateTime.now());
        redisTemplate.opsForValue().set(key, shadow, SHADOW_TTL);
    }
    
    /**
     * 更新影子状态
     */
    public void updateState(String terminalId, Map<String, Object> reported) {
        DeviceShadow shadow = getOrCreate(terminalId);
        
        // 合并 reported 状态
        if (shadow.getReported() == null) {
            shadow.setReported(new HashMap<>());
        }
        shadow.getReported().putAll(reported);
        shadow.setReportedVersion(shadow.getReportedVersion() + 1);
        shadow.setLastReportTime(LocalDateTime.now());
        
        save(shadow);
        
        // 发布影子更新事件
        publishShadowUpdate(terminalId, shadow);
    }
    
    /**
     * 同步期望状态到设备
     */
    public void syncDesiredState(String terminalId, Map<String, Object> desired) {
        DeviceShadow shadow = getOrCreate(terminalId);
        
        // 设置 desired 状态
        shadow.setDesired(desired);
        shadow.setDesiredVersion(shadow.getDesiredVersion() + 1);
        
        save(shadow);
        
        // 发布到设备
        if (shadow.isConnected()) {
            mqttClient.publish(
                "device/" + terminalId + "/desired",
                JsonUtils.toJson(Map.of(
                    "state", Map.of("desired", desired),
                    "version", shadow.getDesiredVersion()
                )),
                1
            );
        }
    }
}

/**
 * 设备影子数据结构
 */
@Data
public class DeviceShadow {
    
    /** 终端 ID */
    private String terminalId;
    
    /** 是否连接 */
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
    
    /** 最后上报时间 */
    private LocalDateTime lastReportTime;
    
    /** 创建时间 */
    private LocalDateTime createdAt;
    
    /** 更新时间 */
    private LocalDateTime updatedAt;
}
```

---

## 5. HTTP 协议绑定可靠性

### 5.1 绑定流程

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        HTTP 设备绑定流程                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

设备终端                                    平台服务
   │                                           │
   │  1. POST /api/v1/terminal/{id}/register   │
   │  ──────────────────────────────────────▶  │
   │  Headers:                                 │
   │    X-Terminal-Id: {序列号}                │
   │    X-Timestamp: {时间戳}                  │
   │    X-Signature: {签名}                    │
   │  Body:                                    │
   │    { "vin": "LDA...", "model": "..." }   │
   │                                           │
   │                     2. 验证签名            │
   │                     检查时间戳防重放       │
   │                     ◀─────────────────    │
   │                                           │
   │                     3. 创建/确认绑定       │
   │                     ◀─────────────────    │
   │                                           │
   │  4. Response                              │
   │  ◀──────────────────────────────────────  │
   │  { "success": true, "bindingId": "..." } │
   │                                           │
   │  ───────────────────────────────────────  │
   │  5. 绑定关系建立成功                       │
   │                                           │
   │  6. 后续: 心跳/数据上报维持绑定            │
   │  ──────────────────────────────────────▶  │
   │                                           │
```

### 5.2 可靠性保证机制

#### 5.2.1 签名验证与幂等设计

```java
/**
 * HTTP 设备认证过滤器
 */
@Component
public class HttpDeviceAuthFilter implements Filter {
    
    @Value("${http-adapter.secret-key}")
    private String secretKey;
    
    /** 请求时间戳有效期 (5分钟) */
    private static final Duration TIMESTAMP_VALIDITY = Duration.ofMinutes(5);
    
    /** 已处理请求缓存 (防重放) */
    private final Cache<String, Boolean> processedRequests = 
        Caffeine.newBuilder()
            .expireAfterWrite(TIMESTAMP_VALIDITY)
            .maximumSize(10000)
            .build();
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) 
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        
        // 1. 提取认证信息
        String terminalId = httpRequest.getHeader("X-Terminal-Id");
        String timestamp = httpRequest.getHeader("X-Timestamp");
        String signature = httpRequest.getHeader("X-Signature");
        String nonce = httpRequest.getHeader("X-Nonce");
        
        if (StringUtils.isAnyBlank(terminalId, timestamp, signature)) {
            sendError(response, 401, "缺少认证信息");
            return;
        }
        
        // 2. 验证时间戳 (防重放)
        long requestTime = Long.parseLong(timestamp);
        long currentTime = System.currentTimeMillis();
        
        if (Math.abs(currentTime - requestTime) > TIMESTAMP_VALIDITY.toMillis()) {
            sendError(response, 401, "请求已过期");
            return;
        }
        
        // 3. 验证 Nonce (防重放)
        String nonceKey = terminalId + ":" + nonce;
        if (processedRequests.getIfPresent(nonceKey) != null) {
            sendError(response, 401, "重复请求");
            return;
        }
        processedRequests.put(nonceKey, true);
        
        // 4. 验证签名
        String expectedSignature = calculateSignature(terminalId, timestamp, nonce);
        
        if (!expectedSignature.equals(signature)) {
            sendError(response, 401, "签名验证失败");
            return;
        }
        
        // 5. 设置终端信息到请求属性
        request.setAttribute("terminalId", terminalId);
        
        chain.doFilter(request, response);
    }
    
    /**
     * 计算签名
     * 
     * 签名算法: HMAC-SHA256(secretKey, terminalId + timestamp + nonce)
     */
    private String calculateSignature(String terminalId, String timestamp, String nonce) {
        String data = terminalId + timestamp + nonce;
        return HmacUtils.hmacSha256Hex(secretKey, data);
    }
}

/**
 * HTTP 设备绑定控制器
 */
@RestController
@RequestMapping("/api/v1/terminal")
public class HttpDeviceBindingController {
    
    @Autowired
    private BindingService bindingService;
    
    @Autowired
    private DeviceShadowService shadowService;
    
    /**
     * 设备注册/绑定
     * 
     * 幂等设计: 同一终端重复注册返回已存在的绑定信息
     */
    @PostMapping("/{terminalId}/register")
    public ResponseEntity<ApiResponse<BindingResponse>> register(
            @PathVariable String terminalId,
            @RequestBody RegisterRequest request) {
        
        // 1. 幂等检查
        DeviceBinding existingBinding = bindingService.getByDeviceId(terminalId);
        
        if (existingBinding != null) {
            // 已存在绑定，返回现有信息
            if (existingBinding.getVin().equals(request.getVin())) {
                // 更新最后确认时间
                bindingService.updateLastConfirmTime(existingBinding.getBindingId());
                
                return ResponseEntity.ok(ApiResponse.success(BindingResponse.from(existingBinding)));
            } else {
                // VIN 不一致，返回错误
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("设备已绑定到其他车辆"));
            }
        }
        
        // 2. 检查 VIN 是否已绑定其他设备
        DeviceBinding vinBinding = bindingService.getByVin(request.getVin());
        if (vinBinding != null && vinBinding.getStatus() == BindingStatus.BOUND) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("车辆已绑定其他设备"));
        }
        
        // 3. 创建绑定
        DeviceBinding binding = bindingService.createBinding(
            terminalId,
            request.getVin(),
            ProtocolType.HTTP,
            request.getTenantId()
        );
        
        // 4. 立即确认 (HTTP 无状态，注册即确认)
        binding = bindingService.confirmBinding(binding.getBindingId());
        
        // 5. 创建设备影子
        DeviceShadow shadow = shadowService.getOrCreate(terminalId);
        shadow.setProtocol(ProtocolType.HTTP);
        shadow.setDeviceModel(request.getDeviceModel());
        shadow.setFirmwareVersion(request.getFirmwareVersion());
        shadowService.save(shadow);
        
        return ResponseEntity.ok(ApiResponse.success(BindingResponse.from(binding)));
    }
    
    /**
     * 数据上报 (心跳)
     * 
     * 用于维持绑定状态
     */
    @PostMapping("/{terminalId}/data")
    public ResponseEntity<ApiResponse<DataReportResponse>> reportData(
            @PathVariable String terminalId,
            @RequestBody DataReportRequest request) {
        
        // 1. 验证绑定状态
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (binding == null || binding.getStatus() != BindingStatus.BOUND) {
            return ResponseEntity.status(403)
                .body(ApiResponse.error("设备未绑定"));
        }
        
        // 2. 更新最后确认时间
        bindingService.updateLastConfirmTime(binding.getBindingId());
        
        // 3. 更新设备影子
        DeviceShadow shadow = shadowService.getByDeviceId(terminalId);
        if (shadow != null) {
            shadow.setLastReportTime(LocalDateTime.now());
            shadowService.save(shadow);
        }
        
        // 4. 处理数据 (上报到监控服务)
        monitorService.processData(terminalId, binding.getVin(), request);
        
        // 5. 返回待处理指令
        List<PendingCommand> commands = commandService.getPendingCommands(terminalId);
        
        return ResponseEntity.ok(ApiResponse.success(DataReportResponse.builder()
            .success(true)
            .pendingCommands(commands.size())
            .commands(commands)
            .build()));
    }
}
```

#### 5.2.2 心跳检测与绑定保活

```java
/**
 * HTTP 设备心跳检测服务
 */
@Service
public class HttpHeartbeatService {
    
    /** HTTP 设备心跳超时时间 (10分钟) */
    private static final Duration HEARTBEAT_TIMEOUT = Duration.ofMinutes(10);
    
    @Autowired
    private BindingService bindingService;
    
    @Autowired
    private DeviceShadowService shadowService;
    
    /**
     * 定期检查超时设备
     */
    @Scheduled(fixedRate = 60000)
    public void checkTimeoutDevices() {
        
        LocalDateTime threshold = LocalDateTime.now().minus(HEARTBEAT_TIMEOUT);
        
        // 1. 查询超时的 HTTP 设备
        List<DeviceShadow> timeoutShadows = shadowService.findHttpDevicesNotReportedSince(threshold);
        
        for (DeviceShadow shadow : timeoutShadows) {
            
            DeviceBinding binding = bindingService.getByDeviceId(shadow.getTerminalId());
            
            if (binding != null && binding.getStatus() == BindingStatus.BOUND) {
                
                // 2. 标记设备离线
                shadow.setConnected(false);
                shadow.setDisconnectTime(LocalDateTime.now());
                shadowService.save(shadow);
                
                // 3. 更新车辆在线状态
                vehicleService.updateOnlineStatus(binding.getVin(), OnlineStatus.OFFLINE);
                
                // 4. 发布离线事件
                eventService.recordEvent(BindingEvent.builder()
                    .bindingId(binding.getBindingId())
                    .eventType(BindingEventType.DEVICE_OFFLINE)
                    .protocol(ProtocolType.HTTP)
                    .success(true)
                    .build());
                
                log.warn("HTTP 设备心跳超时: terminalId={}, vin={}", 
                    shadow.getTerminalId(), binding.getVin());
            }
        }
    }
    
    /**
     * 设备恢复在线
     */
    public void handleDeviceRecover(String terminalId) {
        
        DeviceShadow shadow = shadowService.getByDeviceId(terminalId);
        DeviceBinding binding = bindingService.getByDeviceId(terminalId);
        
        if (shadow != null && binding != null) {
            shadow.setConnected(true);
            shadow.setConnectTime(LocalDateTime.now());
            shadowService.save(shadow);
            
            vehicleService.updateOnlineStatus(binding.getVin(), OnlineStatus.ONLINE);
            
            log.info("HTTP 设备恢复在线: terminalId={}", terminalId);
        }
    }
}
```

---

## 6. 绑定状态同步机制

### 6.1 跨协议状态同步

```java
/**
 * 绑定状态同步服务
 */
@Service
public class BindingSyncService {
    
    @Autowired
    private KafkaTemplate<String, BindingSyncEvent> kafkaTemplate;
    
    @Autowired
    private BindingService bindingService;
    
    private static final String SYNC_TOPIC = "binding.sync";
    
    /**
     * 发布绑定状态变更
     */
    public void publishBindingChange(DeviceBinding binding, BindingEventType eventType) {
        
        BindingSyncEvent event = BindingSyncEvent.builder()
            .bindingId(binding.getBindingId())
            .deviceId(binding.getDeviceId())
            .vin(binding.getVin())
            .tenantId(binding.getTenantId())
            .eventType(eventType)
            .protocol(binding.getProtocol())
            .status(binding.getStatus())
            .timestamp(LocalDateTime.now())
            .build();
        
        kafkaTemplate.send(SYNC_TOPIC, binding.getDeviceId(), event);
    }
    
    /**
     * 消费绑定状态变更
     */
    @KafkaListener(topics = SYNC_TOPIC, groupId = "binding-sync-group")
    public void handleBindingChange(BindingSyncEvent event) {
        
        // 1. 同步到各协议适配器
        switch (event.getProtocol()) {
            case JTT808:
                jtt808Adapter.syncBindingState(event);
                break;
            case MQTT:
                mqttAdapter.syncBindingState(event);
                break;
            case HTTP:
                // HTTP 无状态，更新设备影子即可
                shadowService.updateBindingState(event.getDeviceId(), event.getStatus());
                break;
        }
        
        // 2. 通知租户服务
        tenantService.notifyBindingChange(event);
        
        // 3. 更新缓存
        cacheService.updateBindingCache(event.getDeviceId(), event);
    }
}

/**
 * 绑定同步事件
 */
@Data
@Builder
public class BindingSyncEvent {
    
    private String bindingId;
    private String deviceId;
    private String vin;
    private String tenantId;
    private BindingEventType eventType;
    private ProtocolType protocol;
    private BindingStatus status;
    private LocalDateTime timestamp;
}
```

### 6.2 绑定事件日志

```java
/**
 * 绑定事件服务
 */
@Service
public class BindingEventService {
    
    @Autowired
    private BindingEventRepository eventRepository;
    
    @Autowired
    private KafkaTemplate<String, BindingEvent> kafkaTemplate;
    
    /**
     * 记录绑定事件
     */
    public void recordEvent(BindingEvent event) {
        
        // 1. 持久化
        eventRepository.save(event);
        
        // 2. 发布到 Kafka
        kafkaTemplate.send("binding.events", event.getBindingId(), event);
    }
    
    /**
     * 查询绑定历史
     */
    public List<BindingEvent> getBindingHistory(String bindingId, int limit) {
        return eventRepository.findByBindingIdOrderByEventTimeDesc(bindingId, limit);
    }
    
    /**
     * 统计绑定成功率
     */
    public BindingStatistics getStatistics(String tenantId, LocalDateTime from, LocalDateTime to) {
        
        List<BindingEvent> events = eventRepository.findByTenantIdAndEventTimeBetween(
            tenantId, from, to
        );
        
        long totalRequests = events.stream()
            .filter(e -> e.getEventType() == BindingEventType.BIND_REQUEST)
            .count();
        
        long successCount = events.stream()
            .filter(e -> e.getEventType() == BindingEventType.BIND_SUCCESS)
            .count();
        
        long failureCount = events.stream()
            .filter(e -> e.getEventType() == BindingEventType.BIND_FAILURE)
            .count();
        
        return BindingStatistics.builder()
            .totalRequests(totalRequests)
            .successCount(successCount)
            .failureCount(failureCount)
            .successRate((double) successCount / totalRequests * 100)
            .build();
    }
}
```

---

## 7. 异常处理与故障恢复

### 7.1 异常场景与处理策略

| 异常场景 | 协议 | 处理策略 |
|---------|------|---------|
| 鉴权码过期 | JT/T 808 | 返回错误码，终端重新注册 |
| Token 过期 | MQTT | 返回 CONNACK 错误，终端刷新 Token 重连 |
| 签名验证失败 | HTTP | 返回 401，终端检查签名算法 |
| 设备断线 | JT/T 808 | 保留绑定 30 分钟，等待重连 |
| 设备断线 | MQTT | 遗嘱消息触发，保留绑定 30 分钟 |
| 心跳超时 | HTTP | 标记离线，保留绑定 24 小时 |
| VIN 已绑定 | All | 返回错误，需要管理员处理 |
| 绑定数据冲突 | All | 使用最后确认时间判断，新值覆盖 |

### 7.2 自动恢复机制

```java
/**
 * 绑定自动恢复服务
 */
@Service
public class BindingRecoveryService {
    
    @Autowired
    private BindingService bindingService;
    
    @Autowired
    private EventService eventService;
    
    /**
     * 定期检查需要恢复的绑定
     */
    @Scheduled(fixedRate = 300000)  // 5分钟
    public void checkRecoverableBindings() {
        
        // 1. 查找异常状态的绑定
        List<DeviceBinding> errorBindings = bindingService.findByStatus(BindingStatus.ERROR);
        
        for (DeviceBinding binding : errorBindings) {
            try {
                // 2. 尝试恢复
                recoverBinding(binding);
            } catch (Exception e) {
                log.error("绑定恢复失败: bindingId={}", binding.getBindingId(), e);
            }
        }
    }
    
    /**
     * 恢复单个绑定
     */
    private void recoverBinding(DeviceBinding binding) {
        
        // 1. 检查恢复条件
        if (!canRecover(binding)) {
            return;
        }
        
        // 2. 重置绑定状态
        binding.setStatus(BindingStatus.BOUND);
        binding.setLastConfirmTime(LocalDateTime.now());
        bindingService.save(binding);
        
        // 3. 记录恢复事件
        eventService.recordEvent(BindingEvent.builder()
            .bindingId(binding.getBindingId())
            .eventType(BindingEventType.BIND_RECOVERED)
            .protocol(binding.getProtocol())
            .success(true)
            .build());
        
        log.info("绑定已恢复: bindingId={}, deviceId={}", 
            binding.getBindingId(), binding.getDeviceId());
    }
    
    /**
     * 检查是否可恢复
     */
    private boolean canRecover(DeviceBinding binding) {
        
        // 检查最近错误次数
        List<BindingEvent> recentEvents = eventService.getBindingHistory(binding.getBindingId(), 10);
        
        long errorCount = recentEvents.stream()
            .filter(e -> e.getEventType() == BindingEventType.BIND_FAILURE)
            .filter(e -> e.getEventTime().isAfter(LocalDateTime.now().minusHours(1)))
            .count();
        
        // 最近 1 小时错误次数超过 5 次则不再自动恢复
        return errorCount < 5;
    }
}
```

---

## 8. 监控指标

### 8.1 Prometheus 指标

```java
/**
 * 绑定监控指标
 */
@Component
public class BindingMetrics {
    
    private final MeterRegistry meterRegistry;
    
    // 绑定总数
    private final AtomicLong totalBindings = new AtomicLong(0);
    
    // 各协议绑定数
    private final AtomicLong jtt808Bindings = new AtomicLong(0);
    private final AtomicLong mqttBindings = new AtomicLong(0);
    private final AtomicLong httpBindings = new AtomicLong(0);
    
    // 在线设备数
    private final AtomicLong onlineDevices = new AtomicLong(0);
    
    public BindingMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
        
        // 注册指标
        Gauge.builder("binding_total", totalBindings, AtomicLong::get)
            .description("设备绑定总数")
            .register(meterRegistry);
        
        Gauge.builder("binding_jtt808", jtt808Bindings, AtomicLong::get)
            .description("JT/T 808 协议绑定数")
            .register(meterRegistry);
        
        Gauge.builder("binding_mqtt", mqttBindings, AtomicLong::get)
            .description("MQTT 协议绑定数")
            .register(meterRegistry);
        
        Gauge.builder("binding_http", httpBindings, AtomicLong::get)
            .description("HTTP 协议绑定数")
            .register(meterRegistry);
        
        Gauge.builder("device_online", onlineDevices, AtomicLong::get)
            .description("在线设备数")
            .register(meterRegistry);
    }
    
    /**
     * 更新绑定计数
     */
    public void updateBindingCount(ProtocolType protocol, long delta) {
        totalBindings.addAndGet(delta);
        
        switch (protocol) {
            case JTT808:
                jtt808Bindings.addAndGet(delta);
                break;
            case MQTT:
                mqttBindings.addAndGet(delta);
                break;
            case HTTP:
                httpBindings.addAndGet(delta);
                break;
        }
    }
    
    /**
     * 记录绑定操作
     */
    public void recordBindingOperation(ProtocolType protocol, BindingEventType eventType, 
                                        boolean success, Duration duration) {
        
        Counter.builder("binding_operations_total")
            .tag("protocol", protocol.name())
            .tag("event", eventType.name())
            .tag("success", String.valueOf(success))
            .register(meterRegistry)
            .increment();
        
        Timer.builder("binding_operation_duration")
            .tag("protocol", protocol.name())
            .tag("event", eventType.name())
            .register(meterRegistry)
            .record(duration);
    }
}
```

### 8.2 告警规则

```yaml
# Prometheus 告警规则
groups:
  - name: binding_alerts
    rules:
      # 绑定成功率低于 99%
      - alert: LowBindingSuccessRate
        expr: |
          rate(binding_operations_total{event="BIND_SUCCESS"}[5m]) 
          / 
          rate(binding_operations_total{event="BIND_REQUEST"}[5m]) 
          < 0.99
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "设备绑定成功率低于 99%"
          description: "当前成功率: {{ $value | humanizePercentage }}"
      
      # 绑定操作延迟过高
      - alert: HighBindingLatency
        expr: |
          histogram_quantile(0.95, 
            rate(binding_operation_duration_seconds_bucket[5m])
          ) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "设备绑定操作延迟过高"
          description: "P95 延迟: {{ $value | humanizeDuration }}"
      
      # 离线设备过多
      - alert: TooManyOfflineDevices
        expr: |
          (binding_total - device_online) / binding_total > 0.3
        for: 10m
        labels:
          severity: critical
        annotations:
          summary: "离线设备比例超过 30%"
          description: "当前离线比例: {{ $value | humanizePercentage }}"
```

---

## 9. 最佳实践

### 9.1 设备接入选择

| 设备类型 | 推荐协议 | 原因 |
|---------|---------|------|
| 合规车载终端 | JT/T 808 | 行业标准，符合监管要求 |
| IoT 智能设备 | MQTT | 轻量级，支持 QoS，实时性好 |
| 轻量传感器 | HTTP | 简单易用，无需长连接 |
| 第三方平台 | HTTP (Webhook) | 标准化接口，易于对接 |

### 9.2 可靠性配置建议

```yaml
# application.yaml

# JT/T 808 配置
jtt808:
  auth-code-ttl: 24h        # 鉴权码有效期
  reconnect-timeout: 30m    # 重连等待时间
  max-retry: 3              # 最大重试次数

# MQTT 配置
mqtt:
  session-expiry: 86400s    # 会话过期时间 (24h)
  will-message:
    enabled: true           # 启用遗嘱消息
    qos: 1                  # QoS 级别
    retained: true          # 保留消息

# HTTP 配置
http-adapter:
  heartbeat-timeout: 10m    # 心跳超时时间
  signature-ttl: 5m         # 签名有效期
  idempotent-cache: 10000   # 幂等缓存大小

# 绑定配置
binding:
  auto-recovery: true       # 启用自动恢复
  recovery-interval: 5m     # 恢复检查间隔
  max-error-count: 5        # 最大错误次数
```

---

## 10. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-26 | 初始版本，完整定义三种协议的设备绑定可靠性机制 |

---

_文档维护：渔晓白_  
_最后更新：2026-03-26 08:50_