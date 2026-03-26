package com.daod.iov.modules.ota.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 审计日志实体类
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AuditLog {
    public enum Operation {
        UPLOAD_FIRMWARE,
        DELETE_FIRMWARE,
        CREATE_TASK,
        UPDATE_TASK,
        START_TASK,
        CANCEL_TASK,
        SUCCESS,
        FAILED,
        RETRY,
        ROLLBACK,
        STRATEGY_CHANGE,
        CONFIG_CHANGE
    }
    
    public enum TargetType {
        FIRMWARE,
        TASK,
        STRATEGY,
        CONFIG
    }
    
    private String id;
    private String operation;
    private String targetType;
    private String targetId;
    private String details;
    private String oldValues;
    private String newValues;
    private String userId;
    private String userName;
    private String ipAddress;
    private LocalDateTime createdAt;
}
