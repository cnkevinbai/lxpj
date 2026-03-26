package com.daod.iov.modules.ota.event;

import lombok.*;
import java.time.LocalDateTime;
import com.daod.iov.modules.ota.entity.*;

/**
 * 升级失败事件
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UpgradeFailureEvent {
    private String taskId;
    private String vehicleId;
    private String failureReason;
    private int retryCount;
    private LocalDateTime timestamp;
}
