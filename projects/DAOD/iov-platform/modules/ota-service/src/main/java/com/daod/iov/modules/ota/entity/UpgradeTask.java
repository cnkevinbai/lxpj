package com.daod.iov.modules.ota.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 升级任务实体类
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UpgradeTask {
    public enum Status {
        PENDING,
        SCHEDULED,
        RUNNING,
        SUCCESS,
        FAILED,
        CANCELLED,
        RETRYING,
        ROLLBACKING,
        ROLLED_BACK
    }
    
    private String id;
    private String firmwareId;
    private String firmwareVersion;
    private String strategyType;
    private List<String> vehicleIds;
    private Map<String, List<String>> vehicleGroups;
    private Integer batchSize;
    private Integer batchIndex;
    private Status status;
    private Integer retryCount;
    private Integer maxRetryCount;
    private long timeout;
    private LocalDateTime scheduledAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String failureReason;
    private String rolledBackReason;
    private boolean rollbackEnabled;
    private Map<String, Object> extraParams;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
}
