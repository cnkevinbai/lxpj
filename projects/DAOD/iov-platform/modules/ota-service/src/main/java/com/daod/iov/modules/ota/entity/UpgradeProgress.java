package com.daod.iov.modules.ota.entity;

import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 升级进度实体类
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UpgradeProgress {
    private String taskId;
    private String vehicleId;
    private int progress;
    private String status;
    private String message;
    private long ETA;
    private LocalDateTime lastUpdate;
    private String errorReason;
    private boolean isRollback;
}
