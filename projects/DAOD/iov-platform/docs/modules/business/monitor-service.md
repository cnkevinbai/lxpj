# 监控服务模块 (monitor-service)

## 1. 模块概述

### 1.1 模块信息

| 属性 | 值 |
|-----|-----|
| 模块名称 | monitor-service |
| 模块版本 | 1.0.0 |
| 模块类型 | business |
| 优先级 | 60 |
| 负责人 | 后端开发 |
| 开发周期 | Week 14-15 |

### 1.2 功能描述

监控服务模块负责车辆的实时位置监控、状态监控、轨迹回放和电子围栏等功能，是车联网平台的核心业务模块。

### 1.3 核心能力

- 实时位置监控
- 车辆状态监控
- 轨迹回放
- 电子围栏
- 多车监控

## 2. 技术设计

### 2.1 架构设计

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          监控服务架构                                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              实时数据层                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ WebSocket Push  │  │ SSE Stream      │  │ MQTT Subscribe  │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              服务层                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        MonitorService                                    │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │LocationSvc  │ │StatusService│ │TrackService │ │GeofenceSvc  │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              数据存储层                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐               │
│  │ TimescaleDB     │  │ Redis Cache     │  │ ClickHouse      │               │
│  │ (轨迹数据)       │  │ (实时状态)       │  │ (分析数据)       │               │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 核心接口设计

```java
package com.daod.iov.modules.monitor;

public interface LocationService {
    
    void updateLocation(String vin, LocationData location);
    
    LocationData getCurrentLocation(String vin);
    
    Map<String, LocationData> batchGetLocations(List<String> vins);
    
    List<LocationData> getLocationsByArea(GeoArea area);
    
    List<LocationData> getNearbyVehicles(double latitude, double longitude, double radius);
}

public interface VehicleStatusService {
    
    void updateStatus(String vin, VehicleStatusData status);
    
    VehicleStatusData getCurrentStatus(String vin);
    
    Map<String, VehicleStatusData> batchGetStatus(List<String> vins);
    
    List<VehicleStatusData> getStatusByCondition(StatusQueryCondition condition);
}

public interface TrackService {
    
    void saveTrackPoint(String vin, TrackPoint point);
    
    List<TrackPoint> getTrackHistory(String vin, LocalDateTime start, LocalDateTime end);
    
    TrackSummary getTrackSummary(String vin, LocalDateTime start, LocalDateTime end);
    
    List<TrackSegment> getTrackSegments(String vin, LocalDateTime start, LocalDateTime end);
    
    void exportTrack(String vin, LocalDateTime start, LocalDateTime end, ExportFormat format);
}

public interface GeofenceService {
    
    Geofence createGeofence(GeofenceCreateRequest request);
    
    Geofence getGeofence(String geofenceId);
    
    Geofence updateGeofence(String geofenceId, GeofenceUpdateRequest request);
    
    void deleteGeofence(String geofenceId);
    
    List<Geofence> listGeofences(String tenantId);
    
    List<Geofence> listByVehicle(String vin);
    
    void bindVehicle(String geofenceId, String vin);
    
    void unbindVehicle(String geofenceId, String vin);
    
    GeofenceCheckResult checkPoint(String vin, double latitude, double longitude);
    
    List<String> getVehiclesInGeofence(String geofenceId);
}

public interface RealtimePushService {
    
    void subscribe(String sessionId, List<String> vins);
    
    void unsubscribe(String sessionId, List<String> vins);
    
    void pushLocation(String vin, LocationData location);
    
    void pushStatus(String vin, VehicleStatusData status);
    
    void pushAlarm(AlarmData alarm);
}
```

### 2.3 数据模型

```java
@Data
public class LocationData {
    private String vin;
    private Double latitude;
    private Double longitude;
    private Integer altitude;
    private Integer speed;
    private Integer direction;
    private Integer accuracy;
    private LocalDateTime timestamp;
    private String address;
}

@Data
public class VehicleStatusData {
    private String vin;
    private Integer soc;
    private Integer mileage;
    private Integer voltage;
    private Integer current;
    private Integer temperature;
    private MotorStatus motorStatus;
    private DoorStatus doorStatus;
    private LightStatus lightStatus;
    private LocalDateTime timestamp;
}

@Data
public class TrackPoint {
    private String id;
    private String vin;
    private Double latitude;
    private Double longitude;
    private Integer speed;
    private Integer direction;
    private Integer soc;
    private LocalDateTime timestamp;
    private String address;
}

@Data
public class TrackSummary {
    private String vin;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long duration;
    private Double totalDistance;
    private Double maxSpeed;
    private Double avgSpeed;
    private Integer pointCount;
}

@Data
public class Geofence {
    private String id;
    private String tenantId;
    private String name;
    private GeofenceType type;
    private GeofenceShape shape;
    private String coordinates;
    private Double radius;
    private List<String> boundVehicles;
    private GeofenceAlertType alertType;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

@Data
public class GeofenceCheckResult {
    private String vin;
    private String geofenceId;
    private boolean inside;
    private GeofenceEvent event;
    private LocalDateTime timestamp;
}

public enum GeofenceType {
    CIRCLE,
    RECTANGLE,
    POLYGON
}

public enum GeofenceAlertType {
    ENTER,
    EXIT,
    BOTH
}

public enum GeofenceEvent {
    ENTER,
    EXIT,
    INSIDE,
    OUTSIDE
}
```

### 2.4 数据库设计

```sql
CREATE TABLE vehicle_locations (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    altitude INT,
    speed INT,
    direction INT,
    accuracy INT,
    address VARCHAR(200),
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT create_hypertable('vehicle_locations', 'timestamp');

CREATE TABLE vehicle_status_history (
    id BIGSERIAL PRIMARY KEY,
    vin VARCHAR(17) NOT NULL,
    tenant_id VARCHAR(32) NOT NULL,
    soc INT,
    mileage INT,
    voltage INT,
    current INT,
    temperature INT,
    motor_status JSONB,
    door_status JSONB,
    light_status JSONB,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT create_hypertable('vehicle_status_history', 'timestamp');

CREATE TABLE geofences (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    shape JSONB NOT NULL,
    alert_type VARCHAR(20) DEFAULT 'BOTH',
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE TABLE geofence_vehicle_bindings (
    id VARCHAR(32) PRIMARY KEY,
    geofence_id VARCHAR(32) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (geofence_id) REFERENCES geofences(id),
    FOREIGN KEY (vin) REFERENCES vehicles(vin),
    UNIQUE(geofence_id, vin)
);

CREATE TABLE geofence_events (
    id VARCHAR(32) PRIMARY KEY,
    geofence_id VARCHAR(32) NOT NULL,
    vin VARCHAR(17) NOT NULL,
    event_type VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (geofence_id) REFERENCES geofences(id)
);

CREATE INDEX idx_locations_vin_time ON vehicle_locations(vin, timestamp DESC);
CREATE INDEX idx_locations_tenant_time ON vehicle_locations(tenant_id, timestamp DESC);
CREATE INDEX idx_status_vin_time ON vehicle_status_history(vin, timestamp DESC);
CREATE INDEX idx_geofence_tenant ON geofences(tenant_id);
```

### 2.5 实时推送实现

```java
@Service
public class RealtimePushServiceImpl implements RealtimePushService {
    
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
    private final Map<String, Set<String>> sessionSubscriptions = new ConcurrentHashMap<>();
    
    @Override
    public void subscribe(String sessionId, List<String> vins) {
        Set<String> subscribed = sessionSubscriptions.computeIfAbsent(sessionId, k -> ConcurrentHashMap.newKeySet());
        subscribed.addAll(vins);
        
        for (String vin : vins) {
            String key = "monitor:subscribers:" + vin;
            redisTemplate.opsForSet().add(key, sessionId);
        }
    }
    
    @Override
    public void unsubscribe(String sessionId, List<String> vins) {
        Set<String> subscribed = sessionSubscriptions.get(sessionId);
        if (subscribed != null) {
            subscribed.removeAll(vins);
        }
        
        for (String vin : vins) {
            String key = "monitor:subscribers:" + vin;
            redisTemplate.opsForSet().remove(key, sessionId);
        }
    }
    
    @Override
    public void pushLocation(String vin, LocationData location) {
        String key = "monitor:subscribers:" + vin;
        Set<Object> subscribers = redisTemplate.opsForSet().members(key);
        
        if (subscribers != null && !subscribers.isEmpty()) {
            MonitorMessage message = MonitorMessage.builder()
                .type("LOCATION")
                .vin(vin)
                .data(location)
                .timestamp(LocalDateTime.now())
                .build();
            
            for (Object sessionId : subscribers) {
                messagingTemplate.convertAndSendToUser(
                    sessionId.toString(),
                    "/topic/monitor",
                    message
                );
            }
        }
    }
    
    @Override
    public void pushStatus(String vin, VehicleStatusData status) {
        String key = "monitor:subscribers:" + vin;
        Set<Object> subscribers = redisTemplate.opsForSet().members(key);
        
        if (subscribers != null && !subscribers.isEmpty()) {
            MonitorMessage message = MonitorMessage.builder()
                .type("STATUS")
                .vin(vin)
                .data(status)
                .timestamp(LocalDateTime.now())
                .build();
            
            for (Object sessionId : subscribers) {
                messagingTemplate.convertAndSendToUser(
                    sessionId.toString(),
                    "/topic/monitor",
                    message
                );
            }
        }
    }
}
```

### 2.6 电子围栏检测实现

```java
@Service
public class GeofenceCheckService {
    
    @Autowired
    private GeofenceRepository geofenceRepository;
    
    @Autowired
    private AlarmService alarmService;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public void checkGeofence(String vin, double latitude, double longitude) {
        List<Geofence> geofences = geofenceRepository.findByVehicle(vin);
        
        for (Geofence geofence : geofences) {
            if (!geofence.isEnabled()) {
                continue;
            }
            
            boolean isInside = checkPointInGeofence(geofence, latitude, longitude);
            String cacheKey = "geofence:status:" + geofence.getId() + ":" + vin;
            
            Boolean wasInside = (Boolean) redisTemplate.opsForValue().get(cacheKey);
            
            if (wasInside == null) {
                wasInside = false;
            }
            
            GeofenceEvent event = null;
            if (isInside && !wasInside) {
                event = GeofenceEvent.ENTER;
                redisTemplate.opsForValue().set(cacheKey, true);
            } else if (!isInside && wasInside) {
                event = GeofenceEvent.EXIT;
                redisTemplate.opsForValue().set(cacheKey, false);
            }
            
            if (event != null && shouldAlert(geofence, event)) {
                triggerGeofenceAlarm(vin, geofence, event, latitude, longitude);
            }
        }
    }
    
    private boolean checkPointInGeofence(Geofence geofence, double latitude, double longitude) {
        switch (geofence.getType()) {
            case CIRCLE:
                return checkPointInCircle(geofence, latitude, longitude);
            case RECTANGLE:
                return checkPointInRectangle(geofence, latitude, longitude);
            case POLYGON:
                return checkPointInPolygon(geofence, latitude, longitude);
            default:
                return false;
        }
    }
    
    private boolean checkPointInCircle(Geofence geofence, double latitude, double longitude) {
        JSONObject shape = JSON.parseObject(geofence.getCoordinates());
        double centerLat = shape.getDoubleValue("latitude");
        double centerLng = shape.getDoubleValue("longitude");
        double radius = shape.getDoubleValue("radius");
        
        double distance = GeoUtil.calculateDistance(latitude, longitude, centerLat, centerLng);
        return distance <= radius;
    }
    
    private boolean checkPointInPolygon(Geofence geofence, double latitude, double longitude) {
        JSONObject shape = JSON.parseObject(geofence.getCoordinates());
        JSONArray points = shape.getJSONArray("points");
        
        List<double[]> polygon = new ArrayList<>();
        for (int i = 0; i < points.size(); i++) {
            JSONObject point = points.getJSONObject(i);
            polygon.add(new double[]{point.getDoubleValue("latitude"), point.getDoubleValue("longitude")});
        }
        
        return GeoUtil.isPointInPolygon(latitude, longitude, polygon);
    }
    
    private boolean shouldAlert(Geofence geofence, GeofenceEvent event) {
        return switch (geofence.getAlertType()) {
            case ENTER -> event == GeofenceEvent.ENTER;
            case EXIT -> event == GeofenceEvent.EXIT;
            case BOTH -> true;
        };
    }
    
    private void triggerGeofenceAlarm(String vin, Geofence geofence, GeofenceEvent event, 
                                       double latitude, double longitude) {
        GeofenceAlarm alarm = GeofenceAlarm.builder()
            .vin(vin)
            .geofenceId(geofence.getId())
            .geofenceName(geofence.getName())
            .eventType(event)
            .latitude(latitude)
            .longitude(longitude)
            .timestamp(LocalDateTime.now())
            .build();
        
        alarmService.createGeofenceAlarm(alarm);
    }
}
```

## 3. API设计

### 3.1 REST API

| 方法 | 路径 | 描述 |
|-----|------|------|
| GET | /api/monitor/location/{vin} | 获取车辆当前位置 |
| POST | /api/monitor/location/batch | 批量获取位置 |
| GET | /api/monitor/status/{vin} | 获取车辆状态 |
| GET | /api/monitor/track/{vin} | 获取轨迹历史 |
| GET | /api/monitor/track/{vin}/summary | 获取轨迹统计 |
| POST | /api/geofence | 创建围栏 |
| GET | /api/geofence/{id} | 获取围栏信息 |
| PUT | /api/geofence/{id} | 更新围栏 |
| DELETE | /api/geofence/{id} | 删除围栏 |
| GET | /api/geofence | 查询围栏列表 |
| POST | /api/geofence/{id}/bind | 绑定车辆 |
| DELETE | /api/geofence/{id}/unbind/{vin} | 解绑车辆 |

### 3.2 WebSocket API

| 主题 | 描述 |
|-----|------|
| /topic/monitor | 监控数据推送 |
| /app/monitor/subscribe | 订阅车辆 |
| /app/monitor/unsubscribe | 取消订阅 |

### 3.3 API示例

```json
GET /api/monitor/location/LDA1234567890ABCD

Response:
{
    "code": 200,
    "data": {
        "vin": "LDA1234567890ABCD",
        "latitude": 30.5728,
        "longitude": 104.0668,
        "altitude": 500,
        "speed": 25,
        "direction": 180,
        "accuracy": 10,
        "address": "四川省成都市高新区天府大道",
        "timestamp": "2026-03-17T10:30:00Z"
    }
}

GET /api/monitor/track/LDA1234567890ABCD?start=2026-03-17T00:00:00Z&end=2026-03-17T23:59:59Z

Response:
{
    "code": 200,
    "data": {
        "vin": "LDA1234567890ABCD",
        "points": [
            {"latitude": 30.5728, "longitude": 104.0668, "speed": 25, "timestamp": "2026-03-17T08:00:00Z"},
            {"latitude": 30.5730, "longitude": 104.0670, "speed": 30, "timestamp": "2026-03-17T08:01:00Z"}
        ],
        "summary": {
            "totalDistance": 15.5,
            "duration": 3600,
            "maxSpeed": 35,
            "avgSpeed": 25
        }
    }
}

POST /api/geofence
{
    "name": "景区围栏",
    "type": "POLYGON",
    "shape": {
        "points": [
            {"latitude": 30.57, "longitude": 104.06},
            {"latitude": 30.58, "longitude": 104.06},
            {"latitude": 30.58, "longitude": 104.07},
            {"latitude": 30.57, "longitude": 104.07}
        ]
    },
    "alertType": "BOTH"
}

Response:
{
    "code": 200,
    "message": "Geofence created successfully",
    "data": {
        "id": "GF001",
        "name": "景区围栏",
        "type": "POLYGON",
        "enabled": true
    }
}
```

## 4. 配置项

```yaml
monitor:
  enabled: true
  location:
    cache-ttl: 60
    history-retention-days: 90
  track:
    max-points-per-query: 10000
    export-max-days: 30
  geofence:
    check-interval-ms: 1000
    max-per-vehicle: 10
  websocket:
    enabled: true
    heartbeat-interval-ms: 30000
```

## 5. 测试用例

### 5.1 单元测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testLocationUpdate | 测试位置更新 | 位置更新成功 |
| testTrackQuery | 测试轨迹查询 | 轨迹数据正确 |
| testGeofenceCreate | 测试围栏创建 | 围栏创建成功 |
| testGeofenceCheck | 测试围栏检测 | 进出围栏检测正确 |
| testRealtimePush | 测试实时推送 | 推送数据正确 |

### 5.2 集成测试

| 测试项 | 测试内容 | 预期结果 |
|-------|---------|---------|
| testFullMonitorFlow | 测试完整监控流程 | 数据流转正确 |
| testMultiVehicleMonitor | 测试多车监控 | 多车数据隔离 |
| testGeofenceAlarm | 测试围栏告警 | 告警触发正确 |

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
  - name: alarm-service
    version: ">=1.0.0"
```

## 7. 部署说明

### 7.1 资源需求

```yaml
resources:
  cpu: "300m"
  memory: "512Mi"
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
| monitor_location_updates | Counter | 位置更新次数 |
| monitor_track_queries | Counter | 轨迹查询次数 |
| monitor_geofence_checks | Counter | 围栏检测次数 |
| monitor_geofence_alarms | Counter | 围栏告警次数 |
| monitor_websocket_connections | Gauge | WebSocket连接数 |

## 9. 变更日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-17 | 初始版本 |
