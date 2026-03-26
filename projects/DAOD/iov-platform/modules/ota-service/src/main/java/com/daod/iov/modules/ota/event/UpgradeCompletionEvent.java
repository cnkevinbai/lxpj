package com.daod.iov.modules.ota.event;

import lombok.*;
import java.time.LocalDateTime;
import com.daod.iov.modules.ota.entity.*;

/**
 * 升级完成事件
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UpgradeCompletionEvent {
    private String taskId;
    private String vehicleId;
    private String status;
    private String details;
    private LocalDateTime timestamp;
}
