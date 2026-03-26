# 告警服务模块 (alarm-service)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | alarm-service |
| 模块版本 | 1.0.0 |
| 模块类型 | business |
| 优先级 | 60 |
| 负责人 | 后端开发 |
| 开发周期 | Week 16 |

### 1.2 功能描述

告警服务模块负责告警规则的配置与管理、实时告警检测、告警通知推送和告警处理流程管理。

### 1.3 核心能力

- 告警规则配置
- 实时告警检测
- 多渠道告警通知
- 告警处理流程
- 告警统计分析

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          告警服务架构                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              规则引擎层                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        AlarmRuleEngine                                   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │RuleParser   │ │RuleExecutor │ │RuleScheduler│ │RuleCache    │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              告警处理层                                         │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        AlarmProcessor                                    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │AlarmDetector│ │AlarmFilter  │ │AlarmHandler │ │AlarmNotifier│       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              通知层                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ SMS Notifier    │  │ Email Notifier  │  │ Push Notifier   │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
│  ┌─────────────────┐  ┌─────────────────┐                                    │
│  │ WebSocket Push  │  │ Webhook         │                                    │
│  └─────────────────┘  └─────────────────┘                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.alarm;

public interface AlarmRuleService {
    
    AlarmRule createRule(AlarmRuleCreateRequest request);
    
    AlarmRule getRule(String ruleId);
    
    AlarmRule updateRule(String ruleId, AlarmRuleUpdateRequest request);
    
    void deleteRule(String ruleId);
    
    void enableRule(String ruleId);
    
    void disableRule(String ruleId);
    
    List<AlarmRule> listRules(String tenantId);
    
    List<AlarmRule> listRulesByType(String tenantId, AlarmType type);
}

public interface AlarmService {
    
    Alarm createAlarm(AlarmCreateRequest request);
    
    Alarm getAlarm(String alarmId);
    
    void acknowledgeAlarm(String alarmId, String operator, String note);
    
    void handleAlarm(String alarmId, AlarmHandleRequest request);
    
    void closeAlarm(String alarmId, String operator, String note);
    
    PageResult<Alarm> listAlarms(AlarmQueryRequest request);
    
    List<Alarm> getActiveAlarms(String vin);
    
    AlarmStatistics getStatistics(String tenantId, LocalDateTime start, LocalDateTime end);
}

public interface AlarmDetector {
    
    void detect(VehicleData data);
    
    void detectBatch(List<VehicleData> dataList);
    
    List<Alarm> checkRules(String vin, Map<String, Object> context);
}

public interface AlarmNotifier {
    
    void notify(Alarm alarm, List<NotificationChannel> channels);
    
    void notifySms(Alarm alarm, List<String> phones);
    
    void notifyEmail(Alarm alarm, List<String> emails);
    
    void notifyPush(Alarm alarm, List<String> userIds);
    
    void notifyWebhook(Alarm alarm, String webhookUrl);
}
```

### 2.3 数据模型

```java
@Data
public class AlarmRule {
    private String id;
    private String tenantId;
    private String ruleCode;
    private String ruleName;
    private AlarmType alarmType;
    private String description;
    private String condition;
    private AlarmLevel level;
    private Integer threshold;
    private Integer duration;
    private Integer silencePeriod;
    private List<NotificationChannel> channels;
    private List<String> notifyTargets;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
public class Alarm {
    private String id;
    private String tenantId;
    private String vin;
    private String ruleId;
    private String ruleName;
    private AlarmType alarmType;
    private AlarmLevel level;
    private AlarmStatus status;
    private String title;
    private String content;
    private Double latitude;
    private Double longitude;
    private Map<String, Object> extraData;
    private LocalDateTime alarmTime;
    private LocalDateTime acknowledgeTime;
    private String acknowledgeBy;
    private String acknowledgeNote;
    private LocalDateTime handleTime;
    private String handleBy;
    private String handleNote;
    private LocalDateTime closeTime;
    private String closeBy;
    private String closeNote;
}

@Data
public class AlarmStatistics {
    private String tenantId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long totalCount;
    private Long activeCount;
    private Long handledCount;
    private Long closedCount;
    private Map<AlarmType, Long> countByType;
    private Map<AlarmLevel, Long> countByLevel;
    private List<AlarmTrend> trend;
}

public enum AlarmType {
    OVERSPEED,
    LOW_BATTERY,
    OFFLINE,
    GEOFENCE_ENTER,
    GEOFENCE_EXIT,
    FAULT,
    EMERGENCY,
    MAINTENANCE
}

public enum AlarmLevel {
    INFO,
    WARNING,
    ERROR,
    CRITICAL
}

public enum AlarmStatus {
    ACTIVE,
    ACKNOWLEDGED,
    HANDLED,
    CLOSED
}

public enum NotificationChannel {
    SMS,
    EMAIL,
    PUSH,
    WEBSOCKET,
    WEBHOOK
}
```

### 2.4 数据库设计

```sql
CREATE TABLE alarm_rules (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    rule_code VARCHAR(50) NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    alarm_type VARCHAR(30) NOT NULL,
    description VARCHAR(500),
    condition_expr TEXT NOT NULL,
    level VARCHAR(20) NOT NULL,
    threshold INT,
    duration INT,
    silence_period INT DEFAULT 300,
    channels JSONB,
    notify_targets JSONB,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(tenant_id, rule_code)
);

CREATE TABLE alarms (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    rule_id VARCHAR(32),
    rule_name VARCHAR(100),
    alarm_type VARCHAR(30) NOT NULL,
    level VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    title VARCHAR(200) NOT NULL,
    content TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    extra_data JSONB,
    alarm_time TIMESTAMP NOT NULL,
    acknowledge_time TIMESTAMP,
    acknowledge_by VARCHAR(50),
    acknowledge_note VARCHAR(500),
    handle_time TIMESTAMP,
    handle_by VARCHAR(50),
    handle_note VARCHAR(500),
    close_time TIMESTAMP,
    close_by VARCHAR(50),
    close_note VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (rule_id) REFERENCES alarm_rules(id)
);

CREATE TABLE alarm_notifications (
    id VARCHAR(32) PRIMARY KEY,
    alarm_id VARCHAR(32) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    target VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    sent_at TIMESTAMP,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alarm_id) REFERENCES alarms(id)
);

CREATE TABLE alarm_statistics_daily (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    stat_date DATE NOT NULL,
    alarm_type VARCHAR(30),
    level VARCHAR(20),
    total_count INT DEFAULT 0,
    active_count INT DEFAULT 0,
    handled_count INT DEFAULT 0,
    closed_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(tenant_id, stat_date, alarm_type, level)
);

CREATE INDEX idx_alarm_rules_tenant ON alarm_rules(tenant_id);
CREATE INDEX idx_alarms_tenant ON alarms(tenant_id);
CREATE INDEX idx_alarms_vin ON alarms(vin);
CREATE INDEX idx_alarms_status ON alarms(status);
CREATE INDEX idx_alarms_time ON alarms(alarm_time);
CREATE INDEX idx_alarm_notifications_alarm ON alarm_notifications(alarm_id);
```

### 2.5 告警检测实现

```java
@Service
public class AlarmDetectorImpl implements AlarmDetector {
    
    @Autowired
    private AlarmRuleService ruleService;
    
    @Autowired
    private AlarmService alarmService;
    
    @Autowired
    private AlarmNotifier alarmNotifier;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private final ExpressionParser expressionParser = new SpelExpressionParser();
    
    @Override
    public void detect(VehicleData data) {
        String vin = data.getVin();
        List<AlarmRule> rules = ruleService.listRules(data.getTenantId());
        
        for (AlarmRule rule : rules) {
            if (!rule.isEnabled()) {
                continue;
            }
            
            try {
                boolean triggered = evaluateRule(rule, data);
                
                if (triggered) {
                    handleAlarmTrigger(rule, data);
                }
            } catch (Exception e) {
                log.error("Error evaluating rule {} for vehicle {}: {}", 
                    rule.getId(), vin, e.getMessage());
            }
        }
    }
    
    private boolean evaluateRule(AlarmRule rule, VehicleData data) {
        StandardEvaluationContext context = new StandardEvaluationContext();
        context.setVariable("speed", data.getSpeed());
        context.setVariable("soc", data.getSoc());
        context.setVariable("latitude", data.getLatitude());
        context.setVariable("longitude", data.getLongitude());
        context.setVariable("online", data.isOnline());
        context.setVariable("mileage", data.getMileage());
        context.setVariable("temperature", data.getTemperature());
        
        Expression expression = expressionParser.parseExpression(rule.getCondition());
        return Boolean.TRUE.equals(expression.getValue(context, Boolean.class));
    }
    
    private void handleAlarmTrigger(AlarmRule rule, VehicleData data) {
        String silenceKey = "alarm:silence:" + rule.getId() + ":" + data.getVin();
        
        if (Boolean.TRUE.equals(redisTemplate.hasKey(silenceKey))) {
            log.debug("Alarm {} for vehicle {} is in silence period", 
                rule.getId(), data.getVin());
            return;
        }
        
        Alarm alarm = Alarm.builder()
            .tenantId(data.getTenantId())
            .vin(data.getVin())
            .ruleId(rule.getId())
            .ruleName(rule.getRuleName())
            .alarmType(rule.getAlarmType())
            .level(rule.getLevel())
            .status(AlarmStatus.ACTIVE)
            .title(buildAlarmTitle(rule, data))
            .content(buildAlarmContent(rule, data))
            .latitude(data.getLatitude())
            .longitude(data.getLongitude())
            .alarmTime(LocalDateTime.now())
            .build();
        
        Alarm created = alarmService.createAlarm(alarm);
        
        if (rule.getSilencePeriod() != null && rule.getSilencePeriod() > 0) {
            redisTemplate.opsForValue().set(silenceKey, "1", 
                Duration.ofSeconds(rule.getSilencePeriod()));
        }
        
        if (rule.getChannels() != null && !rule.getChannels().isEmpty()) {
            alarmNotifier.notify(created, rule.getChannels());
        }
    }
    
    private String buildAlarmTitle(AlarmRule rule, VehicleData data) {
        return String.format("[%s] %s - %s", 
            rule.getLevel().name(), 
            rule.getRuleName(), 
            data.getVin());
    }
    
    private String buildAlarmContent(AlarmRule rule, VehicleData data) {
        return String.format("车辆 %s 触发告警规则【%s】，当前值：速度=%dkm/h，电量=%d%%", 
            data.getVin(), 
            rule.getRuleName(), 
            data.getSpeed(), 
            data.getSoc());
    }
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| POST | /api/alarm/rule | 创建告警规则 |
| GET | /api/alarm/rule/{ruleId} | 获取规则信息 |
| PUT | /api/alarm/rule/{ruleId} | 更新规则 |
| DELETE | /api/alarm/rule/{ruleId} | 删除规则 |
| POST | /api/alarm/rule/{ruleId}/enable | 启用规则 |
| POST | /api/alarm/rule/{ruleId}/disable | 禁用规则 |
| GET | /api/alarm/rule | 查询规则列表 |
| GET | /api/alarm/{alarmId} | 获取告警详情 |
| POST | /api/alarm/{alarmId}/acknowledge | 确认告警 |
| POST | /api/alarm/{alarmId}/handle | 处理告警 |
| POST | /api/alarm/{alarmId}/close | 关闭告警 |
| GET | /api/alarm | 查询告警列表 |
| GET | /api/alarm/statistics | 告警统计 |

### 3.2 API示例

```json
POST /api/alarm/rule
{
    "ruleCode": "OVERSPEED_30",
    "ruleName": "超速告警(30km/h)",
    "alarmType": "OVERSPEED",
    "description": "车辆速度超过30km/h时触发告警",
    "condition": "#speed > 30",
    "level": "WARNING",
    "threshold": 30,
    "silencePeriod": 300,
    "channels": ["SMS", "PUSH"],
    "notifyTargets": ["admin@example.com", "13800138000"]
}

Response:
{
    "code": 200,
    "message": "Rule created successfully",
    "data": {
        "id": "AR001",
        "ruleCode": "OVERSPEED_30",
        "ruleName": "超速告警(30km/h)",
        "enabled": true
    }
}

POST /api/alarm/ALM001/acknowledge
{
    "note": "已收到告警，正在处理中"
}

Response:
{
    "code": 200,
    "message": "Alarm acknowledged",
    "data": {
        "id": "ALM001",
        "status": "ACKNOWLEDGED",
        "acknowledgeTime": "2026-03-17T10:30:00Z",
        "acknowledgeBy": "admin"
    }
}

GET /api/alarm/statistics?start=2026-03-01&end=2026-03-17

Response:
{
    "code": 200,
    "data": {
        "totalCount": 150,
        "activeCount": 10,
        "handledCount": 50,
        "closedCount": 90,
        "countByType": {
            "OVERSPEED": 50,
            "LOW_BATTERY": 30,
            "OFFLINE": 40,
            "GEOFENCE_ENTER": 30
        },
        "countByLevel": {
            "INFO": 50,
            "WARNING": 70,
            "ERROR": 20,
            "CRITICAL": 10
        }
    }
}
```

## 4. 配置项

```yaml
alarm:
  enabled: true
  rule:
    max-per-tenant: 100
  notification:
    sms:
      enabled: true
      provider: aliyun
    email:
      enabled: true
      smtp-host: smtp.example.com
    push:
      enabled: true
    webhook:
      enabled: true
      timeout-ms: 5000
  silence:
    default-period: 300
  retention:
    days: 90
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testCreateRule | 测试创建规则 | 规则创建成功 |
| testRuleEvaluation | 测试规则评估 | 条件判断正确 |
| testAlarmTrigger | 测试告警触发 | 告警生成正确 |
| testSilencePeriod | 测试静默期 | 静默期内不重复告警 |
| testNotification | 测试通知发送 | 通知发送成功 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testFullAlarmFlow | 测试完整告警流程 | 检测、通知、处理正常 |
| testMultiChannelNotify | 测试多渠道通知 | 各渠道通知正常 |
| testAlarmStatistics | 测试告警统计 | 统计数据正确 |

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
  - name: monitor-service
    version: ">=1.0.0"
  - name: notification-service
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
| alarm_total | Counter | 告警总数 |
| alarm_active | Gauge | 活跃告警数 |
| alarm_by_type | Counter | 按类型统计告警 |
| alarm_by_level | Counter | 按级别统计告警 |
| alarm_notification_sent | Counter | 通知发送次数 |
| alarm_handle_duration | Histogram | 告警处理耗时 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
