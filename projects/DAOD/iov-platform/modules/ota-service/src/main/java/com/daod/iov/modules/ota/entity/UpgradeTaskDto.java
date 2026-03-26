package com.daod.iov.modules.ota.entity;

import lombok.*;
import java.util.*;

/**
 * 升级任务DTO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UpgradeTaskDto {
    private String firmwareId;
    private String strategyType;
    private List<String> vehicleIds;
    private Map<String, List<String>> vehicleGroups;
    private Integer batchSize;
    private Integer batchIndex;
    private Integer maxRetries = 3;
    private Long timeout = 600000L;
    private boolean rollbackEnabled = true;
    private Map<String, Object> extraParams = new HashMap<>();
    private String createdBy;
}
