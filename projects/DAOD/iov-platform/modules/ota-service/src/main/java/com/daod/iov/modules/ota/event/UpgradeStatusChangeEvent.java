package com.daod.iov.modules.ota.event;

import lombok.*;
import java.time.LocalDateTime;

/**
 * 升级状态变化事件
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UpgradeStatusChangeEvent {
    private String taskId;
    private String vehicleId;
    private String oldStatus;
    private String newStatus;
    private LocalDateTime timestamp;
}
