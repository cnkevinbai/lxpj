package com.daod.iov.modules.ota.event;

import lombok.*;
import java.time.LocalDateTime;
import com.daod.iov.modules.ota.entity.*;

/**
 * 升级进度事件
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UpgradeProgressEvent {
    private String taskId;
    private String vehicleId;
    private int progress;
    private String status;
    private String message;
    private LocalDateTime timestamp;
}
