package com.daod.iov.modules.es.api.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 日志条目
 * 
 * @author 渔晓白
 * @since 1.0.0
 */
@Data
public class LogEntry {
    
    /** 日志 ID */
    private String id;
    
    /** 日志级别: DEBUG, INFO, WARN, ERROR */
    private String level;
    
    /** 日志来源服务 */
    private String service;
    
    /** 日志内容 */
    private String message;
    
    /** 日志时间 */
    private LocalDateTime timestamp;
    
    /** 追踪 ID */
    private String traceId;
    
    /** 租户 ID */
    private String tenantId;
    
    /** 用户 ID */
    private String userId;
    
    /** IP 地址 */
    private String ipAddress;
    
    /** 请求路径 */
    private String requestPath;
    
    /** 请求方法 */
    private String requestMethod;
    
    /** 响应状态码 */
    private Integer statusCode;
    
    /** 处理耗时 (ms) */
    private Long duration;
    
    /** 扩展信息 */
    private Map<String, Object> extra;
}

/**
 * 日志搜索请求
 */
@Data
class LogSearchRequest {
    private String keyword;
    private String level;
    private String service;
    private String traceId;
    private String tenantId;
    private String userId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int from;
    private int size;
    private String sortField;
    private String sortOrder;
}

/**
 * 日志搜索结果
 */
@Data
class LogSearchResult {
    private long total;
    private java.util.List<LogEntry> logs;
    private Map<String, Object> aggregations;
}

/**
 * 轨迹点文档
 */
@Data
class TrajectoryPointDocument {
    private String id;
    private String vin;
    private LocalDateTime timestamp;
    private Double latitude;
    private Double longitude;
    private Double speed;
    private Double direction;
    private Double mileage;
    private String address;
    private String locationType;  // GPS, BDS, LBS
}

/**
 * 轨迹搜索请求
 */
@Data
class TrajectorySearchRequest {
    private String vin;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double minLat;
    private Double maxLat;
    private Double minLng;
    private Double maxLng;
    private int from;
    private int size;
}

/**
 * 轨迹搜索结果
 */
@Data
class TrajectorySearchResult {
    private long total;
    private java.util.List<TrajectoryPointDocument> points;
}

/**
 * 告警文档
 */
@Data
class AlarmDocument {
    private String id;
    private String vin;
    private String alarmCode;
    private Integer alarmLevel;
    private String alarmType;
    private String alarmContent;
    private LocalDateTime occurTime;
    private LocalDateTime handleTime;
    private String status;
    private String tenantId;
}

/**
 * 告警搜索请求
 */
@Data
class AlarmSearchRequest {
    private String vin;
    private String alarmCode;
    private Integer alarmLevel;
    private String alarmType;
    private String status;
    private String tenantId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int from;
    private int size;
}

/**
 * 告警搜索结果
 */
@Data
class AlarmSearchResult {
    private long total;
    private java.util.List<AlarmDocument> alarms;
    private Map<String, Object> aggregations;
}

/**
 * 文档搜索结果
 */
@Data
class DocumentSearchResult {
    private long total;
    private java.util.List<Map<String, Object>> documents;
    private Map<String, Object> aggregations;
}

/**
 * 日志聚合请求
 */
@Data
class LogAggregationRequest {
    private String field;
    private String interval;  // hour, day, week, month
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String tenantId;
}